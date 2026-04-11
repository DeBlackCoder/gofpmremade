/**
 * Ministries (CommunityGroup) — matches `/api/v1/ministries`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import { MinistryGroup, MinistryListResult } from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export const ministriesApi = {
  list: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<MinistryListResult> => {
    const res = await apiClient.get<ApiResponse<MinistryListResult>>(
      `/ministries?page=${page}&limit=${limit}`,
    );
    return unwrap(res);
  },

  getById: async (id: string): Promise<MinistryGroup> => {
    const res = await apiClient.get<ApiResponse<MinistryGroup>>(
      `/ministries/${id}`,
    );
    return unwrap(res);
  },

  create: async (data: Partial<MinistryGroup>): Promise<MinistryGroup> => {
    const res = await apiClient.post<ApiResponse<MinistryGroup>>(
      "/ministries",
      data,
    );
    return unwrap(res);
  },

  update: async (
    id: string,
    data: Partial<MinistryGroup>,
  ): Promise<MinistryGroup> => {
    const res = await apiClient.put<ApiResponse<MinistryGroup>>(
      `/ministries/${id}`,
      data,
    );
    return unwrap(res);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/ministries/${id}`);
  },
};
