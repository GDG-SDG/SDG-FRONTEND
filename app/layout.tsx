import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "팜케어 AI — 작물 질병 진단 서비스",
  description:
    "스마트폰 하나로 작물 질병을 진단하고 방제 시점을 예측하는 저비용 AI 농업 플랫폼",
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
