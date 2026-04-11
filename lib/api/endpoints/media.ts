/**
 * Media — matches `/api/v1/media/*`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import type { ApiResponse } from "@/lib/types/common";

export interface PresignResult {
  url: string;
  key: string;
  [key: string]: unknown;
}

export const mediaApi = {
  presign: async (filename: string, mimeType: string): Promise<PresignResult> => {
    const q = new URLSearchParams({
      filename,
      type: mimeType,
    });
    const res = await apiClient.get<ApiResponse<PresignResult>>(
      `/media/presign?${q.toString()}`,
    );
    return unwrap(res);
  },

  list: async (type?: string): Promise<{ data: unknown[] }> => {
    const q = type ? `?type=${encodeURIComponent(type)}` : "";
    const res = await apiClient.get<ApiResponse<{ data: unknown[] }>>(
      `/media${q}`,
    );
    return unwrap(res);
  },
};
