"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Mypage, NotificationSettings } from "@/lib/types/user";
import {
  useDeleteUser,
  useNotificationSettings,
  useUpdateMypage,
  useUpdateNotificationSettings,
  useUpdatePassword,
} from "@/lib/queries/useUser";

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="glass-card-strong w-full rounded-2xl overflow-hidden"
        style={{ maxWidth: "340px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid #F0F0F0" }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
          >
            <X size={18} style={{ color: "#757575" }} />
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <label
        style={{
          fontSize: "12px",
          color: "#757575",
          marginBottom: "4px",
          display: "block",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl outline-none"
        style={{ border: "1px solid #E0E0E0", fontSize: "14px" }}
      />
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-xl active:scale-[0.98] transition-all"
      style={{
        backgroundColor: danger ? "#F44336" : "#2D7A3E",
        color: "white",
        fontSize: "14px",
        fontWeight: 700,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-full flex-shrink-0 transition-colors"
      style={{
        width: "44px",
        height: "24px",
        backgroundColor: on ? "#2D7A3E" : "#E0E0E0",
      }}
    >
      <span
        className="absolute rounded-full bg-white"
        style={{
          width: "20px",
          height: "20px",
          top: "2px",
          left: on ? "22px" : "2px",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

/** 알림 설정 */
export function NotificationSettingsModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { data } = useNotificationSettings();
  const update = useUpdateNotificationSettings();
  const [local, setLocal] = useState<NotificationSettings | null>(null);
  const settings: NotificationSettings = local ??
    data ?? {
      diagnosisResult: false,
      treatmentReminder: false,
      weatherAlert: false,
    };

  const toggle = (key: keyof NotificationSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setLocal(next);
    update.mutate(next);
  };

  const rows: { key: keyof NotificationSettings; label: string }[] = [
    { key: "diagnosisResult", label: "진단 결과 알림" },
    { key: "treatmentReminder", label: "방제 리마인더" },
    { key: "weatherAlert", label: "기상 경보 알림" },
  ];

  return (
    <ModalShell title="알림 설정" onClose={onClose}>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between py-1">
            <span style={{ fontSize: "14px", color: "#333" }}>{row.label}</span>
            <Toggle on={settings[row.key]} onClick={() => toggle(row.key)} />
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

/** 내 정보 수정 */
export function ProfileEditModal({
  profile,
  onClose,
}: {
  profile: Mypage;
  onClose: () => void;
}) {
  const update = useUpdateMypage();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [farmType, setFarmType] = useState(profile.farmType);

  const submit = async () => {
    await update.mutateAsync({ name, phone, location, farmType });
    onClose();
  };

  return (
    <ModalShell title="내 정보 수정" onClose={onClose}>
      <Field label="이름" value={name} onChange={setName} />
      <Field label="전화번호" value={phone} onChange={setPhone} />
      <Field label="위치" value={location} onChange={setLocation} />
      <Field label="재배 유형" value={farmType} onChange={setFarmType} />
      <PrimaryButton onClick={submit} disabled={update.isPending}>
        {update.isPending ? "저장 중..." : "저장"}
      </PrimaryButton>
    </ModalShell>
  );
}

/** 비밀번호 변경 */
export function PasswordChangeModal({ onClose }: { onClose: () => void }) {
  const update = useUpdatePassword();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    if (!current || !next) {
      setError("모든 항목을 입력하세요");
      return;
    }
    if (next.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 합니다");
      return;
    }
    if (next !== confirm) {
      setError("새 비밀번호가 일치하지 않습니다");
      return;
    }
    setError("");
    await update.mutateAsync({ currentPassword: current, newPassword: next });
    onClose();
  };

  return (
    <ModalShell title="비밀번호 변경" onClose={onClose}>
      <Field
        label="현재 비밀번호"
        type="password"
        value={current}
        onChange={setCurrent}
      />
      <Field
        label="새 비밀번호 (8자 이상)"
        type="password"
        value={next}
        onChange={setNext}
      />
      <Field
        label="새 비밀번호 확인"
        type="password"
        value={confirm}
        onChange={setConfirm}
      />
      {error && (
        <p style={{ fontSize: "12px", color: "#F44336", marginBottom: "8px" }}>
          {error}
        </p>
      )}
      <PrimaryButton onClick={submit} disabled={update.isPending}>
        {update.isPending ? "변경 중..." : "변경하기"}
      </PrimaryButton>
    </ModalShell>
  );
}

/** 회원 탈퇴 */
export function WithdrawModal({ onClose }: { onClose: () => void }) {
  const del = useDeleteUser();
  const [password, setPassword] = useState("");

  const submit = async () => {
    if (!password) return;
    await del.mutateAsync(password);
    onClose();
  };

  return (
    <ModalShell title="회원 탈퇴" onClose={onClose}>
      <div
        className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-3"
        style={{ backgroundColor: "#FFEBEE" }}
      >
        <AlertTriangle
          size={16}
          style={{ color: "#F44336", flexShrink: 0, marginTop: "1px" }}
        />
        <p style={{ fontSize: "12px", color: "#C62828", lineHeight: 1.5 }}>
          탈퇴 시 모든 진단 기록이 삭제되며 복구할 수 없습니다.
        </p>
      </div>
      <Field
        label="비밀번호 확인"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <PrimaryButton
        onClick={submit}
        disabled={del.isPending || !password}
        danger
      >
        {del.isPending ? "처리 중..." : "탈퇴하기"}
      </PrimaryButton>
    </ModalShell>
  );
}
