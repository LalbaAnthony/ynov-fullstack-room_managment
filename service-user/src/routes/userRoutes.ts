import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticateToken,
  userController.getAllUsers
);

router.post(
  "/",
  authenticateToken,
  userController.addUser
);

router.put(
  "/:id",
  authenticateToken,
  userController.updateUser
);

router.delete(
  "/:id",
  authenticateToken,
  userController.deleteUser
);

export default router;
