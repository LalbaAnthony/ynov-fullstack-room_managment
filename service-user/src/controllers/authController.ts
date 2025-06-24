import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest, RegisterRequest, LoginRequest, ChangePasswordRequest } from '../types';

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, role }: RegisterRequest = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Email and password required' });
                return;
            }

            const result = await AuthService.register({ email, password, role });
            res.status(201).json(result);
        } catch (error: any) {
            res.status(error.message === 'User already exists' ? 409 : 500)
                .json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: LoginRequest = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Email and password required' });
                return;
            }

            const result = await AuthService.login({ email, password });
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    static async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await AuthService.getUserProfile(req.user!.id);
            res.json(result);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    static async changePassword(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { currentPassword, newPassword }: ChangePasswordRequest = req.body;

            if (!currentPassword || !newPassword) {
                res.status(400).json({ error: 'Current and new password required' });
                return;
            }

            const result = await AuthService.changePassword(req.user!.id, currentPassword, newPassword);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}
