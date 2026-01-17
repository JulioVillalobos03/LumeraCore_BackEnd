import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";

import {
  create,
  list,
  assign,
} from "../../controllers/RoleController/role.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);
router.use(requireRole("ADMIN"));


router.get("/", asyncHandler(list));
router.post("/", asyncHandler(create));
router.patch("/assign", asyncHandler(assign));

export default router;
