import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(32, { message: 'Username must be at most 32 characters' })
    .trim()
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z
    .email({ message: 'Invalid email address' })
    .max(128, { message: 'Email must be at most 128 characters' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  avatarUrl: z.string().url().optional(),
  isOnline: z.boolean().optional(),
  lastSeen: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(32, { message: 'Username must be at most 32 characters' })
    .trim()
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z
    .email({ message: 'Invalid email address' })
    .max(128, { message: 'Email must be at most 128 characters' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(128, { message: 'Password must be at most 128 characters' }),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(32, { message: 'Username must be at most 32 characters' })
    .trim()
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  email: z
    .email({ message: 'Invalid email address' })
    .max(128, { message: 'Email must be at most 128 characters' })
    .trim()
    .toLowerCase()
    .optional(),
  avatarUrl: z.string().url().optional(),
});

export const loginSchema = z.object({
  email: z
    .email({ message: 'Invalid email address' })
    .trim()
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, { message: 'New password must be at least 6 characters' })
    .max(128, { message: 'New password must be at most 128 characters' }),
});

export type UserInput = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
