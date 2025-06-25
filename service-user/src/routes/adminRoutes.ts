import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/users/:id', verifyToken, requireAdmin, AdminController.getUser);
router.post('/users', verifyToken, requireAdmin, AdminController.createUser);
router.get('/users', verifyToken, requireAdmin, AdminController.getUsers);
router.put('/users/:id', verifyToken, requireAdmin, AdminController.updateUser);
router.delete('/users/:id', verifyToken, requireAdmin, AdminController.deleteUser);

export default router;