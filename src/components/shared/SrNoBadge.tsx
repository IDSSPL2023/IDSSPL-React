interface SrNoBadgeProps {
  value: number | string;
  className?: string;
}

export default function SrNoBadge({ value, className = "" }: SrNoBadgeProps) {
  return (
    <span className={`inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md border border-slate-300 bg-white px-2 text-sm font-semibold text-slate-700 ${className}`}>
      {value}
    </span>
  );
}
