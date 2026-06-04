// MSW 브라우저 워커 — USE_MOCK 구간에서만 시작
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// StrictMode의 이중 effect 실행에도 start는 1회만 (Promise 캐싱)
let startPromise: Promise<unknown> | null = null;

export function startMockWorker() {
  if (!startPromise) {
    startPromise = worker.start({ onUnhandledRequest: "bypass" });
  }
  return startPromise;
}
