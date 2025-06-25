import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { verifyToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.get('/me', verifyToken, AuthController.getProfile);
router.put('/password', verifyToken, AuthController.changePassword);

export default router;