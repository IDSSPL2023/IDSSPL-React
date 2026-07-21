import { SquarePenIcon } from "lucide-react";
import type { StatusTone } from "./table.types";

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  /** Only when provided does the badge render as an editable (clickable) pill with an edit affordance. */
  onClick?: () => void;
  className?: string;
}

const TONE_CLASSES: Record<StatusTone, { pill: string; dot: string }> = {
  success: { pill: "border-emerald-500 bg-emerald-50 text-emerald-600", dot: "bg-emerald-700" },
  neutral: { pill: "border-slate-200 bg-slate-50 text-slate-600", dot: "bg-slate-400" },
  pending: { pill: "border-amber-400 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  rejected: { pill: "border-red-300 bg-red-50 text-red-600", dot: "bg-red-500" },
  info: { pill: "border-primary-300 bg-primary-50 text-primary-700", dot: "bg-primary-600" },
};

/**
 * Relocated from `shared/StatusPill.tsx`. Unlike the original, the edit-pencil
 * affordance only renders when `onClick` is provided — a badge with no handler
 * no longer visually implies it's editable.
 */
export default function StatusBadge({ label, tone = "success", onClick, className = "" }: StatusBadgeProps) {
  const { pill, dot } = TONE_CLASSES[tone];
  const content = (
    <>
      <span className={`h-2 w-1.5 rounded-full ${dot}`} />
      {label}
      {onClick && <SquarePenIcon size={12} />}
    </>
  );

  const classes = `inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium whitespace-nowrap ${pill} ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${classes} cursor-pointer transition hover:brightness-95`}>
        {content}
      </button>
    );
  }

  return <span className={classes}>{content}</span>;
}
