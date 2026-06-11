import jwt from "jsonwebtoken";

const SECRET = process.env.CUSTOMER_JWT_SECRET ?? "smartshine-customer-portal-secret";

export interface CustomerTokenPayload {
  id: number;
  email: string;
  name: string;
}

export function signCustomerToken(payload: CustomerTokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function verifyCustomerToken(token: string): CustomerTokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as CustomerTokenPayload;
  } catch {
    return null;
  }
}
