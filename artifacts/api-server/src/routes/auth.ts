import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

const LOCAL_ISS = "smartshine-local";

function getJwtSecret(): string {
  return process.env.JWT_SECRET ?? process.env.SESSION_SECRET ?? "fallback-secret-change-me";
}

function verifyLocalToken(token: string) {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    if (payload.iss !== LOCAL_ISS) return null;
    return payload;
  } catch {
    return null;
  }
}

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Look up user in DB
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim()))
      .limit(1);

    if (!user || user.role !== "admin") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: String(user.id), email: user.email, role: user.role, iss: LOCAL_ISS },
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    logger.error({ err }, "Login error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", async (_req, res) => {
  return res.json({ ok: true });
});

router.get("/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const localPayload = verifyLocalToken(token);
    if (localPayload) {
      return res.json({
        id: localPayload.sub,
        email: localPayload.email,
        name: "Admin",
        role: "admin",
      });
    }

    return res.status(401).json({ error: "Unauthorized" });
  } catch (err) {
    logger.error({ err }, "Get me error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
