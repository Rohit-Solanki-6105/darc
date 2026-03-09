'use client';

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'developer' | 'client';
}

export function ProtectedLayout({ 
  children, 
  requiredRole 
}: ProtectedLayoutProps) {
  const { isAuthenticated, isReady, user, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRole && user) {
      const userRole = user.is_developer ? 'developer' : 'client';
      if (userRole !== requiredRole) {
        router.push('/home');
        return;
      }
    }
  }, [isReady, isAuthenticated, requiredRole, user, router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
}
