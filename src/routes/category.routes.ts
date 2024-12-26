import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import {
  createCategory,
  getAllCategories,
} from '../controllers/category.controller';

const router = express.Router();

router.post('/create', isAuthenticatedUser, createCategory);
router.get('/all', isAuthenticatedUser, getAllCategories);

export default router;
