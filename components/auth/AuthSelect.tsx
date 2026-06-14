"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

interface AuthSelectProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

/**
 * 글래스 톤 커스텀 드롭다운 — 네이티브 select 대체.
 * 옵션 패널은 필드 위쪽으로 펼쳐진다(폼 하단에서도 가림 없이 보이도록).
 */
export function AuthSelect({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "선택하세요",
  error,
}: AuthSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "rgb(var(--glass-text) / 0.75)",
        }}
      >
        {label}
      </label>

      <div ref={ref} style={{ position: "relative" }}>
        <button
          type="button"
          id={name}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="auth-input"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            padding: "13px 16px",
            borderRadius: "14px",
            fontSize: "15px",
            textAlign: "left",
            cursor: "pointer",
            color: value
              ? "rgb(var(--glass-text) / 0.95)"
              : "rgb(var(--glass-text) / 0.4)",
            background: "rgba(255,255,255,0.7)",
            border: error
              ? "1.5px solid rgba(220,80,70,0.7)"
              : open
                ? "1.5px solid #2d7a3e"
                : "1.5px solid rgba(180,200,188,0.55)",
            outline: "none",
            transition: "border-color 0.18s ease",
          }}
        >
          <span>{value || placeholder}</span>
          <ChevronDown
            size={18}
            style={{
              flexShrink: 0,
              color: "rgb(var(--glass-text) / 0.5)",
              transition: "transform 0.18s ease",
              transform: open ? "rotate(180deg)" : "none",
            }}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
              className="glass-card-strong"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "calc(100% + 8px)",
                zIndex: 50,
                margin: 0,
                padding: "6px",
                listStyle: "none",
                borderRadius: "16px",
                maxHeight: "220px",
                overflowY: "auto",
                boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
              }}
            >
              {options.map((opt) => {
                const selected = opt === value;
                return (
                  <li key={opt} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setOpen(false);
                      }}
                      className="auth-select-option"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        padding: "11px 14px",
                        borderRadius: "11px",
                        fontSize: "14px",
                        fontWeight: selected ? 600 : 500,
                        textAlign: "left",
                        cursor: "pointer",
                        border: "none",
                        background: selected
                          ? "rgb(var(--brand-green) / 0.10)"
                          : "transparent",
                        color: selected
                          ? "rgb(var(--brand-green) / 0.95)"
                          : "rgb(var(--glass-text) / 0.85)",
                      }}
                    >
                      <span>{opt}</span>
                      {selected && (
                        <Check size={16} style={{ flexShrink: 0 }} />
                      )}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <span
          style={{ fontSize: "12px", fontWeight: 500, color: "rgb(220,80,70)" }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
