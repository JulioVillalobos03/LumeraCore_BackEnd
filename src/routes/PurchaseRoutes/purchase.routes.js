import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import * as PurchaseController from "../../controllers/PurchaseController/purchase.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

// Crear orden de compra
router.post(
  "/",
  requirePermission("purchases.create"),
  asyncHandler(PurchaseController.create)
);

// Recibir compra (aplica inventario)
router.post(
  "/:id/receive",
  requirePermission("purchases.receive"),
  asyncHandler(PurchaseController.receive)
);

export default router;
