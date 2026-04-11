/**
 * Admin — matches `/api/v1/admin/*`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import type { ApiResponse } from "@/lib/types/common";
import type {
  ContactSubmission,
  GivingRecord,
  PublicUser,
} from "@/lib/types/resources";

export interface DashboardStats {
  members: number;
  events: number;
  sermons: number;
  givingTotal: number;
  givingRecords: number;
  openPrayers: number;
  // UI aliases
  totalMembers?: number;
  totalEvents?: number;
  totalSermons?: number;
  monthlyGiving?: number;
}

export interface AdminMembersPayload {
  data: PublicUser[];
  total: number;
  page: number;
  limit: number;
}

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard",
    );
    return unwrap(res);
  },

  listMembers: async (
    page: number = 1,
    limit: number = 25,
    status?: string,
  ): Promise<AdminMembersPayload> => {
    const q = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) q.set("status", status);
    const res = await apiClient.get<ApiResponse<AdminMembersPayload>>(
      `/admin/members?${q.toString()}`,
    );
    return unwrap(res);
  },

  listGiving: async (
    page: number = 1,
    limit: number = 25,
  ): Promise<{ data: GivingRecord[]; total: number }> => {
    const res = await apiClient.get<
      ApiResponse<{ data: GivingRecord[]; total: number }>
    >(`/admin/giving?page=${page}&limit=${limit}`);
    return unwrap(res);
  },

  givingSummary: async (): Promise<unknown> => {
    const res = await apiClient.get<ApiResponse<unknown>>(
      "/admin/giving/summary",
    );
    return unwrap(res);
  },

  listPrayerRequests: async (
    page: number = 1,
    limit: number = 25,
  ): Promise<{ data: ContactSubmission[]; total: number }> => {
    const res = await apiClient.get<
      ApiResponse<{ data: ContactSubmission[]; total: number }>
    >(`/admin/prayer-requests?page=${page}&limit=${limit}`);
    return unwrap(res);
  },

  updatePrayerStatus: async (
    id: string,
    status: string,
  ): Promise<ContactSubmission> => {
    const res = await apiClient.put<ApiResponse<ContactSubmission>>(
      `/admin/prayer-requests/${id}`,
      { status },
    );
    return unwrap(res);
  },
};
