import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AuthUser, UserRole, UserOrgType } from './types';
import { ROLE_HOME } from './types';

interface AuthContextValue {
    user: AuthUser | null;
    activeRole: UserRole | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
    user: null, activeRole: null,
    login: async () => { }, logout: () => { }, switchRole: () => { },
    isAuthenticated: false,
});

const STORAGE_KEY = 'farmsense_auth';

/* ── Real Authentication Active ──────────────────────────────────
   Login uses POST /api/v1/auth/login 
   DEMO_USERS block removed.        */


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const s = sessionStorage.getItem(STORAGE_KEY);
            return s ? JSON.parse(s) : null;
        } catch { return null; }
    });

    const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
        try {
            const s = sessionStorage.getItem(STORAGE_KEY);
            if (!s) return null;
            const u: AuthUser = JSON.parse(s);
            return Array.isArray(u.role) ? u.role[0] : u.role;
        } catch { return null; }
    });

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
            }

            const data = await res.json();
            const found: AuthUser = data.user;

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
            setUser(found);
            setActiveRole(Array.isArray(found.role) ? found.role[0] : found.role);
        } catch (err: any) {
            throw new Error(err.message || 'An error occurred during login.');
        }
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setActiveRole(null);
    }, []);

    const switchRole = useCallback((role: UserRole) => {
        if (!user) return;
        const roles = Array.isArray(user.role) ? user.role : [user.role];
        if (roles.includes(role)) setActiveRole(role);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, activeRole, login, logout, switchRole, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() { return useContext(AuthContext); }
export { ROLE_HOME };
export type { UserOrgType };
