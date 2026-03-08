'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from './AuthCard';
import { GoogleButton } from './GoogleButton';
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate error for preview
        if (email !== 'correct@example.com') {
            setError('Invalid email or password');
            setTimeout(() => setError(''), 3000);
        } else {
            setError('');
            persistRole(role);
            router.push('/connect-wallet');
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
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthCard
                title={mode === 'login'
                    ? (role === 'client' ? "Welcome back, Client" : "Welcome back, Developer")
                    : (role === 'client' ? "Create Client Account" : "Create Developer Account")}
                subtitle={mode === 'login'
                    ? (role === 'client' ? "Enter your credentials to access your account" : "Enter your credentials to manage your agents")
                    : (role === 'client' ? "Sign up to access and use agents" : "Sign up to deploy and host your agents")}
            >
                <form onSubmit={handleSubmit} className="space-y-4">


                    <div className="mb-2 text-center">
                        <p className="text-[13px] text-muted-foreground transition-all">
                            {role === 'client'
                                ? 'Access and use agents on our platform.'
                                : 'Deploy and host your agents on our platform.'}
                        </p>
                    </div>

                    {mode === 'signup' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 rounded-xl bg-background focus-visible:ring-1 focus-visible:ring-ring border-border transition-shadow text-[15px]"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="hello@designwithmikey.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 rounded-xl bg-background focus-visible:ring-1 focus-visible:ring-ring border-border transition-shadow text-[15px]"
                            required
                        />
                    </div>
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Password
                            </Label>
                            {mode === 'login' && (
                                <a href="#" className="text-[12px] font-medium text-blue-600/90 hover:text-blue-600 hover:underline underline-offset-4">
                                    Forgot password?
                                </a>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 rounded-xl bg-background focus-visible:ring-1 focus-visible:ring-ring border-border transition-shadow text-[15px]"
                            required
                        />
                    </div>
                                        <div className="flex p-1 bg-muted rounded-xl mb-4">
                        <button
                            type="button"
                            onClick={() => setRole('client')}
                            className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${role === 'client'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Client
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('developer')}
                            className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${role === 'developer'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Developer
                        </button>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all font-medium text-[15px]"
                        >
                            {mode === 'login' ? 'Sign in' : 'Sign up'}
                        </Button>
                    </div>
                </form>

                <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full bg-border" />
                    </div>
                    <div className="relative flex justify-center text-[13px] text-muted-foreground">
                        <span className="bg-background px-3 rounded-md">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-5">
                    <GoogleButton />

                    <p className="text-center text-[13.5px] text-muted-foreground pt-1">
                        {mode === 'login' ? (
                            <>
                                Don&apos;t have an account? <a href="/signup" className="font-medium text-blue-600/90 hover:text-blue-600 hover:underline underline-offset-4">Sign up</a>
                            </>
                        ) : (
                            <>
                                Already have an account? <a href="/login" className="font-medium text-blue-600/90 hover:text-blue-600 hover:underline underline-offset-4">Sign in</a>
                            </>
                        )}
                    </p>
                </div>
            </AuthCard>
        </>
    );
}
