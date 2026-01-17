import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

import * as ClientController from "../../controllers/ClientController/client.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.post("/", requirePermission("clients.create"), asyncHandler(ClientController.create));
router.get("/", requirePermission("clients.read"), asyncHandler(ClientController.list));
router.get("/:id", requirePermission("clients.read"), asyncHandler(ClientController.get));
router.put("/:id", requirePermission("clients.update"), asyncHandler(ClientController.update));
router.patch("/:id/status", requirePermission("clients.change_status"), asyncHandler(ClientController.changeStatus));

export default router;
