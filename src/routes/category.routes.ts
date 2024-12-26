import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import { createCategory } from '../controllers/category.controller';

const router = express.Router();

router.post('/create', isAuthenticatedUser, createCategory);

export default router;
