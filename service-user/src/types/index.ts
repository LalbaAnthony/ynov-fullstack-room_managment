import { Request } from 'express';
export interface UserAttributes {
    id: number;
    firstname: string;
    lastname: string;
    team_id: number;
    email: string;
    password: string;
    role: 'student' | 'admin';
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes {
    firstname: string;
    lastname: string;
    team_id: number;
    email: string;
    password: string;
    role?: 'student' | 'admin';
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
    firstname: string;
    lastname: string;
    team_id: number;
    email: string;
    password: string;
    role?: 'student' | 'admin';
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UpdateUserRequest {
    role?: 'student' | 'admin';
    isActive?: boolean;
}