import { Router } from 'express';
import { TeamController } from '../controllers/teamController';

const router = Router();

router.get('/teams/:id', TeamController.getTeams);
router.post('/teams', TeamController.createTeam);
router.get('/teams', TeamController.getTeams);
router.put('/teams/:id', TeamController.updateTeam);
router.delete('/teams/:id', TeamController.deleteTeam);

export default router;