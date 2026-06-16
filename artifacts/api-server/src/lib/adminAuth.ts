import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "./logger";

const LOCAL_ISS = "smartshine-local";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET ?? process.env.SESSION_SECRET;
  if (!secret) {
    logger.warn("JWT_SECRET / SESSION_SECRET is not set — using insecure fallback. Set this env var in production!");
    return "fallback-secret-change-me";
  }
  return secret;
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
    if (payload.iss !== LOCAL_ISS || payload.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    (req as any).admin = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
