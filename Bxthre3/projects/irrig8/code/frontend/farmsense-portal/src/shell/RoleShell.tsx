import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../auth/types';

// Modular imports
import { NAV_ITEMS, SECTION_LABELS } from './nav-config';
import { SidebarBranding } from './components/SidebarBranding';
import { SidebarRoleLabel } from './components/SidebarRoleLabel';
import { SidebarNav } from './components/SidebarNav';
import { SidebarFooter } from './components/SidebarFooter';

export default function RoleShell({ children }: { children: React.ReactNode }) {
    const { user, activeRole, logout, switchRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showRolePicker, setShowRolePicker] = useState(false);

    if (!user || !activeRole) return null;

    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const isMultiRole = userRoles.length > 1;

    const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(activeRole));

    const handleLogout = () => { logout(); navigate('/login'); };

    const orgBadge = user.org_type === 'external'
        ? <span className="text-[9px] font-black text-amber-400 bg-amber-900/20 border border-amber-800/40 px-2 py-0.5 rounded-full">EXT</span>
        : <span className="text-[9px] font-black text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 px-2 py-0.5 rounded-full">INT</span>;

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-56' : 'w-14'} flex flex-col shrink-0 border-r border-slate-800 bg-slate-950 transition-all duration-200`}>
                <SidebarBranding sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <SidebarRoleLabel
                    sidebarOpen={sidebarOpen}
                    activeRole={activeRole}
                    sectionLabel={SECTION_LABELS[activeRole] ?? 'Portal'}
                    orgBadge={orgBadge}
                />

                <SidebarNav
                    visibleNav={visibleNav}
                    pathname={location.pathname}
                    sidebarOpen={sidebarOpen}
                    onNavigate={(path) => navigate(path)}
                />

                <SidebarFooter
                    sidebarOpen={sidebarOpen}
                    isMultiRole={isMultiRole}
                    showRolePicker={showRolePicker}
                    setShowRolePicker={setShowRolePicker}
                    userRoles={userRoles}
                    activeRole={activeRole}
                    switchRole={(role: UserRole) => { switchRole(role); navigate('/'); }}
                    onLogout={handleLogout}
                    user={{ name: user.name, email: user.email, org: user.org }}
                    orgBadge={orgBadge}
                />
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
