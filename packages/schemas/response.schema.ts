import { z } from 'zod';

// Generic API response schema for the chat app
export const chatApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.string(),
});
