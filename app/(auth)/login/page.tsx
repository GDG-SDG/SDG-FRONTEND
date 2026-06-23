"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { useLogin } from "@/lib/queries/useAuth";
import { USE_MOCK } from "@/lib/api/client";
import {
  hasNoErrors,
  validateLogin,
  type FieldErrors,
} from "@/lib/validation/auth";
import type { LoginRequest } from "@/lib/types/auth";

const REDIRECT_AFTER_LOGIN = "/calendar";

/** mock 구간 전용 프리패스 계정 (백엔드 미연동 개발 편의) */
const TEST_ACCOUNT: LoginRequest = {
  email: "test@test.com",
  password: "test1234",
};

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<LoginRequest>>({});

  const update = (key: keyof LoginRequest) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    if (!hasNoErrors(nextErrors)) return;

    loginMutation.mutate(form, {
      onSuccess: () => router.replace(REDIRECT_AFTER_LOGIN),
    });
  };

  const handleTestLogin = () => {
    setForm(TEST_ACCOUNT);
    setErrors({});
    loginMutation.mutate(TEST_ACCOUNT, {
      onSuccess: () => router.replace(REDIRECT_AFTER_LOGIN),
    });
  };

  return (
    <>
      {/* 브랜드 */}
      <div className="mb-7 flex flex-col items-center gap-3">
        <div className="glass-pill-dark flex h-16 w-16 items-center justify-center rounded-[22px]">
          <Leaf size={32} className="text-white" />
        </div>
        <div
          className="text-xl font-extrabold tracking-tight"
          style={{ color: "rgb(var(--glass-text) / 0.95)" }}
        >
          Agriguard
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="glass-card-strong w-full rounded-[28px] p-6"
      >
        <h1
          className="mb-1 text-lg font-bold"
          style={{ color: "rgb(var(--glass-text) / 0.95)" }}
        >
          로그인
        </h1>
        <p
          className="mb-6 text-sm"
          style={{ color: "rgb(var(--glass-text) / 0.55)" }}
        >
          작물 진단 기록을 이어서 확인하세요.
        </p>

        <div className="flex flex-col gap-4">
          <AuthField
            label="이메일"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="farmer.kim@example.com"
            value={form.email}
            onChange={(e) => update("email")(e.target.value)}
            error={errors.email}
          />
          <AuthField
            label="비밀번호"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(e) => update("password")(e.target.value)}
            error={errors.password}
          />
        </div>

        {loginMutation.isError && (
          <p
            className="mt-4 text-sm font-medium"
            style={{ color: "rgb(220,80,70)" }}
          >
            {loginMutation.error.message || "로그인에 실패했습니다."}
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="glass-pill-dark mt-6 flex w-full items-center justify-center rounded-2xl text-white disabled:opacity-60"
          style={{ height: "52px", fontSize: "15px", fontWeight: 700 }}
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>

        {/* mock 구간 전용 — 백엔드 연동 시 자동으로 숨겨짐 */}
        {USE_MOCK && (
          <button
            type="button"
            onClick={handleTestLogin}
            disabled={loginMutation.isPending}
            className="glass-pill mt-3 flex w-full items-center justify-center rounded-2xl disabled:opacity-60"
            style={{
              height: "48px",
              fontSize: "14px",
              fontWeight: 600,
              color: "rgb(var(--glass-text) / 0.8)",
            }}
          >
            테스트 계정으로 로그인
          </button>
        )}

        <p
          className="mt-5 text-center text-sm"
          style={{ color: "rgb(var(--glass-text) / 0.6)" }}
        >
          아직 계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-semibold"
            style={{ color: "rgb(var(--brand-green) / 0.95)" }}
          >
            회원가입
          </Link>
        </p>
      </form>
    </>
  );
}
