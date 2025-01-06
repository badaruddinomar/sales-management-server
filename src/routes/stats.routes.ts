import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import { getStats } from '../controllers/stats.controller';

const router = express.Router();

router.get('/all', isAuthenticatedUser, getStats);

export default router;
