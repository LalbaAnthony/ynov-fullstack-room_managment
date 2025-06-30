import { Router } from "express";
import * as roomController from "../controllers/roomController";

const router = Router();

router.post("/", roomController.createRoom);
router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoom);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

export default router;
