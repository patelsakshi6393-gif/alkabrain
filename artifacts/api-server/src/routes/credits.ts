import { Router } from "express";
import { db, creditTransactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "./auth-middleware";

const router = Router();

router.get("/credits/history", requireAuth, async (req: AuthRequest, res) => {
  try {
    const history = await db.select().from(creditTransactionsTable)
      .where(eq(creditTransactionsTable.userId, req.dbUserId!))
      .orderBy(desc(creditTransactionsTable.createdAt))
      .limit(50);
    res.json(history.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      createdAt: t.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error(err, "Error getting credits history");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
