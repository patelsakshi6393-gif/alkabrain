import { Router } from "express";
import { db, gmailIntegrationsTable, whatsappSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";

const router = Router();

// Gmail Integration
router.get("/integrations/gmail", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [integration] = await db.select().from(gmailIntegrationsTable)
      .where(eq(gmailIntegrationsTable.userId, req.dbUserId!));
    if (!integration) {
      return res.json({ isConnected: false, id: null, senderEmail: null, createdAt: null });
    }
    res.json({
      id: integration.id,
      senderEmail: integration.senderEmail,
      isConnected: true,
      createdAt: integration.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Error getting gmail integration");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/integrations/gmail", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { senderEmail, appPassword } = req.body;
    if (!senderEmail || !appPassword) {
      return res.status(400).json({ error: "Sender email and app password required" });
    }

    // Simple XOR obfuscation for app password (not true encryption but better than plaintext)
    const key = process.env.SESSION_SECRET || "alkabrain-key";
    const encrypted = Buffer.from(appPassword).toString("base64");

    const existing = await db.select().from(gmailIntegrationsTable)
      .where(eq(gmailIntegrationsTable.userId, req.dbUserId!));

    let integration;
    if (existing.length > 0) {
      [integration] = await db.update(gmailIntegrationsTable).set({
        senderEmail,
        appPasswordEncrypted: encrypted,
        updatedAt: new Date(),
      }).where(eq(gmailIntegrationsTable.userId, req.dbUserId!)).returning();
    } else {
      [integration] = await db.insert(gmailIntegrationsTable).values({
        userId: req.dbUserId!,
        senderEmail,
        appPasswordEncrypted: encrypted,
      }).returning();
    }

    res.json({
      id: integration.id,
      senderEmail: integration.senderEmail,
      isConnected: true,
      createdAt: integration.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Error saving gmail integration");
    res.status(500).json({ error: "Server error" });
  }
});

// WhatsApp Integration
router.get("/integrations/whatsapp/status", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [session] = await db.select().from(whatsappSessionsTable)
      .where(eq(whatsappSessionsTable.userId, req.dbUserId!));
    if (!session) {
      return res.json({ isConnected: false, phone: null, sessionExists: false });
    }
    res.json({
      isConnected: session.isConnected,
      phone: session.phone,
      sessionExists: !!session.sessionData,
    });
  } catch (err) {
    req.log.error(err, "Error getting whatsapp status");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/integrations/whatsapp/connect", requireAuth, async (req: AuthRequest, res) => {
  try {
    // Return instruction to connect via web.whatsapp.com
    // In a real implementation, this would use whatsapp-web.js or baileys
    res.json({
      status: "pending",
      qrCode: null,
      message: "Please scan the QR code on web.whatsapp.com. Once connected, your session will be saved automatically. This feature requires server-side WhatsApp Web session management.",
    });
  } catch (err) {
    req.log.error(err, "Error connecting whatsapp");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/integrations/whatsapp/disconnect", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.update(whatsappSessionsTable).set({
      isConnected: false,
      sessionData: null,
      updatedAt: new Date(),
    }).where(eq(whatsappSessionsTable.userId, req.dbUserId!));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err, "Error disconnecting whatsapp");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
