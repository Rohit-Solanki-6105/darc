"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const wallets = [
    { id: "metamask", name: "MetaMask", icon: "🦊" },
    { id: "phantom", name: "Phantom", icon: "👻" },
    { id: "walletconnect", name: "WalletConnect", icon: "🔗" },
    { id: "coinbase", name: "Coinbase Wallet", icon: "🛡️" },
];

export function ConnectWalletCard() {
    const [selectedWallet, setSelectedWallet] = useState(wallets[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [skipRole, setSkipRole] = useState<"client" | "developer">("client");
    const router = useRouter();
    const { role, isReady } = useAuth();

    const handleSkip = () => {
        // RBAC: Use persisted role if logged in, else use inline choice
        const effectiveRole = role ?? skipRole;
        if (effectiveRole === "developer") {
            router.push("/developer-dashboard");
        } else {
            router.push("/home");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full rounded-2xl border border-border bg-background/40 backdrop-blur-xl p-8 shadow-2xl overflow-hidden relative"
            >
                {/* Subtle decorative glow inside card */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Add Your Wallet
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Select a provider to connect your Web3 wallet
                        </p>
                    </div>

                    {/* Wallet Selector */}
                    <div className="w-full relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between px-4 py-3.5 bg-background/50 hover:bg-muted border border-border rounded-xl transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{selectedWallet.icon}</span>
                                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {selectedWallet.name}
                                </span>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 p-2 bg-popover border border-border rounded-xl shadow-xl z-20"
                            >
                                {wallets.map((wallet) => (
                                    <button
                                        key={wallet.id}
                                        onClick={() => {
                                            setSelectedWallet(wallet);
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{wallet.icon}</span>
                                            <span className="text-sm font-medium text-foreground">
                                                {wallet.name}
                                            </span>
                                        </div>
                                        {selectedWallet.id === wallet.id && (
                                            <Check className="w-4 h-4 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] font-semibold rounded-xl transition-all duration-200">
                        <Wallet className="w-4 h-4 mr-2 hidden sm:block" />
                        Connect {selectedWallet.name}
                    </Button>
                </div>
            </motion.div>

            {/* Role selector for skip (only when no persisted role after hydration) */}
            {isReady && role === null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2"
                >
                    <button
                        type="button"
                        onClick={() => setSkipRole("client")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                            skipRole === "client"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                        Client
                    </button>
                    <button
                        type="button"
                        onClick={() => setSkipRole("developer")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                            skipRole === "developer"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                        Developer
                    </button>
                </motion.div>
            )}

            {/* Skip Button - RBAC: developers → dashboard, clients → home */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full px-6 transition-colors"
                >
                    Skip for now
                </Button>
            </motion.div>
        </div>
    );
}
