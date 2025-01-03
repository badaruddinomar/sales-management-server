import express from 'express';
import validateRequest from '../middleware/validateRequest';
import {
  createProductSchema,
  updateProductSchema,
} from '../validation/product.validation';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from '../controllers/product.controller';
import { isAuthenticatedUser } from '../middleware/authGuard';

const router = express.Router();

router.post(
  '/create',
  isAuthenticatedUser,
  validateRequest(createProductSchema),
  createProduct,
);
router.get('/all', isAuthenticatedUser, getAllProducts);
router.get('/single/:id', isAuthenticatedUser, getSingleProduct);
router.put(
  '/update/:id',
  isAuthenticatedUser,
  validateRequest(updateProductSchema),
  updateProduct,
);
router.delete('/delete/:id', isAuthenticatedUser, deleteProduct);

export default router;
