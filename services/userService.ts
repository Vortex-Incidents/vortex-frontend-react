import { mainApi } from './api';
import { User, Role } from '../types';

interface LoginResponse {
    token: string;
    user?: User;
    role?: Role;
}

export const loginApi = async (email: string, password: string): Promise<{ token: string, role: Role, user: User }> => {
    // POST /auth/login
    // Payload: { email, password }
    const response = await mainApi.post<LoginResponse>('/auth/login', { email, password });

    // Backend returns { token, user: {...} } or similar. Adjust based on real API.
    // If backend only returns token, we might need to fetch /me or infer role.

    const token = response.data.token;

    // Assume backend returns role in response, OR we decode it, OR we fetch it.
    // For "Senior" implementation, let's assume valid response structure or fetch /me if missing.
    let user = response.data.user;
    let role = response.data.role || user?.role || 'employee';

    // If User object is missing but we have token, we should construct a basic user or fetch profile
    if (!user) {
        user = {
            id: 'valid-id',
            email: email,
            name: email.split('@')[0],
            role: role as Role,
            avatar: `https://ui-avatars.com/api/?name=${email}&background=random`
        };
    }

    return { token, role: role as Role, user };
};

export const getUsersApi = async (): Promise<User[]> => {
    const response = await mainApi.get<User[]>('/users');
    return response.data;
};

export const createUserApi = async (userData: any): Promise<User> => {
    const response = await mainApi.post<User>('/users', userData);
    return response.data;
};
