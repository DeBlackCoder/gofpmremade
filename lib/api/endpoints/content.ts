/**
 * Content / posts — backend stores posts as `ContactSubmission` rows
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import type { ContactSubmission } from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export type ContentListPayload = { data: ContactSubmission[]; total: number };

export const contentApi = {
  listContent: async (
    page: number = 1,
    type?: string,
  ): Promise<ContentListPayload> => {
    const q = type
      ? `?page=${page}&type=${encodeURIComponent(type)}`
      : `?page=${page}`;
    const res = await apiClient.get<ApiResponse<ContentListPayload>>(
      `/content${q}`,
    );
    return unwrap(res);
  },

  getById: async (id: string): Promise<ContactSubmission> => {
    const res = await apiClient.get<ApiResponse<ContactSubmission>>(
      `/content/${id}`,
    );
    return unwrap(res);
  },

  searchContent: async (query: string): Promise<{ data: ContactSubmission[] }> => {
    const res = await apiClient.get<ApiResponse<{ data: ContactSubmission[] }>>(
      `/content/search?q=${encodeURIComponent(query)}`,
    );
    return unwrap(res);
  },

  createContent: async (data: Record<string, unknown>): Promise<ContactSubmission> => {
    const res = await apiClient.post<ApiResponse<ContactSubmission>>(
      "/content",
      data,
    );
    return unwrap(res);
  },

  updateContent: async (
    id: string,
    data: Record<string, unknown>,
  ): Promise<ContactSubmission> => {
    const res = await apiClient.put<ApiResponse<ContactSubmission>>(
      `/content/${id}`,
      data,
    );
    return unwrap(res);
  },

  deleteContent: async (id: string): Promise<void> => {
    await apiClient.delete(`/content/${id}`);
  },

  getDevotion: (page?: number) => contentApi.listContent(page, "devotion"),
  getBlogPosts: (page?: number) => contentApi.listContent(page, "blog"),
  getAnnouncements: (page?: number) =>
    contentApi.listContent(page, "announcement"),
};
