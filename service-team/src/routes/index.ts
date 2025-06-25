import { Router } from 'express';
import teamRoutes from './teamRoutes';

const router = Router();

router.use('/team', teamRoutes);

export default router;