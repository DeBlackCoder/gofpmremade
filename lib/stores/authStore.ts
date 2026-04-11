/**
 * Authentication store using Zustand + localStorage persistence
 * Handles user state, tokens, and auth logic
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cookieUtil, localStorageUtil } from "@/lib/utils/storage";
import { authApi } from "@/lib/api/endpoints/auth";
import {
  COOKIE_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
} from "@/lib/constants/config";
import type {
  AuthState,
  User,
  LoginInput,
  RegisterInput,
} from "@/lib/types/auth";

interface AuthStore extends AuthState {
  // Actions
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  hasRole: (role: string | string[]) => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (input: LoginInput) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.login(input);
          set({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Also store in cookies
          cookieUtil.set(COOKIE_TOKEN_NAME, result.accessToken);
          cookieUtil.set(COOKIE_REFRESH_TOKEN_NAME, result.refreshToken);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Login failed",
          });
          throw error;
        }
      },

      register: async (input: RegisterInput) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.register(input);
          set({
            user,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Registration failed",
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Clear cookies
          cookieUtil.remove(COOKIE_TOKEN_NAME);
          cookieUtil.remove(COOKIE_REFRESH_TOKEN_NAME);
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const result = await authApi.refreshToken({ refreshToken });
          set({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          });

          // Update cookies
          cookieUtil.set(COOKIE_TOKEN_NAME, result.accessToken);
          cookieUtil.set(COOKIE_REFRESH_TOKEN_NAME, result.refreshToken);
        } catch (error: any) {
          set({ error: error.message });
          get().clearAuth();
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
        cookieUtil.set(COOKIE_TOKEN_NAME, accessToken);
        cookieUtil.set(COOKIE_REFRESH_TOKEN_NAME, refreshToken);
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        cookieUtil.remove(COOKIE_TOKEN_NAME);
        cookieUtil.remove(COOKIE_REFRESH_TOKEN_NAME);
      },

      hasRole: (role: string | string[]) => {
        const { user } = get();
        if (!user) return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(user.role);
      },

      isAdmin: () => {
        return get().hasRole(["ADMIN", "PASTOR"]);
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Listen for logout events from API client
if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => {
    useAuthStore.getState().clearAuth();
  });
}
