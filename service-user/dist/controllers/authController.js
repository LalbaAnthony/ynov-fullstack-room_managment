"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, role, lastname, firstname, team_id } = req.body;
            if (!email || !password || !firstname || !lastname) {
                res.status(400).json({ error: 'Email, password, firstname, and lastname are required' });
                return;
            }
            const result = await authService_1.AuthService.register({ email, password, role, lastname, firstname, team_id });
            res.status(201).json(result);
        }
        catch (error) {
            res.status(error.message === 'User already exists' ? 409 : 500)
                .json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: 'Email and password required' });
                return;
            }
            const result = await authService_1.AuthService.login({ email, password });
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async getProfile(req, res) {
        try {
            const result = await authService_1.AuthService.getUserProfile(req.user.id);
            res.json(result);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                res.status(400).json({ error: 'Current and new password required' });
                return;
            }
            const result = await authService_1.AuthService.changePassword(req.user.id, currentPassword, newPassword);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map