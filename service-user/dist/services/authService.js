"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '24h' });
    }
    static async register(userData) {
        const existingUser = await user_1.default.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const user = await user_1.default.create(userData);
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
                isActive: user.isActive
            }
        };
    }
    static async login(loginData) {
        const user = await user_1.default.findOne({ where: { email: loginData.email } });
        if (!user || !user.isActive) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await bcryptjs_1.default.compare(loginData.password, user.password);
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
                isActive: user.isActive
            }
        };
    }
    static async getUserProfile(userId) {
        const user = await user_1.default.findByPk(userId, {
            attributes: ['id', 'email', 'firstname', 'lastname', 'role', 'team_id', 'isActive', 'createdAt']
        });
        if (!user || !user.isActive) {
            throw new Error('User not found');
        }
        return { user };
    }
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await user_1.default.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Current password invalid');
        }
        await user.update({ password: newPassword });
        return { message: 'Password updated' };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map