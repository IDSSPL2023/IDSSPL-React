import { useState } from "react";
import { Calculator, Calendar, Check, FileText, MoreVertical, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";
import { FieldShell, TextInput, DateInput, RadioYesNo } from "@/components/shared/FormFields";
import ListModal from "@/components/AccountMaster/ListModal";

export interface TlccInterestPostingData {
  accountType: string;
  accountTypeDescription: string;
  nextIntPostingDate: string;
  nextIntPostingUpToDate: string;
  applyServiceCharges: boolean;
  interestReposting: boolean;
}

export interface TlccInterestPostingProcessProps {
  open: boolean;
  onClose: () => void;
  onCalculate?: (data: TlccInterestPostingData) => void;
  onGenerateReport?: (data: TlccInterestPostingData) => void;
  onApply?: (data: TlccInterestPostingData) => void;
}

const ACCOUNT_TYPES: { code: string; description: string }[] = [
  { code: "TLCC", description: "Term Loan / Cash Credit" },
  { code: "OD", description: "Overdraft Account" },
  { code: "CC", description: "Cash Credit Account" },
];

const INITIAL_VALUES: TlccInterestPostingData = {
  accountType: "",
  accountTypeDescription: "",
  nextIntPostingDate: "",
  nextIntPostingUpToDate: "",
  applyServiceCharges: false,
  interestReposting: false,
};

type RequiredFieldKey = "accountType" | "nextIntPostingDate" | "nextIntPostingUpToDate";

const validateDate = (value: string) => {
  if (!value) return "This field is required";
  if (Number.isNaN(new Date(value).getTime())) return "Enter a valid date";
  return "";
};

const buttonBase =
  "flex h-10 items-center justify-center gap-1.5 rounded-md px-5 text-[13px] font-semibold transition";

export default function TlccInterestPostingProcess({
  open,
  onClose,
  onCalculate,
  onGenerateReport,
  onApply,
}: TlccInterestPostingProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<TlccInterestPostingData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<RequiredFieldKey, string>>>({});
  const [isCalculated, setIsCalculated] = useState(false);
  const [showAccountTypeList, setShowAccountTypeList] = useState(false);

  if (!open) return null;

  const validate = () => {
    const nextErrors: Partial<Record<RequiredFieldKey, string>> = {};
    if (!values.accountType.trim()) nextErrors.accountType = "This field is required";
    const dateError = validateDate(values.nextIntPostingDate);
    if (dateError) nextErrors.nextIntPostingDate = dateError;
    const uptoDateError = validateDate(values.nextIntPostingUpToDate);
    if (uptoDateError) nextErrors.nextIntPostingUpToDate = uptoDateError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateValues = (patch: Partial<TlccInterestPostingData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setIsCalculated(false);
  };

  const handlePickAccountType = (match: { code: string; description: string }) => {
    updateValues({ accountType: match.code, accountTypeDescription: match.description });
    setErrors((prev) => ({ ...prev, accountType: undefined }));
    setShowAccountTypeList(false);
  };

  const handleValidate = () => {
    validate();
  };

  const handleCalculate = () => {
    if (!validate()) return;
    onCalculate?.(values);
    setIsCalculated(true);
  };

  const handleGenerateReport = () => {
    if (!validate()) return;
    onGenerateReport?.(values);
  };

  const handleApply = () => {
    if (!isCalculated) return;
    onApply?.(values);
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-3 shadow-2xl">
        <div className="rounded-2xl p-3">
          <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary">
              <UserRound size={19} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[19px] font-bold leading-tight text-[#1F2858]">
                {en("tlccInterestPosting.title")}
                {t("tlccInterestPosting.title") ? (
                  <span className="text-[#64748B]"> / {t("tlccInterestPosting.title")}</span>
                ) : null}
              </h2>
              <p className="text-[13px] leading-snug text-slate-500">
                {en("interestPostingProcess.subtitle")}
                {t("interestPostingProcess.subtitle") ? (
                  <span> / {t("interestPostingProcess.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-primary border-t-4 bg-white px-5 pb-6 pt-5 shadow-[0_1px_8px_rgba(37,99,235,0.12)]">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <FieldShell
                label={en("tlccInterestPosting.fields.accountType")}
                labelHi={t("tlccInterestPosting.fields.accountType")}
                error={!!errors.accountType}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextInput
                      icon={<Calendar size={15} />}
                      value={values.accountType}
                      onChange={() => {}}
                      readOnly
                      placeholder={tRaw("tlccInterestPosting.placeholders.selectAccountType")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAccountTypeList(true)}
                    className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
                  >
                    <MoreVertical size={20} strokeWidth={3} />
                  </button>
                </div>
              </FieldShell>

              <FieldShell
                label={en("tlccInterestPosting.fields.accountTypeDescription")}
                labelHi={t("tlccInterestPosting.fields.accountTypeDescription")}
              >
                <TextInput
                  icon={<Calendar size={15} />}
                  value={values.accountTypeDescription}
                  onChange={() => {}}
                  readOnly
                  placeholder={tRaw("tlccInterestPosting.placeholders.description")}
                />
              </FieldShell>

              <FieldShell
                label={en("tlccInterestPosting.fields.nextIntPostingDate")}
                labelHi={t("tlccInterestPosting.fields.nextIntPostingDate")}
                error={!!errors.nextIntPostingDate}
              >
                <DateInput
                  value={values.nextIntPostingDate}
                  onChange={(value) => {
                    updateValues({ nextIntPostingDate: value });
                    setErrors((prev) => ({ ...prev, nextIntPostingDate: undefined }));
                  }}
                  placeholder={tRaw("interestPostingProcess.placeholders.fromDate")}
                />
              </FieldShell>

              <FieldShell
                label={en("tlccInterestPosting.fields.nextIntPostingUpToDate")}
                labelHi={t("tlccInterestPosting.fields.nextIntPostingUpToDate")}
                error={!!errors.nextIntPostingUpToDate}
              >
                <DateInput
                  value={values.nextIntPostingUpToDate}
                  onChange={(value) => {
                    updateValues({ nextIntPostingUpToDate: value });
                    setErrors((prev) => ({ ...prev, nextIntPostingUpToDate: undefined }));
                  }}
                  placeholder={tRaw("interestPostingProcess.placeholders.fromDate")}
                />
              </FieldShell>

              <RadioYesNo
                label={en("tlccInterestPosting.fields.applyServiceCharges")}
                labelHi={t("tlccInterestPosting.fields.applyServiceCharges")}
                value={values.applyServiceCharges}
                onChange={(value) => updateValues({ applyServiceCharges: value })}
              />

              <RadioYesNo
                label={en("tlccInterestPosting.fields.interestReposting")}
                labelHi={t("tlccInterestPosting.fields.interestReposting")}
                value={values.interestReposting}
                onChange={(value) => updateValues({ interestReposting: value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleValidate}
            className={`${buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.calculate")}
            <Calculator size={13} />
          </button>
          <button
            type="button"
            onClick={handleGenerateReport}
            className={`${buttonBase} bg-primary-50 text-primary hover:bg-primary-100`}
          >
            {en("common.report")}
            <FileText size={13} />
          </button>
          <button
            type="button"
            disabled={!isCalculated}
            onClick={handleApply}
            className={`${buttonBase} min-w-[100px] ${
              isCalculated
                ? "bg-primary text-white hover:bg-primary-700 cursor-pointer"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            {en("common.apply")}
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={14} />
          </button>
        </div>
      </div>
    </div>

    {showAccountTypeList && (
      <ListModal
        title={en("tlccInterestPosting.fields.accountType")}
        columns={[
          { key: "code", label: "Code" },
          { key: "description", label: "Description" },
        ]}
        rows={ACCOUNT_TYPES}
        onSelect={handlePickAccountType}
        onClose={() => setShowAccountTypeList(false)}
      />
    )}
    </>
  );
}
