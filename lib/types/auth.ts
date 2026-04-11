/**
 * Authentication types - Matches backend User model
 */

export enum UserRole {
  ADMIN = "ADMIN",
  PASTOR = "PASTOR",
  MEMBER = "MEMBER",
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  name?: string | null; // UI helper alias
  phone?: string | null;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
