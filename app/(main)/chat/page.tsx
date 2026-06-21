"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  CheckCircle,
  AlertTriangle,
  Bot,
  User,
  MessageSquare,
  Plus,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QUICK_QUESTIONS } from "@/lib/data/mockData";
import type { ChatMessage } from "@/lib/types/chat";
import type { DiagnosisDetail } from "@/lib/types/diagnosis";
import {
  createChatSession,
  getChatMessages,
  sendChatMessage,
} from "@/lib/api/chat";
import { useChatSessions } from "@/lib/queries/useChat";
import { useDiagnosisDetail } from "@/lib/queries/useDiagnoses";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";

const nowHHMM = () =>
  new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

// 진단 연계 진입 시 보여줄 환영 메시지 id (출처 배지를 숨기기 위해 식별).
const DIAGNOSIS_WELCOME_ID = "diag-welcome";

// 진단 상세 → 진단 맥락을 요약한 AI 환영 메시지. 마크다운(볼드)은 ChatBubble이 렌더한다.
function buildDiagnosisWelcome(detail: DiagnosisDetail): ChatMessage {
  const top = detail.results[0];
  const name = top?.diseaseNameKr ?? "진단된 병해";
  const confidence = top ? ` · 신뢰도 ${top.confidence}%` : "";
  return {
    id: DIAGNOSIS_WELCOME_ID,
    role: "ai",
    text: `**${detail.cropName} ${name}**(${detail.severity}${confidence}) 진단 결과를 함께 보고 있어요.\n\n방제 방법·재발 방지·약제 사용처럼 궁금한 점을 편하게 물어보세요.`,
    timestamp: nowHHMM(),
  };
}

// 진단 상세 조회 실패 시 사용할 일반 환영 메시지 (빈 화면 방지).
function buildFallbackWelcome(): ChatMessage {
  return {
    id: DIAGNOSIS_WELCOME_ID,
    role: "ai",
    text: "진단 정보를 불러오지 못했어요. 그래도 작물 질병·방제에 대해 무엇이든 물어보세요.",
    timestamp: nowHHMM(),
  };
}

// 진단 병명 기반 맞춤 추천 질문.
function buildDiagnosisQuestions(detail: DiagnosisDetail): string[] {
  const name = detail.results[0]?.diseaseNameKr ?? "이 병해";
  return [
    `${name}, 지금 약을 써야 하나요?`,
    `${name} 재발을 막으려면 어떻게 하나요?`,
    "이웃 작물에도 퍼질 수 있나요?",
    "며칠 후 다시 확인하면 되나요?",
  ];
}

function ChatBubble({
  message,
  hideBadge = false,
}: {
  message: ChatMessage;
  hideBadge?: boolean;
}) {
  const isAI = message.role === "ai";
  return (
    <div className={`flex items-end gap-2 ${isAI ? "" : "flex-row-reverse"}`}>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: isAI ? "#2D7A3E" : "#FF6B35" }}
      >
        {isAI ? (
          <Bot size={14} style={{ color: "white" }} />
        ) : (
          <User size={14} style={{ color: "white" }} />
        )}
      </div>
      <div
        className={`flex flex-col gap-1 max-w-[75%] ${isAI ? "" : "items-end"}`}
      >
        <div
          className={`px-4 py-3 ${isAI ? "rounded-2xl rounded-bl-sm" : "rounded-2xl rounded-br-sm"}`}
          style={{
            backgroundColor: isAI ? "white" : "#2D7A3E",
            border: isAI ? "1px solid #E0E0E0" : "none",
            color: isAI ? "#333" : "white",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {isAI ? (
            <div className="chat-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </div>
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>{message.text}</span>
          )}
        </div>
        {isAI && !hideBadge && (
          <div className="flex items-center gap-1.5 px-1">
            {message.verified ? (
              <>
                <CheckCircle size={11} style={{ color: "#2D7A3E" }} />
                <span
                  style={{
                    fontSize: "10px",
                    color: "#4CAF50",
                    fontWeight: 600,
                  }}
                >
                  검증된 자료
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={11} style={{ color: "#FFC107" }} />
                <span
                  style={{
                    fontSize: "10px",
                    color: "#F57F17",
                    fontWeight: 600,
                  }}
                >
                  제한적 근거
                </span>
              </>
            )}
            {message.source && (
              <span style={{ fontSize: "10px", color: "#BDBDBD" }}>
                · {message.source}
              </span>
            )}
          </div>
        )}
        <span
          style={{
            fontSize: "10px",
            color: "#BDBDBD",
            paddingLeft: "4px",
            paddingRight: "4px",
          }}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

function ChatbotContent() {
  const { data: sessions } = useChatSessions();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  // 진단 상세에서 "AI 상담 시작하기"로 진입 시 ?diagnosisId=<id> 로 컨텍스트 전달.
  // 실 백엔드 진단 id는 UUID 문자열이므로 숫자로 변환하지 않고 그대로 사용한다.
  const entryDiagnosisId = searchParams.get("diagnosisId") || null;
  const [sessionId, setSessionId] = useState<string | null>(null);
  // 현재 세션의 진단 컨텍스트. URL 파라미터가 아니라 "지금 보고 있는 세션"을 따라간다
  // (새 채팅·다른 세션 선택 시 엉뚱한 diagnosisId가 따라붙지 않도록).
  const [sessionDiagnosisId, setSessionDiagnosisId] = useState<
    string | number | null
  >(entryDiagnosisId);
  // 환영 메시지/추천질문을 현재 세션의 진단 맥락으로 구성하기 위한 상세 조회.
  const {
    data: diagnosisDetail,
    isError: diagnosisDetailError,
    isLoading: diagnosisDetailLoading,
  } = useDiagnosisDetail(sessionDiagnosisId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  // 진단별 환영 메시지를 한 번만 주입하기 위한 가드.
  const greetedDiagnosisRef = useRef<string | null>(null);

  // 세션은 첫 메시지를 보낼 때 생성한다(lazy 생성). 진입만 하고 대화하지 않으면
  // 빈 세션이 서버에 쌓이므로 여기서 미리 만들지 않는다.
  // 진단 연계 진입 시 환영 메시지는 아래 effect가 진단 상세로 구성한다.

  // 진단 상세가 도착하면 진단 맥락 환영 메시지로 대화를 시작한다.
  // 진입 세션(entryDiagnosisId)에 대해서만, 진단당 1회만 주입한다
  // (기존 세션을 선택해 들어온 경우엔 서버 이력을 그대로 쓰므로 주입하지 않음).
  useEffect(() => {
    if (!entryDiagnosisId || sessionDiagnosisId !== entryDiagnosisId) return;
    if (greetedDiagnosisRef.current === entryDiagnosisId) return;
    // 상세 도착 → 진단 맥락 환영, 조회 실패 → 일반 환영(빈 화면 방지).
    // 로딩 중이면 아직 주입하지 않고 다음 상태 변화를 기다린다.
    if (diagnosisDetail) {
      greetedDiagnosisRef.current = entryDiagnosisId;
      setMessages([buildDiagnosisWelcome(diagnosisDetail)]);
    } else if (diagnosisDetailError) {
      greetedDiagnosisRef.current = entryDiagnosisId;
      setMessages([buildFallbackWelcome()]);
    }
  }, [
    entryDiagnosisId,
    sessionDiagnosisId,
    diagnosisDetail,
    diagnosisDetailError,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text,
      timestamp: nowHHMM(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    try {
      // 첫 메시지일 때만 세션을 생성한다(lazy) — 빈 세션이 쌓이지 않도록.
      let sid = sessionId;
      if (!sid) {
        const session = sessionDiagnosisId
          ? await createChatSession({
              diagnosisId: sessionDiagnosisId,
              type: "diagnosis",
            })
          : await createChatSession({ type: "free" });
        sid = session.sessionId;
        setSessionId(sid);
      }
      const aiMsg = await sendChatMessage({
        sessionId: sid,
        diagnosisId: sessionDiagnosisId ?? undefined,
        message: text,
      });
      setMessages((prev) => [...prev, aiMsg]);
      // 새로 생성된 세션이 대화 기록 목록에 반영되도록 갱신.
      queryClient.invalidateQueries({ queryKey: queryKeys.chatSessions });
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setShowHistoryMenu(false);
    // 빈 세션을 만들지 않는다 — 첫 메시지를 보내면 그때 새 세션이 생성된다.
    setSessionId(null);
    setSessionDiagnosisId(null);
    setMessages([]);
    greetedDiagnosisRef.current = null;
  };

  const handleSelectSession = async (sid: string) => {
    setShowHistoryMenu(false);
    const selected = (sessions ?? []).find((s) => s.sessionId === sid);
    const nextDiagnosisId = selected?.diagnosisId ?? null;
    setSessionId(sid);
    setSessionDiagnosisId(nextDiagnosisId);
    setMessages(await getChatMessages(sid, nextDiagnosisId ?? undefined));
  };

  // 메시지가 없는 빈 세션(lastMessage 없음)은 대화 기록에서 숨긴다.
  const visibleSessions = (sessions ?? []).filter((s) => s.lastMessage);

  // 현재 세션이 진단 연계면 병명 맞춤 질문, 아니면 기본 빠른 질문.
  const quickQuestions =
    sessionDiagnosisId && diagnosisDetail
      ? buildDiagnosisQuestions(diagnosisDetail)
      : QUICK_QUESTIONS;

  return (
    <div className="flex flex-col h-full">
      {/* Session controls */}
      <div className="mx-4 mt-3 mb-2 flex gap-2 flex-shrink-0">
        <div className="relative flex-1">
          <button
            onClick={() => setShowHistoryMenu(!showHistoryMenu)}
            className="glass-pill-green w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#2D7A3E",
            }}
          >
            <MessageSquare size={16} />
            대화 기록
          </button>
          {showHistoryMenu && (
            <div className="glass-card-strong absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-10">
              <div
                className="px-3 py-2"
                style={{
                  background: "rgba(232, 245, 233, 0.6)",
                  borderBottom: "1px solid rgb(var(--glass-accent) / 0.12)",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#757575",
                  }}
                >
                  최근 대화
                </p>
              </div>
              {visibleSessions.length === 0 ? (
                <div className="px-3 py-4">
                  <p style={{ fontSize: "12px", color: "#9E9E9E" }}>
                    대화 기록이 없습니다
                  </p>
                </div>
              ) : (
                visibleSessions.map((session) => (
                  <button
                    key={session.sessionId}
                    onClick={() => handleSelectSession(session.sessionId)}
                    className="glass-row w-full px-3 py-2.5 text-left"
                    style={{
                      borderBottom: "1px solid rgb(var(--glass-accent) / 0.1)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#333",
                        marginBottom: "2px",
                      }}
                    >
                      {session.title}
                    </p>
                    <p
                      className="truncate"
                      style={{ fontSize: "11px", color: "#9E9E9E" }}
                    >
                      {new Date(session.updatedAt).toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      · {session.lastMessage}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl"
          style={{
            backgroundColor: "#2D7A3E",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <Plus size={16} />새 대화
        </button>
      </div>

      {/* Chat area */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2 flex flex-col gap-3">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            hideBadge={msg.id === DIAGNOSIS_WELCOME_ID}
          />
        ))}

        {/* 진단 연계 진입 시 상세 로딩 동안 빈 화면 방지 */}
        {messages.length === 0 && diagnosisDetailLoading && (
          <div className="flex items-center justify-center py-6">
            <p style={{ fontSize: "13px", color: "#9E9E9E" }}>
              진단 정보를 불러오는 중...
            </p>
          </div>
        )}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#2D7A3E" }}
            >
              <Bot size={14} style={{ color: "white" }} />
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm"
              style={{ backgroundColor: "white", border: "1px solid #E0E0E0" }}
            >
              <div
                className="flex gap-1 items-center"
                style={{ height: "16px" }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-full bounce-dot"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#9E9E9E",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 pt-2 pb-2 flex-shrink-0">
        <p
          style={{
            fontSize: "11px",
            color: "#9E9E9E",
            marginBottom: "6px",
            fontWeight: 500,
          }}
        >
          빠른 질문
        </p>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="px-3 py-2 rounded-xl flex-shrink-0 transition-all active:scale-95"
              style={{
                backgroundColor: isTyping ? "#F5F5F5" : "#E8F5E9",
                color: isTyping ? "#BDBDBD" : "#2D7A3E",
                fontSize: "12px",
                fontWeight: 600,
                border: `1px solid ${isTyping ? "#E0E0E0" : "#C8E6C9"}`,
                whiteSpace: "nowrap",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="glass-bar-top px-4 py-3 flex-shrink-0 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Enter") handleSend(input);
          }}
          placeholder="질병에 대해 질문하세요..."
          className="glass-pill flex-1 px-4 py-3 rounded-2xl outline-none chat-input"
          style={{
            fontSize: "14px",
            color: "rgb(var(--glass-text) / 0.9)",
          }}
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isTyping}
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
          style={{
            backgroundColor: input.trim() && !isTyping ? "#2D7A3E" : "#E0E0E0",
          }}
        >
          <Send
            size={18}
            style={{ color: input.trim() && !isTyping ? "white" : "#9E9E9E" }}
          />
        </button>
      </div>
    </div>
  );
}

// useSearchParams는 Suspense 경계가 필요하다 (Next.js app router).
export default function ChatbotPage() {
  return (
    <Suspense fallback={<div className="h-full" />}>
      <ChatbotContent />
    </Suspense>
  );
}
