"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { USE_MOCK } from "@/lib/api/client";

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

  if (!mockReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
