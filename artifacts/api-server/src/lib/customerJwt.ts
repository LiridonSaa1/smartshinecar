import jwt from "jsonwebtoken";
import { logger } from "./logger";

function getCustomerJwtSecret(): string {
  const secret = process.env.CUSTOMER_JWT_SECRET;
  if (!secret) {
    logger.warn("CUSTOMER_JWT_SECRET is not set — using insecure fallback. Set this env var in production!");
    return "smartshine-customer-portal-secret";
  }
  return secret;
}

export interface CustomerTokenPayload {
  id: number;
  email: string;
  name: string;
}

export function signCustomerToken(payload: CustomerTokenPayload): string {
  return jwt.sign(payload, getCustomerJwtSecret(), { expiresIn: "30d" });
}

export function verifyCustomerToken(token: string): CustomerTokenPayload | null {
  try {
    return jwt.verify(token, getCustomerJwtSecret()) as CustomerTokenPayload;
  } catch {
    return null;
  }
}
