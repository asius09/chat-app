import { z } from 'zod';

export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.date(),
  requestId: z.string().optional(),
});

export const paginatedResponseSchema = apiResponseSchema.extend({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().positive(),
    limit: z.number().positive(),
    total: z.number().nonnegative(),
    totalPages: z.number().nonnegative(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
  timestamp: z.date(),
  requestId: z.string().optional(),
});

// Legacy schema for backward compatibility
export const chatApiResponseSchema = apiResponseSchema;

export type ApiResponseInput<T = any> = z.infer<typeof apiResponseSchema> & { data?: T };
export type PaginatedResponseInput<T = any> = z.infer<typeof paginatedResponseSchema> & { data: T[] };
export type ErrorResponseInput = z.infer<typeof errorResponseSchema>;
export type ResponseInput<T = any> = ApiResponseInput<T>;
