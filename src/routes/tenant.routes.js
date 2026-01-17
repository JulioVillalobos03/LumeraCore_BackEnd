import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { tenantMiddleware } from "../middlewares/tenant.middleware.js";
import { getCurrentCompany } from "../controllers/tenant.controller.js";

const router = Router();

router.get("/me", tenantMiddleware, asyncHandler(getCurrentCompany));

export default router;
