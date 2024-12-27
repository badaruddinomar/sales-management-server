import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import validateRequest from '../middleware/validateRequest';
import { createSaleSchema } from '../validation/sale.validation';
import { createSale } from '../controllers/sale.controller';

const router = express.Router();

router.post(
  '/create',
  isAuthenticatedUser,
  validateRequest(createSaleSchema),
  createSale,
);

export default router;
