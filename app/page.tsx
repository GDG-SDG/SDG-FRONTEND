"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const SPLASH_DURATION_MS = 1600;

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/calendar");
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background:
          "linear-gradient(145deg, #c8ddd0 0%, #b8ccbe 50%, #a8bcae 100%)",
      }}
    >
      <div
        className="page-bg relative flex flex-col items-center justify-center overflow-hidden shadow-2xl"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "44px",
          border: "3px solid #1a1a1a",
        }}
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
              팜케어 AI
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
    </div>
  );
}
