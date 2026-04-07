import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'purple';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        neutral: 'bg-slate-800/50 text-slate-400 border-slate-700/50',
        success: 'bg-emerald-900/20 text-emerald-400 border-emerald-800/30',
        warning: 'bg-amber-900/20 text-amber-400 border-amber-800/30',
        error: 'bg-red-900/20 text-red-400 border-red-800/30',
        info: 'bg-blue-900/20 text-blue-400 border-blue-800/30',
        purple: 'bg-indigo-900/20 text-indigo-300 border-indigo-800/30',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
