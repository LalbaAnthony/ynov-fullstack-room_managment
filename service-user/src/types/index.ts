import { Request } from 'express';
export interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes {
    email: string;
    password: string;
    role?: 'user' | 'admin';
}

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    role?: 'user' | 'admin';
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateUserRequest {
    role?: 'user' | 'admin';
    isActive?: boolean;
}