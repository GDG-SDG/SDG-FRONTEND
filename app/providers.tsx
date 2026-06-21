"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { USE_MOCK } from "@/lib/api/client";
import { refresh } from "@/lib/api/auth";
import { setAccessToken } from "@/lib/auth/token";

// 부팅(silent refresh) 동안 흰 화면 대신 보여줄 스플래시.
// 콜드 스타트로 오래 걸리면 몇 초 뒤 안내 문구를 띄워 "멈춤"으로 보이지 않게 한다.
function BootSplash() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className="page-bg flex flex-col items-center justify-center"
      style={{ height: "100dvh", gap: "16px", padding: "0 32px" }}
    >
      <div
        className="w-10 h-10 rounded-full border-4 spin-anim"
        style={{
          borderColor: "rgb(var(--brand-green) / 0.2)",
          borderTopColor: "rgb(var(--brand-green))",
        }}
      />
      <p
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "rgb(var(--brand-green))",
        }}
      >
        팜케어 AI
      </p>
      {slow && (
        <p
          className="text-center"
          style={{
            fontSize: "12px",
            color: "rgb(var(--glass-text) / 0.6)",
            lineHeight: 1.5,
          }}
        >
          서버를 준비하고 있어요.
          <br />
          처음 접속은 조금 더 걸릴 수 있어요.
        </p>
      )}
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  // USE_MOCK 구간에서는 MSW 워커가 준비된 뒤에 앱을 렌더
  const [mockReady, setMockReady] = useState(!USE_MOCK);

  // iOS Safari는 viewport user-scalable=no를 무시하므로 확대/축소 제스처를 직접 차단한다.
  // (핀치 줌·더블탭 줌·gesture 이벤트 모두 preventDefault)
  useEffect(() => {
    const preventGesture = (e: Event) => e.preventDefault();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    let lastTouchEnd = 0;
    const onTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    };
    const opts: AddEventListenerOptions = { passive: false };
    document.addEventListener("gesturestart", preventGesture, opts);
    document.addEventListener("gesturechange", preventGesture, opts);
    document.addEventListener("gestureend", preventGesture, opts);
    document.addEventListener("touchmove", onTouchMove, opts);
    document.addEventListener("touchend", onTouchEnd, opts);
    return () => {
      document.removeEventListener("gesturestart", preventGesture, opts);
      document.removeEventListener("gesturechange", preventGesture, opts);
      document.removeEventListener("gestureend", preventGesture, opts);
      document.removeEventListener("touchmove", onTouchMove, opts);
      document.removeEventListener("touchend", onTouchEnd, opts);
    };
  }, []);

  // accessToken은 메모리 보관이라 새로고침 시 사라진다.
  // 부팅 시 refreshToken(HttpOnly 쿠키)으로 silent refresh 해서 로그인 상태를 복구한다.
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!USE_MOCK) return;
    let active = true;
    import("@/mocks/browser")
      .then(({ startMockWorker }) => startMockWorker())
      .catch((e) => {
        // 워커 시작 실패해도 앱은 렌더 (mock 없이 동작 — 빈 화면 방지)
        console.error("[MSW] worker start failed:", e);
      })
      .finally(() => {
        if (active) setMockReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // 부팅 silent refresh — mock 워커 준비 후 1회 실행.
  useEffect(() => {
    if (!mockReady) return;
    let active = true;
    refresh()
      .then(({ accessToken }) => {
        if (active && accessToken) setAccessToken(accessToken);
      })
      .catch(() => {
        // 쿠키 없음/만료 → 비로그인 상태로 진행 (보호 라우트에서 처리)
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });
    return () => {
      active = false;
    };
  }, [mockReady]);

  // 부팅 silent refresh가 끝나기 전까지 흰 화면 대신 스플래시 노출.
  if (!mockReady || !authReady) return <BootSplash />;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
