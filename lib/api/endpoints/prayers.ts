/**
 * Prayer & testimonies — matches `/api/v1/prayer/*`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import {
  ContactSubmission,
  PrayerRequestInput,
  PrayerRequestListResult,
  TestimonyInput,
} from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export const prayerApi = {
  listPrayerRequests: async (
    page: number = 1,
  ): Promise<PrayerRequestListResult> => {
    const res = await apiClient.get<ApiResponse<PrayerRequestListResult>>(
      `/prayer/requests?page=${page}`,
    );
    return unwrap(res);
  },

  submitPrayerRequest: async (
    input: PrayerRequestInput,
  ): Promise<ContactSubmission> => {
    const res = await apiClient.post<ApiResponse<ContactSubmission>>(
      "/prayer/requests",
      input,
    );
    return unwrap(res);
  },

  submitTestimony: async (input: TestimonyInput): Promise<ContactSubmission> => {
    const res = await apiClient.post<ApiResponse<ContactSubmission>>(
      "/prayer/testimonies",
      input,
    );
    return unwrap(res);
  },

  getTestimonies: async (): Promise<{ data: ContactSubmission[] }> => {
    const res = await apiClient.get<ApiResponse<{ data: ContactSubmission[] }>>(
      "/prayer/testimonies",
    );
    return unwrap(res);
  },
};
