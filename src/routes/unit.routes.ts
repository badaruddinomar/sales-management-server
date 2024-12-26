import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import {
  createUnit,
  deleteUnit,
  getAllUnits,
  getSingleUnit,
  updateUnit,
} from '../controllers/unit.controller';

const router = express.Router();

router.post('/create', isAuthenticatedUser, createUnit);
router.get('/all', isAuthenticatedUser, getAllUnits);
router.get('/single/:id', isAuthenticatedUser, getSingleUnit);
router.put('/update/:id', isAuthenticatedUser, updateUnit);
router.delete('/delete/:id', isAuthenticatedUser, deleteUnit);

export default router;
