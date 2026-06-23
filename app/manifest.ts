import type { MetadataRoute } from "next";

// PWA Web App Manifest (App Router 네이티브 방식 — /manifest.webmanifest 로 제공됨)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agriguard — 작물 질병 진단 서비스",
    short_name: "Agriguard",
    description:
      "스마트폰 하나로 작물 질병을 진단하고 방제 시점을 예측하는 저비용 AI 농업 플랫폼",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#2D7A3E",
    lang: "ko",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // 설치된 앱 아이콘 길게 누르면 노출되는 빠른 진입점
    shortcuts: [
      {
        name: "작물 진단하기",
        short_name: "진단",
        description: "사진으로 작물 질병을 진단합니다",
        url: "/diagnosis",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "AI 챗봇 상담",
        short_name: "챗봇",
        description: "방제·재배 질문을 AI에게 물어보세요",
        url: "/chat",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "방제 캘린더",
        short_name: "캘린더",
        description: "방제 일정을 확인합니다",
        url: "/calendar",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
