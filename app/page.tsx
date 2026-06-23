"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { getAccessToken } from "@/lib/auth/token";

const SPLASH_DURATION_MS = 1600;

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // 로그인 토큰이 없으면 로그인 화면으로, 있으면 메인으로 진입
      const next = getAccessToken() ? "/calendar" : "/login";
      router.replace(next);
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="page-bg relative flex flex-col items-center justify-center overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center gap-5"
      >
        <div className="glass-pill-dark w-20 h-20 rounded-[28px] flex items-center justify-center">
          <Leaf size={40} className="text-white" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: "rgb(var(--glass-text) / 0.95)" }}
          >
            Agriguard
          </div>
          <div
            className="text-sm font-medium"
            style={{ color: "rgb(var(--glass-text) / 0.6)" }}
          >
            작물 질병 진단 서비스
          </div>
        </div>
      </motion.div>
    </div>
  );
}
