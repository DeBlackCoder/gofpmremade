/**
 * Core API client using native fetch with custom interceptors
 * Handles authentication, error normalization, and retry logic
 */

import {
  API_BASE_URL,
  COOKIE_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  HTTP_STATUS,
  RETRY_CONFIG,
} from "@/lib/constants/config";
import {
  ApiClientError,
  getErrorMessage,
  normalizeApiError,
  isRetryableError,
} from "@/lib/utils/errors";
import { localStorageUtil, cookieUtil } from "@/lib/utils/storage";
import { ApiResponse, ApiError } from "@/lib/types/common";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  retries?: number;
}

export class ApiClient {
  private baseUrl: string;
  private refreshTokenPromise: Promise<void> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get current access token from storage
   */
  private getAccessToken(): string | null {
    // Try cookie first (more secure)
    let token = cookieUtil.get(COOKIE_TOKEN_NAME);
    if (token) return token;

    // Fallback to localStorage (from Zustand persist)
    const authState = localStorageUtil.getJSON<{
      tokens?: { accessToken: string };
    }>("auth-store");
    return authState?.tokens?.accessToken || null;
  }

  /**
   * Get refresh token from storage
   */
  private getRefreshToken(): string | null {
    let token = cookieUtil.get(COOKIE_REFRESH_TOKEN_NAME);
    if (token) return token;

    const authState = localStorageUtil.getJSON<{
      tokens?: { refreshToken: string };
    }>("auth-store");
    return authState?.tokens?.refreshToken || null;
  }

  /**
   * Request interceptor - adds auth headers
   */
  private addAuthHeader(headers: HeadersInit = {}): HeadersInit {
    const token = this.getAccessToken();
    if (token) {
      // If headers is already a Headers object, modify it
      if (headers instanceof Headers) {
        headers.set("Authorization", `Bearer ${token}`);
        return headers;
      }

      // If it's an array or plain object, return a merged object
      const normalizedHeaders = Array.isArray(headers)
        ? Object.fromEntries(headers)
        : headers;

      return {
        ...normalizedHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
    return headers;
  }

  /**
   * Response interceptor - handles token refresh on 401
   */
  private async handleUnauthorized(request: Request): Promise<Response> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshTokenPromise) {
      await this.refreshTokenPromise;
      // Retry original request with new token
      return this.validateAndRetry(request);
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      // No refresh token, clear auth and reject
      this.clearAuth();
      throw new ApiClientError(
        "UNAUTHORIZED",
        "Session expired. Please login again.",
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    // Attempt refresh
    this.refreshTokenPromise = this.refreshAccessToken(refreshToken).finally(
      () => {
        this.refreshTokenPromise = null;
      },
    );

    try {
      await this.refreshTokenPromise;
      return this.validateAndRetry(request);
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(refreshToken: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new ApiClientError(
        "REFRESH_FAILED",
        "Failed to refresh token",
        response.status,
      );
    }

    const data = (await response.json()) as ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>;

    if (!data.data) {
      throw new ApiClientError("REFRESH_FAILED", "No tokens in response", 500);
    }

    // Update tokens in storage
    this.setTokens(data.data.accessToken, data.data.refreshToken);
  }

  /**
   * Retry request with fresh token
   */
  private async validateAndRetry(originalRequest: Request): Promise<Response> {
    const newRequest = new Request(originalRequest);
    this.addAuthHeader(newRequest.headers);
    return fetch(newRequest);
  }

  /**
   * Store tokens
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    // Store in cookies
    cookieUtil.set(COOKIE_TOKEN_NAME, accessToken);
    cookieUtil.set(COOKIE_REFRESH_TOKEN_NAME, refreshToken);

    // Also update localStorage for Zustand
    const authState = localStorageUtil.getJSON<any>("auth-store") || {};
    localStorageUtil.setJSON("auth-store", {
      ...authState,
      tokens: { accessToken, refreshToken },
    });
  }

  /**
   * Clear authentication
   */
  private clearAuth(): void {
    cookieUtil.remove(COOKIE_TOKEN_NAME);
    cookieUtil.remove(COOKIE_REFRESH_TOKEN_NAME);

    // dispatch logout event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:logout"));
    }
  }

  /**
   * Format response
   */
  private async formatResponse<T = unknown>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    return response.text() as Promise<T>;
  }

  /**
   * Main fetch method with interceptors and retry logic
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { retries = RETRY_CONFIG.attempts, body, ...fetchOptions } = options;

    let retryCount = 0;

    const executeRequest = async (): Promise<Response> => {
      try {
        const headers = this.addAuthHeader({
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        });

        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        // Handle 401 - token expired
        if (response.status === HTTP_STATUS.UNAUTHORIZED) {
          return this.handleUnauthorized(
            new Request(url, {
              ...fetchOptions,
              headers,
              body: body ? JSON.stringify(body) : undefined,
            }),
          );
        }

        return response;
      } catch (error) {
        if (retryCount < retries) {
          retryCount++;
          const delay = Math.min(
            RETRY_CONFIG.delay *
              Math.pow(RETRY_CONFIG.backoffMultiplier, retryCount - 1),
            RETRY_CONFIG.maxDelay,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return executeRequest();
        }
        throw error;
      }
    };

    let response: Response;
    try {
      response = await executeRequest();
    } catch (error) {
      throw new ApiClientError("NETWORK_ERROR", getErrorMessage(error), 0);
    }

    // Parse response
    const data = await this.formatResponse(response);

    // Handle error responses
    if (!response.ok) {
      const normalized = normalizeApiError(data, response.status);
      throw new ApiClientError(
        normalized.error.code,
        normalized.error.message,
        response.status,
        normalized.error.details,
      );
    }

    return data as T;
  }

  /**
   * GET request
   */
  get<T = unknown>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  /**
   * PUT request
   */
  put<T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  /**
   * PATCH request
   */
  patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  /**
   * DELETE request
   */
  delete<T = unknown>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
