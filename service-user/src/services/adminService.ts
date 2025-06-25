import User from '../models/user';
import { UpdateUserRequest } from '../types';

export class AdminService {
    static async getUsers(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            attributes: ['id', 'email', 'lastname', 'firstname', 'role', 'team_id', 'isFirstConnection', 'createdAt'],
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

    static async getStudents() {
        const { count, rows } = await User.findAndCountAll({
            where: { role: 'student' },
            attributes: ['id', 'email', 'lastname', 'firstname', 'team_id', 'isFirstConnection', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        return {
            students: rows,
            pagination: {
                total: count,
            }
        };
    }

    static async createStudent(newUserData: UpdateUserRequest) {
        const existingUser = await User.findOne({ where: { email: newUserData.email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = await User.create({
            ...newUserData,
            role: 'student',
            isFirstConnection: true
        });

        return {
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
                firstname: user.firstname,
                lastname: user.lastname,
                team_id: user.team_id,
                role: user.role,
                isFirstConnection: user.isFirstConnection
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
