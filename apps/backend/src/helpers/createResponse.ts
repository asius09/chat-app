import type { ApiResponse, ErrorResponse } from '@chat-app/types';
import { createSuccessResponse, createErrorResponse, generateRequestId } from '@chat-app/utils';

/**
 * Class to create standardized API responses with some predefined helpers.
 */
export class ResponseBuilder {
  /**
   * Generic response creator.
   */
  static create<T>({
    success,
    message,
    data,
    error,
    requestId,
  }: {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    requestId?: string;
  }): ApiResponse<T | undefined> {
    if (success) {
      return createSuccessResponse(data as T, message, requestId);
    } else {
      return createErrorResponse(message, error || 'Unknown error', undefined, undefined, requestId);
    }
  }

  /**
   * Predefined success response.
   */
  static ok<T>(data: T, message = 'Success', requestId?: string): ApiResponse<T> {
    return createSuccessResponse(data, message, requestId);
  }

  /**
   * Predefined failure response.
   */
  static fail(
    message = 'Request failed',
    error: string = 'Error',
    code?: string,
    details?: any,
    requestId?: string
  ): ErrorResponse {
    return createErrorResponse(message, error, code, details, requestId);
  }

  /**
   * Predefined not found response.
   */
  static notFound(message = 'Resource not found', requestId?: string): ErrorResponse {
    return createErrorResponse(message, 'Not Found', 'NOT_FOUND', undefined, requestId);
  }

  /**
   * Predefined validation error response.
   */
  static validationError(
    message = 'Validation failed',
    details?: any,
    requestId?: string
  ): ErrorResponse {
    return createErrorResponse(message, 'Validation Error', 'VALIDATION_ERROR', details, requestId);
  }

  /**
   * Predefined unauthorized response.
   */
  static unauthorized(message = 'Unauthorized', requestId?: string): ErrorResponse {
    return createErrorResponse(message, 'Unauthorized', 'UNAUTHORIZED', undefined, requestId);
  }

  /**
   * Predefined forbidden response.
   */
  static forbidden(message = 'Forbidden', requestId?: string): ErrorResponse {
    return createErrorResponse(message, 'Forbidden', 'FORBIDDEN', undefined, requestId);
  }
}
