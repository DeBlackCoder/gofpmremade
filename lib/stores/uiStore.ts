/**
 * UI Store using Zustand
 * Manages global UI state: toasts, modals, loading states, etc.
 * Client-side only, not persisted
 */

import { create } from "zustand";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: string;
  data?: unknown;
}

interface UiStore {
  // Toast management
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal management
  modals: Record<string, ModalState>;
  openModal: (type: string, data?: unknown) => void;
  closeModal: (type: string) => void;
  closeAllModals: () => void;

  // Global loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  // Toast state
  toasts: [],

  addToast: (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto-remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration || 3000);
    }

    return id;
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Modal state
  modals: {},

  openModal: (type: string, data?: unknown) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [type]: { isOpen: true, type, data },
      },
    }));
  },

  closeModal: (type: string) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [type]: { isOpen: false, type },
      },
    }));
  },

  closeAllModals: () => {
    set({ modals: {} });
  },

  // Loading state
  isLoading: false,

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
