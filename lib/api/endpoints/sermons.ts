/**
 * Sermons API — matches `/api/v1/sermons`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import { Sermon, SermonListResult, SermonSearchResult } from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export const sermonsApi = {
  listSermons: async (page: number = 1): Promise<SermonListResult> => {
    const res = await apiClient.get<ApiResponse<SermonListResult>>(
      `/sermons?page=${page}`,
    );
    return unwrap(res);
  },

  getSermon: async (id: string): Promise<Sermon> => {
    const res = await apiClient.get<ApiResponse<Sermon>>(`/sermons/${id}`);
    return unwrap(res);
  },

  searchSermons: async (
    query: string,
    page: number = 1,
  ): Promise<SermonSearchResult> => {
    const res = await apiClient.get<ApiResponse<SermonSearchResult>>(
      `/sermons/search?q=${encodeURIComponent(query)}&page=${page}`,
    );
    return unwrap(res);
  },

  getBySeriesId: async (
    seriesId: string,
    page: number = 1,
  ): Promise<SermonListResult> => {
    const res = await apiClient.get<ApiResponse<SermonListResult>>(
      `/sermons?page=${page}&seriesId=${encodeURIComponent(seriesId)}`,
    );
    return unwrap(res);
  },
};
