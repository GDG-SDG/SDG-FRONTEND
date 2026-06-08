"use client";

import { WifiOff, RotateCcw } from "lucide-react";

// 네트워크 단절 시 서비스워커가 문서 요청에 대해 보여주는 오프라인 폴백 페이지.
// API 호출 없이 정적으로 동작한다(precache 대상).
export default function OfflinePage() {
  return (
    <div
      className="page-bg flex flex-col items-center justify-center px-8 text-center"
      style={{ height: "100dvh" }}
    >
      <div
        className="glass-card flex flex-col items-center"
        style={{
          borderRadius: "28px",
          padding: "32px 28px",
          maxWidth: "340px",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: "rgb(var(--brand-green) / 0.12)" }}
        >
          <WifiOff size={30} style={{ color: "rgb(var(--brand-green))" }} />
        </div>

        <h1 className="mt-5 text-[18px] font-extrabold text-[#1a1a1a]">
          오프라인 상태예요
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[#616161]">
          인터넷 연결이 끊겼습니다. 연결을 확인한 뒤 다시 시도해 주세요.
          네트워크가 복구되면 정상적으로 이용할 수 있어요.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white"
          style={{
            background: "rgb(var(--brand-green))",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <RotateCcw size={15} />
          다시 시도
        </button>
      </div>
    </div>
  );
}
