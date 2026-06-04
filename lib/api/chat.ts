// 챗봇 API — api-spec.md 기준 (mock은 MSW 핸들러가 처리)
import { apiFetch, buildQuery } from "./client";
import type {
  ChatMessage,
  ChatSession,
  ChatType,
  CreateSessionResponse,
} from "@/lib/types/chat";

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
  return apiFetch<ChatMessage[]>(
    `/chat/sessions/${sessionId}/messages${buildQuery({ diagnosisId })}`,
  );
}

/** POST /chat/sessions/{id}/messages — 메시지 전송 (AI 응답 반환) */
export async function sendChatMessage(params: {
  sessionId: string;
  diagnosisId?: number | null;
  message: string;
}): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(`/chat/sessions/${params.sessionId}/messages`, {
    method: "POST",
    body: { diagnosisId: params.diagnosisId, message: params.message },
  });
}
