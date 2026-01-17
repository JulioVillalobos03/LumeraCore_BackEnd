import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

import {
  assign,
  list,
  changeStatus,
} from "../../controllers/CompanyUserController/companyUser.controller.js";

const router = Router();

// todo protegido
router.use(authMiddleware);

// asignar usuario
router.post("/", asyncHandler(assign));

// listar usuarios de empresa
router.get("/:companyId", asyncHandler(list));

// activar / desactivar
router.patch("/:id/status", asyncHandler(changeStatus));

export default router;
