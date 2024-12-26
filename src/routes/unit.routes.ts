import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import {
  createUnit,
  getAllUnits,
  getSingleUnit,
} from '../controllers/unit.controller';

const router = express.Router();

router.post('/create', isAuthenticatedUser, createUnit);
router.get('/all', isAuthenticatedUser, getAllUnits);
router.get('/single/:id', isAuthenticatedUser, getSingleUnit);

export default router;
