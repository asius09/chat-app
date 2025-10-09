import type { ApiResponse, ErrorResponse } from '@chat-app/types';

/**
 * Creates a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Success',
  requestId?: string
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date(),
    requestId,
  };
}

/**
 * Creates an error API response
 */
export function createErrorResponse(
  message: string,
  error: string,
  code?: string,
  details?: any,
  requestId?: string
): ErrorResponse {
  return {
    success: false,
    message,
    error,
    code,
    details,
    timestamp: new Date(),
    requestId,
  };
}

/**
 * Creates a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success',
  requestId?: string
) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date(),
    requestId,
  };
}

/**
 * Generates a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
