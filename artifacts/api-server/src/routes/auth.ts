import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// Simple in-memory sessions (token → userId)
const sessions = new Map<string, number>();

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
    const user = users[0];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken();
    sessions.set(token, user.id);
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    logger.error({ err }, "Login error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) sessions.delete(token);
  return res.json({ ok: true });
});

router.get("/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token || !sessions.has(token)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = sessions.get(token)!;
    const users = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    const user = users[0];
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    logger.error({ err }, "Get me error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { sessions };
export default router;
