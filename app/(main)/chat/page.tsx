"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  CheckCircle,
  AlertTriangle,
  Bot,
  User,
  MessageSquare,
  Plus,
} from "lucide-react";
import {
  DIAGNOSIS_RECORDS,
  CHAT_HISTORY_MOCK,
  QUICK_QUESTIONS,
  AI_RESPONSES,
  getSeverityColor,
} from "@/lib/data/mockData";

type Message = {
  id: string;
  role: "ai" | "user";
  text: string;
  verified?: boolean;
  source?: string;
  timestamp: string;
};

function ChatBubble({ message }: { message: Message }) {
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
          {message.text}
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

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(CHAT_HISTORY_MOCK);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const contextRecord = DIAGNOSIS_RECORDS[0];
  const topDisease = contextRecord.results[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(
      () => {
        const aiText =
          AI_RESPONSES[text] ||
          `${topDisease.diseaseKr}에 관한 질문이군요. 현재 감염 상태(${contextRecord.primarySeverity})를 고려할 때, 농촌진흥청 지침에 따라 방제 조치를 취하시기 바랍니다. 더 구체적인 내용은 가까운 농업기술센터에 문의하세요.`;
        const aiMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "ai",
          text: aiText,
          verified: !!AI_RESPONSES[text],
          source: AI_RESPONSES[text]
            ? "농촌진흥청 병해충 관리 지침"
            : undefined,
          timestamp: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
      },
      1500 + Math.random() * 1000,
    );
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      {/* Session controls */}
      <div className="mx-4 mt-3 mb-2 flex gap-2 flex-shrink-0">
        <div className="relative flex-1">
          <button
            onClick={() => setShowHistoryMenu(!showHistoryMenu)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              backgroundColor: "white",
              border: "1.5px solid #E0E0E0",
              fontSize: "13px",
              fontWeight: 600,
              color: "#616161",
            }}
          >
            <MessageSquare size={16} />
            대화 기록
          </button>
          {showHistoryMenu && (
            <div
              className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl overflow-hidden z-10"
              style={{ backgroundColor: "white", border: "1px solid #E0E0E0" }}
            >
              <div
                className="px-3 py-2"
                style={{
                  backgroundColor: "#F5F5F5",
                  borderBottom: "1px solid #E0E0E0",
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
              {[
                {
                  id: 1,
                  title: "탄저병 방제 문의",
                  date: "4월 28일",
                  messages: 12,
                },
                {
                  id: 2,
                  title: "흰가루병 증상 확인",
                  date: "4월 25일",
                  messages: 8,
                },
                { id: 3, title: "역병 예방법", date: "4월 22일", messages: 15 },
              ].map((session) => (
                <button
                  key={session.id}
                  onClick={() => setShowHistoryMenu(false)}
                  className="w-full px-3 py-2.5 text-left hover:bg-green-50 transition-colors"
                  style={{ borderBottom: "1px solid #F5F5F5" }}
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
                  <p style={{ fontSize: "11px", color: "#9E9E9E" }}>
                    {session.date} · {session.messages}개 메시지
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setMessages([]);
            setShowHistoryMenu(false);
          }}
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
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-3">
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
              onClick={() => sendMessage(q)}
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
      <div
        className="px-4 py-3 flex-shrink-0 flex items-center gap-2"
        style={{ borderTop: "1px solid #E0E0E0", backgroundColor: "white" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="질병에 대해 질문하세요..."
          className="flex-1 px-4 py-3 rounded-2xl outline-none chat-input"
          style={{
            backgroundColor: "#F5F5F5",
            fontSize: "14px",
            color: "#333",
            border: "1.5px solid transparent",
          }}
        />
        <button
          onClick={() => sendMessage(input)}
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
