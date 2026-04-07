import React from 'react';
import { UserRole, ROLE_LABEL } from '../../auth/types';

interface SidebarRoleLabelProps {
    sidebarOpen: boolean;
    activeRole: UserRole;
    sectionLabel: string;
    orgBadge: React.ReactNode;
}

export const SidebarRoleLabel: React.FC<SidebarRoleLabelProps> = ({
    sidebarOpen,
    activeRole,
    sectionLabel,
    orgBadge
}) => {
    if (!sidebarOpen) return null;

    return (
        <div className="px-4 py-3 border-b border-slate-800">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                {sectionLabel}
            </p>
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-indigo-300">{ROLE_LABEL[activeRole]}</span>
                {orgBadge}
            </div>
        </div>
    );
};
