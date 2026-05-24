import { getSeverityColor, Severity } from "@/lib/data/mockData";

export function SeverityBadge({ severity }: { severity: Severity }) {
  const colors = getSeverityColor(severity);
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {severity}
    </span>
  );
}
