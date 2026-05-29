"use client";

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
  const userInfo = {
    name: "김농부",
    email: "farmer.kim@example.com",
    phone: "010-1234-5678",
    location: "경기도 이천시",
    joinDate: "2025년 3월 15일",
    farmType: "노지 재배",
  };

  const menuItems = [
    { icon: Bell, label: "알림 설정", color: "#FF6B35" },
    { icon: Shield, label: "개인정보 보호", color: "#2D7A3E" },
    { icon: HelpCircle, label: "고객 지원", color: "#1976D2" },
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
                {userInfo.name}
              </h1>
              <button className="glass-pill w-7 h-7 rounded-full flex items-center justify-center">
                <Edit
                  size={14}
                  style={{ color: "rgb(var(--glass-text) / 0.75)" }}
                />
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#757575" }}>
              {userInfo.farmType}
            </p>
          </div>
        </div>
        <div className="px-5 py-4">
          <InfoRow icon={Mail} label="이메일" value={userInfo.email} />
          <InfoRow icon={Phone} label="전화번호" value={userInfo.phone} />
          <InfoRow icon={MapPin} label="위치" value={userInfo.location} />
          <InfoRow icon={Calendar} label="가입일" value={userInfo.joinDate} />
        </div>
      </div>

      {/* Statistics */}
      <div className="mx-4 mt-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: "총 진단",
              value: "24",
              sub: "건",
              color: "#2D7A3E",
              bg: "#E8F5E9",
            },
            {
              label: "이번 달",
              value: "5",
              sub: "건",
              color: "#FF6B35",
              bg: "#FFF3E0",
            },
            {
              label: "방제 완료",
              value: "19",
              sub: "건",
              color: "#1976D2",
              bg: "#E3F2FD",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: item.bg }}
            >
              <div
                style={{ fontSize: "22px", fontWeight: 800, color: item.color }}
              >
                {item.value}
              </div>
              <div
                style={{ fontSize: "11px", color: item.color, fontWeight: 600 }}
              >
                {item.sub}
              </div>
              <div
                style={{ fontSize: "10px", color: "#757575", marginTop: "2px" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="mx-4 mt-3">
        <div className="glass-card-strong rounded-2xl overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
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
      </div>

      {/* App version */}
      <div className="mx-4 mt-4 text-center">
        <p style={{ fontSize: "11px", color: "#BDBDBD" }}>팜케어 AI v1.0.0</p>
        <p style={{ fontSize: "10px", color: "#E0E0E0", marginTop: "4px" }}>
          © 2026 FarmCare AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
