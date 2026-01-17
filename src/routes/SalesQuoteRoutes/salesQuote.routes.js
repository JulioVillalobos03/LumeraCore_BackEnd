import * as SalesQuoteController from '../../controllers/SalesQuotesController/salesQuote.controller.js';
import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { companyMiddleware } from "../../middlewares/company.middleware.js";
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.patch(
  '/:quoteId/state',
  asyncHandler(SalesQuoteController.changeState)
);

export default router;