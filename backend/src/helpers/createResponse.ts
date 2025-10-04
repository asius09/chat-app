import type { ChatApiResponse } from '../types/response.type.ts';

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
  }: {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }): ChatApiResponse<T | undefined> {
    return {
      success,
      message,
      ...(data !== undefined ? { data } : {}),
      ...(error !== undefined ? { error } : {}),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Predefined success response.
   */
  static ok<T>(data: T, message = 'Success'): ChatApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Predefined failure response.
   */
  static fail(
    message = 'Request failed',
    error: string = 'Error'
  ): ChatApiResponse<null> {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Predefined not found response.
   */
  static notFound(message = 'Resource not found'): ChatApiResponse<null> {
    return {
      success: false,
      message,
      error: 'Not Found',
      timestamp: new Date().toISOString(),
    };
  }
}
