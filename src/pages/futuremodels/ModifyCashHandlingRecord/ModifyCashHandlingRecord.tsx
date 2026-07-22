import { IMAGES } from "@/assets";
import { useState, type ReactNode } from "react";
import { Check, ChevronDown, Hash, KeyRound, MoreVertical, UserRound, UserSquare, X } from "lucide-react";
import Image from "@/components/ui/Image";
import { useBilingual } from "@/i18n/useBilingual";
import BranchListPickerModal, { type Branch } from "@/components/common/BranchPickListModal";
import ListModal from "@/components/AccountMaster/ListModal";
import SuccessModal from "@/components/shared/SuccessModal";

/* ===== from ModifyCashHandlingRecord.tsx ===== */
interface ScrollOption {
  code: string;
  cashHandlingNumber: string;
  amount: string;
  returnAmount: string;
}

const SCROLL_OPTIONS: ScrollOption[] = [
  { code: "SCR-1001", cashHandlingNumber: "CH-0001", amount: "125000", returnAmount: "0" },
  { code: "SCR-1002", cashHandlingNumber: "CH-0002", amount: "84000", returnAmount: "500" },
  { code: "SCR-1003", cashHandlingNumber: "CH-0003", amount: "216500", returnAmount: "0" },
];

interface ModifyCashHandlingRecordData {
  branchCode: string;
  branchName: string;
  asOnDate: string;
  scrollNumber: string;
  cashHandlingNumber: string;
  amount: string;
  returnAmount: string;
  r2000: string;
  r500: string;
  p2000: string;
  p500: string;
  r200: string;
  r100: string;
  p200: string;
  p100: string;
  r50: string;
  r20: string;
  p50: string;
  p20: string;
  r10: string;
  rChange: string;
  p10: string;
  pChange: string;
}

const EMPTY_DATA: ModifyCashHandlingRecordData = {
  branchCode: "",
  branchName: "",
  asOnDate: "",
  scrollNumber: "",
  cashHandlingNumber: "",
  amount: "",
  returnAmount: "",
  r2000: "",
  r500: "",
  p2000: "",
  p500: "",
  r200: "",
  r100: "",
  p200: "",
  p100: "",
  r50: "",
  r20: "",
  p50: "",
  p20: "",
  r10: "",
  rChange: "",
  p10: "",
  pChange: "",
};

const REQUIRED_FIELDS = Object.keys(EMPTY_DATA) as (keyof ModifyCashHandlingRecordData)[];

const INFO_FIELDS: FieldConfig[] = [
  { key: "branchCode", labelKey: "fields.branchCode", icon: "user", picker: "branch" },
  { key: "branchName", labelKey: "fields.branchName", icon: "key", readOnly: true, placeholderKey: "modifyCashHandlingRecord.namePlaceholder" },
  { key: "asOnDate", labelKey: "modifyCashHandlingRecord.fields.asOnDate", icon: "user" },
  { key: "scrollNumber", labelKey: "modifyCashHandlingRecord.fields.scrollNumber", icon: "user", picker: "scroll" },
];

const DENOMINATION_FIELDS: FieldConfig[] = [
  { key: "cashHandlingNumber", labelKey: "modifyCashHandlingRecord.fields.cashHandlingNumber", icon: "user", readOnly: true, placeholderKey: "modifyCashHandlingRecord.namePlaceholder" },
  { key: "amount", labelKey: "modifyCashHandlingRecord.fields.amount", icon: "user" },
  { key: "returnAmount", labelKey: "modifyCashHandlingRecord.fields.returnAmount", icon: "user" },
  { key: "r2000", labelKey: "modifyCashHandlingRecord.fields.r2000", icon: "key", placeholderKey: "modifyCashHandlingRecord.keyPlaceholder" },
  { key: "r500", labelKey: "modifyCashHandlingRecord.fields.r500", icon: "user" },
  { key: "p2000", labelKey: "modifyCashHandlingRecord.fields.p2000", icon: "user" },
  { key: "p500", labelKey: "modifyCashHandlingRecord.fields.p500", icon: "user" },
  { key: "r200", labelKey: "modifyCashHandlingRecord.fields.r200", icon: "user" },
  { key: "r100", labelKey: "modifyCashHandlingRecord.fields.r100", icon: "user" },
  { key: "p200", labelKey: "modifyCashHandlingRecord.fields.p200", icon: "user" },
  { key: "p100", labelKey: "modifyCashHandlingRecord.fields.p100", icon: "user" },
  { key: "r50", labelKey: "modifyCashHandlingRecord.fields.r50", icon: "user" },
  { key: "r20", labelKey: "modifyCashHandlingRecord.fields.r20", icon: "user" },
  { key: "p50", labelKey: "modifyCashHandlingRecord.fields.p50", icon: "user" },
  { key: "p20", labelKey: "modifyCashHandlingRecord.fields.p20", icon: "user" },
  { key: "r10", labelKey: "modifyCashHandlingRecord.fields.r10", icon: "user" },
  { key: "rChange", labelKey: "modifyCashHandlingRecord.fields.rChange", icon: "user" },
  { key: "p10", labelKey: "modifyCashHandlingRecord.fields.p10", icon: "user" },
  { key: "pChange", labelKey: "modifyCashHandlingRecord.fields.pChange", icon: "user" },
];

type PickerKind = "branch" | "scroll";

interface FieldConfig {
  key: keyof ModifyCashHandlingRecordData;
  labelKey: string;
  icon: "user" | "key" | "hash";
  readOnly?: boolean;
  picker?: PickerKind;
  placeholderKey?: string;
}

const ICONS = {
  user: <UserSquare size={20} />,
  key: <KeyRound size={20} />,
  hash: <Hash size={20} />,
};

function BilingualText({ labelKey, separator = " / " }: { labelKey: string; separator?: string }) {
  const { en, t } = useBilingual();
  return (
    <>
      {en(labelKey)}
      {t(labelKey) ? <span className="font-semibold text-slate-500 dark:text-slate-400">{separator}{t(labelKey)}</span> : null}
    </>
  );
}

function FieldLabel({ labelKey }: { labelKey: string }) {
  return (
    <label className="mb-1 block text-[12px] font-semibold leading-6 text-slate-800 dark:text-slate-100">
      <BilingualText labelKey={labelKey} />
      <span className="ml-0.5 text-red-500">*</span>
    </label>
  );
}

interface FieldBoxProps {
  config: FieldConfig;
  value: string;
  onChange?: (value: string) => void;
  error?: boolean;
  trailing?: ReactNode;
}

function FieldBox({ config, value, onChange, error = false, trailing }: FieldBoxProps) {
  const { tRaw } = useBilingual();
  const placeholder = config.placeholderKey
    ? tRaw(config.placeholderKey)
    : tRaw("modifyCashHandlingRecord.amountPlaceholder");

  return (
    <div className="min-w-0">
      <FieldLabel labelKey={config.labelKey} />
      <div className="flex items-center gap-3">
        <div
          className={`flex h-[40px] min-w-0 flex-1 items-center rounded-md border px-3 ${
            config.readOnly ? "bg-gray-100 dark:bg-slate-800" : "bg-white dark:bg-slate-900"
          } ${error ? "border-red-400" : "border-slate-400 dark:border-slate-700"}`}
        >
          <span className="shrink-0 text-slate-500 dark:text-slate-400">{ICONS[config.icon]}</span>
          <input
            type="text"
            readOnly={config.readOnly}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
            className="ml-3 w-full min-w-0 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        {trailing}
      </div>
    </div>
  );
}

function PickerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition hover:bg-primary-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
    >
      <MoreVertical size={25} strokeWidth={3} />
    </button>
  );
}

function SectionHeader({ titleKey, subtitleKey }: { titleKey: string; subtitleKey: string }) {
  return (
    <div className="mb-7 border-b border-slate-200 pb-3 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary-50 text-primary shadow-sm dark:bg-blue-900/30">
          <UserRound size={25} />
        </div>
        <div className="min-w-0">
          <h2 className="text-[14px] font-bold text-[#202052] dark:text-slate-100">
            <BilingualText labelKey={titleKey} />
          </h2>
          <p className="-mt-1 text-[12px] font-medium leading-6 text-slate-500 dark:text-slate-400">
            <BilingualText labelKey={subtitleKey} />
          </p>
        </div>
      </div>
    </div>
  );
}

const ModifyCashHandlingRecord = () => {
  const { en, t } = useBilingual();
  const [data, setData] = useState<ModifyCashHandlingRecordData>(EMPTY_DATA);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState(false);
  const [scrollPickerOpen, setScrollPickerOpen] = useState(false);

  const clearError = (key: keyof ModifyCashHandlingRecordData) => {
    setErrors((prev) => ({ ...prev, [key]: false }));
    setIsValidated(false);
  };

  const set =
    (key: keyof ModifyCashHandlingRecordData) =>
    (value: string) => {
      setData((prev) => ({ ...prev, [key]: value }));
      clearError(key);
    };

  const handleBranchSelect = (branch: Branch) => {
    setData((prev) => ({ ...prev, branchCode: branch.code, branchName: branch.name }));
    clearError("branchCode");
    clearError("branchName");
    setBranchPickerOpen(false);
  };

  const handleScrollSelect = (scroll: ScrollOption) => {
    setData((prev) => ({
      ...prev,
      scrollNumber: scroll.code,
      cashHandlingNumber: scroll.cashHandlingNumber,
      amount: scroll.amount,
      returnAmount: scroll.returnAmount,
    }));
    clearError("scrollNumber");
    clearError("cashHandlingNumber");
    clearError("amount");
    clearError("returnAmount");
    setScrollPickerOpen(false);
  };

  const validate = () => {
    const nextErrors: Record<string, boolean> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!data[key].trim()) nextErrors[key] = true;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => setIsValidated(validate());

  const handleCancel = () => {
    setData(EMPTY_DATA);
    setErrors({});
    setIsValidated(false);
  };

  const handleModify = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    handleCancel();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title={en("modifyCashHandlingRecord.successTitle")}
        subtitle=""
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
      />
    );
  }

  return (
    <div className="min-h-screen app-page-bg px-3 py-4 dark:bg-slate-950">
     <div className="mx-auto w-full max-w-5xl rounded-[28px] bg-white p-3 shadow-sm dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={IMAGES.PERSON_ICON}
            alt={en("modifyCashHandlingRecord.title")}
            width={54}
            height={54}
            className="h-[50px] w-[50px] shrink-0 object-contain"
          />
          <h1 className="min-w-0 text-[16px] font-bold leading-tight text-[#070747] dark:text-slate-100">
            {en("modifyCashHandlingRecord.title")}
            {t("modifyCashHandlingRecord.title") ? (
              <span className="font-semibold text-slate-500 dark:text-slate-400"> / {t("modifyCashHandlingRecord.title")}</span>
            ) : null}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => window.history.back()}
          aria-label={en("common.cancel")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-slate-400 text-slate-500 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <X size={28} strokeWidth={3} />
        </button>
      </div>

      <section className="rounded-[18px] border-x border-b border-t-4 border-primary p-7 dark:bg-slate-900">
        <SectionHeader
          titleKey="modifyCashHandlingRecord.infoTitle"
          subtitleKey="modifyCashHandlingRecord.infoSubtitle"
        />
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-4">
          {INFO_FIELDS.map((field) => (
            <FieldBox
              key={field.key}
              config={field}
              value={data[field.key]}
              onChange={field.readOnly ? undefined : set(field.key)}
              error={!!errors[field.key]}
              trailing={
                field.picker === "branch" ? (
                  <PickerButton onClick={() => setBranchPickerOpen(true)} />
                ) : field.picker === "scroll" ? (
                  <PickerButton onClick={() => setScrollPickerOpen(true)} />
                ) : null
              }
            />
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[18px] border-x border-b border-t-4 border-primary p-7 dark:bg-slate-900">
        <SectionHeader
          titleKey="modifyCashHandlingRecord.summaryTitle"
          subtitleKey="modifyCashHandlingRecord.summarySubtitle"
        />
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-4">
          {DENOMINATION_FIELDS.map((field) => (
            <FieldBox
              key={field.key}
              config={field}
              value={data[field.key]}
              onChange={field.readOnly ? undefined : set(field.key)}
              error={!!errors[field.key]}
            />
          ))}
        </div>
      </section>

      <div className="mt-3 flex flex-wrap justify-end gap-7">
        <button
          type="button"
          onClick={handleValidate}
          disabled={isValidated}
          className="flex h-12 min-w-[130px] items-center justify-center gap-3 rounded-md bg-primary px-8 text-md font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {en("common.validate")} <Check size={22} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-12 min-w-[130px] items-center justify-center gap-3 rounded-md border-2 border-primary bg-white px-8 text-md font-semibold text-primary transition hover:bg-primary-50 dark:bg-slate-900 dark:hover:bg-blue-900/20"
        >
          {en("common.cancel")} <X size={24} />
        </button>
        <button
          type="button"
          onClick={handleModify}
          disabled={!isValidated}
          className="flex h-12 min-w-[130px] items-center justify-center gap-3 rounded-lg bg-gray-100 px-8 text-lg font-semibold text-gray-400 transition enabled:bg-primary-100 enabled:text-primary enabled:hover:bg-primary-200 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-500 dark:enabled:bg-blue-900/30 dark:enabled:text-blue-400"
        >
          {en("common.modify")} <ChevronDown size={20} />
        </button>
      </div>

      {branchPickerOpen && (
        <BranchListPickerModal open={branchPickerOpen} onClose={() => setBranchPickerOpen(false)} onSelect={handleBranchSelect} />
      )}

      {scrollPickerOpen && (
        <ListModal
          title={en("modifyCashHandlingRecord.fields.scrollNumber")}
          columns={[
            { key: "code", label: en("modifyCashHandlingRecord.fields.scrollNumber") },
            { key: "cashHandlingNumber", label: en("modifyCashHandlingRecord.fields.cashHandlingNumber") },
          ]}
          rows={SCROLL_OPTIONS}
          onClose={() => setScrollPickerOpen(false)}
          onSelect={handleScrollSelect}
        />
      )}
    </div>
    </div>
  );
};

export default ModifyCashHandlingRecord;
