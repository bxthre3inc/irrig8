import React, { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';

interface ResolutionPopOverlayProps {
    isVisible: boolean;
}

export const ResolutionPopOverlay: React.FC<ResolutionPopOverlayProps> = ({ isVisible }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isVisible || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

        const characters = "01";
        const fontSize = 12;
        const columns = canvas.width / fontSize;
        const drops: number[] = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#10b981"; // emerald-500
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-700">
            <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />

            <div className="relative z-10 bg-[#070511]/90 border border-emerald-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center max-w-sm transform hover:scale-105 transition-transform">
                <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/40">
                    <Lock className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>

                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">1m Resolution Locked</h3>
                <p className="text-xs text-emerald-500/70 font-mono uppercase tracking-[0.2em] mb-6">
                    Enterprise Tier Required for Deterministic Grid
                </p>

                <div className="space-y-3">
                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-900/40 text-sm uppercase">
                        Upgrade to Enterprise
                    </button>
                    <button className="w-full bg-white/5 hover:bg-white/10 text-slate-400 font-bold py-2 rounded-lg transition-all text-[10px] uppercase tracking-widest">
                        Continue with 50m Satellite View
                    </button>
                </div>

                <p className="mt-8 text-[9px] text-slate-600 font-mono flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    UFI Real-time Scarcity Engine Active
                </p>
            </div>
        </div>
    );
};
