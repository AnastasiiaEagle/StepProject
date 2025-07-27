export type RegisterRequest = {
    email: string
    password: string
    nickname: string
}

export type LoginRequest = {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        nickname: string;
    };
}

export interface RegisterResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        nickname: string;
    };
    message: string;
}

export interface LogoutResponse {
    message: string;
}