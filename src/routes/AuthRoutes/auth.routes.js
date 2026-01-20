import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { context, login } from "../../controllers/AuthController/auth.controller.js";
import { register } from "../../controllers/AuthController/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));

router.get("/context", authMiddleware, asyncHandler(context));

export default router;