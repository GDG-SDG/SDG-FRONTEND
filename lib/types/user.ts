// 사용자 / 마이페이지 타입 — api-spec.md 기준

/** GET /users/mypage (내 정보) */
export interface Mypage {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmType: string;
  joinedAt: string;
}

/** GET /users/mypage/summary (대시보드 통계) */
export interface MypageSummary {
  totalDiagnosisCount: number;
  monthlyDiagnosisCount: number;
  treatmentCompletedCount: number;
}
