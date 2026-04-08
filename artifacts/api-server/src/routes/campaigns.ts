import { Router } from "express";
import { db, campaignsTable, usersTable, creditTransactionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";

const router = Router();

router.get("/campaigns", requireAuth, async (req: AuthRequest, res) => {
  try {
    const campaigns = await db.select().from(campaignsTable)
      .where(eq(campaignsTable.userId, req.dbUserId!))
      .orderBy(campaignsTable.createdAt);
    res.json(campaigns.map(c => ({
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
    })));
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
    res.json({
      id: campaign.id,
      name: campaign.name,
      niche: campaign.niche,
      status: campaign.status,
      emailSubject: campaign.emailSubject,
      emailBody: campaign.emailBody,
      whatsappMessage: campaign.whatsappMessage,
      sendEmail: campaign.sendEmail,
      sendWhatsapp: campaign.sendWhatsapp,
      totalLeads: campaign.totalLeads,
      emailsSent: campaign.emailsSent,
      whatsappSent: campaign.whatsappSent,
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Error getting campaign");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/campaigns", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.dbUserId!));
    if (!user || user.creditsRemaining < 1) {
      return res.status(402).json({ error: "Insufficient credits. Please upgrade your plan." });
    }

    const { name, niche, emailSubject, emailBody, whatsappMessage, sendEmail, sendWhatsapp } = req.body;
    if (!name || !niche) return res.status(400).json({ error: "Missing required fields" });

    const [campaign] = await db.insert(campaignsTable).values({
      userId: req.dbUserId!,
      name,
      niche,
      emailSubject: emailSubject || null,
      emailBody: emailBody || null,
      whatsappMessage: whatsappMessage || null,
      sendEmail: sendEmail ?? false,
      sendWhatsapp: sendWhatsapp ?? false,
      status: "draft",
      totalLeads: 0,
      emailsSent: 0,
      whatsappSent: 0,
    }).returning();

    res.status(201).json({
      id: campaign.id,
      name: campaign.name,
      niche: campaign.niche,
      status: campaign.status,
      emailSubject: campaign.emailSubject,
      emailBody: campaign.emailBody,
      whatsappMessage: campaign.whatsappMessage,
      sendEmail: campaign.sendEmail,
      sendWhatsapp: campaign.sendWhatsapp,
      totalLeads: campaign.totalLeads,
      emailsSent: campaign.emailsSent,
      whatsappSent: campaign.whatsappSent,
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Error creating campaign");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
