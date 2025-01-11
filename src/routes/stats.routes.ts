import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import {
  getPieChartStats,
  getRevenueLineChartStats,
  getStats,
} from '../controllers/stats.controller';

const router = express.Router();

router.get('/all', isAuthenticatedUser, getStats);
router.get('/pie-chart', isAuthenticatedUser, getPieChartStats);
router.get('/line-chart', isAuthenticatedUser, getRevenueLineChartStats);

export default router;
