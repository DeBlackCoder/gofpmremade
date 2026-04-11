/**
 * Search — matches `/api/v1/search`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import { GlobalSearchResults } from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export const searchApi = {
  global: async (
    query: string,
    types: string = "sermons,events,posts",
    branch?: string,
  ): Promise<GlobalSearchResults> => {
    const params = new URLSearchParams({ q: query, type: types });
    if (branch) params.set("branch", branch);
    const res = await apiClient.get<ApiResponse<GlobalSearchResults>>(
      `/search?${params.toString()}`,
    );
    return unwrap(res);
  },
};
