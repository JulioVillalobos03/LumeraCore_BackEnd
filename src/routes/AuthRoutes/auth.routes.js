import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { login } from "../../controllers/AuthController/auth.controller.js";
import { register } from "../../controllers/AuthController/user.controller.js";

const router = Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));

export default router;