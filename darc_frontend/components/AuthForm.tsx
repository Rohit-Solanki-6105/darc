'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from './AuthCard';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export function AuthForm({ defaultMode = 'login' }: { defaultMode?: 'login' | 'signup' }) {
    const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState<'client' | 'developer'>('client');

    const { setRole: persistRole } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const apiRoute = mode === "signup" ? "/api/signup" : "/api/login";

            const body =
                mode === "signup"
                    ? { name, email, password, role }
                    : { email, password };

            const response = await fetch(apiRoute, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Something went wrong");
                setTimeout(() => setError(""), 3000);
                return;
            }

            const userRole = data.user?.role || data.role;

            persistRole(userRole);

            if (userRole === "developer") {
                router.push("/developer-dashboard");
            } else {
                router.push("/home");
            }

        } catch (err) {
            setError("Server error");
        }
    };

    return (
        <>
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-red-100 bg-red-50/90 px-4 py-2 text-sm font-medium text-red-600 backdrop-blur-md shadow-sm"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthCard
                title={
                    mode === 'login'
                        ? "Welcome back"
                        : role === 'client'
                            ? "Create Client Account"
                            : "Create Developer Account"
                }
                subtitle={
                    mode === 'login'
                        ? "Enter your credentials to access your account"
                        : role === 'client'
                            ? "Sign up to access and use agents"
                            : "Sign up to deploy and host your agents"
                }
            >

                <form onSubmit={handleSubmit} className="space-y-4">

                    {mode === 'signup' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {mode === "signup" && (
                        <div className="flex p-1 bg-muted rounded-xl mb-4">
                            <button
                                type="button"
                                onClick={() => setRole('client')}
                                className={`flex-1 py-2 text-sm rounded-lg ${role === 'client'
                                    ? 'bg-white shadow'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Client
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole('developer')}
                                className={`flex-1 py-2 text-sm rounded-lg ${role === 'developer'
                                    ? 'bg-white shadow'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Developer
                            </button>
                        </div>
                    )}

                    <Button type="submit" className="w-full">
                        {mode === 'login' ? 'Sign In' : 'Sign Up'}
                    </Button>

                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    {mode === 'login' ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <a href="/signup" className="text-blue-600 hover:underline">
                                Sign up
                            </a>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-600 hover:underline">
                                Sign in
                            </a>
                        </>
                    )}
                </p>

            </AuthCard>
        </>
    );
}