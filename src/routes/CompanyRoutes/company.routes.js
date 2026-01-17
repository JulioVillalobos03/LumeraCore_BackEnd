import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

import {
  create,
  list,
  update,
  changeStatus,
} from "../../controllers/CompanyController/company.controller.js";

const router = Router();

// todo protegido con JWT
router.use(authMiddleware);

router.get("/", asyncHandler(list));
router.post("/", asyncHandler(create));
router.patch("/:id", asyncHandler(update));
router.patch("/:id/status", asyncHandler(changeStatus));

export default router;
