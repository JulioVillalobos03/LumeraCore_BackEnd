import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { tenantMiddleware } from "../middlewares/tenant.middleware.js";
import { getCurrentCompany } from "../controllers/tenant.controller.js";

const router = Router();

router.get("/me", tenantMiddleware, asyncHandler(getCurrentCompany));
router.get("/debug/env", (req, res) => {
  res.json({
    port: process.env.PORT,
    jwtSecret: !!process.env.JWT_SECRET,
    jwtExpires: process.env.JWT_EXPIRES_IN,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbName: process.env.DB_NAME,
  });
});

export default router;
