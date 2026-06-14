// fetch 기반 API 클라이언트 — axios 미사용 (의존성 0)
import { getAccessToken } from "@/lib/auth/token";

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

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;
  const accessToken = getAccessToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    // refreshToken HttpOnly 쿠키 송수신을 위해 크로스 오리진에서도 자격증명 포함
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: isFormData
      ? body
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

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

  const json = await res.json();
  // 백엔드 공통 응답 래퍼 { success, data } 를 자동으로 벗긴다.
  // (일부 엔드포인트는 래퍼 없이 raw 로 응답하므로 그 경우는 그대로 반환)
  if (
    json !== null &&
    typeof json === "object" &&
    "success" in json &&
    "data" in json
  ) {
    return (json as { data: T }).data;
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
