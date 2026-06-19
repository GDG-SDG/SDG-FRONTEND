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
import {
  createChatSession,
  getChatMessages,
  sendChatMessage,
} from "@/lib/api/chat";
import { useChatSessions } from "@/lib/queries/useChat";

const nowHHMM = () =>
  new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

function ChatBubble({ message }: { message: ChatMessage }) {
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
        {isAI && (
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
  const searchParams = useSearchParams();
  // 진단 상세에서 "AI 상담 시작하기"로 진입 시 ?diagnosisId=123 으로 컨텍스트 전달.
  // 숫자가 아니면(예: mock 진단 흐름) null → 자유 채팅으로 폴백.
  const rawDiagnosisId = searchParams.get("diagnosisId");
  const diagnosisId =
    rawDiagnosisId && Number.isFinite(Number(rawDiagnosisId))
      ? Number(rawDiagnosisId)
      : null;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 진입 시 세션 생성 + 환영 메시지 로드.
  // diagnosisId가 있으면 진단 연계 세션(type: "diagnosis")으로 컨텍스트를 잇는다.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = diagnosisId
        ? await createChatSession({ diagnosisId, type: "diagnosis" })
        : await createChatSession({ type: "free" });
      if (!mounted) return;
      setSessionId(session.sessionId);
      setMessages(
        await getChatMessages(session.sessionId, diagnosisId ?? undefined),
      );
    })();
    return () => {
      mounted = false;
    };
  }, [diagnosisId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping || !sessionId) return;
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
      const aiMsg = await sendChatMessage({
        sessionId,
        diagnosisId: diagnosisId ?? undefined,
        message: text,
      });
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = async () => {
    setShowHistoryMenu(false);
    const session = await createChatSession({ type: "free" });
    setSessionId(session.sessionId);
    setMessages(await getChatMessages(session.sessionId));
  };

  const handleSelectSession = async (sid: string) => {
    setShowHistoryMenu(false);
    setSessionId(sid);
    setMessages(await getChatMessages(sid));
  };

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
              {(sessions ?? []).length === 0 ? (
                <div className="px-3 py-4">
                  <p style={{ fontSize: "12px", color: "#9E9E9E" }}>
                    대화 기록이 없습니다
                  </p>
                </div>
              ) : (
                (sessions ?? []).map((session) => (
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
          <ChatBubble key={msg.id} message={msg} />
        ))}

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
          {QUICK_QUESTIONS.map((q) => (
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
