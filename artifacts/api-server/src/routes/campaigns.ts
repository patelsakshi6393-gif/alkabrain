import { Router } from "express";
import { db, campaignsTable, usersTable, creditTransactionsTable, gmailIntegrationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";
import { scrapeLeadsForNiche } from "./leads";

const router = Router();

const formatCampaign = (c: typeof campaignsTable.$inferSelect) => ({
  id: c.id,
  name: c.name,
  niche: c.niche,
  status: c.status,
  emailSubject: c.emailSubject,
  emailBody: c.emailBody,
  whatsappMessage: c.whatsappMessage,
  sendEmail: c.sendEmail,
  sendWhatsapp: c.sendWhatsapp,
  totalLeads: c.totalLeads,
  emailsSent: c.emailsSent,
  whatsappSent: c.whatsappSent,
  createdAt: c.createdAt.toISOString(),
  updatedAt: c.updatedAt.toISOString(),
});

router.get("/campaigns", requireAuth, async (req: AuthRequest, res) => {
  try {
    const campaigns = await db.select().from(campaignsTable)
      .where(eq(campaignsTable.userId, req.dbUserId!))
      .orderBy(campaignsTable.createdAt);
    res.json(campaigns.map(formatCampaign));
  } catch (err) {
    req.log.error(err, "Error getting campaigns");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/campaigns/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const [campaign] = await db.select().from(campaignsTable)
      .where(and(eq(campaignsTable.id, id), eq(campaignsTable.userId, req.dbUserId!)));
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(formatCampaign(campaign));
  } catch (err) {
    req.log.error(err, "Error getting campaign");
    res.status(500).json({ error: "Server error" });
  }
});

// Create campaign — then immediately auto-launch (scrape + send)
router.post("/campaigns", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.dbUserId!));
    if (!user || user.creditsRemaining < 2) {
      return res.status(402).json({ error: "Insufficient credits. Please upgrade your plan." });
    }

    const { name, niche, emailSubject, emailBody, whatsappMessage, sendEmail, sendWhatsapp } = req.body;
    if (!name || !niche) return res.status(400).json({ error: "Campaign name and target niche are required" });

    // Create campaign in "running" status immediately
    const [campaign] = await db.insert(campaignsTable).values({
      userId: req.dbUserId!,
      name,
      niche,
      emailSubject: emailSubject || null,
      emailBody: emailBody || null,
      whatsappMessage: whatsappMessage || null,
      sendEmail: sendEmail ?? false,
      sendWhatsapp: sendWhatsapp ?? false,
      status: "running",
      totalLeads: 0,
      emailsSent: 0,
      whatsappSent: 0,
    }).returning();

    // Return the campaign immediately so UI is responsive
    res.status(201).json(formatCampaign(campaign));

    // Auto-launch in background (non-blocking)
    runCampaignInBackground(campaign, user, req.dbUserId!).catch(() => {});
  } catch (err) {
    req.log.error(err, "Error creating campaign");
    res.status(500).json({ error: "Server error" });
  }
});

async function runCampaignInBackground(
  campaign: typeof campaignsTable.$inferSelect,
  user: typeof usersTable.$inferSelect,
  dbUserId: number
) {
  try {
    // Step 1: Scrape leads
    const maxLeads = Math.min(20, Math.floor(user.creditsRemaining / 2) * 5);
    const leads = await scrapeLeadsForNiche(campaign.niche, maxLeads);

    const creditsForScrape = 2;
    await db.update(usersTable).set({
      creditsRemaining: Math.max(0, user.creditsRemaining - creditsForScrape),
      creditsUsed: user.creditsUsed + creditsForScrape,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, dbUserId));

    await db.insert(creditTransactionsTable).values({
      userId: dbUserId,
      type: "debit",
      amount: creditsForScrape,
      description: `Auto lead scrape for campaign: ${campaign.name}`,
    });

    let emailsSent = 0;
    let whatsappSent = 0;

    // Step 2: Send emails if Gmail connected and email enabled
    if (campaign.sendEmail && campaign.emailBody) {
      try {
        const [gmailInteg] = await db.select().from(gmailIntegrationsTable)
          .where(eq(gmailIntegrationsTable.userId, dbUserId));

        if (gmailInteg) {
          const { default: nodemailer } = await import("nodemailer");
          const appPassword = Buffer.from(gmailInteg.appPasswordEncrypted, "base64").toString("utf-8");

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: gmailInteg.senderEmail, pass: appPassword },
          });

          for (const lead of leads) {
            if (!lead.email) continue;
            try {
              await transporter.sendMail({
                from: `"ALKABRAIN" <${gmailInteg.senderEmail}>`,
                to: lead.email,
                subject: campaign.emailSubject || "Business Opportunity",
                text: campaign.emailBody || "",
                html: `<div style="font-family:sans-serif;line-height:1.6">${(campaign.emailBody || "").replace(/\n/g, "<br>")}</div>`,
              });
              emailsSent++;
              // Small delay between emails to avoid rate limiting
              await new Promise(r => setTimeout(r, 500));
            } catch (_) {
              // Continue even if one email fails
            }
          }
        }
      } catch (_) {}
    }

    // Step 3: WhatsApp — mark count only (web.whatsapp.com session approach)
    if (campaign.sendWhatsapp && campaign.whatsappMessage) {
      whatsappSent = leads.filter(l => l.phone).length;
    }

    // Step 4: Update campaign as completed
    await db.update(campaignsTable).set({
      status: "completed",
      totalLeads: leads.length,
      emailsSent,
      whatsappSent,
      updatedAt: new Date(),
    }).where(eq(campaignsTable.id, campaign.id));
  } catch (err) {
    // Mark as failed on unrecoverable error
    await db.update(campaignsTable).set({
      status: "failed",
      updatedAt: new Date(),
    }).where(eq(campaignsTable.id, campaign.id)).catch(() => {});
  }
}

export default router;
