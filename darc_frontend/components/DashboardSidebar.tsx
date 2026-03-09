"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Zap,
  TrendingUp,
  MessageSquare,
  Settings,
  LogOut,
  Grid3X3,
  Wallet,
  BarChart3,
  FileText,
  Users,
  Bot,
  ShoppingCart,
  Award,
  CreditCard,
  Clock,
  CheckCircle,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  devOnly?: boolean;
  clientOnly?: boolean;
}

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  const isDeveloper = user.is_developer;

  // Common items for both
  const commonItems: SidebarItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Grid3X3 className="w-5 h-5" />,
    },
    {
      label: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: "Reviews",
      href: "/dashboard/reviews",
      icon: <StarIcon className="w-5 h-5" />,
    },
    {
      label: "Account Settings",
      href: "/account-settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  // Developer-specific items
  const developerItems: SidebarItem[] = [
    {
      label: "My Agents",
      href: "/developer-dashboard",
      icon: <Zap className="w-5 h-5" />,
      devOnly: true,
    },
    {
      label: "Create Agent",
      href: "/registerAgent",
      icon: <Bot className="w-5 h-5" />,
      devOnly: true,
    },
    {
      label: "Earnings",
      href: "/dashboard/earnings",
      icon: <TrendingUp className="w-5 h-5" />,
      devOnly: true,
    },
    {
      label: "Transactions",
      href: "/dashboard/transactions",
      icon: <CreditCard className="w-5 h-5" />,
      devOnly: true,
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      devOnly: true,
    },
  ];

  // Client-specific items
  const clientItems: SidebarItem[] = [
    {
      label: "Discover Agents",
      href: "/home",
      icon: <Zap className="w-5 h-5" />,
      clientOnly: true,
    },
    {
      label: "My Subscriptions",
      href: "/dashboard/subscriptions",
      icon: <Clock className="w-5 h-5" />,
      clientOnly: true,
    },
    {
      label: "Purchase History",
      href: "/dashboard/purchases",
      icon: <ShoppingCart className="w-5 h-5" />,
      clientOnly: true,
    },
    {
      label: "My Tasks",
      href: "/dashboard/tasks",
      icon: <CheckCircle className="w-5 h-5" />,
      clientOnly: true,
    },
    {
      label: "Favorites",
      href: "/dashboard/favorites",
      icon: <Award className="w-5 h-5" />,
      clientOnly: true,
    },
  ];

  // Filter items based on user role
  let sidebarItems = [...commonItems];

  if (isDeveloper) {
    sidebarItems = [...commonItems, ...developerItems];
  } else {
    sidebarItems = [...commonItems, ...clientItems];
  }

  // Add "Client View" option for developers
  if (isDeveloper) {
    sidebarItems.push({
      label: "Switch to Client View",
      href: "/home",
      icon: <Users className="w-5 h-5" />,
      devOnly: true,
    });
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
    setIsMobileOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="px-6 py-6 border-b border-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">DARC</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="sm:hidden text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-xs uppercase text-muted-foreground font-semibold mb-1">
          {isDeveloper ? "Developer" : "Client"}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">
          {user?.first_name} {user?.last_name}
        </p>
        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {sidebarItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={item.href}>
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all text-left text-sm font-medium",
                  isActive(item.href)
                    ? "bg-primary/20 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          className="w-full justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-background border border-border hover:bg-muted"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:fixed sm:left-0 sm:top-0 sm:h-screen sm:w-64 sm:border-r sm:border-border sm:bg-background/95 sm:backdrop-blur-xl sm:flex sm:flex-col sm:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="sm:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        >
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background flex flex-col"
          >
            {sidebarContent}
          </motion.aside>
        </motion.div>
      )}
    </>
  );
}
