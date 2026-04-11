/**
 * Members API — matches `/api/v1/members`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import { MemberListResult, MemberProfile, PublicUser } from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export const membersApi = {
  listMembers: async (page: number = 1): Promise<MemberListResult> => {
    const res = await apiClient.get<ApiResponse<MemberListResult>>(
      `/members?page=${page}`,
    );
    return unwrap(res);
  },

  getProfile: async (): Promise<MemberProfile> => {
    const res = await apiClient.get<ApiResponse<MemberProfile>>("/members/me");
    return unwrap(res);
  },

  updateProfile: async (
    updates: Partial<Pick<MemberProfile, "fullName" | "phone">>,
  ): Promise<MemberProfile> => {
    const res = await apiClient.put<ApiResponse<MemberProfile>>(
      "/members/me",
      updates,
    );
    return unwrap(res);
  },

  getByBranch: async (branchId: string): Promise<{ data: PublicUser[] }> => {
    const res = await apiClient.get<ApiResponse<{ data: PublicUser[] }>>(
      `/members/branch/${branchId}`,
    );
    return unwrap(res);
  },

  getByMinistry: async (ministryId: string): Promise<{ data: PublicUser[] }> => {
    const res = await apiClient.get<ApiResponse<{ data: PublicUser[] }>>(
      `/members/ministry/${ministryId}`,
    );
    return unwrap(res);
  },
};
