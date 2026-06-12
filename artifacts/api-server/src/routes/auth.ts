import { Router } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

const LOCAL_ISS = "smartshine-local";

function getJwtSecret(): string {
  return process.env.JWT_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY!;
}

function tryLocalAdminLogin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return null;
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

    // 1. Check local admin env-var credentials first
    const local = tryLocalAdminLogin(email, password);
    if (local) return res.json(local);

    // 2. Fall back to Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    return res.json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name ?? data.user.email,
        role: data.user.user_metadata?.role ?? "admin",
      },
    });
  } catch (err) {
    logger.error({ err }, "Login error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      // Only call Supabase sign-out for Supabase tokens (not local JWTs)
      const localPayload = verifyLocalToken(token);
      if (!localPayload) {
        await supabase.auth.admin.signOut(token);
      }
    }
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Logout error");
    return res.json({ ok: true });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // 1. Check if it's a local admin token
    const localPayload = verifyLocalToken(token);
    if (localPayload) {
      return res.json({
        id: localPayload.sub,
        email: localPayload.email,
        name: "Admin",
        role: "admin",
      });
    }

    // 2. Fall back to Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name ?? data.user.email,
      role: data.user.user_metadata?.role ?? "admin",
    });
  } catch (err) {
    logger.error({ err }, "Get me error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
