import { Router } from 'express';
import roomRoutes from './roomRoutes';

const router = Router();

router.use('/room', roomRoutes);

export default router;