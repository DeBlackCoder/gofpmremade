/**
 * Error handling and normalization utilities
 */

import { ApiErrorResponse, ApiError } from "@/lib/types/common";
import { HTTP_STATUS } from "@/lib/constants/config";

export class ApiClientError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Normalize fetch error response into consistent ApiErrorResponse
 */
export function normalizeApiError(
  error: unknown,
  status: number = 500,
): ApiErrorResponse {
  // If already normalized, return as-is
  if (isApiErrorResponse(error)) {
    return { ...error, status };
  }

  // Handle JSON response errors
  if (typeof error === "object" && error !== null && "error" in error) {
    const apiError = error as { error: ApiError["error"]; requestId?: string };
    return {
      success: false,
      error: apiError.error,
      requestId: apiError.requestId,
      status,
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: error,
      },
      status,
    };
  }

  // Default error
  return {
    success: false,
    error: {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred",
    },
    status,
  };
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    "status" in value &&
    typeof (value as Record<string, unknown>).error === "object" &&
    "code" in ((value as Record<string, unknown>).error as object) &&
    "message" in ((value as Record<string, unknown>).error as object)
  );
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "error" in error) {
    const apiError = error as { error: { message?: string } };
    return apiError.error.message || "Something went wrong";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) {
    return false;
  }

  // Retryable status codes
  const retryableStatuses = [408, 429, 502, 503, 504];
  return retryableStatuses.includes(error.status);
}

/**
 * Check if error is authentication-related
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    return error.status === HTTP_STATUS.UNAUTHORIZED;
  }
  return false;
}

/**
 * Check if error is validation error
 */
export function isValidationError(
  error: unknown,
): error is ApiClientError & { details: Record<string, string[]> } {
  if (error instanceof ApiClientError) {
    return (
      error.status === HTTP_STATUS.UNPROCESSABLE_ENTITY &&
      typeof error.details === "object"
    );
  }
  return false;
}
