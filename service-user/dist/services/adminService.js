"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const user_1 = __importDefault(require("../models/user"));
class AdminService {
    static async getUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const { count, rows } = await user_1.default.findAndCountAll({
            attributes: ['id', 'email', 'lastname', 'firstname', 'role', 'team_id', 'isActive', 'createdAt'],
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
    static async updateUser(userId, updateData) {
        const user = await user_1.default.findByPk(userId);
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
                isActive: user.isActive
            }
        };
    }
    static async deleteUser(userId, currentUserId) {
        if (userId === currentUserId) {
            throw new Error('Cannot delete own account');
        }
        const deleted = await user_1.default.destroy({ where: { id: userId } });
        if (!deleted) {
            throw new Error('User not found');
        }
        return { message: 'User deleted' };
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=adminService.js.map