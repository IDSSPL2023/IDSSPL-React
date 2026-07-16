import { useState, type FC, type ReactNode } from "react";
import { X, Check, Landmark, ClipboardList, CalendarClock, MoreVertical } from "lucide-react";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";

type YesNo = "Yes" | "No" | "";
type PickerKey = "bank" | "branch";

export interface BranchParameterFormData {
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  isDayBeginExecuted: YesNo;
  isDayEndExecuted: YesNo;
  isDenominationRequired: YesNo;
  isYearAutoRenewalAtDayBegin: YesNo;
  isSBInterestPostAtDayEnd: YesNo;
  isCAInterestPostAtDayEnd: YesNo;
  isTDInterestPostAtDayEnd: YesNo;
  isTLInterestPostAtDayEnd: YesNo;
  isCCInterestPostAtDayEnd: YesNo;
  sbNextInterestPostingDate: string;
  caNextInterestPostingDate: string;
  ccNextInterestPostingDate: string;
  tlNextInterestPostingDate: string;
  tdNextInterestPostingDate: string;
  sbInterestCalculateFromDate: string;
  sbInterestCalculateToDate: string;
  tdNextInterestPayUptoDate: string;
  tlNextInterestPayUptoDate: string;
  ccNextInterestPayUptoDate: string;
  yearBeginDate: string;
  yearEndDate: string;
}

export const emptyBranchParameterFormData: BranchParameterFormData = {
  bankCode: "",
  bankName: "",
  branchCode: "",
  branchName: "",
  isDayBeginExecuted: "",
  isDayEndExecuted: "",
  isDenominationRequired: "",
  isYearAutoRenewalAtDayBegin: "",
  isSBInterestPostAtDayEnd: "",
  isCAInterestPostAtDayEnd: "",
  isTDInterestPostAtDayEnd: "",
  isTLInterestPostAtDayEnd: "",
  isCCInterestPostAtDayEnd: "",
  sbNextInterestPostingDate: "",
  caNextInterestPostingDate: "",
  ccNextInterestPostingDate: "",
  tlNextInterestPostingDate: "",
  tdNextInterestPostingDate: "",
  sbInterestCalculateFromDate: "",
  sbInterestCalculateToDate: "",
  tdNextInterestPayUptoDate: "",
  tlNextInterestPayUptoDate: "",
  ccNextInterestPayUptoDate: "",
  yearBeginDate: "",
  yearEndDate: "",
};

interface CodeNameRow {
  code: string;
  name: string;
}

const BANK_ROWS: CodeNameRow[] = [
  { code: "00021010000008", name: "Swami Vivekanand Printing Press" },
  { code: "00022010000001", name: "Sahyadri Urban Co-op Bank" },
  { code: "00025050007604", name: "Janata Sahakari Bank" },
];

const BRANCH_ROWS: CodeNameRow[] = [
  { code: "010", name: "Main Branch" },
  { code: "011", name: "City Branch" },
  { code: "012", name: "Market Branch" },
];

const PICKER_CONFIG: Record<
  PickerKey,
  {
    titleEn: string;
    columns: { key: keyof CodeNameRow; label: string }[];
    rows: CodeNameRow[];
    setField: keyof BranchParameterFormData;
    nameField: keyof BranchParameterFormData;
  }
> = {
  bank: {
    titleEn: "Select Bank",
    columns: [
      { key: "code", label: "Bank Code" },
      { key: "name", label: "Bank Name" },
    ],
    rows: BANK_ROWS,
    setField: "bankCode",
    nameField: "bankName",
  },
  branch: {
    titleEn: "Select Branch",
    columns: [
      { key: "code", label: "Branch Code" },
      { key: "name", label: "Branch Name" },
    ],
    rows: BRANCH_ROWS,
    setField: "branchCode",
    nameField: "branchName",
  },
};

const TEXT_FIELDS: {
  key: keyof BranchParameterFormData;
  labelEn: string;
  labelHi: string;
  placeholder: string;
  type: "picker" | "readonly";
  picker?: PickerKey;
}[] = [
  { key: "bankCode", labelEn: "Bank Code", labelHi: "बँक कोड", placeholder: "Select Bank Code", type: "picker", picker: "bank" },
  { key: "bankName", labelEn: "Bank Name", labelHi: "बँकेचे नाव", placeholder: "Auto-filled", type: "readonly" },
  { key: "branchCode", labelEn: "Branch Code", labelHi: "शाखा कोड", placeholder: "Select Branch Code", type: "picker", picker: "branch" },
  { key: "branchName", labelEn: "Branch Name", labelHi: "शाखेचे नाव", placeholder: "Auto-filled", type: "readonly" },
];

const TOGGLE_FIELDS: { key: keyof BranchParameterFormData; labelEn: string; labelHi: string }[] = [
  { key: "isDayBeginExecuted", labelEn: "Is Day Begin Executed", labelHi: "दिवस प्रारंभ" },
  { key: "isDayEndExecuted", labelEn: "Is Day End Executed", labelHi: "दिवस समाप्त" },
  { key: "isDenominationRequired", labelEn: "Is Denomination Required", labelHi: "चलन तपशील" },
  { key: "isYearAutoRenewalAtDayBegin", labelEn: "Is Year Auto Renewal At Day Begin", labelHi: "वर्ष नूतनीकरण" },
  { key: "isSBInterestPostAtDayEnd", labelEn: "Is SB Interest Post At Day End", labelHi: "एसबी व्याज पोस्ट" },
  { key: "isCAInterestPostAtDayEnd", labelEn: "Is CA Interest Post At Day End", labelHi: "सीए व्याज पोस्ट" },
  { key: "isTDInterestPostAtDayEnd", labelEn: "Is TD Interest Post At Day End", labelHi: "TD व्याज पोस्ट" },
  { key: "isTLInterestPostAtDayEnd", labelEn: "Is TL Interest Post At Day End", labelHi: "TL व्याज पोस्ट" },
  { key: "isCCInterestPostAtDayEnd", labelEn: "Is CC Interest Post At Day End", labelHi: "CC व्याज पोस्ट" },
];

const DATE_FIELDS: { key: keyof BranchParameterFormData; labelEn: string; labelHi: string }[] = [
  { key: "sbNextInterestPostingDate", labelEn: "SB Next Interest Posting Date", labelHi: "SB पुढील व्याज तारीख" },
  { key: "caNextInterestPostingDate", labelEn: "CA Next Interest Posting Date", labelHi: "CA पुढील व्याज तारीख" },
  { key: "ccNextInterestPostingDate", labelEn: "CC Next Interest Posting Date", labelHi: "CC पुढील व्याज तारीख" },
  { key: "tlNextInterestPostingDate", labelEn: "TL Next Interest Posting Date", labelHi: "TL पुढील व्याज तारीख" },
  { key: "tdNextInterestPostingDate", labelEn: "TD Next Interest Posting Date", labelHi: "TD पुढील व्याज तारीख" },
  { key: "sbInterestCalculateFromDate", labelEn: "SB Interest Calculate From Date", labelHi: "SB व्याज प्रारंभ" },
  { key: "sbInterestCalculateToDate", labelEn: "SB Interest Calculate To Date", labelHi: "SB व्याज समाप्त" },
  { key: "tdNextInterestPayUptoDate", labelEn: "TD Next Interest Pay Upto Date", labelHi: "TD व्याज देय तारीख" },
  { key: "tlNextInterestPayUptoDate", labelEn: "TL Next Interest Pay Upto Date", labelHi: "TL व्याज देय तारीख" },
  { key: "ccNextInterestPayUptoDate", labelEn: "CC Next Interest Pay Upto Date", labelHi: "CC व्याज देय तारीख" },
  { key: "yearBeginDate", labelEn: "Year Begin Date", labelHi: "वर्ष प्रारंभ तारीख" },
  { key: "yearEndDate", labelEn: "Year End Date", labelHi: "वर्ष समाप्त तारीख" },
];

// TOGGLE_FIELDS are left out of validation while the "Details" (Yes/No)
// card below is commented out — its fields can't be filled, so requiring
// them would keep Validate from ever passing and Save from ever enabling.
const REQUIRED_FIELDS: (keyof BranchParameterFormData)[] = [
  ...TEXT_FIELDS.map((f) => f.key),
  ...DATE_FIELDS.map((f) => f.key),
];

/* ------------------------------------------------------------------ */
/*  Shared "Support Utility" style building blocks                     */
/* ------------------------------------------------------------------ */

const SectionCard: FC<{ icon: FC<{ size?: number }>; titleEn: string; titleHi: string; children: ReactNode }> = ({
  icon: Icon,
  titleEn,
  titleHi,
  children,
}) => (
  <div className="mt-5 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
        <Icon size={18} />
      </div>
      <h3 className="text-base font-semibold text-[#1F2858] dark:text-slate-100">
        {titleEn} <span className="font-normal text-slate-500 dark:text-slate-400">/ {titleHi}</span>
      </h3>
    </div>
    {children}
  </div>
);

const FieldLabel: FC<{ labelEn: string; labelHi: string }> = ({ labelEn, labelHi }) => (
  <label className="mb-1.5 block text-[15px] font-semibold text-[#1F2858] dark:text-slate-100">
    {labelEn} <span className="font-normal text-slate-500 dark:text-slate-400">/ {labelHi}</span>
    <span className="text-red-500"> *</span>
  </label>
);

const PickerField: FC<{
  labelEn: string;
  labelHi: string;
  placeholder: string;
  value: string;
  hasError?: boolean;
  onOpen: () => void;
}> = ({ labelEn, labelHi, placeholder, value, hasError, onOpen }) => (
  <div>
    <FieldLabel labelEn={labelEn} labelHi={labelHi} />
    <div className="flex items-center gap-2">
      <div
        onClick={onOpen}
        className={`flex h-11 flex-1 cursor-pointer items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
          hasError
            ? "border-red-400"
            : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
        }`}
      >
        <Landmark size={18} className="shrink-0 text-[#6B7280]" />
        <input
          type="text"
          readOnly
          value={value}
          placeholder={placeholder}
          className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>
      <button
        type="button"
        title={`Search ${labelEn}`}
        onClick={onOpen}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
      >
        <MoreVertical size={18} />
      </button>
    </div>
    {hasError && <p className="mt-1 text-xs text-red-500">This field is required</p>}
  </div>
);

const ReadOnlyField: FC<{ labelEn: string; labelHi: string; value: string; placeholder: string }> = ({
  labelEn,
  labelHi,
  value,
  placeholder,
}) => (
  <div>
    <FieldLabel labelEn={labelEn} labelHi={labelHi} />
    <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
      <Landmark size={18} className="shrink-0 text-[#6B7280]" />
      <input
        type="text"
        readOnly
        value={value}
        placeholder={placeholder}
        className="ml-3 w-full bg-transparent text-[15px] text-slate-500 outline-none placeholder:text-[#7C879B] dark:text-slate-400"
      />
    </div>
  </div>
);

const RadioField: FC<{
  labelEn: string;
  labelHi: string;
  name: string;
  value: YesNo;
  hasError?: boolean;
  onChange: (value: YesNo) => void;
}> = ({ labelEn, labelHi, name, value, hasError, onChange }) => (
  <div>
    <FieldLabel labelEn={labelEn} labelHi={labelHi} />
    <div className="flex items-center gap-6">
      <label className="flex cursor-pointer items-center gap-2 text-[14px] font-medium text-slate-700 dark:text-slate-300">
        <input
          type="radio"
          name={name}
          checked={value === "Yes"}
          onChange={() => onChange("Yes")}
          className="h-4 w-4 text-primary focus:ring-primary"
        />
        Yes
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-[14px] font-medium text-slate-700 dark:text-slate-300">
        <input
          type="radio"
          name={name}
          checked={value === "No"}
          onChange={() => onChange("No")}
          className="h-4 w-4 text-primary focus:ring-primary"
        />
        No
      </label>
    </div>
    {hasError && <p className="mt-1 text-xs text-red-500">This field is required</p>}
  </div>
);

const DateField: FC<{
  labelEn: string;
  labelHi: string;
  value: string;
  hasError?: boolean;
  onChange: (value: string) => void;
}> = ({ labelEn, labelHi, value, hasError, onChange }) => (
  <div>
    <FieldLabel labelEn={labelEn} labelHi={labelHi} />
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#1F2858] outline-none transition dark:bg-slate-900 dark:text-slate-100 ${
        hasError
          ? "border-red-400"
          : "border-[#B8C2D6] focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700"
      }`}
    />
    {hasError && <p className="mt-1 text-xs text-red-500">This field is required</p>}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */

interface SetBranchParameterModalProps {
  initialData?: BranchParameterFormData;
  onClose: () => void;
  onSave?: (data: BranchParameterFormData) => void;
}

const SetBranchParameterModal: FC<SetBranchParameterModalProps> = ({
  initialData = emptyBranchParameterFormData,
  onClose,
  onSave,

}) => {
  const [formData, setFormData] = useState<BranchParameterFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof BranchParameterFormData, boolean>>>({});
  const [validated, setValidated] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerKey | null>(null);

  const handleChange = <K extends keyof BranchParameterFormData>(key: K, value: BranchParameterFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    setErrors((prev) => (prev[key] ? { ...prev, [key]: false } : prev));
  };

  const handlePick = (pickerKey: PickerKey, row: CodeNameRow) => {
    const config = PICKER_CONFIG[pickerKey];
    setFormData((prev) => ({ ...prev, [config.setField]: row.code, [config.nameField]: row.name }));
    setValidated(false);
    setErrors((prev) => ({ ...prev, [config.setField]: false, [config.nameField]: false }));
    setActivePicker(null);
  };

  const runValidation = (): boolean => {
    const newErrors: Partial<Record<keyof BranchParameterFormData, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    return isValid;
  };

  const handleValidate = () => {
    runValidation();
  };

  const handleSave = () => {
    if (!validated) return;
    const isValid = runValidation();
    if (!isValid) return;
    onSave?.(formData);
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
        <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
                <Landmark size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                  Set Branch Parameter <span className="font-bold text-[#64748B] dark:text-slate-400">/ शाखा मापदंड सेट करा</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Configure branch, interest posting and financial-year parameters.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Branch Details */}
          <SectionCard icon={Landmark} titleEn="Branch Details" titleHi="शाखेचा तपशील">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {TEXT_FIELDS.map((field) =>
                field.type === "picker" ? (
                  <PickerField
                    key={field.key}
                    labelEn={field.labelEn}
                    labelHi={field.labelHi}
                    placeholder={field.placeholder}
                    value={formData[field.key] as string}
                    hasError={errors[field.key]}
                    onOpen={() => setActivePicker(field.picker as PickerKey)}
                  />
                ) : (
                  <ReadOnlyField
                    key={field.key}
                    labelEn={field.labelEn}
                    labelHi={field.labelHi}
                    placeholder={field.placeholder}
                    value={formData[field.key] as string}
                  />
                )
              )}
            </div>
          </SectionCard>

          {/* Details - Yes/No settings */}
         

          {/* Details - Dates */}
          <SectionCard icon={CalendarClock} titleEn="Details" titleHi="तपशील">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              {DATE_FIELDS.map((field) => (
                <DateField
                  key={field.key}
                  labelEn={field.labelEn}
                  labelHi={field.labelHi}
                  value={formData[field.key] as string}
                  hasError={errors[field.key]}
                  onChange={(v) => handleChange(field.key, v)}
                />
              ))}
            </div>
          </SectionCard>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Validate <Check size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
            >
              Cancel <X size={16} />
            </button>
            <button
              type="button"
              disabled={!validated}
              onClick={handleSave}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                validated
                  ? "bg-primary text-white hover:bg-primary-700"
                  : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
              }`}
            >
              Save <Check size={16} />
            </button>
          </div>
        </div>
      </div>

      {activePicker && (
        <ListModal
          title={PICKER_CONFIG[activePicker].titleEn}
          columns={PICKER_CONFIG[activePicker].columns}
          rows={PICKER_CONFIG[activePicker].rows}
          onSelect={(row) => handlePick(activePicker, row)}
          onClose={() => setActivePicker(null)}
        />
      )}

      {successOpen && (
        <SuccessModal
          variant="success"
          title="Branch Parameter Saved Successfully"
          subtitle=""
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </>
  );
};

export default SetBranchParameterModal;
