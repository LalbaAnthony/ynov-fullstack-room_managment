import { Router } from "express";
import * as teamController from "../controllers/teamController";

const router = Router();

router.post("/", teamController.createTeam);
router.get("/", teamController.getTeams);
router.get("/:id", teamController.getTeam);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

export default router;
