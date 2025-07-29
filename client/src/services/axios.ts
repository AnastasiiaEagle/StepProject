import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3001',
    // baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const { authService } = await import('./auth/auth.service');
                const result = await authService.refresh();
                localStorage.setItem('access_token', result.access_token);
                
                originalRequest.headers.Authorization = `Bearer ${result.access_token}`;
                return instance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
)

export default instance