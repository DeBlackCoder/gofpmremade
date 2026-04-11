import type { ApiResponse } from "@/lib/types/common";

/** Unwrap `{ success, data }` envelopes returned by the Church Platform API. */
export function unwrap<T>(res: ApiResponse<T>): T {
  if (!res.success || res.data === undefined) {
    throw new Error("Invalid API response envelope");
  }
  return res.data;
}
