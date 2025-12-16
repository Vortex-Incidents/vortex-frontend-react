import { mainApi } from './api';
import { User, Role } from '../types';

interface LoginResponse {
    token: string;
    user?: User;
    role?: Role;
}

export const loginApi = async (email: string, password: string): Promise<{ token: string, role: Role, user: User }> => {
    // Clear stale credentials to prevent 403 on Login due to invalid Headers
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // POST /auth/login
    // Payload: { email, password }
    const response = await mainApi.post<LoginResponse>('/auth/login', { email, password });

    // Backend returns { token, user: {...} } or similar. Adjust based on real API.
    // If backend only returns token, we might need to fetch /me or infer role.

    const token = response.data.token;

    // Assume backend returns role in response, OR we decode it, OR we fetch it.
    // For "Senior" implementation, let's assume valid response structure or fetch /me if missing.
    let user = response.data.user;
    // Normalize Role (Backend might return "ROLE_ADMIN" or "ADMIN")
    let rawRole = (response.data.role || user?.role || 'employee').toString();

    // Remove "ROLE_" prefix if present and convert to lowercase
    rawRole = rawRole.replace('ROLE_', '').toLowerCase();

    // Map to strictly typed Role
    let finalRole: Role = 'employee';
    if (rawRole.includes('admin')) finalRole = 'admin';
    else if (rawRole.includes('support')) finalRole = 'support';
    else if (rawRole.includes('employee') || rawRole.includes('user')) finalRole = 'employee';

    return { token, role: finalRole, user };
};

export const getUsersApi = async (): Promise<User[]> => {
    const response = await mainApi.get<User[]>('/users');
    return response.data;
};

export const createUserApi = async (userData: any): Promise<User> => {
    const response = await mainApi.post<User>('/users', userData);
    return response.data;
};
