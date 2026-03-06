import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { AuthForm } from "@/components/AuthForm";

export default function Login() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
      <AnimatedGradientBackground />
      <div className="w-full max-w-[420px] mx-auto z-10">
        <AuthForm />
      </div>
    </main>
  );
}
