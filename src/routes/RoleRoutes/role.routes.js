import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import {
  create,
  list,
  assign,
} from "../../controllers/RoleController/role.controller.js";
import * as PermissionController from "../../controllers/PermissionController/permission.controller.js";


const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.get(
  "/:roleId/permissions",
  requirePermission("roles.read"),
  asyncHandler(PermissionController.listByRole)
);
router.get("/", requirePermission("roles.read"), asyncHandler(list));
router.post("/", requirePermission("roles.create"),asyncHandler(create));
router.patch("/assign", requirePermission("roles.assign"), asyncHandler(assign));

export default router;
