import { API } from "../endpoint"
import axios from "../axios"
import { LoginResponse, RegisterResponse, LogoutResponse } from "./auth.types"

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await axios.post(API.auth.login, { email, password });
        const data = response.data;
        
        localStorage.setItem('access_token', data.access_token);
        
        return data;
    },
    
        register: async (email: string, password: string, nickname: string): Promise<RegisterResponse> => {
        const response = await axios.post(API.auth.register, { email, password, nickname });
        const data = response.data;
        
        localStorage.setItem('access_token', data.access_token);
        
        return data;
    },
    
    logout: async (): Promise<LogoutResponse> => {
        const response = await axios.post(API.auth.logout);
        
        localStorage.removeItem('access_token');
        
        return response.data;
    },
    
    refresh: async (): Promise<{ access_token: string; expires_in: number }> => {
        const response = await axios.post(API.auth.refresh);
        const data = response.data;
        
        localStorage.setItem('access_token', data.access_token);
        
        return data;
    }
}