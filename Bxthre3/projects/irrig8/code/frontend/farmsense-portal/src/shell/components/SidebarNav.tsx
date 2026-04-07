import React from 'react';
import { NavItem } from '../nav-config';

interface SidebarNavProps {
    visibleNav: NavItem[];
    pathname: string;
    sidebarOpen: boolean;
    onNavigate: (path: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
    visibleNav,
    pathname,
    sidebarOpen,
    onNavigate
}) => {
    return (
        <nav className="flex-1 overflow-y-auto py-2">
            {visibleNav.map(item => {
                const active = pathname === item.path || pathname.startsWith(item.path + '/');
                return (
                    <button key={item.path} onClick={() => onNavigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-bold transition-all ${active ? 'text-white bg-indigo-600/20 border-l-2 border-indigo-500' : 'text-slate-500 hover:text-slate-200 border-l-2 border-transparent'}`}>
                        {item.icon}
                        {sidebarOpen && <span>{item.label}</span>}
                    </button>
                );
            })}
        </nav>
    );
};
