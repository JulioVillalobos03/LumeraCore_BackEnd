import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

import * as QuoteController from "../../controllers/QuoteController/quote.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.post(
  "/",
  requirePermission("quotes.create"),
  asyncHandler(QuoteController.create)
);

router.get(
  "/",
  requirePermission("quotes.read"),
  asyncHandler(QuoteController.list)
);

router.get(
  "/:id",
  requirePermission("quotes.read"),
  asyncHandler(QuoteController.detail)
);

export default router;
