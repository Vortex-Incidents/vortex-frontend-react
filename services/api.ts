import axios from 'axios';

// Environment Variables
const JAVA_API_URL = import.meta.env.VITE_API_JAVA_URL || 'https://vortex-java-core.onrender.com';
const PYTHON_API_URL = import.meta.env.VITE_API_PYTHON_URL || 'https://vortex-service-triage-ml.onrender.com';

// 1. Main API Instance (Java Core)
export const mainApi = axios.create({
    baseURL: JAVA_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach Token
mainApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor for Global Error Handling (Optional: redirect on 401)
mainApi.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        // Only redirect if not already on login to avoid loops
        if (window.location.pathname !== '/login') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});


// 2. AI API Instance (Python Triage/Chat)
export const aiApi = axios.create({
    baseURL: PYTHON_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// AI API might not need Auth token yet, or might need a different one.
// For now, we assume it's open or uses the same token if backend validates it.
// If needed, we can add a similar interceptor.
