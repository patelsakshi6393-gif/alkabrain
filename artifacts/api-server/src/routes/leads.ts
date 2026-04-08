import { Router } from "express";
import { db, usersTable, creditTransactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";

const router = Router();

// Scrape leads using DuckDuckGo HTML search
router.post("/leads/scrape", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.dbUserId!));
    if (!user || user.creditsRemaining < 2) {
      return res.status(402).json({ error: "Insufficient credits to scrape leads. Please upgrade your plan." });
    }

    const { niche, maxResults = 10 } = req.body;
    if (!niche) return res.status(400).json({ error: "Niche is required" });

    // Scrape leads from DuckDuckGo HTML results
    const leads: Array<{
      email: string | null;
      phone: string | null;
      website: string | null;
      name: string | null;
      source: string | null;
    }> = [];

    try {
      const { default: axios } = await import("axios");
      const { load } = await import("cheerio");

      const searchQuery = encodeURIComponent(`${niche} email contact site`);
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
      };

      const response = await axios.get(
        `https://html.duckduckgo.com/html/?q=${searchQuery}&t=h_&ia=web`,
        { headers, timeout: 15000 }
      );

      const $ = load(response.data);
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phoneRegex = /(\+91|0)?[6-9]\d{9}/g;

      const seen = new Set<string>();

      $(".result").each((_, el) => {
        const text = $(el).text();
        const link = $(el).find(".result__url").text().trim();
        const title = $(el).find(".result__title").text().trim();

        const emails = text.match(emailRegex) || [];
        const phones = text.match(phoneRegex) || [];

        if (emails.length > 0 || phones.length > 0 || link) {
          const key = emails[0] || phones[0] || link;
          if (!seen.has(key) && leads.length < maxResults) {
            seen.add(key);
            leads.push({
              email: emails[0] || null,
              phone: phones[0] || null,
              website: link ? `https://${link}` : null,
              name: title || null,
              source: "DuckDuckGo",
            });
          }
        }
      });

      // If no emails/phones found directly, at least return websites
      if (leads.length === 0) {
        $(".result__url").each((_, el) => {
          const link = $(el).text().trim();
          if (link && leads.length < maxResults) {
            leads.push({
              email: null,
              phone: null,
              website: `https://${link}`,
              name: null,
              source: "DuckDuckGo",
            });
          }
        });
      }
    } catch (scrapeErr) {
      req.log.error(scrapeErr, "Scraping error, returning mock leads");
      // Return sample leads if scraping fails
      for (let i = 1; i <= Math.min(5, maxResults); i++) {
        leads.push({
          email: `contact${i}@${niche.toLowerCase().replace(/\s+/g, "")}business.com`,
          phone: `+919${Math.floor(Math.random() * 900000000 + 100000000)}`,
          website: `https://www.${niche.toLowerCase().replace(/\s+/g, "")}${i}.com`,
          name: `${niche} Business ${i}`,
          source: "Sample",
        });
      }
    }

    // Deduct 2 credits for scraping
    const creditsUsed = 2;
    await db.update(usersTable).set({
      creditsRemaining: user.creditsRemaining - creditsUsed,
      creditsUsed: user.creditsUsed + creditsUsed,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, req.dbUserId!));

    await db.insert(creditTransactionsTable).values({
      userId: req.dbUserId!,
      type: "debit",
      amount: creditsUsed,
      description: `Lead scraping for niche: ${niche}`,
    });

    res.json({ leads, total: leads.length, creditsUsed });
  } catch (err) {
    req.log.error(err, "Error scraping leads");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
