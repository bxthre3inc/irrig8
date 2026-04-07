import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-all" onClick={onClose} />
            <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-slate-950 border-l border-indigo-900/30 z-[101] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-900/20 bg-indigo-950/10">
                    <h3 className="font-bold text-white tracking-wide">{title}</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
                {footer && (
                    <div className="px-6 py-4 border-t border-indigo-900/20 bg-indigo-950/10">
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
};
