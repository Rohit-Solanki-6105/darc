"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Plus,
  BarChart3,
  Activity,
  Users,
  Zap,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";

export default function DeveloperDashboardPage() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Placeholder metrics - replace with real data
  const metrics = [
    { label: "Total Agents", value: "3", icon: Bot, trend: "+1 this week" },
    { label: "Total Requests", value: "1.2k", icon: Activity, trend: "+12%" },
    { label: "Active Users", value: "847", icon: Users, trend: "+8%" },
  ];

  const recentAgents = [
    { id: 1, name: "Code Assistant", status: "live", requests: 432 },
    { id: 2, name: "Content Writer", status: "live", requests: 289 },
    { id: 3, name: "Data Analyzer", status: "draft", requests: 0 },
  ];

  return (
    <main className="relative min-h-screen w-full">
      <AnimatedGradientBackground />
      <div className="relative z-10 flex min-h-screen">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-border bg-background/40 backdrop-blur-xl p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2 py-4">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Developer Dashboard</h1>
          </div>

          <nav className="flex flex-col gap-1">
            <Button
              variant={showRegisterForm ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => setShowRegisterForm(true)}
            >
              <Plus className="w-4 h-4" />
              Register Agent
            </Button>
            <Link href="/developer-dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </Button>
            </Link>
          </nav>

          {/* Dashboard Basic Analysis Sections */}
          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Quick Stats
            </p>
            <div className="space-y-2">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50"
                >
                  <m.icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content - Agents of Developer */}
        <section className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Your Agents</h2>
              <p className="text-muted-foreground mt-1">
                Manage and monitor your deployed AI agents
              </p>
            </div>

            {showRegisterForm ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-background/60 backdrop-blur-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Register New Agent</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Agent registration form will be integrated here. Connect your agent
                  endpoint, configure capabilities, and deploy.
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => setShowRegisterForm(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button>
                    <Zap className="w-4 h-4 mr-2" />
                    Deploy Agent
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Button
                variant="outline"
                className="w-full h-24 border-dashed border-2"
                onClick={() => setShowRegisterForm(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add your first agent or register a new one
              </Button>
            )}

            <div className="grid gap-4">
              {recentAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="bg-background/60 backdrop-blur-xl border-border"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Bot className="w-4 h-4 text-primary" />
                      {agent.name}
                    </CardTitle>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        agent.status === "live"
                          ? "bg-green-500/20 text-green-600 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {agent.requests} requests
                      </p>
                      <Button variant="ghost" size="sm">
                        View details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
