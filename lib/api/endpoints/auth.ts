/**
 * Authentication API endpoints
 */

import { apiClient } from "@/lib/api/client";
import {
  LoginInput,
  LoginResponse,
  RegisterInput,
  User,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/lib/types/auth";
import { ApiResponse } from "@/lib/types/common";

export const authApi = {
  /**
   * Register new user
   */
  register: async (input: RegisterInput): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/register",
      input,
    );
    return response.data!;
  },

  /**
   * Login user
   */
  login: async (input: LoginInput): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      input,
    );
    return response.data!;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (
    input: RefreshTokenInput,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >("/auth/refresh", input);
    return response.data!;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  /**
   * Get current user
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data!;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (
    input: ForgotPasswordInput,
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
      "/auth/forgot-password",
      input,
    );
    return response.data!;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    input: ResetPasswordInput,
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
      "/auth/reset-password",
      input,
    );
    return response.data!;
  },
};
