// 작물 API — api-spec.md 기준 (mock은 MSW 핸들러가 처리)
import { apiFetch } from "./client";
import type { Crop } from "@/lib/types/common";

/** GET /crops — 작물 목록 */
export async function getCrops(): Promise<Crop[]> {
  return apiFetch<Crop[]>("/crops");
}
