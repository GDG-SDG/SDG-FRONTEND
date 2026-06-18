// 챗봇 API — api-spec.md 기준 (mock은 MSW 핸들러가 처리)
import { apiFetch, buildQuery } from "./client";
import type {
  ChatMessage,
  ChatSession,
  ChatType,
  CreateSessionResponse,
} from "@/lib/types/chat";

/**
 * 서버 원본 메시지 DTO — 프론트 ChatMessage와 계약이 다르다.
 * - role: 백엔드는 "assistant", mock은 "ai" → "user" 외에는 모두 "ai"로 정규화
 * - 시간: 백엔드는 createdAt(ISO), mock은 timestamp(HH:MM) → timestamp로 통일
 */
interface RawChatMessage {
  id: string;
  role: string;
  text: string;
  verified?: boolean;
  source?: string | null;
  timestamp?: string;
  createdAt?: string | null;
}

const formatTime = (iso?: string | null): string => {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const toChatMessage = (raw: RawChatMessage): ChatMessage => ({
  id: raw.id,
  role: raw.role === "user" ? "user" : "ai",
  text: raw.text,
  verified: raw.verified,
  source: raw.source ?? undefined,
  timestamp: raw.timestamp ?? formatTime(raw.createdAt),
});

/** GET /chat/sessions — 세션 목록 */
export async function getChatSessions(): Promise<ChatSession[]> {
  return apiFetch<ChatSession[]>("/chat/sessions");
}

/** POST /chat/sessions — 세션 생성 */
export async function createChatSession(params: {
  diagnosisId?: number | null;
  type: ChatType;
}): Promise<CreateSessionResponse> {
  return apiFetch<CreateSessionResponse>("/chat/sessions", {
    method: "POST",
    body: params,
  });
}

/** GET /chat/sessions/{id}/messages — 채팅 이력 */
export async function getChatMessages(
  sessionId: string,
  diagnosisId?: number,
): Promise<ChatMessage[]> {
  const raw = await apiFetch<RawChatMessage[]>(
    `/chat/sessions/${sessionId}/messages${buildQuery({ diagnosisId })}`,
  );
  return raw.map(toChatMessage);
}

/** POST /chat/sessions/{id}/messages — 메시지 전송 (AI 응답 반환) */
export async function sendChatMessage(params: {
  sessionId: string;
  diagnosisId?: number | null;
  message: string;
}): Promise<ChatMessage> {
  const raw = await apiFetch<RawChatMessage>(
    `/chat/sessions/${params.sessionId}/messages`,
    {
      method: "POST",
      body: { diagnosisId: params.diagnosisId, message: params.message },
    },
  );
  return toChatMessage(raw);
}
