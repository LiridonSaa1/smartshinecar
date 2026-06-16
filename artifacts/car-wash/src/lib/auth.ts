import React, { createContext, useContext, useState, useEffect } from "react";
import { setAuthTokenGetter } from "@/lib/api-client";

const TOKEN_KEY = "admin_token";
const USER_KEY  = "admin_user";

// Wire the admin token into the API client so every customFetch call
// automatically attaches Authorization: Bearer <token> when logged in.
setAuthTokenGetter(() => localStorage.getItem(TOKEN_KEY));

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser]   = useState<AdminUser | null>(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) ?? "null"); } catch { return null; }
  });

  const login = (newToken: string, newUser: AdminUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch { /* nuk ndal logout-in nëse API dështon */ }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) { logout(); } })
      .catch(() => logout());
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { token, user, isAuthenticated: !!token, login, logout } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
