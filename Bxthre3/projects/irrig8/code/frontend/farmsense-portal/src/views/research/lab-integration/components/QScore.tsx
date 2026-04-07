import React from 'react';

export function QScore({ score }: { score: number }) {
    const color = score >= 85 ? '#10b981' : score >= 65 ? '#fbbf24' : '#ef4444';
    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-bold font-mono" style={{ color }}>{score}%</span>
        </div>
    );
}
