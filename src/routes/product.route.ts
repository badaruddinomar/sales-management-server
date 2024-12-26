import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { createProductSchema } from '../validation/product.validation';
import {
  createProduct,
  deleteProduct,
  getSingleProduct,
} from '../controllers/product.controller';
import { isAuthenticatedUser } from '../middleware/authGuard';

const router = express.Router();

router.post(
  '/create',
  isAuthenticatedUser,
  validateRequest(createProductSchema),
  createProduct,
);
router.get('/single/:id', isAuthenticatedUser, getSingleProduct);
router.delete('/delete/:id', isAuthenticatedUser, deleteProduct);

export default router;
