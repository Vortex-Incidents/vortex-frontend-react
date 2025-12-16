import { User, Role } from '../types';

const AUTH_URL = 'https://vortex-java-core.onrender.com/api/v1/auth';
const USERS_URL = 'https://vortex-java-core.onrender.com/api/v1/users';

interface LoginResponse {
    token: string;
    user?: User; // Backend might return user info, if not we decode or fetch
}

export const loginApi = async (email: string, password: string): Promise<{ token: string, role: Role }> => {
    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Login failed');

        const data: LoginResponse = await response.json();

        // Store token
        localStorage.setItem('token', data.token);

        // Simple decoding or default role if backend doesn't send it. 
        // For this guide, we assume the backend might return user data or we default.
        // The user guide says response is just token. We might need to fetch profile or parse JWT.
        // For now, let's look for a role in the response or default to 'employee'.
        // Or we decode the token if it's a standard JWT.

        return { token: data.token, role: 'employee' }; // Placeholder role, should be parsed from token or response
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const getUsersApi = async (): Promise<any[]> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(USERS_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
};

export const createUserApi = async (userData: any): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(USERS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
};
