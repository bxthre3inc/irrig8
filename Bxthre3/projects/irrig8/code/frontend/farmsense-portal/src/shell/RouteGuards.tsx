import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { UserRole } from '../auth/types';
import { ROLE_HOME } from '../auth/types';

interface PrivateRouteProps {
    children: React.ReactNode;
}

/** Redirects to /login if not authenticated */
export function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

interface RoleRouteProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
}

/** Redirects to the user's home if they don't have the required role */
export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
    const { user, activeRole } = useAuth();
    if (!user || !activeRole) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(activeRole)) {
        return <Navigate to={ROLE_HOME[activeRole]} replace />;
    }
    return <>{children}</>;
}
