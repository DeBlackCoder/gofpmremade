/**
 * Notifications — matches `/api/v1/notifications/*`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import type { ApiResponse } from "@/lib/types/common";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  list: async (): Promise<{ data: AppNotification[] }> => {
    const res = await apiClient.get<ApiResponse<{ data: AppNotification[] }>>(
      "/notifications/me",
    );
    return unwrap(res);
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/me/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/me/read-all");
  },

  broadcast: async (payload: {
    title: string;
    message: string;
    type?: string;
  }): Promise<unknown> => {
    const res = await apiClient.post<ApiResponse<unknown>>(
      "/notifications/broadcast",
      payload,
    );
    return unwrap(res);
  },
};
