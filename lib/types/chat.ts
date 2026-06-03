// 챗봇 타입 — api-spec.md 기준

export type ChatType = "diagnosis" | "free";
export type ChatRole = "ai" | "user";

/** GET /chat/sessions */
export interface ChatSession {
  sessionId: string;
  type: ChatType;
  diagnosisId: number | null;
  title: string;
  lastMessage: string;
  updatedAt: string;
}

/** POST /chat/sessions 응답 */
export interface CreateSessionResponse {
  sessionId: string;
  type: ChatType;
  diagnosisId: number | null;
  createdAt: string;
}

/** 채팅 메시지 (GET/POST /chat/sessions/{id}/messages) */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  verified?: boolean;
  source?: string;
  timestamp: string;
}
