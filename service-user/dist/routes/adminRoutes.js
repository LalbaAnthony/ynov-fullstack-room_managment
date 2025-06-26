"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/users', auth_1.verifyToken, auth_1.requireAdmin, adminController_1.AdminController.getUsers);
router.put('/users/:id', auth_1.verifyToken, auth_1.requireAdmin, adminController_1.AdminController.updateUser);
router.delete('/users/:id', auth_1.verifyToken, auth_1.requireAdmin, adminController_1.AdminController.deleteUser);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map