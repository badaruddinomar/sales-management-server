import express from 'express';
import { isAuthenticatedUser } from '../middleware/authGuard';
import { getProfile } from '../controllers/user.controllers';

const router = express.Router();

router.get('/profile', isAuthenticatedUser, getProfile);

export default router;
