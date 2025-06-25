import { Router } from 'express';
import roomRoutes from './roomRoutes';

const router = Router();

router.use(roomRoutes);

export default router;