import { Router, type Request } from "express";
import crypto from "crypto";
import { db, usersTable, subscriptionsTable, creditTransactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";
import { logger } from "../lib/logger";

const router = Router();

// Payment page URLs from Razorpay dashboard
const PAYMENT_PAGES: Record<string, string> = {
  trial:     "https://rzp.io/rzp/KjEoJm9",
  monthly:   "https://rzp.io/rzp/8iV4SDy",
  quarterly: "https://rzp.io/rzp/PY0a4MG",
  yearly:    "https://rzp.io/rzp/JZZdG0Ne",
};

// Amount in paise → plan mapping for webhook identification
const AMOUNT_TO_PLAN: Record<number, string> = {
  500:   "trial",
  9900:  "monthly",
  24900: "quarterly",
  79900: "yearly",
};

const PLANS = [
  {
    id: "trial",
    name: "Trial Plan",
    price: 5,
    currency: "INR",
    durationDays: 3,
    credits: 30,
    paymentUrl: PAYMENT_PAGES.trial,
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
    paymentUrl: PAYMENT_PAGES.monthly,
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
    paymentUrl: PAYMENT_PAGES.quarterly,
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
    paymentUrl: PAYMENT_PAGES.yearly,
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

async function activatePlan(userId: number, plan: typeof PLANS[0], paymentId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) throw new Error("User not found");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

  await db.update(usersTable).set({
    planId: plan.id,
    planName: plan.name,
    planExpiresAt: expiresAt,
    creditsRemaining: user.creditsRemaining + plan.credits,
    updatedAt: new Date(),
  }).where(eq(usersTable.id, userId));

  await db.insert(subscriptionsTable).values({
    userId,
    planId: plan.id,
    planName: plan.name,
    status: "active",
    transactionId: paymentId,
    expiresAt,
  });

  await db.insert(creditTransactionsTable).values({
    userId,
    type: "credit",
    amount: plan.credits,
    description: `${plan.name} purchased — Payment: ${paymentId}`,
  });
}

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

// ─────────────────────────────────────────────────────────────
// RAZORPAY WEBHOOK — Automatic payment verification
// Razorpay calls this after every successful payment
// Raw body is required for HMAC-SHA256 signature verification
// ─────────────────────────────────────────────────────────────
router.post("/billing/razorpay-webhook", async (req: Request, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error("RAZORPAY_WEBHOOK_SECRET not set");
      return res.status(503).json({ error: "Webhook not configured" });
    }

    const signature = req.headers["x-razorpay-signature"] as string;
    if (!signature) {
      logger.warn("Webhook received without signature header");
      return res.status(400).json({ error: "Missing signature" });
    }

    // Raw body is captured by express.raw() middleware in app.ts
    const rawBody: Buffer = (req as any).rawBody || req.body;
    const rawBodyStr = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : String(rawBody);

    // Cryptographic verification — prevents fake webhook calls
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBodyStr)
      .digest("hex");

    if (expectedSig !== signature) {
      logger.warn({ received: signature, expected: expectedSig }, "Razorpay webhook signature mismatch");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = JSON.parse(rawBodyStr);
    logger.info({ event: event.event }, "Razorpay webhook received");

    // Handle payment.captured event (money is captured/settled)
    if (event.event === "payment.captured" || event.event === "payment_page.payment.attempted") {
      const payment = event.payload?.payment?.entity;
      if (!payment) {
        logger.warn("Webhook missing payment entity");
        return res.status(200).json({ status: "ignored" });
      }

      const paymentId = payment.id as string;
      const amountPaise = payment.amount as number;
      const email = payment.email as string;
      const status = payment.status as string;

      if (status !== "captured") {
        logger.info({ paymentId, status }, "Payment not captured, skipping");
        return res.status(200).json({ status: "ignored" });
      }

      logger.info({ paymentId, amountPaise, email }, "Processing captured payment");

      // Identify plan by amount
      const planId = AMOUNT_TO_PLAN[amountPaise];
      if (!planId) {
        logger.warn({ amountPaise }, "Unknown payment amount, skipping plan activation");
        return res.status(200).json({ status: "unknown_plan" });
      }

      const plan = PLANS.find(p => p.id === planId);
      if (!plan) return res.status(200).json({ status: "plan_not_found" });

      // Find user by email
      if (!email) {
        logger.warn({ paymentId }, "No email in payment, cannot identify user");
        return res.status(200).json({ status: "no_email" });
      }

      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
      if (!user) {
        logger.warn({ email, paymentId }, "No user found with this email");
        return res.status(200).json({ status: "user_not_found" });
      }

      await activatePlan(user.id, plan, paymentId);

      logger.info({ userId: user.id, planId, paymentId }, "Plan activated via webhook");
      return res.status(200).json({ success: true, message: "Plan activated" });
    }

    // Always return 200 to Razorpay for other events
    res.status(200).json({ status: "ok" });
  } catch (err) {
    logger.error(err, "Webhook processing error");
    // Return 200 to prevent Razorpay from retrying (log the error internally)
    res.status(200).json({ error: "Internal error logged" });
  }
});

// Legacy webhook (kept for manual/admin triggers)
router.post("/billing/webhook", async (req, res) => {
  try {
    const { userId: clerkId, planId, transactionId } = req.body;
    if (!clerkId || !planId || !transactionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ error: "Invalid plan" });
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
    if (!user) return res.status(404).json({ error: "User not found" });
    await activatePlan(user.id, plan, transactionId);
    res.json({ success: true });
  } catch (err) {
    logger.error(err, "Webhook error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
