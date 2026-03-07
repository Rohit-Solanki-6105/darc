"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 right-4 z-50 rounded-full w-10 h-10 bg-background/50 backdrop-blur-md border border-border shadow-sm opacity-50 cursor-default"
            >
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    const isDark = resolvedTheme === "dark" || theme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="fixed top-4 right-4 z-50 rounded-full w-10 h-10 bg-background/50 backdrop-blur-md border border-border shadow-sm"
        >
            <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
            <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
