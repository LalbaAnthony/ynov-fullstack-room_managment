import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { JwtPayload, LoginRequest, UserCreationAttributes } from '../types';

export class AuthService {
    private static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET || '',
            { expiresIn: '24h' }
        );
    }

    static async register(userData: UserCreationAttributes) {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = await User.create(userData);
        const token = this.generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isFirstConnection: user.isFirstConnection
            }
        };
    }

    static async login(loginData: LoginRequest) {
        const user = await User.findOne({ where: { email: loginData.email } });
        if (!user || !user.isFirstConnection) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(loginData.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                team_id: user.team_id,
                role: user.role,
                isFirstConnection: user.isFirstConnection
            }
        };
    }

    static async getUserProfile(userId: number) {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'firstname', 'lastname', 'role', 'team_id', 'isFirstConnection', 'createdAt']
        });

        if (!user || !user.isFirstConnection) {
            throw new Error('User not found');
        }

        return { user };
    }

    static async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Current password invalid');
        }

        await user.update({ password: newPassword });
        return { message: 'Password updated' };
    }
}