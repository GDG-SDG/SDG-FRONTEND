"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  User,
  Leaf,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard },
  { path: "/calendar", icon: CalendarDays },
  { path: "/diagnosis", icon: Camera, isCamera: true },
  { path: "/chat", icon: MessageSquare },
  { path: "/mypage", icon: User },
];

function StatusBar({ time, isOnline }: { time: string; isOnline: boolean }) {
  return (
    <div
      className="glass-pill flex items-center justify-between px-6 py-2.5 flex-shrink-0 text-[11px] font-semibold"
      style={{ color: "rgba(20,60,35,0.9)", borderRadius: 0 }}
    >
      <span>{time}</span>
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Wifi size={12} />
        ) : (
          <WifiOff size={12} style={{ color: "#ef4444" }} />
        )}
        <span>4G</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

function AppBar({ isOnline }: { isOnline: boolean }) {
  return (
    <div className="flex-shrink-0 px-4 pt-3 pb-2">
      <div
        className="glass-card flex items-center justify-between"
        style={{ borderRadius: "28px", padding: "12px 14px" }}
      >
        <div className="flex items-center gap-3">
          <div className="glass-pill-dark w-10 h-10 rounded-2xl flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <div
              className="text-lg font-extrabold leading-tight tracking-tight"
              style={{ color: "rgba(20,60,35,0.95)" }}
            >
              팜케어 AI
            </div>
            <div
              className="text-[11px] font-medium"
              style={{ color: "rgba(20,60,35,0.6)" }}
            >
              작물 질병 진단 서비스
            </div>
          </div>
        </div>

        <div className="glass-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: isOnline ? "#22c55e" : "#ef4444",
              boxShadow: isOnline ? "0 0 5px #22c55e" : "0 0 5px #ef4444",
            }}
          />
          <span
            className="text-[10px] font-semibold"
            style={{ color: "rgba(20,60,35,0.85)" }}
          >
            {isOnline ? "온라인" : "오프라인"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background:
          "linear-gradient(145deg, #c8ddd0 0%, #b8ccbe 50%, #a8bcae 100%)",
      }}
    >
      <div
        className="page-bg relative flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          border: "3px solid #1a1a1a",
        }}
      >
        <StatusBar time={time} isOnline={isOnline} />
        <AppBar isOnline={isOnline} />

        {/* Main content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(45,122,62,0.4) transparent",
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
                          : "rgba(20,60,35,0.9)"
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
    </div>
  );
}
