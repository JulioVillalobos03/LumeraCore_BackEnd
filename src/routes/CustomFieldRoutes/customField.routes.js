import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

import * as CustomFieldController from "../../controllers/CustomFieldController/customField.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.post(
  "/",
  requirePermission("custom_fields.create"),
  asyncHandler(CustomFieldController.create)
);

router.get(
  "/",
  requirePermission("custom_fields.read"),
  asyncHandler(CustomFieldController.list)
);

export default router;
