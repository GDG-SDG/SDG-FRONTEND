"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useMypage, useMypageSummary } from "@/lib/queries/useUser";
import { useMonthlyStats } from "@/lib/queries/useDiagnoses";
import {
  NotificationSettingsModal,
  ProfileEditModal,
  PasswordChangeModal,
  WithdrawModal,
} from "@/components/mypage/AccountModals";

type AccountModal = "notification" | "profile" | "password" | "withdraw";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false },
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false },
);

const formatJoinDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <Icon size={16} style={{ color: "#616161" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: "11px", color: "#9E9E9E", marginBottom: "2px" }}>
          {label}
        </p>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function MyPage() {
  const { data: profile } = useMypage();
  const { data: summary } = useMypageSummary();
  const year = new Date().getFullYear();
  const { data: monthlyStats } = useMonthlyStats(year);

  const [activeModal, setActiveModal] = useState<AccountModal | null>(null);

  const chartData = (monthlyStats ?? []).map((s) => ({
    월: `${s.month}월`,
    총진단: s.totalCount,
    심각: s.severeCount,
  }));

  const menuItems = [
    {
      icon: Bell,
      label: "알림 설정",
      color: "#FF6B35",
      onClick: () => setActiveModal("notification"),
    },
    {
      icon: Shield,
      label: "비밀번호 변경",
      color: "#2D7A3E",
      onClick: () => setActiveModal("password"),
    },
    {
      icon: HelpCircle,
      label: "고객 지원",
      color: "#1976D2",
      onClick: () => {},
    },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ paddingBottom: "24px" }}>
      {/* Profile section */}
      <div className="glass-card-strong mx-4 mt-4 rounded-2xl overflow-hidden">
        <div
          className="px-5 py-6 flex items-center gap-4"
          style={{
            background: "rgba(232, 245, 233, 0.6)",
            borderBottom: "1px solid rgb(var(--glass-accent) / 0.12)",
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#2D7A3E" }}
          >
            <User size={36} style={{ color: "white" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1
                style={{ fontSize: "20px", fontWeight: 800, color: "#1a1a1a" }}
              >
                {profile?.name ?? "-"}
              </h1>
              <button
                onClick={() => setActiveModal("profile")}
                className="glass-pill w-7 h-7 rounded-full flex items-center justify-center"
              >
                <Edit
                  size={14}
                  style={{ color: "rgb(var(--glass-text) / 0.75)" }}
                />
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#757575" }}>
              {profile?.farmType ?? "-"}
            </p>
          </div>
        </div>
        <div className="px-5 py-4">
          <InfoRow icon={Mail} label="이메일" value={profile?.email ?? "-"} />
          <InfoRow
            icon={Phone}
            label="전화번호"
            value={profile?.phone ?? "-"}
          />
          <InfoRow
            icon={MapPin}
            label="위치"
            value={profile?.location ?? "-"}
          />
          <InfoRow
            icon={Calendar}
            label="가입일"
            value={formatJoinDate(profile?.joinedAt)}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="mx-4 mt-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: "총 진단",
              value: String(summary?.totalDiagnosisCount ?? 0),
              sub: "건",
              token: "--brand-green",
            },
            {
              label: "이번 달",
              value: String(summary?.monthlyDiagnosisCount ?? 0),
              sub: "건",
              token: "--accent-orange",
            },
            {
              label: "방제 완료",
              value: String(summary?.treatmentCompletedCount ?? 0),
              sub: "건",
              token: "--info-blue",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl px-3 py-3.5 text-center"
              style={{ backgroundColor: `rgb(var(${item.token}) / 0.1)` }}
            >
              <div className="flex items-baseline justify-center gap-0.5">
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: `rgb(var(${item.token}))`,
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: `rgb(var(${item.token}))`,
                  }}
                >
                  {item.sub}
                </span>
              </div>
              <div
                style={{ fontSize: "11px", color: "#757575", marginTop: "4px" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 연간 진단 추이 */}
      <div className="mx-4 mt-3">
        <div className="glass-card-strong rounded-2xl overflow-hidden">
          <div
            className="px-4 py-3"
            style={{
              background: "rgba(232, 245, 233, 0.6)",
              borderBottom: "1px solid rgb(var(--glass-accent) / 0.12)",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>
              {year}년 진단 추이
            </h3>
            <p style={{ fontSize: "11px", color: "#9E9E9E" }}>월별 진단 건수</p>
          </div>
          <div className="px-3 py-3">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F0F0F0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="월"
                    tick={{ fontSize: 9, fill: "#9E9E9E" }}
                    stroke="#E0E0E0"
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "#9E9E9E" }}
                    stroke="#E0E0E0"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E0E0E0",
                      borderRadius: "6px",
                      fontSize: "10px",
                      padding: "4px 8px",
                    }}
                  />
                  <Bar dataKey="총진단" fill="#2D7A3E" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="심각" fill="#F44336" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-6 text-center">
                <p style={{ fontSize: "12px", color: "#BDBDBD" }}>
                  통계가 없습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="mx-4 mt-3">
        <div className="glass-card-strong rounded-2xl overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="glass-row w-full flex items-center gap-3 px-5 py-4"
              style={{
                borderTop:
                  idx > 0 ? "1px solid rgb(var(--glass-accent) / 0.1)" : "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <span
                style={{ fontSize: "15px", fontWeight: 600, color: "#333" }}
              >
                {item.label}
              </span>
              <ChevronRight
                size={16}
                style={{ color: "#BDBDBD", marginLeft: "auto" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="mx-4 mt-3">
        <button
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl"
          style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2" }}
        >
          <LogOut size={18} style={{ color: "#F44336" }} />
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#F44336" }}>
            로그아웃
          </span>
        </button>
        <button
          onClick={() => setActiveModal("withdraw")}
          className="w-full mt-2 py-2 text-center"
          style={{ fontSize: "12px", color: "#9E9E9E", fontWeight: 500 }}
        >
          회원 탈퇴
        </button>
      </div>

      {/* App version */}
      <div className="mx-4 mt-4 text-center">
        <p style={{ fontSize: "11px", color: "#BDBDBD" }}>팜케어 AI v1.0.0</p>
        <p style={{ fontSize: "10px", color: "#E0E0E0", marginTop: "4px" }}>
          © 2026 FarmCare AI. All rights reserved.
        </p>
      </div>

      {/* Account modals */}
      {activeModal === "notification" && (
        <NotificationSettingsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "profile" && profile && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "password" && (
        <PasswordChangeModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "withdraw" && (
        <WithdrawModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
