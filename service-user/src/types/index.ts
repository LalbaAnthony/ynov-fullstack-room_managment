export interface UserAttributes {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
    isFirstConnection: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

import { Optional } from 'sequelize';
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'isFirstConnection'> { }

export interface JwtPayload {
    userId: string;
    role: 'user' | 'admin';
}

import { Request } from 'express';
export interface AuthRequest extends Request {
    user?: JwtPayload;
}