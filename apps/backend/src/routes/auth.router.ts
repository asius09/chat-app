import { Router } from 'express';
import {
  signup,
  login,
  logout,
  changePassword,
  forgetPassword,
  refresh,
} from '../controllers/auth.controller';
import { verifyUser } from '../middlewares/verifyUser.middleware';
import { validate } from '../middlewares/validation.middleware';
import { z } from 'zod';

// Re-declare request validation schemas to match those in auth.controller.ts for router-level validation
const signupSchema = z.object({
  username: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const forgetPasswordSchema = z.object({
  email: z.string().email(),
});

const router = Router();

// Signup
router.post('/signup', validate(signupSchema), signup);

// Login
router.post('/login', validate(loginSchema), login);

// Refresh Token (stateless: for demo only)
router.post('/refresh', refresh);

// Logout (just a client-side token discard)
router.post('/logout', verifyUser, logout);

// Change Password (requires verified user)
router.post('/change-password', verifyUser, validate(changePasswordSchema), changePassword);

// Forget Password (stateless: just returns a message)
router.post('/forget-password', validate(forgetPasswordSchema), forgetPassword);

export default router;
