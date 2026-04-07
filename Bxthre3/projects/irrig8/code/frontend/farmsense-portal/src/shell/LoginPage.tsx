import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLE_HOME } from '../auth/types';
import { Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Determine where to navigate based on role (AuthContext sets role on login)
            // Brief delay to allow state to settle
            setTimeout(() => {
                const stored = sessionStorage.getItem('farmsense_auth');
                if (stored) {
                    const user = JSON.parse(stored);
                    const role = Array.isArray(user.role) ? user.role[0] : user.role;
                    navigate(ROLE_HOME[role as keyof typeof ROLE_HOME] ?? '/');
                }
            }, 50);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-8">
                {/* Logo */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-slate-700 mb-4">
                        <Leaf className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-black text-white">FarmSense</h1>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your portal</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Email</label>
                        <input
                            type="email" value={email} onChange={e => setEmail(e.target.value)}
                            required autoComplete="email" placeholder="you@example.com"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'} value={password}
                                onChange={e => setPassword(e.target.value)}
                                required placeholder="••••••••"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors pr-10"
                            />
                            <button type="button" onClick={() => setShowPass(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2.5">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-300">{error}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                {/* Org badge */}
                <p className="text-center text-[10px] text-slate-700">
                    Access is provisioned by your FarmSense administrator.
                </p>
            </div>
        </div>
    );
}
