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
import { useAuthContext } from '@/contexts/AuthContext';

export function AuthForm({ defaultMode = 'login' }: { defaultMode?: 'login' | 'signup' }) {
    const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [isDeveloper, setIsDeveloper] = useState(false);
    const { login, register, isLoading, error: authError } = useAuthContext();
    const router = useRouter();

    // Show auth errors
    React.useEffect(() => {
        if (authError) {
            setError(authError);
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [authError]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const success = await login(email, password);
        if (success) {
            router.push('/home');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!firstName || !lastName || !email || !password) {
            setError('Please fill in all required fields');
            return;
        }

        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const success = await register(
            firstName,
            lastName,
            email,
            password,
            passwordConfirm,
            isDeveloper,
            mobile
        );

        if (success) {
            router.push('/login');
        }
    };

    const handleSubmit = mode === 'login' ? handleLogin : handleSignup;

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
                    ? "Welcome Back"
                    : "Create Account"}
                subtitle={mode === 'login'
                    ? "Enter your credentials to access your account"
                    : "Sign up to get started on DARC"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="flex p-1 bg-muted rounded-xl mb-4">
                            <button
                                type="button"
                                onClick={() => setIsDeveloper(false)}
                                className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${!isDeveloper
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsDeveloper(true)}
                                className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${isDeveloper
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Developer
                            </button>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div className="mb-2 text-center">
                            <p className="text-[13px] text-muted-foreground transition-all">
                                {isDeveloper
                                    ? 'Deploy and host your agents on our platform.'
                                    : 'Access and use agents on our platform.'}
                            </p>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="firstName" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="h-11 rounded-xl bg-background focus-visible:ring-1 focus-visible:ring-ring border-border transition-shadow text-[15px]"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="lastName" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="h-11 rounded-xl bg-background focus-visible:ring-1 focus-visible:ring-ring border-border transition-shadow text-[15px]"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 rounded-xl bg-background focus-visible:ring-1 focus-visible:ring-ring border-border transition-shadow text-[15px]"
                            required
                        />
                    </div>

                    {mode === 'signup' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="mobile" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Phone (Optional)
                            </Label>
                            <Input
                                id="mobile"
                                type="tel"
                                placeholder="+1234567890"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="h-11 rounded-xl bg-background focus-visible:ring-1 focus-visible:ring-ring border-border transition-shadow text-[15px]"
                            />
                        </div>
                    )}

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

                    {mode === 'signup' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="passwordConfirm" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Confirm Password
                            </Label>
                            <Input
                                id="passwordConfirm"
                                type="password"
                                placeholder="••••••••"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                className="h-11 rounded-xl bg-background focus-visible:ring-1 focus-visible:ring-ring border-border transition-shadow text-[15px]"
                                required
                            />
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all font-medium text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⚙️</span>
                                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                                </span>
                            ) : (
                                mode === 'login' ? 'Sign in' : 'Sign up'
                            )}
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
