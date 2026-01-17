import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";

import * as SalesOrderItemController from "../../controllers/SalesOrderItemsController/salesOrderItem.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

// Crear item
router.post("/", asyncHandler(SalesOrderItemController.create));

// Listar items de una orden
router.get("/:salesOrderId", asyncHandler(SalesOrderItemController.list));

// Editar item
router.patch("/item/:itemId", asyncHandler(SalesOrderItemController.update));

// Eliminar item
router.delete("/item/:itemId", asyncHandler(SalesOrderItemController.remove));

export default router;
