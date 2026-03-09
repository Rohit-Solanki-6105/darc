"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth, UseAuthReturn } from "@/hooks/useApi";

export type UserRole = "client" | "developer";

type AuthContextType = UseAuthReturn & {
  role: UserRole | null;
  isReady: boolean;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [mounted, setMounted] = useState(false);

  // Determine role from user data
  useEffect(() => {
    if (auth.user) {
      setRoleState(auth.user.is_developer ? "developer" : "client");
      localStorage.setItem("darc_user_role", auth.user.is_developer ? "developer" : "client");
    }
    setMounted(true);
  }, [auth.user]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("darc_user_role", newRole);
  };

  const clearRole = () => {
    setRoleState(null);
    localStorage.removeItem("darc_user_role");
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
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

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
