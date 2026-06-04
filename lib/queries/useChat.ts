// 챗봇 조회 훅 — TanStack Query
import { useQuery } from "@tanstack/react-query";
import { getChatSessions } from "@/lib/api/chat";
import { queryKeys } from "./keys";

/** 채팅 세션 목록 (대화 기록) */
export function useChatSessions() {
  return useQuery({
    queryKey: queryKeys.chatSessions,
    queryFn: getChatSessions,
  });
}
