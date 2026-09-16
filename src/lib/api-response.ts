/**
 * Standardized API response wrapper
 * All endpoints should wrap responses in this format
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, unknown>;
}

export function successResponse<T>(
  data: T,
  pagination?: { page: number; limit: number; total: number; totalPages: number },
  meta?: Record<string, unknown>
): ApiResponse<T> {
  return {
    data,
    ...(pagination && { pagination }),
    ...(meta && { meta }),
  };
}

export function errorResponse(
  error: string,
  details?: unknown
): ApiResponse<never> {
  const response: ApiResponse<never> = { error };
  if (details) response.details = details as any;
  return response;
}
