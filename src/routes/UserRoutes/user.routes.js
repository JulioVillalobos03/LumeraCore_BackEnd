import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import * as UserController from '../../controllers/UserController/user.controller.js';


const router = Router();

// proteger todo con JWT
router.use(authMiddleware);
router.use(companyMiddleware);

router.get("/", requirePermission("users.read"), asyncHandler(UserController.list));
router.patch("/:id", asyncHandler(UserController.update));
router.patch("/:id/status", requirePermission("users.change_status"), asyncHandler(UserController.changeStatus));
router.post(
  "/",
  requirePermission("users.create"),
  asyncHandler(UserController.create)
);

router.put(
  "/company-users/:userId/role",
  UserController.assignRole
);

export default router;
