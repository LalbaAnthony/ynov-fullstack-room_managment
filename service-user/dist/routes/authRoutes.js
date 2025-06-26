"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.post('/register', rateLimiter_1.authLimiter, authController_1.AuthController.register);
router.post('/login', rateLimiter_1.authLimiter, authController_1.AuthController.login);
router.get('/me', auth_1.verifyToken, authController_1.AuthController.getProfile);
router.put('/password', auth_1.verifyToken, authController_1.AuthController.changePassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map