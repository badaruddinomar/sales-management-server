import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from '../controllers/category.controller';

const router = express.Router();

router.post('/create', isAuthenticatedUser, createCategory);
router.get('/all', isAuthenticatedUser, getAllCategories);
router.get('/single/:id', isAuthenticatedUser, getSingleCategory);
router.put('/update/:id', isAuthenticatedUser, updateCategory);

export default router;
