"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Bot, Sparkles, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";

const CATEGORIES = [
  "All",
  "Code",
  "Writing",
  "Analysis",
  "Creative",
  "Productivity",
];

// Placeholder agents - replace with API data
const MOCK_AGENTS = [
  {
    id: 1,
    name: "Code Assistant",
    description:
      "Helps you write, refactor, and debug code in multiple programming languages such as JavaScript, Python, and TypeScript. It can also suggest better patterns, optimize performance, and explain complex logic to improve code quality.",
    category: "Code",
    usage: "12k uses",
  },
  {
    id: 2,
    name: "Content Writer",
    description:
      "Creates blog posts, landing page copy, advertisements, and long-form marketing content. It can adapt tone for different audiences, generate headlines, and structure articles for readability and engagement.",
    category: "Writing",
    usage: "8k uses",
  },
  {
    id: 3,
    name: "Data Analyzer",
    description:
      "Analyzes datasets, identifies patterns, and generates actionable insights. It can summarize data trends, explain correlations, and assist with creating reports or visualizations for decision making.",
    category: "Analysis",
    usage: "5k uses",
  },
  {
    id: 4,
    name: "Image Generator",
    description:
      "Creates high-quality images from natural language prompts. You can generate illustrations, concept art, product mockups, and creative visuals for presentations, marketing materials, or social media.",
    category: "Creative",
    usage: "15k uses",
  },
  {
    id: 5,
    name: "SEO Optimizer",
    description:
      "Improves your content’s search engine performance by suggesting relevant keywords, optimizing headings, analyzing readability, and providing on-page SEO recommendations to increase organic traffic.",
    category: "Code",
    usage: "6k uses",
  },
  {
    id: 6,
    name: "Chatbot Builder",
    description:
      "Helps design, configure, and deploy conversational chatbots for websites or apps. It supports conversation flows, automated responses, and integrations with APIs or customer support tools.",
    category: "Writing",
    usage: "7k uses",
  },
  {
    id: 7,
    name: "Resume Reviewer",
    description:
      "Reviews resumes and provides detailed feedback on structure, wording, and formatting. It suggests improvements to highlight achievements, optimize for ATS systems, and increase interview chances.",
    category: "Productivity",
    usage: "4k uses",
  },
  {
    id: 8,
    name: "Social Media Manager",
    description:
      "Generates social media posts, captions, hashtags, and monthly content calendars. It can adapt messaging for different platforms like LinkedIn, Instagram, and X while maintaining brand voice.",
    category: "Analysis",
    usage: "9k uses",
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredAgents =
    category === "All"
      ? MOCK_AGENTS.filter((a) =>
          a.name.toLowerCase().includes(search.toLowerCase()),
        )
      : MOCK_AGENTS.filter(
          (a) =>
            a.category === category &&
            a.name.toLowerCase().includes(search.toLowerCase()),
        );

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
            <nav className="flex items-center gap-4">
              <a
                href="/"
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
                  {c === "All" && (
                    <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                  )}
                  {c}
                </Button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Agent Grid */}
        <section className="flex-1 max-w-8xl mx-auto w-full px-4 sm:px-6 pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2"
          >
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="bg-background/60 backdrop-blur-xl border-border hover:border-primary/30 transition-colors cursor-pointer group"
              >
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5 h-26">
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {agent.usage}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted">
                          {agent.category}
                        </span>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No agents match your search. Try a different query or category.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
