import { Response } from 'express';
import { AdminService } from '../services/adminService';
import { AuthRequest, UpdateUserRequest } from '../types';

export class AdminController {
    static async getUsers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query?.page as string) || 1;
            const limit = parseInt((req.query?.limit as string) ?? '10') || 10;

            const result = await AdminService.getUsers(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params?.id || '0');
            const updateData: UpdateUserRequest = req?.body

            const result = await AdminService.updateUser(userId, updateData);
            res.json(result);
        } catch (error: any) {
            res.status(error.message === 'User not found' ? 404 : 500)
                .json({ error: error.message });
        }
    }

    static async createUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userData = req?.body;
            const result = await AdminService.createUser(userData, req.user!.id);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params?.id || '0');
            const result = await AdminService.deleteUser(userId, req.user!.id);
            res.json(result);
        } catch (error: any) {
            const status = error.message === 'User not found' ? 404 :
                error.message === 'Cannot delete own account' ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    }
}
