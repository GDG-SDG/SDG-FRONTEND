"use client";

import { forwardRef } from "react";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/** 라벨 + 인풋 + 에러 메시지 묶음 — 글래스 폼 톤 */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField({ label, error, id, ...rest }, ref) {
    const fieldId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={fieldId}
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "rgb(var(--glass-text) / 0.75)",
          }}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className="auth-input"
          aria-invalid={!!error}
          style={{
            width: "100%",
            padding: "13px 16px",
            borderRadius: "14px",
            fontSize: "15px",
            color: "rgb(var(--glass-text) / 0.95)",
            background: "rgba(255,255,255,0.7)",
            border: error
              ? "1.5px solid rgba(220,80,70,0.7)"
              : "1.5px solid rgba(180,200,188,0.55)",
            outline: "none",
            transition: "border-color 0.18s ease",
          }}
          {...rest}
        />
        {error && (
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "rgb(220,80,70)",
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);
