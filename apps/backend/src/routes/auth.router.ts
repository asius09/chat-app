import { Router } from 'express';
import {
  signup,
  login,
  logout,
  changePassword,
  forgetPassword,
  refresh,
} from '@/controllers/auth.controller.js';
import { verifyUser } from '@/middlewares/verifyUser.middleware.js';

const router = Router();

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// Refresh Token (protected by verifyUser middleware)
router.post('/refresh', verifyUser, refresh);

// Logout
router.post('/logout', verifyUser, logout);

// Change Password (protected route)
router.post('/change-password', verifyUser, changePassword);

// Forget Password
router.post('/forget-password', forgetPassword);

export default router;
