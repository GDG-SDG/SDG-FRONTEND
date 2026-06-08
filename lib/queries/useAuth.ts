// 인증 뮤테이션 훅 — TanStack Query
import { useMutation } from "@tanstack/react-query";
import { login, signup } from "@/lib/api/auth";
import { setTokens } from "@/lib/auth/token";
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
      setTokens(data.accessToken, data.refreshToken);
    },
  });
}

/** 회원가입 */
export function useSignup() {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signup,
  });
}
