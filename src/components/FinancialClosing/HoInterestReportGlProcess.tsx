import { useState } from "react";
import type { ReactNode } from "react";
import { BarChart3, Calendar, Check, MoreVertical, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import ListModal from "@/components/AccountMaster/ListModal";

export interface HoInterestReportGlData {
  glAccountCode: string;
  accountName: string;
  fromDate: string;
  toDate: string;
}

export interface HoInterestReportGlProcessProps {
  open: boolean;
  onClose: () => void;
  onReport?: (data: HoInterestReportGlData) => void;
}

const INITIAL_VALUES: HoInterestReportGlData = {
  glAccountCode: "0002",
  accountName: "",
  fromDate: "2026-05-12",
  toDate: "2026-05-12",
};

const GL_ACCOUNTS = [
  { code: "0002", name: "Interest Payable GL" },
  { code: "0003", name: "Interest Receivable GL" },
];

const buttonBase =
  "flex h-11 min-w-[128px] items-center justify-center gap-2 rounded-lg px-6 text-[14px] font-semibold transition";

export default function HoInterestReportGlProcess({
  open,
  onClose,
  onReport,
}: HoInterestReportGlProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<HoInterestReportGlData>(INITIAL_VALUES);
  const [isValidated, setIsValidated] = useState(false);
  const [showAccountList, setShowAccountList] = useState(false);

  if (!open) return null;

  const updateValues = (patch: Partial<HoInterestReportGlData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setIsValidated(false);
  };

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleReport = () => {
    if (!isValidated) return;
    onReport?.(values);
  };

  const handlePickAccount = (account: { code: string; name: string }) => {
    updateValues({ glAccountCode: account.code, accountName: account.name });
    setShowAccountList(false);
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary shadow-sm">
              <UserRound size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold leading-tight text-[#1F2858]">
                {en("hoInterestReportGl.title")}
                {t("hoInterestReportGl.title") ? (
                  <span className="text-[#64748B]"> / {t("hoInterestReportGl.title")}</span>
                ) : null}
              </h2>
              <p className="mt-1 text-[14px] leading-snug text-[#64748B]">
                {en("loanInterestRate.subtitle")}
                {t("loanInterestRate.subtitle") ? (
                  <span> / {t("loanInterestRate.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={en("common.cancel")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="rounded-[18px] border border-primary border-t-4 bg-white px-6 pb-6 pt-6 shadow-[0_1px_8px_rgba(37,99,235,0.14)]">
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <FormField
              label={en("hoInterestReportGl.fields.glAccountCode")}
              labelHi={t("hoInterestReportGl.fields.glAccountCode")}
            >
              <div className="flex gap-2">
                <IconInput
                  icon={<UserRound size={18} className="mr-3 shrink-0 text-[#64748B]" />}
                  value={values.glAccountCode}
                  onChange={(value) => updateValues({ glAccountCode: value })}
                />
                <button
                  type="button"
                  onClick={() => setShowAccountList(true)}
                  className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                >
                  <MoreVertical size={22} strokeWidth={3} />
                </button>
              </div>
            </FormField>

            <FormField
              label={en("hoInterestReportGl.fields.accountName")}
              labelHi={t("hoInterestReportGl.fields.accountName")}
            >
              <IconInput
                icon={<UserRound size={18} className="mr-3 shrink-0 text-[#64748B]" />}
                value={values.accountName}
                onChange={() => {}}
                placeholder={tRaw("hoInterestReportGl.placeholders.name")}
                readOnly
              />
            </FormField>

            <FormField
              label={en("hoInterestReportGl.fields.fromDate")}
              labelHi={t("hoInterestReportGl.fields.fromDate")}
            >
              <IconInput
                icon={<Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />}
                value={values.fromDate}
                onChange={(value) => updateValues({ fromDate: value })}
                type="date"
              />
            </FormField>

            <FormField
              label={en("hoInterestReportGl.fields.toDate")}
              labelHi={t("hoInterestReportGl.fields.toDate")}
            >
              <IconInput
                icon={<Calendar size={18} className="mr-3 shrink-0 text-[#64748B]" />}
                value={values.toDate}
                onChange={(value) => updateValues({ toDate: value })}
                type="date"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            onClick={handleValidate}
            className={`${buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={18} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleReport}
            className={`${buttonBase} ${
              isValidated
                ? "bg-primary-50 text-primary hover:bg-primary-100"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.report")}
            <BarChart3 size={17} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={20} />
          </button>
        </div>
      </div>
    </div>

    {showAccountList && (
      <ListModal
        title="Select GL Account"
        columns={[
          { key: "code", label: "GL Account Code" },
          { key: "name", label: "Account Name" },
        ]}
        rows={GL_ACCOUNTS}
        onSelect={handlePickAccount}
        onClose={() => setShowAccountList(false)}
      />
    )}
    </>
  );
}

function FormField({
  label,
  labelHi,
  children,
}: {
  label: string;
  labelHi?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-3 block text-[15px] font-semibold leading-none text-[#1F2937]">
        {label}
        {labelHi ? <span className="text-[#64748B]"> / {labelHi}</span> : null}
        <span className="ml-0.5 text-rose-600">*</span>
      </label>
      {children}
    </div>
  );
}

function IconInput({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "date" | "text";
  readOnly?: boolean;
}) {
  return (
    <div
      className={`flex h-11 flex-1 items-center rounded-lg border border-[#7E8796] px-4 text-[15px] text-slate-700 ${
        readOnly ? "bg-slate-100" : "bg-white"
      }`}
    >
      {icon}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
      />
    </div>
  );
}
