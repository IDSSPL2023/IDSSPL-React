import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  FileText,
  Percent,
  UserRound,
  X,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";
import { FieldShell, LookupButton, TextInput } from "@/components/shared/FormFields";
import { useBilingual } from "@/i18n/useBilingual";

export interface LoanInterestRateRow {
  id: string;
  checked: boolean;
  interestRate: string;
  penalInterest: string;
  overdueInterest: string;
  moratoriumInterest: string;
  dateOfApplication: string;
}

export interface LoanInterestRateData {
  accountCode: string;
  accountName: string;
  rows: LoanInterestRateRow[];
}

export interface AddModifyLoanInterestRateProps {
  onClose: () => void;
  onSave?: (data: LoanInterestRateData) => void;
  variant?: "modal" | "page";
}

const DEFAULT_ROWS: LoanInterestRateRow[] = [
  {
    id: "current",
    checked: false,
    interestRate: "00025050007604",
    penalInterest: "14.0",
    overdueInterest: "2.0",
    moratoriumInterest: "0.0",
    dateOfApplication: "2026-11-12",
  },
  {
    id: "modified",
    checked: true,
    interestRate: "00025050007604",
    penalInterest: "14.0",
    overdueInterest: "2.0",
    moratoriumInterest: "0",
    dateOfApplication: "2026-03-12",
  },
];

const ACCOUNT_CODES = ["0002", "0003", "0004"];

const percentFields = ["penalInterest", "overdueInterest", "moratoriumInterest"] as const;

export default function AddModifyLoanInterestRate({
  onClose,
  onSave,
  variant = "modal",
}: AddModifyLoanInterestRateProps) {
  const { en, t, tRaw } = useBilingual();
  const [accountCode, setAccountCode] = useState("0002");
  const [accountName] = useState("");
  const [rows, setRows] = useState<LoanInterestRateRow[]>(DEFAULT_ROWS);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateRow = (id: string, patch: Partial<LoanInterestRateRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addNewRow = () => {
    setRows((prev) => [
      ...prev.map((row) => ({ ...row, checked: false })),
      {
        id: `new-${Date.now()}`,
        checked: true,
        interestRate: accountCode.padEnd(14, "0"),
        penalInterest: "0.0",
        overdueInterest: "0.0",
        moratoriumInterest: "0.0",
        dateOfApplication: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  const handleSave = () => {
    const payload = { accountCode, accountName, rows };
    onSave?.(payload);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
        title={en("loanInterestRate.successTitle")}
        subtitle={en("loanInterestRate.successSubtitle")}
      />
    );
  }

  const footer = (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={addNewRow}
        className="flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-md border border-primary-500 bg-white px-4 text-xs font-medium text-primary transition hover:bg-primary-50"
      >
        {en("loanInterestRate.actions.new")}
        <FileText size={13} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-md border border-primary-500 bg-white px-4 text-xs font-medium text-primary transition hover:bg-primary-50"
      >
        {en("common.cancel")}
        <X size={13} />
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-md bg-primary-100 px-4 text-xs font-medium text-primary transition hover:bg-primary-200"
      >
        {en("common.save")}
        <ChevronDown size={13} />
      </button>
    </div>
  );

  return (
    <FormModal
      onClose={onClose}
      titleEn={en("loanInterestRate.title")}
      titleHi={t("loanInterestRate.title")}
      subtitleEn={en("loanInterestRate.subtitle")}
      subtitleHi={t("loanInterestRate.subtitle")}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      maxWidth="max-w-5xl"
      hideFooter
      customFooter={footer}
      variant={variant}
    >
      <div className="rounded-xl border border-primary border-t-4 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_44px_1.1fr] md:items-end">
          <FieldShell
            label={en("fields.accountCode")}
            labelHi={t("fields.accountCode")}
            required
          >
            <TextInput
              icon={<UserRound size={16} />}
              value={accountCode}
              onChange={setAccountCode}
              placeholder={tRaw("loanInterestRate.placeholders.accountCode")}
              trailing={<LookupButton items={ACCOUNT_CODES} onPick={setAccountCode} />}
            />
          </FieldShell>

          <div className="hidden md:block" />

          <FieldShell
            label={en("fields.accountName")}
            labelHi={t("fields.accountName")}
            required
          >
            <TextInput
              icon={<UserRound size={16} />}
              value={accountName}
              onChange={() => {}}
              placeholder={tRaw("loanInterestRate.placeholders.accountName")}
              readOnly
            />
          </FieldShell>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-100">
        <table className="min-w-[850px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[64px]" />
            <col className="w-[210px]" />
            <col className="w-[145px]" />
            <col className="w-[145px]" />
            <col className="w-[165px]" />
            <col className="w-[185px]" />
          </colgroup>
          <thead>
            <tr className="bg-[#211858] text-left text-xs font-semibold text-white">
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.check")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.interestRate")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.penalInterest")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.overdueInterest")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.moratoriumInterest")}</th>
              <th className="px-3 py-2">{tRaw("loanInterestRate.table.dateOfApplication")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-slate-100 last:border-b-0 ${
                  row.checked ? "bg-[#F7F8FC]" : "bg-white"
                }`}
              >
                <td className="px-3 py-2 align-middle">
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={(event) => updateRow(row.id, { checked: event.target.checked })}
                    className="h-3.5 w-3.5 rounded border-slate-300 accent-primary"
                  />
                </td>
                <td className="px-3 py-2 align-middle">
                  <span className="block truncate text-xs font-medium text-[#1F2858]">
                    {row.interestRate}
                  </span>
                </td>
                {percentFields.map((field) => (
                  <td key={field} className="px-3 py-2 align-middle">
                    <PercentInput
                      value={row[field]}
                      disabled={!row.checked}
                      onChange={(value) => updateRow(row.id, { [field]: value })}
                    />
                  </td>
                ))}
                <td className="px-3 py-2 align-middle">
                  <DateCell
                    value={row.dateOfApplication}
                    disabled={!row.checked}
                    onChange={(value) => updateRow(row.id, { dateOfApplication: value })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FormModal>
  );
}
function PercentInput({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`flex h-8 items-center rounded-md border px-2.5 text-xs ${
        disabled
          ? "border-slate-200 bg-slate-100 text-slate-500"
          : "border-primary bg-white text-slate-700 shadow-[0_0_0_1px_rgba(37,99,235,0.08)]"
      }`}
    >
      <Percent size={12} className="mr-1.5 shrink-0 text-slate-500" />
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
      />
    </label>
  );
}

function DateCell({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`flex h-8 items-center rounded-md border px-2.5 text-xs ${
        disabled
          ? "border-slate-200 bg-slate-100 text-slate-500"
          : "border-primary bg-white text-slate-700 shadow-[0_0_0_1px_rgba(37,99,235,0.08)]"
      }`}
    >
      <Calendar size={12} className="mr-1.5 shrink-0 text-slate-500" />
      <input
        type="date"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
      />
    </label>
  );
}
