import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import validateRequest from '../middleware/validateRequest';
import { createSaleSchema } from '../validation/sale.validation';
import { createSale, getAllSales } from '../controllers/sale.controller';

const router = express.Router();

router.post(
  '/create',
  isAuthenticatedUser,
  validateRequest(createSaleSchema),
  createSale,
);

router.get('/all', isAuthenticatedUser, getAllSales);

export default router;
