import { Router } from 'express';
import { RoomController } from '../controllers/roomController';

const router = Router();

router.get('/rooms/:id', RoomController.getRooms);
router.get('/rooms', RoomController.getRooms);
router.put('/rooms/:id', RoomController.updateRoom);
router.delete('/rooms/:id', RoomController.deleteRoom);

export default router;