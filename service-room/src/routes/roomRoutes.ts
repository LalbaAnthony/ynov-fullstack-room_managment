import { Router } from 'express';
import { RoomController } from '../controllers/roomController';

const router = Router();

router.get('/room', RoomController.getRooms);
router.get('/room/:id', RoomController.getRoom);
router.put('/room/:id', RoomController.updateRoom);
router.delete('/room/:id', RoomController.deleteRoom);

export default router;