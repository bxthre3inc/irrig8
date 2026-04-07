import React from 'react';
import { Repeat, ChevronDown, Building2, LogOut } from 'lucide-react';
import { UserRole, ROLE_LABEL } from '../../auth/types';

interface SidebarFooterProps {
    sidebarOpen: boolean;
    isMultiRole: boolean;
    showRolePicker: boolean;
    setShowRolePicker: React.Dispatch<React.SetStateAction<boolean>>;
    userRoles: UserRole[];
    activeRole: UserRole;
    switchRole: (role: UserRole) => void;
    onLogout: () => void;
    user: {
        name: string;
        email: string;
        org: string;
    };
    orgBadge: React.ReactNode;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
    sidebarOpen,
    isMultiRole,
    showRolePicker,
    setShowRolePicker,
    userRoles,
    activeRole,
    switchRole,
    onLogout,
    user,
    orgBadge
}) => {
    return (
        <div className="border-t border-slate-800 p-3 space-y-2">
            {/* Multi-role switcher */}
            {isMultiRole && sidebarOpen && (
                <div className="relative">
                    <button onClick={() => setShowRolePicker(v => !v)}
                        className="w-full flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 hover:border-indigo-600/50 transition-colors">
                        <Repeat className="w-3 h-3" />
                        Switch Role
                        <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${showRolePicker ? 'rotate-180' : ''}`} />
                    </button>
                    {showRolePicker && (
                        <div className="absolute bottom-full mb-1 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl py-1 shadow-2xl z-50">
                            {userRoles.map(r => (
                                <button key={r} onClick={() => { switchRole(r); setShowRolePicker(false); }}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors ${r === activeRole ? 'text-indigo-300' : 'text-slate-400 hover:text-white'}`}>
                                    {ROLE_LABEL[r]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* User card */}
            {sidebarOpen && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <p className="text-[10px] text-slate-500 truncate">{user.org}</p>
                        {orgBadge}
                    </div>
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
            )}

            <button onClick={onLogout}
                className="w-full flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-red-400 px-1 py-1 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
                {sidebarOpen && 'Sign Out'}
            </button>
        </div>
    );
};
