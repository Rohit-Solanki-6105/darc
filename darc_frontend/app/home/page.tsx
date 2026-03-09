"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Bot, Sparkles, Zap, Store, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAgents } from "@/hooks/useApi";

const CATEGORIES = [
  "All",
  "Code",
  "Writing",
  "Analysis",
  "Creative",
  "Productivity",
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthContext();
  const { agents, isLoading, error, fetchAgents } = useAgents();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Fetch approved agents on mount and when search changes
  useEffect(() => {
    fetchAgents({ search, status: "approved" });
  }, [search, fetchAgents]);

  // Filter agents by category on the client side
  const filteredAgents =
    category === "All"
      ? agents
      : agents.filter((a) => {
          // Map agent description to category if needed
          // For now, use the search results returned by API
          return true;
        });

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="relative min-h-screen w-full">
      <AnimatedGradientBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background/40 backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-foreground">DARC</span>
            </div>
            {isAuthenticated && user ? (
              <nav className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-semibold text-foreground">{user.first_name || "User"}</span>
                </span>
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => router.push("/dashboard")}
                  >
                    <Store className="w-4 h-4 mr-1.5" />
                    Dashboard
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => router.push("/account-settings")}
                >
                  <Settings className="w-4 h-4 mr-1.5" />
                  Settings
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              </nav>
            ) : (
              <nav className="flex items-center gap-4">
                <a
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </a>
                <a
                  href="/connect-wallet"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Connect Wallet
                </a>
              </nav>
            )}
          </div>
        </header>

        {/* Hero / Introduction */}
        <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              AI Agents, Ready for the Web
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and use AI agents deployed on DARC. Access powerful
              assistants for code, writing, analysis, and more—right from your
              browser, anywhere.
            </p>
          </motion.div>
        </section>

        {/* Search & Category */}
        <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 rounded-xl bg-background/60 border-border"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {CATEGORIES.map((c) => (
                <Button
                  key={c}
                  variant={category === c ? "default" : "outline"}
                  size="sm"
                  className="shrink-0 rounded-xl"
                  onClick={() => setCategory(c)}
                >
                  {c === "All" && <SlidersHorizontal className="w-4 h-4 mr-1.5" />}
                  {c}
                </Button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Agent Grid */}
        <section className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
              />
              <span className="ml-3 text-muted-foreground">Loading agents...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
              <p className="font-semibold">Failed to load agents</p>
              <p className="text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fetchAgents({ search, status: "approved" })}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Agents Grid */}
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredAgents && filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <motion.div
                    key={agent.agent_id}
                    whileHover={{ y: -4 }}
                    onClick={() => router.push(`/agents/${agent.agent_id}`)}
                  >
                    <Card className="bg-background/60 backdrop-blur-xl border-border hover:border-primary/30 transition-colors cursor-pointer group h-full">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {agent.agent_name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              by Developer
                            </p>
                          </div>
                          <Zap className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                          {agent.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Rating:</span>
                            <span className="text-sm font-semibold text-primary">
                              {(agent.rating || 0).toFixed(1)} ⭐
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Price:</span>
                            <span className="text-sm font-semibold">
                              ${parseFloat(agent.agent_price || 0).toFixed(2)}
                            </span>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full mt-3 rounded-lg"
                            onClick={() => router.push(`/useagent/${agent.agent_id}`)}
                          >
                            Use Agent
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No agents found matching your search.</p>
                  <p className="text-sm mt-1">Try a different search term or category.</p>
                </div>
              )}
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}
