import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
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

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
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

// Step 1: Create Razorpay order — called when user clicks Buy
router.post("/billing/create-order", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ error: "planId required" });

    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ error: "Invalid plan" });

    let razorpay: Razorpay;
    try {
      razorpay = getRazorpay();
    } catch (e: any) {
      return res.status(503).json({ error: e.message });
    }

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: "INR",
      receipt: `alka_${req.dbUserId}_${planId}_${Date.now()}`,
      notes: {
        planId: plan.id,
        planName: plan.name,
        userId: String(req.dbUserId),
      },
    });

    logger.info({ orderId: order.id, planId, userId: req.dbUserId }, "Razorpay order created");

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planId: plan.id,
      planName: plan.name,
      planPrice: plan.price,
    });
  } catch (err: any) {
    logger.error(err, "Error creating Razorpay order");
    res.status(500).json({ error: err?.message || "Failed to create payment order" });
  }
});

// Step 2: Verify Razorpay signature — automatic, cryptographic verification
router.post("/billing/verify-payment", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(503).json({ error: "Razorpay not configured on server" });
    }

    // HMAC-SHA256 signature check — proves payment is genuine and not tampered
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      logger.warn({ razorpay_order_id, razorpay_payment_id }, "Razorpay signature mismatch — fraud attempt or tampered data");
      return res.status(400).json({ error: "Payment signature invalid. Transaction rejected." });
    }

    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ error: "Invalid plan" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.dbUserId!));
    if (!user) return res.status(404).json({ error: "User not found" });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

    await db.update(usersTable).set({
      planId: plan.id,
      planName: plan.name,
      planExpiresAt: expiresAt,
      creditsRemaining: user.creditsRemaining + plan.credits,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    await db.insert(subscriptionsTable).values({
      userId: user.id,
      planId: plan.id,
      planName: plan.name,
      status: "active",
      transactionId: razorpay_payment_id,
      expiresAt,
    });

    await db.insert(creditTransactionsTable).values({
      userId: user.id,
      type: "credit",
      amount: plan.credits,
      description: `${plan.name} purchased — Payment: ${razorpay_payment_id}`,
    });

    logger.info({ razorpay_payment_id, planId, userId: req.dbUserId }, "Payment verified and plan activated");

    res.json({
      success: true,
      message: `${plan.name} activated! ${plan.credits} credits added to your account.`,
      credits: plan.credits,
      planName: plan.name,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: any) {
    logger.error(err, "Error verifying payment");
    res.status(500).json({ error: err?.message || "Payment verification failed" });
  }
});

// Legacy webhook (for manual/external triggers)
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
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);
    await db.update(usersTable).set({
      planId: plan.id, planName: plan.name, planExpiresAt: expiresAt,
      creditsRemaining: user.creditsRemaining + plan.credits, updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));
    await db.insert(subscriptionsTable).values({
      userId: user.id, planId: plan.id, planName: plan.name,
      status: "active", transactionId, expiresAt,
    });
    await db.insert(creditTransactionsTable).values({
      userId: user.id, type: "credit", amount: plan.credits,
      description: `Credits from ${plan.name} - Transaction: ${transactionId}`,
    });
    res.json({ success: true });
  } catch (err) {
    logger.error(err, "Webhook error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
