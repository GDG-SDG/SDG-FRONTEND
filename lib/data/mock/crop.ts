// API 응답 형태(api-spec.md)에 맞춘 작물 목록 mock
import type { Crop } from "@/lib/types/common";

/** GET /crops */
export const MOCK_CROPS: Crop[] = [
  { id: 1, name: "고추" },
  { id: 2, name: "토마토" },
  { id: 3, name: "딸기" },
  { id: 4, name: "오이" },
  { id: 5, name: "감자" },
  { id: 6, name: "배추" },
  { id: 7, name: "상추" },
  { id: 8, name: "파프리카" },
  { id: 9, name: "가지" },
  { id: 10, name: "수박" },
];
