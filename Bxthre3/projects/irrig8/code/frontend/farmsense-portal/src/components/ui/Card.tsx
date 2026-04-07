import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    padded?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, padded = true }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-black/40 border border-slate-800 rounded-xl transition-all ${onClick ? 'hover:border-indigo-800/40 cursor-pointer' : ''} ${padded ? 'p-4' : ''} ${className}`}
        >
            {children}
        </div>
    );
};
