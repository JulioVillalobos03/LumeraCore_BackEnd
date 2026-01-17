import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

import * as EmployeeController from "../../controllers/EmployeeController/employee.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.post(
  "/",
  requirePermission("employees.create"),
  asyncHandler(EmployeeController.create)
);

router.get(
  "/",
  requirePermission("employees.read"),
  asyncHandler(EmployeeController.list)
);

router.get(
  "/:id",
  requirePermission("employees.read"),
  asyncHandler(EmployeeController.get)
);

router.put(
  "/:id",
  requirePermission("employees.update"),
  asyncHandler(EmployeeController.update)
);

router.patch(
  "/:id/status",
  requirePermission("employees.change_status"),
  asyncHandler(EmployeeController.changeStatus)
);

export default router;
