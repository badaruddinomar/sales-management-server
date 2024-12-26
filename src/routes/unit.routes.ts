import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import { createUnit } from '../controllers/unit.controller';

const router = express.Router();

router.post('/create', isAuthenticatedUser, createUnit);

export default router;
