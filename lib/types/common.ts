// API 공통 타입 — api-spec.md 기준

export type Severity = "경미" | "보통" | "심각";

export type TreatmentStatus = "방제 필요" | "방제 완료";

export interface Weather {
  temperature: number;
  humidity: number;
  precipitation: number;
}

export interface LesionArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Spring Boot 페이징 응답 (GET /diagnoses 등) */
export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}

/** GET /crops */
export interface Crop {
  id: number;
  name: string;
}
