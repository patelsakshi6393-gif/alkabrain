import { Router } from "express";
import { db, templatesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";

const router = Router();

router.get("/templates", requireAuth, async (req: AuthRequest, res) => {
  try {
    const templates = await db.select().from(templatesTable).where(eq(templatesTable.userId, req.dbUserId!));
    res.json(templates.map(t => ({
      id: t.id,
      name: t.name,
      type: t.type,
      subject: t.subject,
      body: t.body,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error(err, "Error getting templates");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/templates", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, type, subject, body } = req.body;
    if (!name || !type || !body) return res.status(400).json({ error: "Missing required fields" });
    const [template] = await db.insert(templatesTable).values({
      userId: req.dbUserId!,
      name,
      type,
      subject: subject || null,
      body,
    }).returning();
    res.status(201).json({
      id: template.id,
      name: template.name,
      type: template.type,
      subject: template.subject,
      body: template.body,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Error creating template");
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/templates/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, subject, body } = req.body;
    const [template] = await db.update(templatesTable)
      .set({ name, type, subject: subject || null, body, updatedAt: new Date() })
      .where(and(eq(templatesTable.id, id), eq(templatesTable.userId, req.dbUserId!)))
      .returning();
    if (!template) return res.status(404).json({ error: "Template not found" });
    res.json({
      id: template.id,
      name: template.name,
      type: template.type,
      subject: template.subject,
      body: template.body,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err, "Error updating template");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/templates/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(templatesTable)
      .where(and(eq(templatesTable.id, id), eq(templatesTable.userId, req.dbUserId!)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Error deleting template");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
