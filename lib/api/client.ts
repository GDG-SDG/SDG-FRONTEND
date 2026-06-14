// fetch 기반 API 클라이언트 — axios 미사용 (의존성 0)
import { clearTokens, getAccessToken, setAccessToken } from "@/lib/auth/token";
import { refresh } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * 도메인별 mock 유지 여부 (백엔드 미연동 구간 대응).
 * 백엔드 연동 전까지는 mock이 기본 — 명시적으로 "false"일 때만 실제 API 호출.
 */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  /** 객체는 JSON 직렬화, FormData는 그대로 전송 */
  body?: unknown;
};

/**
 * accessToken 만료(401) 시 재발급 — refreshToken(HttpOnly 쿠키) 기반.
 * 동시에 여러 요청이 401을 받아도 refresh는 단 한 번만 호출되도록 single-flight 처리.
 * 실패 시 null 반환(호출부에서 토큰 정리).
 */
let refreshPromise: Promise<string | null> | null = null;

/**
 * 세션 만료 시 로그인 페이지로 강제 이동(자동 로그아웃).
 * 이미 인증 화면(/login·/signup)에 있으면 중복 이동하지 않는다.
 */
function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  const { pathname } = window.location;
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) return;
  window.location.assign("/login");
}

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refresh()
      .then(({ accessToken }) => {
        if (!accessToken) return null;
        setAccessToken(accessToken);
        return accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const buildInit = (token: string | null): RequestInit => ({
    ...rest,
    // refreshToken HttpOnly 쿠키 송수신을 위해 크로스 오리진에서도 자격증명 포함
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isFormData
      ? body
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  let res = await fetch(`${BASE_URL}${path}`, buildInit(getAccessToken()));

  // accessToken 만료 시 refresh 1회 후 원요청 재시도.
  // 백엔드(Spring Security)는 만료/누락 토큰에 401뿐 아니라 403도 반환하므로 둘 다 트리거에 포함.
  // /auth/* 자체(로그인 실패·refresh 실패 등)는 재발급 대상이 아니므로 제외 → 무한루프 방지.
  if (
    (res.status === 401 || res.status === 403) &&
    !path.startsWith("/auth/")
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await fetch(`${BASE_URL}${path}`, buildInit(newToken));
    } else {
      // refresh 실패 = 세션 만료 → 토큰 정리 후 자동 로그아웃.
      clearTokens();
      redirectToLogin();
    }
  }

  if (!res.ok) {
    let message = `요청 실패 (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // 에러 응답이 JSON이 아닐 수 있음 — 기본 메시지 사용
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;

  // 본문이 비었거나 JSON이 아닌 정상 응답(예: 빈 200)도 throw 없이 통과시킨다.
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return undefined as T;
  }

  // 백엔드 공통 응답 래퍼 { success, data } 면 data만 반환.
  // 래퍼가 없는 엔드포인트(예: /crops 의 raw 배열)는 success 키가 없어 그대로 반환된다.
  if (json !== null && typeof json === "object" && "success" in json) {
    // 래퍼 계약상 data를 보유한다고 보고 단언 (런타임 의존)
    return (json as unknown as { data: T }).data;
  }
  return json as T;
}

/** undefined·빈 값을 제외한 query string 빌더 (앞에 ? 포함) */
export function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  }
  const str = search.toString();
  return str ? `?${str}` : "";
}
