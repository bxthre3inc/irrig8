import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-black/40 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/60 transition-all ${error ? 'border-red-900/60 focus:border-red-500/60' : ''} ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-[10px] font-bold text-red-400 ml-1">{error}</p>}
        </div>
    );
};
