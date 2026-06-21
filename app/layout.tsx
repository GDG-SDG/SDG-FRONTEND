import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
});

export const metadata: Metadata = {
  title: "팜케어 AI — 작물 질병 진단 서비스",
  description:
    "스마트폰 하나로 작물 질병을 진단하고 방제 시점을 예측하는 저비용 AI 농업 플랫폼",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "팜케어 AI",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2D7A3E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  // safe-area-inset(env)이 실제로 적용되도록 cover 지정 — 미설정 시 inset이 0이 된다.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
