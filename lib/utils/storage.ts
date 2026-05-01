/**
 * Storage utilities for localStorage and cookies
 */

// @ts-expect-error — js-cookie has no bundled types in this setup
import Cookies from "js-cookie";

/**
 * Safe localStorage wrapper
 */
export const localStorageUtil = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error(`localStorage.getItem error for key "${key}":`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error(`localStorage.setItem error for key "${key}":`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`localStorage.removeItem error for key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.clear();
    } catch (error) {
      console.error("localStorage.clear error:", error);
    }
  },

  getJSON: <T = unknown>(key: string, fallback?: T): T | null => {
    try {
      const item = localStorageUtil.getItem(key);
      return item ? (JSON.parse(item) as T) : (fallback ?? null);
    } catch (error) {
      console.error(
        `localStorage.getJSON parse error for key "${key}":`,
        error,
      );
      return fallback ?? null;
    }
  },

  setJSON: <T = unknown>(key: string, value: T): void => {
    try {
      localStorageUtil.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `localStorage.setJSON stringify error for key "${key}":`,
        error,
      );
    }
  },
};

/**
 * Cookie utility wrapper
 */
export const cookieUtil = {
  get: (name: string): string | undefined => {
    try {
      return Cookies.get(name);
    } catch (error) {
      console.error(`Cookie.get error for name "${name}":`, error);
      return undefined;
    }
  },

  set: (
    name: string,
    value: string,
    options?: Cookies.CookieAttributes,
  ): void => {
    try {
      Cookies.set(name, value, {
        expires: 7,
        ...options,
      });
    } catch (error) {
      console.error(`Cookie.set error for name "${name}":`, error);
    }
  },

  remove: (name: string): void => {
    try {
      Cookies.remove(name);
    } catch (error) {
      console.error(`Cookie.remove error for name "${name}":`, error);
    }
  },

  getJSON: <T = unknown>(name: string, fallback?: T): T | null => {
    try {
      const value = cookieUtil.get(name);
      return value ? (JSON.parse(value) as T) : (fallback ?? null);
    } catch (error) {
      console.error(`Cookie.getJSON parse error for name "${name}":`, error);
      return fallback ?? null;
    }
  },

  setJSON: <T = unknown>(
    name: string,
    value: T,
    options?: Cookies.CookieAttributes,
  ): void => {
    try {
      cookieUtil.set(name, JSON.stringify(value), options);
    } catch (error) {
      console.error(
        `Cookie.setJSON stringify error for name "${name}":`,
        error,
      );
    }
  },
};
