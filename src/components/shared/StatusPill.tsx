import { ExternalLink, SquarePenIcon } from "lucide-react";

export type StatusPillTone = "success" | "neutral" | "pending" | "rejected";

interface StatusPillProps {
  label: string;
  tone?: StatusPillTone;
}

const TONE_CLASSES: Record<NonNullable<StatusPillProps["tone"]>, { pill: string; dot: string }> = {
  success: { pill: "border-emerald-500 bg-emerald-50 text-emerald-600", dot: "bg-emerald-700" },
  neutral: { pill: "border-slate-200 bg-slate-50 text-slate-600", dot: "bg-slate-400" },
  pending: { pill: "border-amber-400 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  rejected: { pill: "border-red-300 bg-red-50 text-red-600", dot: "bg-red-500" },
};

export default function StatusPill({ label, tone = "success" }: StatusPillProps) {
  const { pill, dot } = TONE_CLASSES[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium whitespace-nowrap ${pill}`}>
      <span className={`h-2 w-1.5 rounded-full ${dot}`} />
      {label}
      <SquarePenIcon size={12} />
    </span>
  );
}
