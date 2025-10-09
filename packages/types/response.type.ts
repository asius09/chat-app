export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
  requestId?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  code?: string;
  details?: any;
  timestamp: Date;
  requestId?: string;
}

export type ChatApiResponse<T> = ApiResponse<T>;
export type Response<T = any> = ApiResponse<T>;
