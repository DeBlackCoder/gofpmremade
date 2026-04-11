/**
 * Giving API — matches `/api/v1/giving`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import {
  GivingRecord,
  InitiateGivingInput,
  InitiateGivingResult,
} from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export type GivingRecordWithMeta = GivingRecord & Record<string, unknown>;

export const givingApi = {
  initiateDonation: async (
    data: InitiateGivingInput,
  ): Promise<InitiateGivingResult> => {
    const res = await apiClient.post<ApiResponse<InitiateGivingResult>>(
      "/giving/initiate",
      data,
    );
    return unwrap(res);
  },

  verifyPayment: async (reference: string): Promise<GivingRecordWithMeta> => {
    const res = await apiClient.get<ApiResponse<GivingRecordWithMeta>>(
      `/giving/verify/${encodeURIComponent(reference)}`,
    );
    return unwrap(res);
  },

  /** Authenticated member history */
  getMyHistory: async (): Promise<{ data: GivingRecord[] }> => {
    const res = await apiClient.get<ApiResponse<{ data: GivingRecord[] }>>(
      "/giving/my-history",
    );
    return unwrap(res);
  },

  /** Admin list */
  listRecords: async (page: number = 1): Promise<{ data: GivingRecord[]; total: number }> => {
    const res = await apiClient.get<
      ApiResponse<{ data: GivingRecord[]; total: number }>
    >(`/giving?page=${page}`);
    return unwrap(res);
  },
};
