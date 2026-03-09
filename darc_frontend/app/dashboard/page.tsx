"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  Sparkles,
  LogOut,
  Settings,
  CheckCircle,
  Clock,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAgents } from "@/hooks/useApi";
import { ProtectedLayout } from "@/components/ProtectedLayout";

export default function DeveloperDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { agents, isLoading, error, fetchAgents, deleteAgent } = useAgents();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    agent_name: "",
    description: "",
    agent_price: "0",
    task_fees: "0",
    subscription_fee: "0",
  });

  // Fetch developer's agents on mount
  useEffect(() => {
    if (user?.id) {
      // Fetch only this developer's agents
      fetchAgents({ developer_id: user.id });
    }
  }, [user?.id, fetchAgents]);

  // Filter agents by status and search
  const filteredAgents = (agents || [])
    .filter((agent) => {
      if (statusFilter !== "all") {
        return agent.status === statusFilter;
      }
      return true;
    })
    .filter((agent) =>
      agent.agent_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Handle create agent
  const handleCreateAgent = async () => {
    if (!formData.agent_name.trim() || !formData.description.trim()) {
      alert("Please fill in required fields");
      return;
    }

    try {
      // This would call the create agent API
      // For now, just show a message
      console.log("Creating agent:", formData);
      setFormData({
        agent_name: "",
        description: "",
        agent_price: "0",
        task_fees: "0",
        subscription_fee: "0",
      });
      setShowCreateForm(false);
      alert("Agent creation API integration coming soon!");
    } catch (err) {
      console.error("Error creating agent:", err);
    }
  };

  // Handle delete agent
  const handleDeleteAgent = async (agentId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this agent? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(agentId.toString());
    try {
      await deleteAgent(agentId);
      // Refresh agents list
      if (user?.id) {
        await fetchAgents({ developer_id: user.id });
      }
    } catch (err) {
      console.error("Error deleting agent:", err);
      alert("Failed to delete agent");
    } finally {
      setDeleting(null);
    }
  };

  const stats = {
    totalAgents: agents.length,
    approvedAgents: agents.filter((a) => a.status === "approved")
      .length,
    pendingAgents: agents.filter((a) => a.status === "pending").length,
    rejectedAgents: agents.filter((a) => a.status === "rejected")
      .length,
    totalEarnings: user?.total_earning || 0,
  };

  return (
    <ProtectedLayout requiredRole="developer">
      <main className="relative min-h-screen w-full">
        <AnimatedGradientBackground />
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-background/40 backdrop-blur-xl sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg text-foreground">DARC</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full ml-2">
                  Developer
                </span>
              </div>
              <nav className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user?.first_name || "Developer"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => router.push("/home")}
                >
                  Back to Explore
                </Button>
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
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Developer Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your AI agents and track performance
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
            >
              <Card className="bg-background/60 backdrop-blur-xl border-border">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Total Agents
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalAgents}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/60 backdrop-blur-xl border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Approved
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.approvedAgents}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/60 backdrop-blur-xl border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Pending
                  </div>
                  <div className="text-2xl font-bold text-amber-600">
                    {stats.pendingAgents}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/60 backdrop-blur-xl border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Rejected
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.rejectedAgents}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/60 backdrop-blur-xl border-border">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Total Earnings
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${stats.totalEarnings}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Create Agent Section */}
            {!showCreateForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Button
                  onClick={() => router.push("/registerAgent")}
                  className="rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Agent
                </Button>
              </motion.div>
            )}

            {/* Create Agent Form */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/60 backdrop-blur-xl border border-border rounded-lg p-6 mb-8"
              >
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Create New Agent
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Agent Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Code Assistant Pro"
                      value={formData.agent_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agent_name: e.target.value,
                        })
                      }
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Description *
                    </label>
                    <Input
                      type="text"
                      placeholder="Describe what your agent does..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="rounded-lg"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Agent Price ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="99.99"
                        value={formData.agent_price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agent_price: e.target.value,
                          })
                        }
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Task Fees ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="10.00"
                        value={formData.task_fees}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            task_fees: e.target.value,
                          })
                        }
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Subscription Fee ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="29.99"
                        value={formData.subscription_fee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subscription_fee: e.target.value,
                          })
                        }
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCreateAgent}
                      className="rounded-lg"
                    >
                      Create Agent
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Agents List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-lg"
                />
                <div className="flex gap-2">
                  {["all", "approved", "pending", "rejected"].map((status) => (
                    <Button
                      key={status}
                      variant={
                        statusFilter === status ? "default" : "outline"
                      }
                      size="sm"
                      className="rounded-lg capitalize"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                  />
                  <span className="ml-3 text-muted-foreground">
                    Loading agents...
                  </span>
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
                    onClick={() =>
                      user?.id && fetchAgents({ developer_id: user.id })
                    }
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Agents Table */}
              {!isLoading && !error && (
                <div className="space-y-3">
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <motion.div
                        key={agent.agent_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="bg-background/60 backdrop-blur-xl border-border hover:border-primary/30 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-foreground">
                                    {agent.agent_name}
                                  </h3>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      agent.status === "approved"
                                        ? "bg-green-600/20 text-green-600"
                                        : agent.status === "pending"
                                        ? "bg-amber-600/20 text-amber-600"
                                        : "bg-red-600/20 text-red-600"
                                    }`}
                                  >
                                    {agent.status}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {agent.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                  <span>
                                    Price: $
                                    {parseFloat(agent.agent_price || 0).toFixed(
                                      2
                                    )}
                                  </span>
                                  <span>
                                    Rating:{" "}
                                    {(agent.rating || 0).toFixed(1)} ⭐
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-lg"
                                  onClick={() =>
                                    router.push(
                                      `/agents/${agent.agent_id}/edit`
                                    )
                                  }
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-lg text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteAgent(agent.agent_id)}
                                  disabled={deleting === agent.agent_id.toString()}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-lg"
                                  onClick={() =>
                                    router.push(
                                      `/agents/${agent.agent_id}/stats`
                                    )
                                  }
                                >
                                  <BarChart3 className="w-4 h-4" />
                                </Button>
                                {agent.status === "approved" && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="rounded-lg"
                                    onClick={() =>
                                      router.push(`/useagent/${agent.agent_id}`)
                                    }
                                  >
                                    <Zap className="w-4 h-4 mr-1" />
                                    Use
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg font-semibold mb-2">No agents found</p>
                      <p className="text-sm mb-4">
                        {agents.length === 0
                          ? "Start by creating your first agent"
                          : "No agents match your filters"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </ProtectedLayout>
  );
}
