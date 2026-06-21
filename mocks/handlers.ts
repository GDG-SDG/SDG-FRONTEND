// MSW 핸들러 — api-spec.md 전 엔드포인트를 mock 응답으로 가로챔
// ⚠ 와일드카드(*/diagnoses)가 /calendar/diagnoses 까지 매칭하므로
//    더 구체적인 calendar 핸들러를 diagnoses 보다 먼저 배치한다.
import { http, HttpResponse } from "msw";
import type { Severity, TreatmentStatus } from "@/lib/types/common";
import type {
  DiagnoseResponse,
  TreatmentStatusUpdate,
} from "@/lib/types/diagnosis";
import type { ChatType } from "@/lib/types/chat";
import type {
  NotificationSettings,
  UpdateMypageRequest,
} from "@/lib/types/user";
import {
  MOCK_DIAGNOSIS_DETAILS,
  MOCK_DIAGNOSIS_LIST,
  MOCK_MONTHLY_STATS,
  MOCK_SIMILAR_CASES,
} from "@/lib/data/mock/diagnoses";
import {
  getMockCalendarByDate,
  getMockCalendarMonth,
} from "@/lib/data/mock/calendar";
import {
  MOCK_CHAT_SESSIONS,
  getMockAiReply,
  getMockMessages,
} from "@/lib/data/mock/chat";
import {
  MOCK_MYPAGE,
  MOCK_MYPAGE_SUMMARY,
  MOCK_NOTIFICATION_SETTINGS,
} from "@/lib/data/mock/user";
import { MOCK_CROPS } from "@/lib/data/mock/crop";
import {
  MOCK_LOGIN_RESPONSE,
  MOCK_SIGNUP_RESPONSE,
} from "@/lib/data/mock/auth";

export const handlers = [
  // ---- 인증 ----
  http.post("*/auth/signup", () => HttpResponse.json(MOCK_SIGNUP_RESPONSE)),
  http.post("*/auth/login", () => HttpResponse.json(MOCK_LOGIN_RESPONSE)),
  http.post("*/auth/logout", () => new HttpResponse(null, { status: 204 })),
  http.post("*/auth/refresh", () =>
    HttpResponse.json({ accessToken: MOCK_LOGIN_RESPONSE.accessToken }),
  ),

  // ---- 캘린더 (diagnoses 와일드카드보다 먼저) ----
  http.get("*/calendar/diagnoses/:date", ({ params }) =>
    HttpResponse.json(getMockCalendarByDate(String(params.date))),
  ),
  http.get("*/calendar/diagnoses", ({ request }) => {
    const url = new URL(request.url);
    const year = Number(url.searchParams.get("year"));
    const month = Number(url.searchParams.get("month"));
    return HttpResponse.json(getMockCalendarMonth(year, month));
  }),

  // ---- 진단 / 기록 / 통계 (구체 경로를 :id 보다 먼저) ----
  http.get("*/diagnoses/stats/monthly", () =>
    HttpResponse.json(MOCK_MONTHLY_STATS),
  ),
  http.get("*/diagnoses/:id/similar-cases", () =>
    HttpResponse.json(MOCK_SIMILAR_CASES),
  ),
  http.patch(
    "*/diagnoses/:id/treatment-status",
    async ({ params, request }) => {
      const id = Number(params.id);
      const { treatmentStatus } = (await request.json()) as {
        treatmentStatus: TreatmentStatus;
      };
      const detail = MOCK_DIAGNOSIS_DETAILS[id];
      if (detail) detail.treatmentStatus = treatmentStatus;
      const item = MOCK_DIAGNOSIS_LIST.find((d) => d.id === id);
      if (item) item.treatmentStatus = treatmentStatus;
      const res: TreatmentStatusUpdate = { id, treatmentStatus, updated: true };
      return HttpResponse.json(res);
    },
  ),
  http.get("*/diagnoses/:id", ({ params }) => {
    const detail = MOCK_DIAGNOSIS_DETAILS[Number(params.id)];
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
  // 이미지 진단 요청 — multipart 업로드를 받아 상세 전체를 반환.
  // 실제 백엔드는 POST 응답으로 상세(results[])를 그대로 주고 id는 UUID 문자열이다.
  http.post("*/diagnoses", () => {
    const detail = MOCK_DIAGNOSIS_DETAILS[101];
    const res: DiagnoseResponse = {
      id: String(detail.id),
      cropName: detail.cropName,
      imageUrl: detail.imageUrl,
      location: detail.location,
      severity: detail.severity,
      treatmentStatus: detail.treatmentStatus,
      diagnosedAt: detail.diagnosedAt,
      weather: detail.weather,
      results: detail.results.map((r) => ({
        id: String(r.id),
        diseaseName: r.diseaseName,
        diseaseNameKr: r.diseaseNameKr,
        confidence: r.confidence,
        severity: r.severity,
        description: r.description,
        lesionArea: r.lesionArea,
        rank: r.rank,
        treatmentSteps: r.treatmentSteps ?? [],
        source: r.source,
      })),
    };
    return HttpResponse.json(res, { status: 201 });
  }),
  http.get("*/diagnoses", ({ request }) => {
    const url = new URL(request.url);
    const severity = url.searchParams.get("severity") as Severity | null;
    const treatmentStatus = url.searchParams.get(
      "treatmentStatus",
    ) as TreatmentStatus | null;
    const page = Number(url.searchParams.get("page") ?? "0");
    const content = MOCK_DIAGNOSIS_LIST.filter((item) => {
      const sevOk = !severity || item.severity === severity;
      const statusOk =
        !treatmentStatus || item.treatmentStatus === treatmentStatus;
      return sevOk && statusOk;
    });
    return HttpResponse.json({
      content,
      page,
      size: content.length,
      totalElements: content.length,
    });
  }),

  // ---- 챗봇 ----
  http.get("*/chat/sessions/:id/messages", () =>
    HttpResponse.json(getMockMessages()),
  ),
  http.post("*/chat/sessions/:id/messages", async ({ request }) => {
    const { message } = (await request.json()) as { message: string };
    return HttpResponse.json(getMockAiReply(message));
  }),
  http.get("*/chat/sessions", () => HttpResponse.json(MOCK_CHAT_SESSIONS)),
  http.post("*/chat/sessions", async ({ request }) => {
    const body = (await request.json()) as {
      diagnosisId?: number | null;
      type: ChatType;
    };
    return HttpResponse.json({
      sessionId: `sess-${Date.now()}`,
      type: body.type,
      diagnosisId: body.diagnosisId ?? null,
      createdAt: new Date().toISOString(),
    });
  }),

  // ---- 사용자 (구체 경로 먼저) ----
  http.get("*/users/mypage/summary", () =>
    HttpResponse.json(MOCK_MYPAGE_SUMMARY),
  ),
  http.get("*/users/mypage", () => HttpResponse.json(MOCK_MYPAGE)),
  http.patch("*/users/mypage", async ({ request }) => {
    const body = (await request.json()) as UpdateMypageRequest;
    Object.assign(MOCK_MYPAGE, body);
    return HttpResponse.json({ id: MOCK_MYPAGE.id, updated: true });
  }),
  http.get("*/users/notification-settings", () =>
    HttpResponse.json(MOCK_NOTIFICATION_SETTINGS),
  ),
  http.patch("*/users/notification-settings", async ({ request }) => {
    const body = (await request.json()) as NotificationSettings;
    Object.assign(MOCK_NOTIFICATION_SETTINGS, body);
    return HttpResponse.json({ updated: true });
  }),
  http.patch("*/users/password", () => HttpResponse.json({ updated: true })),
  http.delete("*/users", () => HttpResponse.json({ deleted: true })),

  // ---- 작물 ----
  http.get("*/crops", () => HttpResponse.json(MOCK_CROPS)),
];
