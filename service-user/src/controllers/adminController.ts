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

    static async getStudents(res: Response): Promise<void> {
        try {
            // const result = await AdminService.getStudents();
            const test = "hey";
            res.json(test);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createStudent(req: AuthRequest, res: Response): Promise<void> {
        try {
            const newUserData = req.body;

            if (!newUserData.email || !newUserData.password || !newUserData.firstname || !newUserData.lastname) {
                res.status(400).json({ error: 'Email, password, firstname, and lastname are required' });
                return;
            }

            const result = await AdminService.createStudent(newUserData);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(error.message === 'User already exists' ? 409 : 500)
                .json({ error: error.message });
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
