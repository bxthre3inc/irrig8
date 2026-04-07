/** FarmSense Unified Portal — Auth Types */

export type UserRole =
    | 'ADMIN'
    | 'GRANT_MANAGER'    // Internal or external consultant — full grant pipeline
    | 'GRANT_REVIEWER'   // Internal evaluator or external funder officer — notes on submissions
    | 'FARMER'           // Internal staff or contracted grower — field operations
    | 'RESEARCHER'       // Internal or partner institution — data science & research tools
    | 'AUDITOR'          // Internal or external — GLOBALG.A.P. and compliance review
    | 'REGULATOR'        // State Engineers, basin managers, water court — immutable ledger & SLV reporting
    | 'INVESTOR';        // VCs, sustainability funds — obfuscated aggregate impact metrics

export type UserOrgType = 'internal' | 'external';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    org: string;                    // e.g. "FarmSense" | "Colorado Division of Water Resources" | "Acme Capital"
    org_type: UserOrgType;
    role: UserRole | UserRole[];
    token: string;
    expires_at: number;
}

export function primaryRole(user: AuthUser): UserRole {
    return Array.isArray(user.role) ? user.role[0] : user.role;
}

export function hasRole(user: AuthUser, roles: UserRole[]): boolean {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    return roles.some(r => userRoles.includes(r));
}

export const ROLE_HOME: Record<UserRole, string> = {
    ADMIN: '/admin',
    GRANT_MANAGER: '/grants',
    GRANT_REVIEWER: '/grants/review',
    FARMER: '/farmer',
    RESEARCHER: '/research',
    AUDITOR: '/compliance',
    REGULATOR: '/regulatory',
    INVESTOR: '/investor',
};

export const ROLE_LABEL: Record<UserRole, string> = {
    ADMIN: 'Admin',
    GRANT_MANAGER: 'Grant Manager',
    GRANT_REVIEWER: 'Grant Reviewer',
    FARMER: 'Farmer',
    RESEARCHER: 'Researcher',
    AUDITOR: 'Auditor',
    REGULATOR: 'Regulator',
    INVESTOR: 'Investor',
};

/** Docs sections visible per role — public baseline + role extras */
export const DOCS_SECTIONS: Record<UserRole | 'PUBLIC', string[]> = {
    PUBLIC: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Security Architecture'],
    ADMIN: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Security Architecture', 'API Reference', 'Deployment Guide', 'Architecture Deep Dive', 'Firmware OTA', 'Calibration Protocols', 'Internal SOPs'],
    GRANT_MANAGER: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Security Architecture', 'Grant Portal Guide', 'Impact Metrics Methodology'],
    GRANT_REVIEWER: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Security Architecture', 'Grant Portal Guide', 'Data Validation Methods', 'Impact Metrics Methodology'],
    FARMER: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Farmer Dashboard Guide', 'VRI Worksheet Guide', 'Hardware Field SOPs'],
    RESEARCHER: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Security Architecture', 'API Reference', 'Kriging Engine Docs', 'Federated Learning Docs', 'Data Export Guide'],
    AUDITOR: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Security Architecture', 'GLOBALG.A.P. Control Points', 'Compliance Report Guide', 'Calibration Protocols'],
    REGULATOR: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Security Architecture', 'Regulatory Portal Guide', 'Master Meter Calibration Protocols', 'Water Court Reporting Procedures', 'Tamper Detection Methodology'],
    INVESTOR: ['Overview', 'Hardware Overview', 'Privacy Policy', 'Investor Dashboard Guide', 'Impact Metrics Methodology', 'Spatial Privacy Guarantee'],
};
