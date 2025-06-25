import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { requireAdmin, verifyToken } from '../middleware/auth';

const router = Router();

router.get('/users', verifyToken, requireAdmin, AdminController.getUsers);
router.get('/students', verifyToken, requireAdmin,AdminController.getStudents);
router.post('/students', verifyToken, requireAdmin, AdminController.createStudent);
router.put('/users/:id', verifyToken, requireAdmin, AdminController.updateUser);
router.delete('/users/:id', verifyToken, requireAdmin, AdminController.deleteUser);

export default router;