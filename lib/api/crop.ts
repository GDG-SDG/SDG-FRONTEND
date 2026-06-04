// 작물 API — api-spec.md 기준
import { apiFetch, USE_MOCK } from "./client";
import type { Crop } from "@/lib/types/common";
import { MOCK_CROPS } from "@/lib/data/mock/crop";

/** GET /crops — 작물 목록 */
export async function getCrops(): Promise<Crop[]> {
  if (USE_MOCK) return MOCK_CROPS;
  return apiFetch<Crop[]>("/crops");
}
