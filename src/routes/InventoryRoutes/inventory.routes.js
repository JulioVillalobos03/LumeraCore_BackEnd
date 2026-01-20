import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

import * as InventoryController from "../../controllers/InventoryController/inventory.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

// =========================
// INVENTORY LIST
// =========================
router.get(
  "/",
  requirePermission("inventory.read"),
  asyncHandler(InventoryController.list)
);

// =========================
// MOVEMENTS (ANTES DE :id)
// =========================
router.get(
  "/movements",
  requirePermission("inventory.movements.read"),
  asyncHandler(InventoryController.movements)
);

// =========================
// STOCK
// =========================
router.get(
  "/stock/:productId",
  asyncHandler(InventoryController.stock)
);

// =========================
// HISTORY BY PRODUCT
// =========================
router.get(
  "/history/:productId",
  asyncHandler(InventoryController.history)
);

// =========================
// INVENTORY BY ID (AL FINAL)
// =========================
router.get(
  "/:id",
  requirePermission("inventory.read"),
  asyncHandler(InventoryController.show)
);

// =========================
// ADJUST INVENTORY
// =========================
router.post(
  "/adjust",
  requirePermission("inventory.adjust"),
  asyncHandler(InventoryController.adjust)
);

// =========================
// ADD MOVEMENT
// =========================
router.post(
  "/",
  asyncHandler(InventoryController.add)
);

export default router;
