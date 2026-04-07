export interface User {
    id: string;
    email: string;
    role: string;
    tier: string;
    is_active: boolean;
    name?: string;
    organization?: string;
    phone?: string;
    notes?: string;
    created_at: string;
    last_login?: string;
    api_key: string;
}
