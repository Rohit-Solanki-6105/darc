"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Loader,
    Send,
    CheckCircle2,
    AlertCircle,
    Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import apiService from "@/lib/api";

type InputFieldType = 'string' | 'file' | 'number' | 'boolean' | 'array';

interface InputField {
    name: string;
    type: InputFieldType;
}

interface Agent {
    agent_id: number;
    agent_name: string;
    description?: string;
    agent_price?: number;
    subscription_fee?: number;
    task_fees?: number;
    rating?: number;
    api_endpoint?: string;
    agent_template?: Record<string, InputFieldType>;
    output_template?: Record<string, InputFieldType>;
    status: string;
}

interface ExecutionResult {
    agent_id: number;
    agent_name: string;
    output: Record<string, any>;
    status: string;
}

export default function UseAgentPage() {
    const params = useParams();
    const router = useRouter();
    const agentId = params.id as string;

    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [executionLoading, setExecutionLoading] = useState(false);
    const [executionError, setExecutionError] = useState<string | null>(null);
    const [result, setResult] = useState<ExecutionResult | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Fetch agent details
    useEffect(() => {
        fetchAgent();
    }, [agentId]);

    const fetchAgent = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiService.getAgent(parseInt(agentId));
            setAgent(res);
            
            // Initialize form data with empty values for all inputs
            if (res.agent_template) {
                const initialData: Record<string, any> = {};
                Object.keys(res.agent_template).forEach(key => {
                    initialData[key] = '';
                });
                setFormData(initialData);
            }
        } catch (err: any) {
            console.error('Error fetching agent:', err);
            setError(err.response?.data?.error || 'Failed to load agent');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (fieldName: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleExecuteAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!agent) return;

        setExecutionLoading(true);
        setExecutionError(null);
        setResult(null);

        try {
            // Validate required fields
            if (agent.agent_template) {
                for (const fieldName of Object.keys(agent.agent_template)) {
                    if (!formData[fieldName]) {
                        setExecutionError(`Missing required input: ${fieldName}`);
                        setExecutionLoading(false);
                        return;
                    }
                }
            }

            // Execute agent
            const response = await fetch(
                `${agent.api_endpoint}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${localStorage.getItem('auth_token') || ''}`,
                    },
                    body: JSON.stringify({ inputs: formData }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to execute agent');
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            console.error('Error executing agent:', err);
            setExecutionError(err.message || 'Failed to execute agent');
        } finally {
            setExecutionLoading(false);
        }
    };

    const renderInputField = (fieldName: string, fieldType: InputFieldType) => {
        const value = formData[fieldName];

        switch (fieldType) {
            case 'string':
                return (
                    <Input
                        type="text"
                        placeholder={`Enter ${fieldName}`}
                        value={value || ''}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        className="rounded-lg"
                    />
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        placeholder={`Enter ${fieldName}`}
                        value={value || ''}
                        onChange={(e) => handleInputChange(fieldName, e.target.value)}
                        className="rounded-lg"
                    />
                );
            case 'boolean':
                return (
                    <select
                        value={value !== '' ? (value ? 'true' : 'false') : ''}
                        onChange={(e) => handleInputChange(fieldName, e.target.value === 'true')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Select {fieldName}</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                );
            case 'file':
                return (
                    <Input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                handleInputChange(fieldName, file.name);
                            }
                        }}
                        className="rounded-lg"
                    />
                );
            case 'array':
                return (
                    <Input
                        type="text"
                        placeholder={`Enter ${fieldName} (comma-separated)`}
                        value={value || ''}
                        onChange={(e) => handleInputChange(fieldName, e.target.value.split(',').map(v => v.trim()))}
                        className="rounded-lg"
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <main className="relative min-h-screen w-full flex items-center justify-center p-4">
                <AnimatedGradientBackground />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading agent...</p>
                </div>
            </main>
        );
    }

    if (error || !agent) {
        return (
            <main className="relative min-h-screen w-full flex items-center justify-center p-4">
                <AnimatedGradientBackground />
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-border bg-background/60 backdrop-blur-xl p-8 max-w-md text-center"
                    >
                        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-foreground mb-2">Error</h2>
                        <p className="text-muted-foreground mb-6">{error || 'Agent not found'}</p>
                        <Button onClick={() => router.back()}>Go Back</Button>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4">
            <AnimatedGradientBackground />

            <div className="relative z-10 w-full max-w-4xl">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-border bg-background/60 backdrop-blur-xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
                >
                    {result ? (
                        // Show Results
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Execution Complete</h2>
                            <p className="text-muted-foreground">Agent executed successfully</p>

                            {/* Output Template Display */}
                            <div className="bg-muted/30 rounded-lg p-6 text-left space-y-4">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <Code className="w-5 h-5" />
                                    Output
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(result.output).map(([key, value]) => (
                                        <div key={key} className="bg-background/60 rounded p-3 space-y-1">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground">{key}</p>
                                            <p className="text-sm font-mono text-foreground break-words">
                                                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setResult(null);
                                        setFormData(
                                            agent.agent_template
                                                ? Object.keys(agent.agent_template).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
                                                : {}
                                        );
                                    }}
                                    className="flex-1"
                                >
                                    Try Again
                                </Button>
                                <Button
                                    onClick={() => router.push('/home')}
                                    className="flex-1"
                                >
                                    Return Home
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Show Form
                        <form onSubmit={handleExecuteAgent} className="space-y-8">
                            {/* Agent Info */}
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{agent.agent_name}</h1>
                                {agent.description && (
                                    <p className="text-muted-foreground mt-2 text-base">{agent.description}</p>
                                )}
                            </div>

                            {/* Agent Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {agent.rating && (
                                    <div className="bg-muted/30 rounded-lg p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Rating</p>
                                        <p className="text-lg font-semibold text-foreground">{parseFloat(agent.rating.toString()).toFixed(2)}/5</p>
                                    </div>
                                )}
                                {agent.task_fees && (
                                    <div className="bg-muted/30 rounded-lg p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Task Fee</p>
                                        <p className="text-lg font-semibold text-foreground">${parseFloat(agent.task_fees.toString()).toFixed(2)}</p>
                                    </div>
                                )}
                                {agent.subscription_fee && (
                                    <div className="bg-muted/30 rounded-lg p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Subscription</p>
                                        <p className="text-lg font-semibold text-foreground">${parseFloat(agent.subscription_fee.toString()).toFixed(2)}/mo</p>
                                    </div>
                                )}
                                {agent.agent_price && (
                                    <div className="bg-muted/30 rounded-lg p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Buy Price</p>
                                        <p className="text-lg font-semibold text-foreground">${parseFloat(agent.agent_price.toString()).toFixed(2)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Input Form */}
                            {agent.agent_template && Object.keys(agent.agent_template).length > 0 ? (
                                <div className="space-y-6 border-t border-border pt-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground mb-1">Provide Inputs</h2>
                                        <p className="text-sm text-muted-foreground">Fill in the required information for the agent</p>
                                    </div>

                                    <div className="space-y-4">
                                        {Object.entries(agent.agent_template).map(([fieldName, fieldType]) => (
                                            <div key={fieldName} className="space-y-2">
                                                <Label htmlFor={fieldName} className="text-sm font-medium">
                                                    {fieldName}
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ml-2">
                                                        {fieldType}
                                                    </span>
                                                </Label>
                                                {renderInputField(fieldName, fieldType)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t border-border pt-6">
                                    <p className="text-muted-foreground text-center">This agent has no input parameters</p>
                                </div>
                            )}

                            {/* Error Display */}
                            {executionError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-destructive/10 border border-destructive/30 rounded-lg p-4"
                                >
                                    <p className="text-destructive text-sm">{executionError}</p>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-6 border-t border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={executionLoading}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={executionLoading}
                                    className="flex-1"
                                >
                                    {executionLoading ? (
                                        <>
                                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                                            Executing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Execute Agent
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
