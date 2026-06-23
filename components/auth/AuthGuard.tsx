"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth/token";

/**
 * 보호 라우트 공통 인증 가드.
 *
 * accessToken은 메모리에만 보관되며, 부팅 silent refresh(`Providers`)가 끝난 뒤에야
 * 보호 라우트 트리가 렌더된다. 따라서 이 시점의 `getAccessToken()`이 권위 있는 인증
 * 상태다. 토큰이 없으면(쿠키 만료·미로그인 딥링크 등) 비로그인으로 보고 `/login`으로
 * 보낸다.
 *
 * 세션 중간 만료(refresh 실패)는 `lib/api/client.ts`가 자동 로그아웃으로 처리하므로,
 * 여기서는 진입 시점의 토큰 유무만 확인한다. 인증 확인 전에는 보호 화면을 노출하지
 * 않도록 아무것도 렌더하지 않는다.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      setAuthorized(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (!authorized) return null;

  return <>{children}</>;
}
