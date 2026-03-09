"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Zap,
    CheckCircle2,
    ArrowLeft,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";

export default function RegisterAgentPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

    const [showTemplateModal, setShowTemplateModal] = useState(false);

    const [templateConfig, setTemplateConfig] = useState({
        input: "",
        output: ""
    });

    const handleRegisterAgent = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            templateFormat: templateConfig
        };

        console.log("Agent Template Config:", payload);

        setFormStatus('submitting');

        setTimeout(() => {
            setFormStatus('submitted');
        }, 1500);
    };

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4">
            <AnimatedGradientBackground />

            <div className="relative z-10 w-full max-w-3xl">
                <div className="mb-6">
                    <Link href="/developer-dashboard">
                        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-border bg-background/60 backdrop-blur-xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
                >
                    {formStatus === 'submitted' ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">Agent Registration Submitted</h3>
                            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                                Your agent has been submitted and is currently <strong>in review</strong> by our platform handlers to ensure compatibility and quality.
                            </p>
                            <p className="text-base text-muted-foreground mt-2">
                                You will be reminded once the agent has been approved or if any adjustments are needed.
                            </p>
                            <Link href="/developer-dashboard">
                                <Button className="mt-8" size="lg">
                                    Return to Dashboard
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleRegisterAgent} className="space-y-8">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Register New Agent</h1>
                                <p className="text-muted-foreground mt-2">
                                    Provide the details of your AI agent for platform review. Once approved, it will be available for clients.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="agentName">Agent Name</Label>
                                    <Input id="agentName" placeholder="e.g. DeFi Smart Contract Auditor" required disabled={formStatus === 'submitting'} className="text-base py-6" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        placeholder="What does your agent do?"
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                        disabled={formStatus === 'submitting'}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="taskFees">Task Fees ($)</Label>
                                    <Input id="taskFees" type="number" min="0" step="0.01" placeholder="e.g. 0.50 per task" required disabled={formStatus === 'submitting'} className="text-base py-5" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subscriptionFees">Subscription Fees ($/month)</Label>
                                    <Input id="subscriptionFees" type="number" min="0" step="0.01" placeholder="e.g. 19.99" required disabled={formStatus === 'submitting'} className="text-base py-5" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="agentPrice">Agent Buyout Price ($)</Label>
                                    <p className="text-xs text-muted-foreground -mt-1 mb-2">If a user wants to buy out/own this agent in the future.</p>
                                    <Input id="agentPrice" type="number" min="0" step="0.01" placeholder="e.g. 5000" required disabled={formStatus === 'submitting'} className="text-base py-5" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="agentAPIendpoint">Agent API Endpoint</Label>
                                    <p className="text-xs text-muted-foreground -mt-1 mb-2">Hosted URL where platform can connect to this agent.</p>
                                    <Input id="agentAPIendpoint" type="url" placeholder="https://api.yourdomain.com/v1" required disabled={formStatus === 'submitting'} className="text-base py-5" />
                                </div>

                                {/* TEMPLATE FORMAT */}
                                <div className="space-y-2">
                                    <Label>Template Format (Optional)</Label>
                                    <p className="text-xs text-muted-foreground -mt-1 mb-2">
                                        Define what type of input your agent accepts and what output it returns.
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowTemplateModal(true)}
                                        className="w-full flex items-center justify-center gap-2 py-5 text-base"
                                        disabled={formStatus === "submitting"}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Template Format
                                    </Button>

                                    {templateConfig.input && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Input: <strong>{templateConfig.input}</strong> | Output:{" "}
                                            <strong>{templateConfig.output}</strong>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo">Agent Logo (Optional)</Label>
                                    <p className="text-xs text-muted-foreground -mt-1 mb-2">Upload a square image (PNG, JPG) for your agent.</p>
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        disabled={formStatus === 'submitting'}
                                        className="text-base py-3 pl-0 h-auto cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all border-none focus-visible:ring-0 bg-transparent text-muted-foreground"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end pt-6 border-t border-border mt-8">
                                <Link href="/developer-dashboard">
                                    <Button type="button" variant="ghost" disabled={formStatus === 'submitting'} size="lg">
                                        Cancel
                                    </Button>
                                </Link>

                                <Button type="submit" disabled={formStatus === 'submitting'} size="lg">
                                    {formStatus === 'submitting' ? (
                                        <>
                                            <Zap className="w-5 h-5 mr-2 animate-pulse" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5 mr-2" />
                                            Submit for Review
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>

            {/* TEMPLATE MODAL */}
            {showTemplateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-background border border-border rounded-xl w-full max-w-md p-6 space-y-6 shadow-2xl">

                        <h3 className="text-lg font-semibold">
                            Configure Template Format
                        </h3>

                        <div className="space-y-3">
                            <Label>Input Format</Label>
                            <div className="flex gap-3 flex-wrap">
                                {["Text", "File", "Both"].map((type) => (
                                    <Button
                                        key={type}
                                        type="button"
                                        variant={templateConfig.input === type ? "default" : "outline"}
                                        onClick={() =>
                                            setTemplateConfig((prev) => ({
                                                ...prev,
                                                input: type
                                            }))
                                        }
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Output Format</Label>
                            <div className="flex gap-3 flex-wrap">
                                {["Text", "File", "Both"].map((type) => (
                                    <Button
                                        key={type}
                                        type="button"
                                        variant={templateConfig.output === type ? "default" : "outline"}
                                        onClick={() =>
                                            setTemplateConfig((prev) => ({
                                                ...prev,
                                                output: type
                                            }))
                                        }
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-border">

                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setShowTemplateModal(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                onClick={() => {
                                    console.log("Template Saved:", templateConfig);
                                    setShowTemplateModal(false);
                                }}
                            >
                                Save Template
                            </Button>

                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}