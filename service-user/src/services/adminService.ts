import User from '../models/User';
import { UpdateUserRequest } from '../types';

export class AdminService {
    static async getUsers(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            attributes: ['id', 'email', 'role', 'isActive', 'createdAt'],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            users: rows,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit)
            }
        };
    }

    static async updateUser(userId: number, updateData: UpdateUserRequest) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update(updateData);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        };
    }

    static async deleteUser(userId: number, currentUserId: number) {
        if (userId === currentUserId) {
            throw new Error('Cannot delete own account');
        }

        const deleted = await User.destroy({ where: { id: userId } });

        if (!deleted) {
            throw new Error('User not found');
        }

        return { message: 'User deleted' };
    }
}
