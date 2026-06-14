"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthField } from "@/components/auth/AuthField";
import { AuthSelect } from "@/components/auth/AuthSelect";
import { useSignup } from "@/lib/queries/useAuth";
import {
  formatPhoneNumber,
  hasNoErrors,
  validateSignup,
  type FieldErrors,
} from "@/lib/validation/auth";
import type { SignupRequest } from "@/lib/types/auth";

type SignupForm = SignupRequest & { passwordConfirm: string };

const FARM_TYPES = ["노지 재배", "시설 재배", "과수원", "축산", "기타"];

const INITIAL: SignupForm = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  phone: "",
  location: "",
  farmType: "",
};

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignup();

  const [form, setForm] = useState<SignupForm>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors<SignupForm>>({});

  const update = (key: keyof SignupForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { passwordConfirm, ...payload } = form;
    const nextErrors: FieldErrors<SignupForm> = validateSignup(payload);
    if (!passwordConfirm) {
      nextErrors.passwordConfirm = "비밀번호를 한 번 더 입력해주세요.";
    } else if (passwordConfirm !== form.password) {
      nextErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(nextErrors);
    if (!hasNoErrors(nextErrors)) return;

    signupMutation.mutate(payload, {
      onSuccess: () => router.replace("/login"),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="glass-card-strong w-full rounded-[28px] p-6"
    >
      <h1
        className="mb-1 text-lg font-bold"
        style={{ color: "rgb(var(--glass-text) / 0.95)" }}
      >
        회원가입
      </h1>
      <p
        className="mb-6 text-sm"
        style={{ color: "rgb(var(--glass-text) / 0.55)" }}
      >
        몇 가지 정보만 입력하면 바로 시작할 수 있어요.
      </p>

      <div className="flex flex-col gap-4">
        <AuthField
          label="이름"
          name="name"
          autoComplete="name"
          placeholder="김농부"
          value={form.name}
          onChange={(e) => update("name")(e.target.value)}
          error={errors.name}
        />
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
          autoComplete="new-password"
          placeholder="8자 이상"
          value={form.password}
          onChange={(e) => update("password")(e.target.value)}
          error={errors.password}
        />
        <AuthField
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호 재입력"
          value={form.passwordConfirm}
          onChange={(e) => update("passwordConfirm")(e.target.value)}
          error={errors.passwordConfirm}
        />
        <AuthField
          label="연락처"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-1234-5678"
          maxLength={13}
          value={form.phone}
          onChange={(e) => update("phone")(formatPhoneNumber(e.target.value))}
          error={errors.phone}
        />
        <AuthField
          label="지역"
          name="location"
          placeholder="경기도 이천시"
          value={form.location}
          onChange={(e) => update("location")(e.target.value)}
          error={errors.location}
        />

        {/* 재배 유형 — 커스텀 드롭다운 */}
        <AuthSelect
          label="재배 유형"
          name="farmType"
          value={form.farmType}
          options={FARM_TYPES}
          onChange={update("farmType")}
          placeholder="재배 유형을 선택하세요"
          error={errors.farmType}
        />
      </div>

      {signupMutation.isError && (
        <p
          className="mt-4 text-sm font-medium"
          style={{ color: "rgb(220,80,70)" }}
        >
          {signupMutation.error.message || "회원가입에 실패했습니다."}
        </p>
      )}

      <button
        type="submit"
        disabled={signupMutation.isPending}
        className="glass-pill-dark mt-6 flex w-full items-center justify-center rounded-2xl text-white disabled:opacity-60"
        style={{ height: "52px", fontSize: "15px", fontWeight: 700 }}
      >
        {signupMutation.isPending ? "가입 중..." : "회원가입"}
      </button>

      <p
        className="mt-5 text-center text-sm"
        style={{ color: "rgb(var(--glass-text) / 0.6)" }}
      >
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-semibold"
          style={{ color: "rgb(var(--brand-green) / 0.95)" }}
        >
          로그인
        </Link>
      </p>
    </form>
  );
}
