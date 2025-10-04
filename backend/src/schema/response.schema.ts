import { z } from 'zod';

// Generic API response schema for the chat app
export const chatApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.string(),
});

// Example: You can extend this for specific data types if needed
// e.g.,
// import { userSchema } from './user.schema';
// export const userResponseSchema = chatApiResponseSchema.extend({
//   data: userSchema.optional(),
// });
