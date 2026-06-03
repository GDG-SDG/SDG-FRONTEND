// 챗봇 API — api-spec.md 기준
import { apiFetch, buildQuery, USE_MOCK } from "./client";
import type {
  ChatMessage,
  ChatSession,
  ChatType,
  CreateSessionResponse,
} from "@/lib/types/chat";
import {
  MOCK_CHAT_SESSIONS,
  getMockAiReply,
  getMockMessages,
} from "@/lib/data/mock/chat";

/** GET /chat/sessions — 세션 목록 */
export async function getChatSessions(): Promise<ChatSession[]> {
  if (USE_MOCK) return MOCK_CHAT_SESSIONS;
  return apiFetch<ChatSession[]>("/chat/sessions");
}

/** POST /chat/sessions — 세션 생성 */
export async function createChatSession(params: {
  diagnosisId?: number | null;
  type: ChatType;
}): Promise<CreateSessionResponse> {
  if (USE_MOCK) {
    return {
      sessionId: `sess-${Date.now()}`,
      type: params.type,
      diagnosisId: params.diagnosisId ?? null,
      createdAt: new Date().toISOString(),
    };
  }
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
  if (USE_MOCK) return getMockMessages();
  const query = buildQuery({ diagnosisId });
  return apiFetch<ChatMessage[]>(
    `/chat/sessions/${sessionId}/messages${query}`,
  );
}

/** POST /chat/sessions/{id}/messages — 메시지 전송 (AI 응답 반환) */
export async function sendChatMessage(params: {
  sessionId: string;
  diagnosisId?: number | null;
  message: string;
}): Promise<ChatMessage> {
  if (USE_MOCK) return getMockAiReply(params.message);
  return apiFetch<ChatMessage>(`/chat/sessions/${params.sessionId}/messages`, {
    method: "POST",
    body: { diagnosisId: params.diagnosisId, message: params.message },
  });
}
