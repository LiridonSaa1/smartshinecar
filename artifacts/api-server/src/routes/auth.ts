import { Router } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../lib/logger";

const router = Router();

const LOCAL_ISS = "smartshine-local";

function getJwtSecret(): string {
  return process.env.JWT_SECRET ?? process.env.SESSION_SECRET ?? "fallback-secret-change-me";
}

function tryLocalAdminLogin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@carwash.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  if (email !== adminEmail || password !== adminPassword) return null;

  const token = jwt.sign(
    { sub: "local-admin", email: adminEmail, role: "admin", iss: LOCAL_ISS },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
  return {
    token,
    user: { id: "local-admin", email: adminEmail, name: "Admin", role: "admin" },
  };
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

    const local = tryLocalAdminLogin(email, password);
    if (local) return res.json(local);

    return res.status(401).json({ error: "Invalid credentials" });
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
