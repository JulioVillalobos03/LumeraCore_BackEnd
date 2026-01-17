import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { companyMiddleware } from '../../middlewares/company.middleware.js';
import * as SalesOrderController from '../../controllers/SalesOrdersController/salesOrder.controller.js';

const router = Router();

router.use(authMiddleware);
router.use(companyMiddleware);

router.post('/', asyncHandler(SalesOrderController.create));
router.get('/', asyncHandler(SalesOrderController.list));
router.patch('/:orderId/state', asyncHandler(SalesOrderController.changeState));

export default router;
