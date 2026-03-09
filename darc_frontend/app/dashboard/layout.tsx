"use client";

import React from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ProtectedLayout } from "@/components/ProtectedLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
      <div className="flex bg-background min-h-screen">
        <DashboardSidebar />
        {/* Main Content - Offset for desktop sidebar */}
        <main className="flex-1 sm:ml-64">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
  );
}
