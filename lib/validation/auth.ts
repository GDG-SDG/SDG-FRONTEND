// 인증 폼 유효성 검사 — 라이브러리 미사용, 순수 함수 기반
import type { LoginRequest, SignupRequest } from "@/lib/types/auth";

/** 필드별 에러 메시지 맵 (값이 있으면 에러) */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 010-1234-5678 형태 (하이픈 필수)
const PHONE_RE = /^01[016789]-\d{3,4}-\d{4}$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "이메일을 입력해주세요.";
  if (!EMAIL_RE.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "비밀번호를 입력해주세요.";
  if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  return undefined;
}

/**
 * 입력값을 010-1234-5678 형태로 자동 포맷.
 * 숫자만 추출해 최대 11자리까지 3-4-4로 하이픈을 끼운다 (입력 중 부분값도 자연스럽게).
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return "연락처를 입력해주세요.";
  if (!PHONE_RE.test(phone))
    return "연락처는 010-1234-5678 형식으로 입력해주세요.";
  return undefined;
}

function validateRequired(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `${label}을(를) 입력해주세요.`;
}

/** 로그인 폼 검증 */
export function validateLogin(form: LoginRequest): FieldErrors<LoginRequest> {
  const errors: FieldErrors<LoginRequest> = {};
  const email = validateEmail(form.email);
  if (email) errors.email = email;
  const password = validatePassword(form.password);
  if (password) errors.password = password;
  return errors;
}

/** 회원가입 폼 검증 — password 확인란은 페이지에서 별도 처리 */
export function validateSignup(
  form: SignupRequest,
): FieldErrors<SignupRequest> {
  const errors: FieldErrors<SignupRequest> = {};
  const name = validateRequired(form.name, "이름");
  if (name) errors.name = name;
  const email = validateEmail(form.email);
  if (email) errors.email = email;
  const password = validatePassword(form.password);
  if (password) errors.password = password;
  const phone = validatePhone(form.phone);
  if (phone) errors.phone = phone;
  const location = validateRequired(form.location, "지역");
  if (location) errors.location = location;
  const farmType = validateRequired(form.farmType, "재배 유형");
  if (farmType) errors.farmType = farmType;
  return errors;
}

/** 에러 맵이 비어 있으면 통과 */
export function hasNoErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length === 0;
}
