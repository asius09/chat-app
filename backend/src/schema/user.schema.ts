import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(32, { message: 'Username must be at most 32 characters' })
    .trim(),
  email: z
    .email({ message: 'Invalid email address' })
    .max(128, { message: 'Email must be at most 128 characters' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  avatarUrl: z.string().optional(),
  isOnline: z.boolean().optional(),
  lastSeen: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
