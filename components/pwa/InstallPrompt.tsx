"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Share, SquarePlus, X } from "lucide-react";

// beforeinstallprompt는 표준 타입에 없어 직접 정의한다.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari 전용 플래그
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua);
}

/**
 * PWA 설치 유도 배너.
 * - Android/Chrome: beforeinstallprompt를 가로채 "설치" 버튼 노출
 * - iOS Safari: beforeinstallprompt 미지원 → 수동 안내 ("공유 → 홈 화면에 추가")
 * - 이미 설치(standalone)했거나 사용자가 닫은 경우 노출하지 않음
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [iosGuide, setIosGuide] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "true") return;

    // iOS는 이벤트가 없으므로 안내 배너를 직접 노출
    if (isIOS()) {
      setIosGuide(true);
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setIosGuide(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDeferred(null);
    setIosGuide(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const visible = Boolean(deferred) || iosGuide;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className="glass-card fixed left-4 right-4 z-50 flex items-center gap-3"
          style={{
            top: "max(env(safe-area-inset-top), 12px)",
            borderRadius: "20px",
            padding: "12px 14px",
          }}
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgb(var(--brand-green) / 0.12)" }}
          >
            <Download size={20} style={{ color: "rgb(var(--brand-green))" }} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-[#1a1a1a]">
              팜케어 AI 앱으로 설치
            </p>
            {iosGuide ? (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#616161]">
                공유
                <Share size={12} className="inline" />
                {" → "}
                홈 화면에 추가
                <SquarePlus size={12} className="inline" />
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] text-[#616161]">
                홈 화면에서 바로 실행하세요
              </p>
            )}
          </div>

          {!iosGuide && (
            <button
              onClick={install}
              className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-white"
              style={{
                background: "rgb(var(--brand-green))",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              설치
            </button>
          )}

          <button
            onClick={dismiss}
            aria-label="닫기"
            className="flex-shrink-0 rounded-full p-1 text-[#9E9E9E]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
