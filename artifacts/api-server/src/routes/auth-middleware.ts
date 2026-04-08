import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  userId?: string;
  dbUserId?: number;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const clerkId = auth?.sessionClaims?.userId as string | undefined || auth?.userId;
  if (!clerkId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = clerkId;

  // Auto-create user in DB if not exists
  let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) {
    const email = (auth?.sessionClaims?.email as string) || "";
    const name = (auth?.sessionClaims?.name as string) || "";
    [user] = await db.insert(usersTable).values({
      clerkId,
      email,
      name,
      creditsRemaining: 10,
      creditsUsed: 0,
    }).returning();
  }
  req.dbUserId = user.id;
  next();
};
