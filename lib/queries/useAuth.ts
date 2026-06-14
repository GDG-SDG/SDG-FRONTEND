// 인증 뮤테이션 훅 — TanStack Query
import { useMutation } from "@tanstack/react-query";
import { login, logout, signup } from "@/lib/api/auth";
import { clearTokens, setAccessToken } from "@/lib/auth/token";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/lib/types/auth";

/** 로그인 — 성공 시 토큰 저장 */
export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
  });
}

/** 회원가입 */
export function useSignup() {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signup,
  });
}

/**
 * 로그아웃 — 서버 호출 성공 여부와 무관하게 로컬 토큰을 비운다.
 * (서버 실패/네트워크 오류로 로그아웃이 막히면 안 되므로 onSettled에서 정리)
 */
export function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSettled: () => {
      clearTokens();
    },
  });
}
