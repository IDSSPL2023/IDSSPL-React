import { IndianRupee } from "lucide-react";

export const DENOMINATION_NOTE_LABELS = ["2000", "500", "200", "100", "50", "20", "10", "5", "2", "1", "Change"] as const;
export type DenominationNoteLabel = (typeof DENOMINATION_NOTE_LABELS)[number];

export type DenominationColumn = { key: string; label: string };
export type DenominationRowValues = Record<string, string>;

export const emptyDenominationRows = (columnKeys: string[]): Record<DenominationNoteLabel, DenominationRowValues> =>
  DENOMINATION_NOTE_LABELS.reduce(
    (acc, label) => ({ ...acc, [label]: Object.fromEntries(columnKeys.map((key) => [key, ""])) }),
    {} as Record<DenominationNoteLabel, DenominationRowValues>
  );

export const sumDenominationColumn = (
  rows: Record<DenominationNoteLabel, DenominationRowValues>,
  columnKey: string
) => Object.values(rows).reduce((sum, row) => sum + Number(row[columnKey] || 0), 0);

const DenomInput = ({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) => (
  <div className="relative flex items-center">
    <span className="pointer-events-none absolute left-3 text-slate-400">
      <IndianRupee size={14} />
    </span>
    <input
      type="number"
      inputMode="decimal"
      value={value}
      readOnly={readOnly}
      placeholder="0"
      onChange={(e) => onChange?.(e.target.value)}
      className={`h-10 w-full rounded-lg border pl-8 pr-3 text-sm text-slate-700 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
        readOnly ? "border-slate-200 bg-slate-50 text-slate-500" : "border-slate-300 bg-white"
      }`}
    />
  </div>
);

export interface DenominationTableProps {
  columns: DenominationColumn[];
  rows: Record<DenominationNoteLabel, DenominationRowValues>;
  onChange: (label: DenominationNoteLabel, columnKey: string, value: string) => void;
  totals: DenominationRowValues;
  firstColumnLabel?: string;
}

/** Shared "Cash | note columns" table used by cash-handling screens (Combine Accept
 * Pay Cash Multiple, Recovery Summary, Pay Cash, ...) so the layout only lives in one place. */
export const DenominationTable = ({ columns, rows, onChange, totals, firstColumnLabel = "Cash" }: DenominationTableProps) => {
  const gridTemplateColumns = `1fr repeat(${columns.length}, 2fr)`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="grid gap-3 bg-[#1F2858] px-5 py-3 text-sm font-semibold text-white" style={{ gridTemplateColumns }}>
        <div>{firstColumnLabel}</div>
        {columns.map((col) => (
          <div key={col.key}>{col.label}</div>
        ))}
      </div>
      <div className="divide-y divide-slate-100 bg-white">
        {DENOMINATION_NOTE_LABELS.map((label) => (
          <div key={label} className="grid items-center gap-3 px-5 py-2.5" style={{ gridTemplateColumns }}>
            <div className="text-sm font-medium text-slate-700">{label}</div>
            {columns.map((col) => (
              <DenomInput
                key={col.key}
                value={rows[label][col.key]}
                onChange={(v) => onChange(label, col.key, v)}
              />
            ))}
          </div>
        ))}
        <div className="grid items-center gap-3 bg-slate-50 px-5 py-2.5" style={{ gridTemplateColumns }}>
          <div className="text-sm font-semibold text-slate-800">Total</div>
          {columns.map((col) => (
            <DenomInput key={col.key} value={totals[col.key] ?? "0"} readOnly />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DenominationTable;
