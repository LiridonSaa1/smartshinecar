import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  token: string | null;
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  session: null,
  isAuthenticated: false,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const login = (token: string) => {
    // kept for backward compatibility — Supabase manages its own session
    console.log("login called with token", token);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) return null;

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        token: session?.access_token ?? null,
        user: session?.user ?? null,
        session,
        isAuthenticated: !!session,
        login,
        logout,
      },
    },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
