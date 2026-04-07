import React, { useEffect, useRef } from 'react';

interface MatrixDataStreamProps {
    isStreaming: boolean;
}

export const MatrixDataStream: React.FC<MatrixDataStreamProps> = ({ isStreaming }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isStreaming || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || 200;

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
        const fontSize = 10;
        const columns = canvas.width / fontSize;

        const drops: number[] = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            // Translucent black background to create trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#a855f7"; // purple-500
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = letters.charAt(Math.floor(Math.random() * letters.length));

                // Draw character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Randomly reset drop to top or move it down
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33); // ~30fps

        return () => {
            clearInterval(interval);
            // Clear canvas when unmounted or stopped
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [isStreaming]);

    if (!isStreaming) return null;

    return (
        <div className="absolute inset-0 z-50 pointer-events-none rounded-xl overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 opacity-40"></canvas>
            <div className="relative z-10 bg-black/50 px-6 py-3 border border-purple-500/30 rounded backdrop-blur-md">
                <p className="text-purple-400 font-mono font-bold uppercase tracking-[0.3em] text-sm animate-pulse flex items-center gap-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                    Extracing Hexabytes...
                </p>
            </div>
        </div>
    );
};
