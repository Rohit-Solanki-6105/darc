"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Zap,
    CheckCircle2,
    ArrowLeft,
    Plus,
    X,
    Code,
    Sparkles,
    CheckSquare,
    Square,
    Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import apiService from "@/lib/api";
import { a, output } from "framer-motion/client";

type InputField = {
    name: string;
    type: 'string' | 'file' | 'number' | 'boolean' | 'array';
};
type OutputField = {
    name: string;
    type: 'string' | 'file' | 'number' | 'boolean' | 'array';
};

type Capability = {
    capability_id: number;
    name: string;
    description?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function RegisterAgentPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
    const [templateInputs, setTemplateInputs] = useState<InputField[]>([]);
    const [templateOutputs, setTemplateOutputs] = useState<InputField[]>([]);
    const [selectedCapabilities, setSelectedCapabilities] = useState<number[]>([]);
    const [newCapability, setNewCapability] = useState('');
    const [newInputField, setNewInputField] = useState<InputField>({ name: '', type: 'string' });
    const [newOutputField, setNewOutputField] = useState<InputField>({ name: '', type: 'string' });
    const [showInputForm, setShowInputForm] = useState(false);
    const [showOutputForm, setShowOutputForm] = useState(false);
    const [availableCapabilities, setAvailableCapabilities] = useState<Capability[]>([]);
    const [capabilitiesLoading, setCapabilitiesLoading] = useState(true);
    const [capabilitiesError, setCapabilitiesError] = useState<string | null>(null);

    // Fetch available capabilities from API
    useEffect(() => {
        fetchCapabilities();
    }, []);

    const fetchCapabilities = async () => {
        try {
            setCapabilitiesLoading(true);
            setCapabilitiesError(null);
            const capabilities = await apiService.getCapabilities();
            setAvailableCapabilities(capabilities);
        } catch (err) {
            console.error('Error fetching capabilities:', err);
            setCapabilitiesError('Failed to load capabilities');
        } finally {
            setCapabilitiesLoading(false);
        }
    };

    const handleAddInputField = () => {
        if (newInputField.name.trim()) {
            setTemplateInputs([...templateInputs, newInputField]);
            setNewInputField({ name: '', type: 'string' });
            setShowInputForm(false);
        }
    };
    const handleAddOutputField = () => {
        if (newOutputField.name.trim()) {
            setTemplateOutputs([...templateOutputs, newOutputField]);
            setNewOutputField({ name: '', type: 'string' });
            setShowOutputForm(false);
        }
    };
    const handleRemoveInputField = (index: number) => {
        setTemplateInputs(templateInputs.filter((_, i) => i !== index));
    };
    const handleRemoveOutputField = (index: number) => {
        setTemplateOutputs(templateOutputs.filter((_, i) => i !== index));
    };

    
    const handleToggleCapability = (capabilityId: number) => {
        setSelectedCapabilities(prev => 
            prev.includes(capabilityId) 
                ? prev.filter(id => id !== capabilityId)
                : [...prev, capabilityId]
        );
    };

    const handleAddCapability = async () => {
        if (!newCapability.trim()) return;

        try {
            const newCap = await apiService.createCapability(newCapability.trim());
            
            // Add to available capabilities and select it
            setAvailableCapabilities([...availableCapabilities, newCap]);
            setSelectedCapabilities([...selectedCapabilities, newCap.capability_id]);
            setNewCapability('');
        } catch (err) {
            console.error('Error creating capability:', err);
            alert('Failed to create capability');
        }
    };

    const handleRegisterAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const agentData = {
                agent_name: formData.get('agent_name'),
                description: formData.get('description'),
                task_fees: formData.get('task_fees') ? parseFloat(formData.get('task_fees') as string) : null,
                agent_price: formData.get('agent_price') ? parseFloat(formData.get('agent_price') as string) : null,
                subscription_fee: formData.get('subscription_fee') ? parseFloat(formData.get('subscription_fee') as string) : null,
                subscription_duration_days: 30,
                api_endpoint: formData.get('api_endpoint'),
                agent_template: templateInputs.length > 0 ? Object.fromEntries(templateInputs.map(field => [field.name, field.type])) : null,
                output_template: templateOutputs.length > 0 ? Object.fromEntries(templateOutputs.map(field => [field.name, field.type])) : null,
                capabilities: selectedCapabilities,
            };

            const response = await apiService.createAgent(agentData);
            
            if (response) {
                setFormStatus('submitted');
            } else {
                throw new Error('Failed to register agent');
            }
        } catch (err: any) {
            console.error('Error registering agent:', err);
            const errorMessage = err.response?.data?.error || 'Failed to register agent. Please try again.';
            alert(errorMessage);
            setFormStatus('idle');
        }
    };

    // Generate template preview as JSON
    const templatePreview = templateInputs.length > 0
        ? Object.fromEntries(templateInputs.map(field => [field.name, field.type]))
        : null;

    const templateOutPreview = templateOutputs.length > 0
        ? Object.fromEntries(templateOutputs.map(field => [field.name, field.type]))
        : null;

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4">
            <AnimatedGradientBackground />

            <div className="relative z-10 w-full max-w-4xl">
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

                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Basic Information
                                </h2>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="agentName">Agent Name</Label>
                                        <Input id="agentName" name="agent_name" placeholder="e.g. DeFi Smart Contract Auditor" required disabled={formStatus === 'submitting'} className="text-base py-6" />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="What does your agent do? Be specific about its capabilities and use cases."
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                            disabled={formStatus === 'submitting'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="taskFees">Task Fees ($)</Label>
                                        <Input id="taskFees" name="task_fees" type="number" min="0" step="0.01" placeholder="e.g. 0.50 per task" required disabled={formStatus === 'submitting'} className="text-base py-5" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subscriptionFees">Subscription Fees ($/month)</Label>
                                        <Input id="subscriptionFees" name="subscription_fee" type="number" min="0" step="0.01" placeholder="e.g. 19.99" required disabled={formStatus === 'submitting'} className="text-base py-5" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="agentPrice">Agent Buyout Price ($)</Label>
                                        <p className="text-xs text-muted-foreground -mt-1 mb-2">If a user wants to buy out/own this agent in the future.</p>
                                        <Input id="agentPrice" name="agent_price" type="number" min="0" step="0.01" placeholder="e.g. 5000" required disabled={formStatus === 'submitting'} className="text-base py-5" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="agentAPIendpoint">Agent API Endpoint</Label>
                                        <p className="text-xs text-muted-foreground -mt-1 mb-2">Hosted URL where platform can connect to this agent.</p>
                                        <Input id="agentAPIendpoint" name="api_endpoint" type="url" placeholder="https://api.yourdomain.com/v1" required disabled={formStatus === 'submitting'} className="text-base py-5" />
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
                            </div>

                            {/* Template Inputs */}
                            <div className="space-y-4 border-t border-border pt-6">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Code className="w-5 h-5" />
                                    Input Template
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Define what types of inputs your agent accepts. This tells clients how to interact with your agent.
                                </p>

                                {/* Input Fields List */}
                                {templateInputs.length > 0 && (
                                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                                        {templateInputs.map((field, index) => (
                                            <div key={index} className="flex items-center justify-between bg-background/60 rounded p-3">
                                                <div className="flex-1">
                                                    <span className="font-medium text-foreground">{field.name}</span>
                                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded ml-2">{field.type}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveInputField(index)}
                                                    className="text-destructive hover:bg-destructive/10 p-2 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Input Field */}
                                {!showInputForm && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full rounded-lg"
                                        onClick={() => setShowInputForm(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Input Field
                                    </Button>
                                )}

                                {showInputForm && (
                                    <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                                        <div>
                                            <Label htmlFor="fieldName" className="text-sm">Field Name</Label>
                                            <Input
                                                id="fieldName"
                                                placeholder="e.g. prompt, document, image"
                                                value={newInputField.name}
                                                onChange={(e) => setNewInputField({ ...newInputField, name: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="fieldType" className="text-sm">Field Type</Label>
                                            <select
                                                id="fieldType"
                                                value={newInputField.type}
                                                onChange={(e) => setNewInputField({ ...newInputField, type: e.target.value as InputField['type'] })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="string">String (Text)</option>
                                                <option value="file">File (Upload)</option>
                                                <option value="number">Number</option>
                                                <option value="boolean">Boolean (Yes/No)</option>
                                                <option value="array">Array (List)</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                onClick={handleAddInputField}
                                                disabled={!newInputField.name.trim()}
                                                className="flex-1 rounded-lg"
                                            >
                                                Add Field
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowInputForm(false);
                                                    setNewInputField({ name: '', type: 'string' });
                                                }}
                                                className="flex-1 rounded-lg"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Template Preview */}
                                {templatePreview && (
                                    <div className="bg-background/60 border border-border rounded-lg p-4">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Template Preview (JSON):</p>
                                        <pre className="text-xs overflow-auto bg-muted/30 rounded p-3 text-foreground">
                                            {JSON.stringify(templatePreview, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>

                            {/* template outputs */}
                            <div className="space-y-4 border-t border-border pt-6">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Code className="w-5 h-5" />
                                    Output Template
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Define what types of outputs your agent produces. This tells clients how to interpret the results from your agent.
                                </p>

                                {/* Output Fields List */}
                                {templateOutputs.length > 0 && (
                                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                                        {templateOutputs.map((field, index) => (
                                            <div key={index} className="flex items-center justify-between bg-background/60 rounded p-3">
                                                <div className="flex-1">
                                                    <span className="font-medium text-foreground">{field.name}</span>
                                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded ml-2">{field.type}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOutputField(index)}
                                                    className="text-destructive hover:bg-destructive/10 p-2 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Output Field */}
                                {!showInputForm && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full rounded-lg"
                                        onClick={() => setShowOutputForm(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Output Field
                                    </Button>
                                )}

                                {showOutputForm && (
                                    <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                                        <div>
                                            <Label htmlFor="fieldName" className="text-sm">Field Name</Label>
                                            <Input
                                                id="fieldName"
                                                placeholder="e.g. prompt, document, image"
                                                value={newOutputField.name}
                                                onChange={(e) => setNewOutputField({ ...newInputField, name: e.target.value })}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="fieldType" className="text-sm">Field Type</Label>
                                            <select
                                                id="fieldType"
                                                value={newOutputField.type}
                                                onChange={(e) => setNewOutputField({ ...newOutputField, type: e.target.value as OutputField['type'] })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="string">String (Text)</option>
                                                <option value="file">File (Upload)</option>
                                                <option value="number">Number</option>
                                                <option value="boolean">Boolean (Yes/No)</option>
                                                <option value="array">Array (List)</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                onClick={handleAddOutputField}
                                                disabled={!newOutputField.name.trim()}
                                                className="flex-1 rounded-lg"
                                            >
                                                Add Field
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowOutputForm(false);
                                                    setNewOutputField({ name: '', type: 'string' });
                                                }}
                                                className="flex-1 rounded-lg"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Template Preview */}
                                {templateOutPreview && (
                                    <div className="bg-background/60 border border-border rounded-lg p-4">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Template Preview (JSON):</p>
                                        <pre className="text-xs overflow-auto bg-muted/30 rounded p-3 text-foreground">
                                            {JSON.stringify(templateOutPreview, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>



                            {/* Capabilities */}
                            <div className="space-y-4 border-t border-border pt-6">
                                <h2 className="text-lg font-semibold text-foreground">Capabilities & Tags</h2>
                                <p className="text-sm text-muted-foreground">
                                    Select existing capabilities or add new ones to help clients discover your agent.
                                </p>

                                {/* Loading State */}
                                {capabilitiesLoading && (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader className="w-5 h-5 animate-spin mr-2" />
                                        <span className="text-muted-foreground">Loading capabilities...</span>
                                    </div>
                                )}

                                {/* Error State */}
                                {capabilitiesError && (
                                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
                                        {capabilitiesError}
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={fetchCapabilities}
                                            className="mt-2"
                                        >
                                            Retry
                                        </Button>
                                    </div>
                                )}

                                {/* Available Capabilities */}
                                {!capabilitiesLoading && !capabilitiesError && availableCapabilities.length > 0 && (
                                    <div className="bg-muted/30 rounded-lg p-4 max-h-[300px] overflow-y-auto space-y-2">
                                        {availableCapabilities.map((cap) => (
                                            <label key={cap.capability_id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCapabilities.includes(cap.capability_id)}
                                                    onChange={() => handleToggleCapability(cap.capability_id)}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground">{cap.name}</p>
                                                    {cap.description && (
                                                        <p className="text-xs text-muted-foreground">{cap.description}</p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Selected Capabilities Summary */}
                                {selectedCapabilities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                                        {selectedCapabilities.map((capId) => {
                                            const cap = availableCapabilities.find(c => c.capability_id === capId);
                                            return cap ? (
                                                <div key={capId} className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                                                    {cap.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleCapability(capId)}
                                                        className="hover:opacity-70"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                )}

                                {/* Add New Capability */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground">Add New Capability</p>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="e.g. Security Analysis, Smart Contracts, AI Powered"
                                            value={newCapability}
                                            onChange={(e) => setNewCapability(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddCapability();
                                                }
                                            }}
                                            className="flex-1 rounded-lg"
                                            disabled={capabilitiesLoading}
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddCapability}
                                            disabled={!newCapability.trim() || capabilitiesLoading}
                                            className="rounded-lg"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end pt-6 border-t border-border mt-8">
                                <Link href="/developer-dashboard">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        disabled={formStatus === 'submitting'}
                                        size="lg"
                                    >
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
        </main>
    );
}
