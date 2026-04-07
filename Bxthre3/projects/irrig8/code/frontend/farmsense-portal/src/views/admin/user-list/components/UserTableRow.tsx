import React from 'react';
import { Mail, Building2, Shield, Award } from 'lucide-react';
import { User } from '../types';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';

interface UserTableRowProps {
    user: User;
    onSelect: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({ user, onSelect }) => {
    return (
        <tr className="hover:bg-indigo-50/30 transition-colors group">
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-indigo-600 font-bold transition-colors">
                        {user.email[0].toUpperCase()}
                    </div>
                    <div>
                        <div className="text-sm font-extrabold text-slate-900">{user.name || 'Anonymous'}</div>
                        <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                        </div>
                        {user.organization && (
                            <div className="text-[10px] font-bold text-indigo-500 mt-1 flex items-center gap-1 uppercase tracking-tighter">
                                <Building2 className="w-3 h-3" /> {user.organization}
                            </div>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="flex flex-col gap-2">
                    <Badge variant={user.role === 'ADMIN' ? 'purple' : user.role === 'AUDITOR' ? 'warning' : 'success'}>
                        <Shield className="w-3 h-3 mr-1" /> {user.role}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 ml-1">
                        <Award className="w-3 h-3" /> {user.tier}
                    </span>
                </div>
            </td>
            <td className="px-8 py-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase
                    ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`} />
                    {user.is_active ? 'Operational' : 'Restricted'}
                </span>
            </td>
            <td className="px-8 py-5 whitespace-nowrap">
                <div className="text-[10px] space-y-1">
                    <div className="text-slate-400 font-bold uppercase tracking-tighter">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                    <div className="text-slate-500 font-mono">UID: {user.id.substring(0, 8)}</div>
                </div>
            </td>
            <td className="px-8 py-5 text-right">
                <Button variant="outline" size="sm" onClick={() => onSelect(user)}>
                    Manage
                </Button>
            </td>
        </tr>
    );
};
