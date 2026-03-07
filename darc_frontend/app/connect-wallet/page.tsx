import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { ConnectWalletCard } from "@/components/ConnectWalletCard";

export default function ConnectWalletPage() {
    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
            <AnimatedGradientBackground />
            <div className="w-full max-w-[480px] mx-auto z-10 flex flex-col items-center">
                <ConnectWalletCard />
            </div>
        </main>
    );
}
