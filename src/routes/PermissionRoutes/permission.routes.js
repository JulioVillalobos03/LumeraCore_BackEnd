import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";

import * as PermissionController from "../../controllers/PermissionController/permission.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.post(
  "/",
  requirePermission("permissions.create"),
  asyncHandler(PermissionController.create)
);

router.get(
  "/",
  requirePermission("permissions.read"),
  asyncHandler(PermissionController.list)
);
router.post("/assign", asyncHandler(PermissionController.assign));

export default router;
