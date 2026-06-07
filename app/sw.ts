/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// Serwist가 빌드 시점에 precache 매니페스트를 self.__SW_MANIFEST에 주입한다.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // 정적 자산 기본 캐싱 전략. API 캐싱은 백엔드 확정 후 별도 작업에서 추가한다.
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
