import React from 'react';
import { Leaf, Menu, X } from 'lucide-react';

interface SidebarBrandingProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarBranding: React.FC<SidebarBrandingProps> = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/30 to-indigo-500/30 border border-slate-700 flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            {sidebarOpen && <span className="text-sm font-black text-white">FarmSense</span>}
            <button onClick={() => setSidebarOpen(v => !v)} className="ml-auto text-slate-600 hover:text-slate-300 transition-colors">
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
        </div>
    );
};
