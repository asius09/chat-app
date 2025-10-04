import type { Request, Response, NextFunction } from 'express';
import type { ChatApiResponse } from '../types/response.type.ts';
import { ZodError } from 'zod';
import { ResponseBuilder } from '@/helpers/createResponse.js';

// Centralized error handler middleware with error formatter
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response<ChatApiResponse<null>>,
  next: NextFunction
) {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let error: string = 'An unexpected error occurred.';

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    // Format Zod errors as a single string
    error = err.issues
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');
  }
  // Handle Mongoose validation errors
  else if (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    (err as any).name === 'ValidationError'
  ) {
    statusCode = 400;
    message = 'Validation Error';
    error = (err as any).message ?? 'Validation failed';
  }
  // Handle duplicate key errors (e.g., MongoDB)
  else if (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    (err as any).name === 'MongoError' &&
    (err as any).code === 11000
  ) {
    statusCode = 409;
    message = 'Duplicate key error';
    error = 'Resource already exists.';
  }
  // Handle invalid ObjectId errors (e.g., Mongoose CastError)
  else if (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    (err as any).name === 'CastError'
  ) {
    statusCode = 400;
    message = 'Invalid ID format';
    error = (err as any).message ?? 'Invalid ID format';
  }
  // Custom error with status and message
  else if (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'message' in err
  ) {
    statusCode = (err as any).status ?? 500;
    message = (err as any).message ?? 'Error';
    error = (err as any).error ?? message;
  }
  // String error
  else if (typeof err === 'string') {
    message = err;
    error = err;
  }
  // Standard JS Error
  else if (err instanceof Error) {
    error = err.message;
    message = err.message;
  }

  res.status(statusCode).json(ResponseBuilder.fail(message, error));
}
