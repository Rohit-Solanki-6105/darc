"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ROLE_STORAGE_KEY = "darc_user_role";

export type UserRole = "client" | "developer";

type AuthContextType = {
  role: UserRole | null;
  isReady: boolean; // true after localStorage has been read
  setRole: (role: UserRole) => void;
  clearRole: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
      if (stored === "client" || stored === "developer") {
        setRoleState(stored);
      }
      setMounted(true);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    }
  };

  const clearRole = () => {
    setRoleState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role: mounted ? role : null,
        isReady: mounted,
        setRole,
        clearRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
