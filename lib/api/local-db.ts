/**
 * Local JSON file database utility
 * Reads and writes data from the data/ directory
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export function readData<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return [] as unknown as T;
  }
}

export function writeData<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function successResponse<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ success: false, error: { code: "ERROR", message } }, { status });
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number = 20,
) {
  const total = data.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = data.slice(start, start + limit);
  return Response.json({
    success: true,
    data: { data: paged, total, page, limit, pages, pagination: { total, page, limit, pages } },
  });
}
