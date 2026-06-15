import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = BASE ? `${BASE}/api` : "/api";
const TOKEN_KEY = "customer_token";

export interface CustomerUser {
  id: number;
  email: string;
  name: string;
}

interface CustomerAuthCtx {
  customer: CustomerUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthCtx>({
  customer: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }

    fetch(`${API}/customer/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setCustomer(data); else localStorage.removeItem(TOKEN_KEY); })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Login failed");
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    setCustomer(data.customer);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setCustomer(null);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customer, loading, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function getCustomerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function fetchCustomerBookings() {
  const token = getCustomerToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API}/customer/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function cancelCustomerBooking(id: number) {
  const token = getCustomerToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API}/customer/bookings/${id}/cancel`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Cancel failed");
  }
  return res.json();
}

export async function editCustomerBooking(id: number, updates: { date: string; time: string; notes: string }) {
  const token = getCustomerToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API}/customer/bookings/${id}/edit`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Edit failed");
  }
  return res.json();
}

export async function addCustomerBookingNote(id: number, note: string) {
  const token = getCustomerToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API}/customer/bookings/${id}/note`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to save note");
  }
  return res.json();
}

export async function submitCustomerReview(id: number, payload: { rating: number; comment: string }) {
  const token = getCustomerToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API}/customer/bookings/${id}/review`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to submit review");
  }
  return res.json();
}

export { API as CUSTOMER_API_BASE };
