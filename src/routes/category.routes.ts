import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import {
  createCategory,
  getAllCategories,
  getSingleCategory,
} from '../controllers/category.controller';

const router = express.Router();

router.post('/create', isAuthenticatedUser, createCategory);
router.get('/all', isAuthenticatedUser, getAllCategories);
router.get('/single/:id', isAuthenticatedUser, getSingleCategory);

export default router;
