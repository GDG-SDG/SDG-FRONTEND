import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

// 서비스워커 "한 번에 하나만" 불변식:
// MSW 워커(mockServiceWorker.js)와 PWA 워커(sw.js)는 둘 다 루트 스코프(/)에
// 등록되어 동시에 켜면 충돌한다. 따라서 mock 모드에서는 PWA SW를 끈다.
// - dev            → MSW만
// - prod + mock    → MSW만 (manifest/아이콘은 그대로 제공되어 설치는 동작)
// - prod + 실제 API(NEXT_PUBLIC_USE_MOCK=false) → Serwist PWA SW + 오프라인 캐싱
const isDev = process.env.NODE_ENV === "development";
const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: isDev || useMock,
});

export default withSerwist(nextConfig);
