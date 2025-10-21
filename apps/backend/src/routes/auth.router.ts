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
import { z } from 'zod';

const router = Router();

// Simple Zod validation middleware
function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: result.error.errors.map((e) => e.message).join('; '),
        timestamp: new Date(),
      });
    }
    req.body = result.data;
    next();
  };
}

// Lightweight in-memory rate limiter (per IP + route)
const windowMs = 60_000; // 1 minute
const maxRequests = 20; // per window per route per IP
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit() {
  return (req: any, res: any, next: any) => {
    const ip = (req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString();
    const key = `${ip}:${req.method}:${req.originalUrl}`;
    const now = Date.now();
    const entry = buckets.get(key);

    if (!entry || now > entry.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        message: 'Too many requests',
        error: 'Rate limit exceeded',
        timestamp: new Date(),
      });
    }

    entry.count += 1;
    buckets.set(key, entry);
    next();
  };
}

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const refreshSchema = z
  .object({
    refreshToken: z.string().min(10, 'Refresh token required'),
  })
  .partial(); // allow empty to support header-based refresh token

const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Signup
router.post('/signup', rateLimit(), signup);

// Login
router.post('/login', rateLimit(), validate(loginSchema), login);

// Refresh Token (no verifyUser — client may not have a valid access token here)
router.post('/refresh', rateLimit(), validate(refreshSchema), refresh);

// Logout
router.post('/logout', verifyUser, logout);

// Change Password (protected route)
router.post(
  '/change-password',
  verifyUser,
  validate(changePasswordSchema),
  changePassword
);

// Forget Password
router.post('/forget-password', rateLimit(), validate(forgetPasswordSchema), forgetPassword);

export default router;
