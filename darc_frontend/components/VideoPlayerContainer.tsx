import { ReactNode } from "react";

export function VideoPlayerContainer({ children, className = "" }: { children?: ReactNode, className?: string }) {
    return (
        <div className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-md aspect-video group ${className}`}>
            {/* Decorative gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

            {/* Placeholder content if no children (video element) is provided */}
            {children || (
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-xl transition-transform hover:scale-110 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Load Video</p>
                    </div>
                </div>
            )}
        </div>
    );
}
