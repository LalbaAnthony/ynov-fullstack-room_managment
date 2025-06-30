import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

router.get("/", authController.healthCheck);
router.post("/register", authController.register);
router.post("/", authController.login);

export default router;
