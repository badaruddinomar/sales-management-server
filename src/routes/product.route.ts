import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { createProductSchema } from '../validation/product.validation';
import { createProduct } from '../controllers/product.controller';
import { isAuthenticatedUser } from '../middleware/authGuard';

const router = express.Router();

router.post(
  '/create',
  isAuthenticatedUser,
  validateRequest(createProductSchema),
  createProduct,
);

export default router;
