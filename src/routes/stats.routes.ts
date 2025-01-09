import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import { getPieChartStats, getStats } from '../controllers/stats.controller';

const router = express.Router();

router.get('/all', isAuthenticatedUser, getStats);
router.get('/pie', isAuthenticatedUser, getPieChartStats);

export default router;
