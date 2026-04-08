import { Router } from "express";
import { db, usersTable, subscriptionsTable, creditTransactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";
import { logger } from "../lib/logger";

const router = Router();

const PLANS = [
  {
    id: "trial",
    name: "Trial Plan",
    price: 5,
    currency: "INR",
    durationDays: 3,
    credits: 30,
    features: [
      "30 credits included",
      "Email campaigns",
      "Lead scraping (DuckDuckGo)",
      "1 Gmail integration",
      "Basic templates",
      "3 days validity",
    ],
    isPopular: false,
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 99,
    currency: "INR",
    durationDays: 30,
    credits: 300,
    features: [
      "300 credits included",
      "Email & WhatsApp campaigns",
      "Unlimited lead scraping",
      "Gmail + WhatsApp integration",
      "Unlimited templates",
      "Priority support",
      "30 days validity",
    ],
    isPopular: true,
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: 249,
    currency: "INR",
    durationDays: 90,
    credits: 1000,
    features: [
      "1000 credits included",
      "Email & WhatsApp campaigns",
      "Unlimited lead scraping",
      "Gmail + WhatsApp integration",
      "Unlimited templates",
      "Priority support",
      "Advanced analytics",
      "90 days validity",
    ],
    isPopular: false,
  },
  {
    id: "yearly",
    name: "Yearly Plan",
    price: 799,
    currency: "INR",
    durationDays: 365,
    credits: 5000,
    features: [
      "5000 credits included",
      "Email & WhatsApp campaigns",
      "Unlimited lead scraping",
      "Gmail + WhatsApp integration",
      "Unlimited templates",
      "24/7 Priority support",
      "Advanced analytics & reports",
      "Custom sending schedules",
      "365 days validity",
    ],
    isPopular: false,
  },
];

router.get("/billing/plans", async (_req, res) => {
  res.json(PLANS);
});

router.get("/billing/subscription", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.dbUserId!));
    if (!user || !user.planId) {
      return res.json({ isActive: false, id: null, planId: null, planName: null, status: null, expiresAt: null });
    }

    const now = new Date();
    const isActive = user.planExpiresAt ? user.planExpiresAt > now : false;

    const [sub] = await db.select().from(subscriptionsTable)
      .where(eq(subscriptionsTable.userId, req.dbUserId!))
      .orderBy(subscriptionsTable.createdAt);

    res.json({
      id: sub?.id || null,
      planId: user.planId,
      planName: user.planName,
      status: isActive ? "active" : "expired",
      expiresAt: user.planExpiresAt?.toISOString() || null,
      isActive,
    });
  } catch (err) {
    req.log.error(err, "Error getting subscription");
    res.status(500).json({ error: "Server error" });
  }
});

// Payment webhook — receives payment confirmation
router.post("/billing/webhook", async (req, res) => {
  try {
    const { userId: clerkId, planId, transactionId, amount } = req.body;
    logger.info({ clerkId, planId, transactionId }, "Payment webhook received");

    if (!clerkId || !planId || !transactionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ error: "Invalid plan" });

    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.clerkId, clerkId));
    if (!user) return res.status(404).json({ error: "User not found" });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

    // Update user credits and plan
    await db.update(usersTable).set({
      planId: plan.id,
      planName: plan.name,
      planExpiresAt: expiresAt,
      creditsRemaining: user.creditsRemaining + plan.credits,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    // Create subscription record
    await db.insert(subscriptionsTable).values({
      userId: user.id,
      planId: plan.id,
      planName: plan.name,
      status: "active",
      transactionId,
      expiresAt,
    });

    // Credit transaction
    await db.insert(creditTransactionsTable).values({
      userId: user.id,
      type: "credit",
      amount: plan.credits,
      description: `Credits from ${plan.name} - Transaction: ${transactionId}`,
    });

    res.json({ success: true, message: "Payment verified and plan activated" });
  } catch (err) {
    logger.error(err, "Error processing webhook");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
