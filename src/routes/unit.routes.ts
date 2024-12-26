import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import { createUnit, getAllUnits } from '../controllers/unit.controller';

const router = express.Router();

router.post('/create', isAuthenticatedUser, createUnit);
router.get('/all', isAuthenticatedUser, getAllUnits);

export default router;
