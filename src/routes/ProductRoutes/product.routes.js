import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

import * as ProductController from "../../controllers/ProductController/product.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.post("/", requirePermission("products.create"), asyncHandler(ProductController.create));
router.get("/", requirePermission("products.read"), asyncHandler(ProductController.list));
router.get("/:id", requirePermission("products.read"), asyncHandler(ProductController.get));
router.put("/:id", requirePermission("products.update"), asyncHandler(ProductController.update));
router.patch("/:id/status", requirePermission("products.change_status"), asyncHandler(ProductController.changeStatus));

export default router;
