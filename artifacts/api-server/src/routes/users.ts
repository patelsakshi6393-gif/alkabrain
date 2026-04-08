import { Router } from "express";
import { db, usersTable, campaignsTable, creditTransactionsTable } from "@workspace/db";
import { eq, sum, count } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";

const router = Router();

router.get("/users/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.dbUserId!));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      creditsRemaining: user.creditsRemaining,
      creditsUsed: user.creditsUsed,
      planId: user.planId,
      planName: user.planName,
      planExpiresAt: user.planExpiresAt?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Error getting user");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users/dashboard", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.dbUserId!));
    if (!user) return res.status(404).json({ error: "User not found" });

    const campaigns = await db.select().from(campaignsTable).where(eq(campaignsTable.userId, req.dbUserId!));
    const activeCampaigns = campaigns.filter(c => c.status === "running").length;
    const totalLeads = campaigns.reduce((sum, c) => sum + c.totalLeads, 0);
    const emailsSent = campaigns.reduce((sum, c) => sum + c.emailsSent, 0);
    const whatsappSent = campaigns.reduce((sum, c) => sum + c.whatsappSent, 0);

    res.json({
      creditsRemaining: user.creditsRemaining,
      creditsUsed: user.creditsUsed,
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalLeads,
      emailsSent,
      whatsappSent,
      planName: user.planName,
      planExpiresAt: user.planExpiresAt?.toISOString() || null,
    });
  } catch (err) {
    req.log.error(err, "Error getting dashboard");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
