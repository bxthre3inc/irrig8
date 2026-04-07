import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}) => {
    const variants = {
        primary: 'bg-rose-700 hover:bg-rose-600 text-white border-rose-600/50',
        secondary: 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30',
        outline: 'bg-transparent hover:bg-slate-800 text-slate-300 border-slate-700',
        ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-400 border-transparent',
        danger: 'bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-800/30',
        success: 'bg-emerald-900/20 hover:bg-emerald-900/30 text-emerald-400 border-emerald-800/30',
    };

    const sizes = {
        xs: 'px-2 py-1 text-[10px] font-black uppercase tracking-widest',
        sm: 'px-3 py-1.5 text-xs font-bold leading-none',
        md: 'px-4 py-2 text-sm font-bold',
        lg: 'px-6 py-3 text-base font-bold',
    };

    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
