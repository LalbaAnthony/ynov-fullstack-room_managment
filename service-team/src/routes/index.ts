import { Router } from 'express';
import teamRoutes from './teamRoutes';

const router = Router();

router.use(teamRoutes);

export default router;