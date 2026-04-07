import React from 'react';
import { Shield, Award } from 'lucide-react';
import { User } from '../types';
import { Button } from '../../../../components/ui/Button';

interface UserModalSidebarProps {
    formData: {
        role: string;
        tier: string;
    };
    onFormChange: (data: any) => void;
    user: User;
    isSaving: boolean;
    success: boolean;
    onSave: () => void;
}

export const UserModalSidebar: React.FC<UserModalSidebarProps> = ({
    formData,
    onFormChange,
    user,
    isSaving,
    success,
    onSave
}) => {
    return (
        <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                        <Shield className="w-3 h-3 text-indigo-400" /> System Role
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => onFormChange({ ...formData, role: e.target.value })}
                        className="w-full p-2 bg-black/40 border border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-200"
                    >
                        <option value="FARMER">Farmer</option>
                        <option value="AUDITOR">Auditor</option>
                        <option value="ADMIN">Administrator</option>
                        <option value="RESEARCHER">Researcher</option>
                        <option value="INVESTOR">Investor</option>
                        <option value="REVIEWER">Reviewer</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                        <Award className="w-3 h-3 text-amber-400" /> Subscription Tier
                    </label>
                    <select
                        value={formData.tier}
                        onChange={(e) => onFormChange({ ...formData, tier: e.target.value })}
                        className="w-full p-2 bg-black/40 border border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-200"
                    >
                        <option value="FREE">Free Tier</option>
                        <option value="BASIC">Basic</option>
                        <option value="PRO">Pro</option>
                        <option value="ENTERPRISE">Enterprise</option>
                    </select>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Joined:</span>
                    <span className="text-slate-300 font-mono">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Last Login:</span>
                    <span className="text-slate-300 font-mono">{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">API Key:</span>
                    <span className="text-slate-500 font-mono">{user.api_key.substring(0, 8)}...</span>
                </div>
            </div>

            <Button
                disabled={isSaving}
                onClick={onSave}
                variant={success ? 'success' : 'primary'}
                className="w-full py-3 shadow-lg"
            >
                {isSaving ? 'Synchronizing...' : success ? 'Successfully Saved' : 'Commit Changes'}
            </Button>
        </div>
    );
};
