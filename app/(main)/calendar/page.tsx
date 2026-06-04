"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getSeverityColor } from "@/lib/data/mockData";
import type { Severity } from "@/lib/types/common";
import { useCalendarByDate, useCalendarMonth } from "@/lib/queries/useCalendar";

const TODAY = new Date();

const LineChart = dynamic(() => import("recharts").then((m) => m.LineChart), {
  ssr: false,
});
const Line = dynamic(() => import("recharts").then((m) => m.Line), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false },
);
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false },
);

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(TODAY);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const { data: monthData } = useCalendarMonth(year, month + 1);
  const { data: selectedDiagnosesData } = useCalendarByDate(selectedDate);
  const selectedDiagnoses = selectedDiagnosesData ?? [];

  const getDotsForDate = (dateStr: string): Severity[] => {
    const day = (monthData ?? []).find((d) => d.date === dateStr);
    if (!day) return [];
    return [
      ...Array<Severity>(day.severeCount).fill("심각"),
      ...Array<Severity>(day.moderateCount).fill("보통"),
      ...Array<Severity>(day.mildCount).fill("경미"),
    ];
  };

  const monthlyStats = useMemo(
    () =>
      (monthData ?? [])
        .filter((d) => d.count > 0)
        .map((d) => {
          const [, m, day] = d.date.split("-");
          return {
            id: d.date,
            날짜: `${Number(m)}/${Number(day)}`,
            심각: d.severeCount,
            보통: d.moderateCount,
            경미: d.mildCount,
          };
        }),
    [monthData],
  );

  const formatMonthKr = () => `${year}년 ${month + 1}월`;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Calendar */}
      <div className="glass-card-strong mx-4 rounded-2xl overflow-hidden">
        {/* Month nav */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background:
              "linear-gradient(135deg, rgba(35,105,55,0.85) 0%, rgba(45,122,62,0.85) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <ChevronLeft size={16} style={{ color: "white" }} />
          </button>
          <h2 style={{ color: "white", fontSize: "16px", fontWeight: 700 }}>
            {formatMonthKr()}
          </h2>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <ChevronRight size={16} style={{ color: "white" }} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 px-2 pt-2">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className="text-center py-1"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: i === 0 ? "#F44336" : i === 6 ? "#1565C0" : "#9E9E9E",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 px-2 pb-3">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dots = getDotsForDate(dateStr);
            const isSelected = selectedDate === dateStr;
            const isToday =
              day === TODAY.getDate() &&
              month === TODAY.getMonth() &&
              year === TODAY.getFullYear();
            const colIndex = (i + firstDay) % 7;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className="flex flex-col items-center py-1 rounded-xl transition-all"
                style={{
                  backgroundColor: isSelected ? "#E8F5E9" : "transparent",
                  border: isSelected
                    ? "1.5px solid #2D7A3E"
                    : "1.5px solid transparent",
                  minHeight: "42px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: isToday || isSelected ? 700 : 400,
                    color: isSelected
                      ? "#2D7A3E"
                      : isToday
                        ? "#FF6B35"
                        : colIndex === 0
                          ? "#F44336"
                          : colIndex === 6
                            ? "#1565C0"
                            : "#333",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor:
                      isToday && !isSelected ? "#FFF3E0" : "transparent",
                  }}
                >
                  {day}
                </span>
                {dots.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dots.slice(0, 3).map((sev, si) => {
                      const colors = getSeverityColor(sev);
                      return (
                        <div
                          key={si}
                          className="rounded-full"
                          style={{
                            width: "4px",
                            height: "4px",
                            backgroundColor: colors.dot,
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div
          className="flex items-center justify-center gap-4 pb-3"
          style={{ borderTop: "1px solid #F5F5F5", paddingTop: "10px" }}
        >
          {[
            { label: "경미", color: "#4CAF50" },
            { label: "보통", color: "#FFC107" },
            { label: "심각", color: "#F44336" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="rounded-full"
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: item.color,
                }}
              />
              <span style={{ fontSize: "11px", color: "#757575" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats / Selected date detail */}
      <div className="mx-4 mt-3 mb-4">
        <div className="glass-card-strong rounded-2xl overflow-hidden">
          {selectedDate ? (
            <>
              <div
                className="px-4 py-3"
                style={{
                  background: "rgba(232, 245, 233, 0.6)",
                  borderBottom: "1px solid rgb(var(--glass-accent) / 0.12)",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                  }}
                >
                  {new Date(selectedDate).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  진단 기록
                </h3>
                <p style={{ fontSize: "11px", color: "#9E9E9E" }}>
                  총 {selectedDiagnoses.length}건의 진단
                </p>
              </div>
              {selectedDiagnoses.length > 0 ? (
                <div className="p-3">
                  {selectedDiagnoses.map((rec) => {
                    const colors = getSeverityColor(rec.severity);
                    return (
                      <div
                        key={rec.id}
                        className="rounded-xl p-3 mb-2 flex items-center gap-3 last:mb-0"
                        style={{
                          backgroundColor: "#FAFAFA",
                          border: "1px solid #F0F0F0",
                        }}
                      >
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={rec.imageUrl}
                            alt={rec.cropName}
                            fill
                            className="rounded-xl object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              style={{
                                fontSize: "15px",
                                fontWeight: 700,
                                color: "#1a1a1a",
                              }}
                            >
                              {rec.diseaseName}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: colors.bg,
                                color: colors.text,
                                fontSize: "10px",
                                fontWeight: 700,
                              }}
                            >
                              {rec.severity}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#757575",
                              marginBottom: "4px",
                            }}
                          >
                            {rec.cropName} · 신뢰도 {rec.confidence}% ·{" "}
                            {rec.location}
                          </p>
                          <div
                            className="flex-1 h-1.5 rounded-full"
                            style={{ backgroundColor: "#F0F0F0" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${rec.confidence}%`,
                                backgroundColor: colors.dot,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p style={{ fontSize: "13px", color: "#BDBDBD" }}>
                    해당 날짜에 진단 기록이 없습니다
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className="px-4 py-3"
                style={{
                  background: "rgba(232, 245, 233, 0.6)",
                  borderBottom: "1px solid rgb(var(--glass-accent) / 0.12)",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                  }}
                >
                  {formatMonthKr()} 진단 통계
                </h3>
                <p style={{ fontSize: "11px", color: "#9E9E9E" }}>
                  심각도별 진단 횟수
                </p>
              </div>
              <div className="px-3 py-2 pb-3">
                {monthlyStats.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart
                        data={monthlyStats}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#F0F0F0"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="날짜"
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
                        <Line
                          type="monotone"
                          dataKey="심각"
                          stroke="#F44336"
                          strokeWidth={2}
                          dot={{ fill: "#F44336", r: 2.5 }}
                          activeDot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="보통"
                          stroke="#FFC107"
                          strokeWidth={2}
                          dot={{ fill: "#FFC107", r: 2.5 }}
                          activeDot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="경미"
                          stroke="#4CAF50"
                          strokeWidth={2}
                          dot={{ fill: "#4CAF50", r: 2.5 }}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-3 mt-1">
                      {[
                        { label: "심각", color: "#F44336" },
                        { label: "보통", color: "#FFC107" },
                        { label: "경미", color: "#4CAF50" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-1"
                        >
                          <div
                            className="rounded-full"
                            style={{
                              width: "6px",
                              height: "6px",
                              backgroundColor: item.color,
                            }}
                          />
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#757575",
                              fontWeight: 500,
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <p style={{ fontSize: "12px", color: "#BDBDBD" }}>
                      이번 달 진단 기록이 없습니다
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
