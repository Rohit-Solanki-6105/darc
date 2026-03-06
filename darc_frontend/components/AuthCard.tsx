'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AuthCard({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[420px] overflow-hidden rounded-[24px] border border-border bg-background/50 p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] backdrop-blur-2xl"
        >
            <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className="flex flex-col items-center space-y-5 w-full">
                    <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                        {/* Lightning bolt icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="space-y-1.5 text-center">
                        <h1 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h1>
                        {subtitle && (
                            <p className="text-[14px] text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                </div>
                <div className="w-full">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
