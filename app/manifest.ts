import type { MetadataRoute } from "next";

// PWA Web App Manifest (App Router 네이티브 방식 — /manifest.webmanifest 로 제공됨)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "팜케어 AI — 작물 질병 진단 서비스",
    short_name: "팜케어 AI",
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
  };
}
