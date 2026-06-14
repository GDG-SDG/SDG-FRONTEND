"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { USE_MOCK } from "@/lib/api/client";
import { refresh } from "@/lib/api/auth";
import { setAccessToken } from "@/lib/auth/token";

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

  if (!mockReady || !authReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
