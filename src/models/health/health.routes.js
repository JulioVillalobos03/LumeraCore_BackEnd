import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { healthCheck } from './health.controller.js';

export const healthRoutes = Router();

healthRoutes.get('/', healthCheck);