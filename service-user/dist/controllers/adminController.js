"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const adminService_1 = require("../services/adminService");
class AdminController {
    static async getUsers(req, res) {
        try {
            const page = parseInt(req.query?.page) || 1;
            const limit = parseInt(req.query?.limit ?? '10') || 10;
            const result = await adminService_1.AdminService.getUsers(page, limit);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async updateUser(req, res) {
        try {
            const userId = parseInt(req.params?.id || '0');
            const updateData = req?.body;
            const result = await adminService_1.AdminService.updateUser(userId, updateData);
            res.json(result);
        }
        catch (error) {
            res.status(error.message === 'User not found' ? 404 : 500)
                .json({ error: error.message });
        }
    }
    static async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params?.id || '0');
            const result = await adminService_1.AdminService.deleteUser(userId, req.user.id);
            res.json(result);
        }
        catch (error) {
            const status = error.message === 'User not found' ? 404 :
                error.message === 'Cannot delete own account' ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=adminController.js.map