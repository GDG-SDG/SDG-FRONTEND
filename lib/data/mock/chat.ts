// API 응답 형태(api-spec.md)에 맞춘 챗봇 mock — USE_MOCK=true 구간에서 사용
import type { ChatMessage, ChatSession } from "@/lib/types/chat";
import { AI_RESPONSES } from "@/lib/data/mockData";

const nowHHMM = () =>
  new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

/** GET /chat/sessions */
export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    sessionId: "sess-001",
    type: "diagnosis",
    diagnosisId: 101,
    title: "탄저병 방제 문의",
    lastMessage: "프로피네브 또는 만코제브 계열 살균제를 살포하세요.",
    updatedAt: "2026-04-28T10:33:00+09:00",
  },
  {
    sessionId: "sess-002",
    type: "free",
    diagnosisId: null,
    title: "흰가루병 증상 확인",
    lastMessage: "황 계열 살균제를 살포하고 통풍을 개선하세요.",
    updatedAt: "2026-04-25T14:20:00+09:00",
  },
  {
    sessionId: "sess-003",
    type: "diagnosis",
    diagnosisId: 102,
    title: "역병 예방법",
    lastMessage: "과습 방지를 위한 배수 개선이 중요합니다.",
    updatedAt: "2026-04-22T09:10:00+09:00",
  },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "msg-welcome",
  role: "ai",
  text: "안녕하세요! 저는 농업 AI 도우미입니다. 작물 질병이나 방제에 대해 궁금한 점을 질문해 주세요.",
  verified: true,
  source: "농촌진흥청 병해충 관리 지침",
  timestamp: "10:32",
};

/** GET /chat/sessions/{id}/messages — mock은 환영 메시지로 시작 */
export function getMockMessages(): ChatMessage[] {
  return [WELCOME_MESSAGE];
}

/** POST /chat/sessions/{id}/messages — AI 응답 mock */
export function getMockAiReply(message: string): ChatMessage {
  const known = AI_RESPONSES[message];
  return {
    id: `msg-${Date.now()}`,
    role: "ai",
    text:
      known ||
      "질문 주신 내용에 대해 농촌진흥청 지침에 따라 방제 조치를 권장합니다. 더 구체적인 사항은 가까운 농업기술센터에 문의하세요.",
    verified: !!known,
    source: known ? "농촌진흥청 병해충 관리 지침" : undefined,
    timestamp: nowHHMM(),
  };
}
