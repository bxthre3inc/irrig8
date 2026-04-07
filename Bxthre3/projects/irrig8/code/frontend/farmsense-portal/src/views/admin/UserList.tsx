import React, { useState, useEffect } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { UserModal } from './UserModal';
import { Card } from '../../components/ui/Card';

// Modular imports
import { User } from './user-list/types';
import { UserListHeader } from './user-list/components/UserListHeader';
import { UserListFilters } from './user-list/components/UserListFilters';
import { UserTableRow } from './user-list/components/UserTableRow';

export const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.admin.getUsers() as User[];
            setUsers(data);
            setFilteredUsers(data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u =>
                u.email.toLowerCase().includes(query) ||
                (u.name && u.name.toLowerCase().includes(query)) ||
                (u.organization && u.organization.toLowerCase().includes(query))
            );
        }

        if (roleFilter !== 'ALL') {
            result = result.filter(u => u.role === roleFilter);
        }

        setFilteredUsers(result);
    }, [searchQuery, roleFilter, users]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <UserListHeader loading={loading} onRefresh={fetchUsers} />

            <UserListFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                foundCount={filteredUsers.length}
            />

            <Card padded={false} className="shadow-xl shadow-slate-200/50 relative min-h-[400px] overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 font-bold text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
                            Fetching Vault Data...
                        </div>
                    </div>
                )}

                <table className="min-w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Stakeholder Identity</th>
                            <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Role & Tier</th>
                            <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-left text-xs font-extrabold text-slate-400 uppercase tracking-widest">Metadata</th>
                            <th className="px-8 py-5 text-right text-xs font-extrabold text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                            <UserTableRow key={user.id} user={user} onSelect={setSelectedUser} />
                        ))}
                    </tbody>
                </table>

                {!loading && filteredUsers.length === 0 && (
                    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                        <Users className="w-16 h-16 opacity-20 mb-4" />
                        <p className="font-bold text-lg">No matching stakeholders found.</p>
                        <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </Card>

            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={() => {
                        setSelectedUser(null);
                        fetchUsers();
                    }}
                />
            )}
        </div>
    );
};
