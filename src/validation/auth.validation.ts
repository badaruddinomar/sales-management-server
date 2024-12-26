import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
export type SignupSchema = z.infer<typeof signupSchema>;

export const verificationCodeSchema = z.object({
  verificationCode: z
    .string()
    .min(6, 'Verification code must be 6 characters long')
    .max(6, 'Verification code must be 6 characters long')
    .regex(/^\d+$/, 'Verification code must be numeric'),
});
export type VerificationCodeSchema = z.infer<typeof verificationCodeSchema>;

export const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
export type SigninSchema = z.infer<typeof signinSchema>;
