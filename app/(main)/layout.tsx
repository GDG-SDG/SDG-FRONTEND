"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  User,
} from "lucide-react";
import { useCallback } from "react";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard },
  { path: "/calendar", icon: CalendarDays },
  { path: "/diagnosis", icon: Camera, isCamera: true },
  { path: "/chat", icon: MessageSquare },
  { path: "/mypage", icon: User },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  // 대시보드는 상단 헤더(기록)가 화면 최상단에 붙어야 하므로 레이아웃 패딩을 주지 않고
  // 헤더가 직접 safe-area를 흡수한다. 그 외 페이지는 기존 상단 여백 유지.
  const isDashboard = pathname === "/dashboard";

  return (
    <div
      className="page-bg relative flex flex-col overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* PWA 설치 유도 배너 (상단 슬라이드인) */}
      <InstallPrompt />

      {/* Main content */}
      {/* min-h-0 필수: flex 자식이 콘텐츠 높이만큼 늘어나 하단 nav를 밀어내는 것을 막고,
          이 영역 내부에서만 스크롤되도록 한다 (nav 고정). */}
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        style={{
          paddingTop: isDashboard ? 0 : "max(env(safe-area-inset-top), 16px)",
        }}
      >
        {children}
      </div>

      {/* Liquid glass bottom nav — layoutId sliding pill */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div
          className="glass-card flex items-center justify-between"
          style={{ borderRadius: "36px", padding: "10px 14px" }}
        >
          {NAV_ITEMS.map(({ path, icon: Icon, isCamera }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => router.push(path)}
                className="relative flex items-center justify-center"
                style={{
                  width: "52px",
                  height: "52px",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0"
                    style={{
                      borderRadius: isCamera ? "50%" : "18px",
                      background: isCamera
                        ? "rgba(35,105,55,0.68)"
                        : "rgba(20,50,30,0.22)",
                      backdropFilter: "blur(24px) saturate(180%)",
                      WebkitBackdropFilter: "blur(24px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: isCamera
                        ? [
                            "0 6px 20px rgba(30,90,50,0.45)",
                            "inset 0 1.5px 0 rgba(255,255,255,0.45)",
                            "inset 0 -1px 0 rgba(0,0,0,0.12)",
                          ].join(", ")
                        : [
                            "inset 0 1px 0 rgba(255,255,255,0.5)",
                            "0 4px 12px rgba(0,0,0,0.1)",
                          ].join(", "),
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  animate={{
                    color: active
                      ? isCamera
                        ? "rgba(255,255,255,0.93)"
                        : "rgb(var(--glass-text) / 0.9)"
                      : "rgba(100,130,108,0.7)",
                    scale: active ? 1 : 0.95,
                  }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Icon size={22} />
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
