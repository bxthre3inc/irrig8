import React, { useState, useEffect, useRef } from 'react';

interface ParameterDialProps {
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    onChange?: (val: number) => void;
}

export const ParameterDial: React.FC<ParameterDialProps> = ({ label, value, min, max, unit, onChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const dialRef = useRef<HTMLDivElement>(null);

    const percentage = ((currentValue - min) / (max - min)) * 100;
    const rotation = -135 + (percentage * 2.7); // 270 degrees total range

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dialRef.current) return;

            const rect = dialRef.current.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };

            const dx = e.clientX - center.x;
            const dy = e.clientY - center.y;

            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            angle = angle + 90; // Adjust so top is 0
            if (angle < 0) angle += 360; // 0 to 360

            // Map angle to value (135 to 225 is dead Zone at bottom)
            let newAngle = angle;
            if (angle > 225) newAngle -= 360; // -135 to 225

            if (newAngle >= -135 && newAngle <= 135) {
                const percent = (newAngle + 135) / 270;
                let val = min + (percent * (max - min));
                val = Math.max(min, Math.min(max, val));
                setCurrentValue(Math.round(val));
                if (onChange) onChange(Math.round(val));
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, min, max, onChange]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">{label}</div>

            <div
                ref={dialRef}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-black border-4 border-slate-900 shadow-[inset_0_5px_15px_rgba(0,0,0,1),_0_0_20px_rgba(168,85,247,0.1)] relative cursor-grab active:cursor-grabbing flex items-center justify-center"
                onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
            >
                {/* Tick marks ring */}
                <div className="absolute inset-2 rounded-full border border-slate-800/50 pointer-events-none"></div>

                {/* Rotating knob */}
                <div
                    className="w-16 h-16 rounded-full bg-gradient-to-t from-slate-900 to-slate-700 shadow-[0_5px_10px_rgba(0,0,0,0.8),_inset_0_2px_4px_rgba(255,255,255,0.1)] transition-transform duration-75 relative z-10"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {/* Indicator line */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_5px_currentColor]"></div>
                </div>

                {/* Progress Arc glow effect */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-90">
                    <circle
                        cx="48" cy="48" r="44"
                        fill="none"
                        stroke="rgba(168,85,247,0.3)"
                        strokeWidth="2"
                        strokeDasharray="276"
                        strokeDashoffset={276 - (276 * percentage / 100 * 0.75)}
                        className="transition-all duration-75 origin-center"
                    />
                </svg>
            </div>

            <div className="bg-black/50 border border-slate-800 px-4 py-1.5 rounded text-purple-400 font-mono text-sm shadow-inner group">
                <span className="font-bold">{currentValue}</span>
                <span className="text-[10px] text-slate-500 ml-1">{unit}</span>
            </div>
        </div>
    );
};
