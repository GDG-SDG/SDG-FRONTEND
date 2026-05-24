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
import { useState, useEffect } from "react";

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

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background:
          "linear-gradient(145deg, #c8ddd0 0%, #b8ccbe 50%, #a8bcae 100%)",
      }}
    >
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          backgroundColor: "#EFF4F0",
          border: "3px solid #1a1a1a",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-6 py-2.5 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #144f28 0%, #1e6b35 100%)",
            color: "white",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          <span>{time}</span>
          <div className="flex items-center gap-1">
            {isOnline ? (
              <Wifi size={12} />
            ) : (
              <WifiOff size={12} style={{ color: "#fca5a5" }} />
            )}
            <span>4G</span>
            <span>🔋</span>
          </div>
        </div>

        {/* App bar */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{
            background:
              "linear-gradient(160deg, #155729 0%, #2D7A3E 65%, #3a9150 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <Leaf size={20} style={{ color: "white" }} />
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: "-0.3px",
                }}
              >
                팜케어 AI
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.68)",
                  fontSize: "11px",
                  letterSpacing: "0.1px",
                }}
              >
                작물 질병 진단 서비스
              </div>
            </div>
          </div>

          {/* Online status pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: isOnline ? "#4ade80" : "#f87171",
                boxShadow: isOnline ? "0 0 5px #4ade80" : "0 0 5px #f87171",
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "10px",
                fontWeight: 600,
              }}
            >
              {isOnline ? "온라인" : "오프라인"}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: "#EFF4F0",
            scrollbarWidth: "thin",
            scrollbarColor: "#BDBDBD #EFF4F0",
          }}
        >
          {children}
        </div>

        {/* Liquid glass bottom nav — layoutId sliding pill */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <div
            className="flex items-center justify-between"
            style={{
              background: "rgba(180, 215, 190, 0.18)",
              backdropFilter: "blur(48px) saturate(200%)",
              WebkitBackdropFilter: "blur(48px) saturate(200%)",
              borderRadius: "36px",
              border: "1px solid rgba(255,255,255,0.38)",
              boxShadow: [
                "0 12px 40px rgba(0,0,0,0.08)",
                "inset 0 1.5px 0 rgba(255,255,255,0.8)",
                "inset 0 -1px 0 rgba(0,0,0,0.03)",
              ].join(", "),
              padding: "10px 14px",
            }}
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
                  {/* layoutId pill — slides across all items via spring */}
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

                  {/* Icon — color animated via motion */}
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
