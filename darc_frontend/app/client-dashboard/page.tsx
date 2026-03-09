"use client";

import { motion } from "framer-motion";
import { Bot, Clock, Sparkles, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";

const MOCK_TASKS = [
  {
    id: 1,
    agent: "Code Assistant",
    result: "Optimized React component structure",
    time: "2 minutes ago",
  },
  {
    id: 2,
    agent: "Image Generator",
    result: "Generated cyberpunk skyline image",
    time: "10 minutes ago",
  },
  {
    id: 3,
    agent: "Data Analyzer",
    result: "Detected 3 key data trends",
    time: "1 hour ago",
  },
];

export default function ClientDashboard() {
  return (
    <main className="relative min-h-screen w-full">
      <AnimatedGradientBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <Sparkles className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <Card className="bg-background/60 backdrop-blur-xl border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <Bot className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Agents Used
                </p>
                <p className="text-xl font-semibold">12</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur-xl border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <Zap className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Tasks Completed
                </p>
                <p className="text-xl font-semibold">87</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur-xl border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Last Activity
                </p>
                <p className="text-xl font-semibold">2m ago</p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Task History */}
        <div className="space-y-4">

          <h2 className="text-xl font-semibold mb-4">
            Recent Agent Tasks
          </h2>

          {MOCK_TASKS.map((task) => (
            <Card
              key={task.id}
              className="bg-background/60 backdrop-blur-xl border-border"
            >
              <CardContent className="p-5 flex items-center justify-between">

                <div>
                  <p className="font-medium">{task.agent}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.result}
                  </p>
                </div>

                <span className="text-xs text-muted-foreground">
                  {task.time}
                </span>

              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </main>
  );
}