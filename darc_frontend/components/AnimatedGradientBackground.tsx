'use client';

import { motion } from 'framer-motion';

export function AnimatedGradientBackground() {
    return (
        <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden flex items-center justify-center">
            {/* Soft, wide blue blob */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                    x: ["-5%", "5%", "-5%"],
                    y: ["0%", "-5%", "0%"],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 h-[800px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/40 dark:bg-blue-900/30 blur-[150px]"
            />
            {/* Smaller, slightly deeper blue/purple blob to add depth */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: ["5%", "-5%", "5%"],
                    y: ["5%", "-5%", "5%"],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[120px]"
            />
            {/* Subtle glow behind the card area specifically */}
            <motion.div
                animate={{
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/50 dark:bg-sky-900/30 blur-[100px]"
            />
        </div>
    );
}
