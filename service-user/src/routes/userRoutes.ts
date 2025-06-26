import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticateToken, authorizeRoles } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  userController.getAllUsers
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  userController.addUser
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  userController.updateUser
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  userController.deleteUser
);

export default router;
