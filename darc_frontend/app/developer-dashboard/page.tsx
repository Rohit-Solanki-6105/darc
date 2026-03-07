"use client";

import React from "react";
import Link from "next/link";
import {
  Bot,
  Plus,
  BarChart3,
  Activity,
  Users,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";

export default function DeveloperDashboardPage() {

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
            <Link href="/registerAgent">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <Plus className="w-4 h-4" />
                Register Agent
              </Button>
            </Link>
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

            <Link href="/registerAgent">
              <Button
                variant="outline"
                className="w-full h-24 border-dashed border-2 bg-background/40 hover:bg-background/80 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add your first agent or register a new one
              </Button>
            </Link>

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
                      className={`text-xs px-2 py-1 rounded-full ${agent.status === "live"
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
