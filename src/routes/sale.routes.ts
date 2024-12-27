import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import validateRequest from '../middleware/validateRequest';
import {
  createSaleSchema,
  updateSaleSchema,
} from '../validation/sale.validation';
import {
  createSale,
  deleteSale,
  getAllSales,
  getSingleSale,
  updateSale,
} from '../controllers/sale.controller';

const router = express.Router();

router.post(
  '/create',
  isAuthenticatedUser,
  validateRequest(createSaleSchema),
  createSale,
);

router.get('/all', isAuthenticatedUser, getAllSales);
router.get('/single/:id', isAuthenticatedUser, getSingleSale);
router.put(
  '/update/:id',
  isAuthenticatedUser,
  validateRequest(updateSaleSchema),
  updateSale,
);
router.delete('/delete/:id', isAuthenticatedUser, deleteSale);

export default router;
