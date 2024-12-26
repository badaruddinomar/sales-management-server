import express from 'express';
import validateRequest from '../middleware/validateRequest';
import {
  signinSchema,
  signupSchema,
  verificationCodeSchema,
} from '../validation/auth.validation';
import {
  signup,
  verifyEmail,
  signin,
  forgotPassword,
  resetPassword,
  logout,
  resendVerifyCode,
} from '../controllers/auth.controllers';
const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post(
  '/verify-email',
  validateRequest(verificationCodeSchema),
  verifyEmail,
);
router.post('/signin', validateRequest(signinSchema), signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.post('/resend-verify-code', resendVerifyCode);

export default router;
