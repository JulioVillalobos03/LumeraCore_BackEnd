import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

import * as InventoryController from "../../controllers/InventoryController/inventory.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

// Ver inventario
router.get(
  "/",
  requirePermission("inventory.read"),
  asyncHandler(InventoryController.list)
);

// Ajustar inventario
router.post(
  "/adjust",
  requirePermission("inventory.adjust"),
  asyncHandler(InventoryController.adjust)
);

// Ver movimientos
router.get(
  "/movements",
  requirePermission("inventory.movements.read"),
  asyncHandler(InventoryController.movements)
);

// Crear movimiento
router.post("/", asyncHandler(InventoryController.add));

// Ver stock actual
router.get("/stock/:productId", asyncHandler(InventoryController.stock));

// Historial de movimientos
router.get("/history/:productId", asyncHandler(InventoryController.history));

export default router;
