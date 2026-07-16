import { useState } from "react";
import type { ReactNode } from "react";
import { Calendar, Check, ChevronDown, Contact, MoreVertical, Plus, UserRound, X } from "lucide-react";
import { useBilingual } from "@/i18n/useBilingual";

export interface NpaModificationData {
  fromDate: string;
  toDate: string;
  accountNumber: string;
  accountName: string;
  osAmount: string;
  principalOverdueAmount: string;
  interestOverdueAmount: string;
  principalOverdueMonths: string;
  interestOverdueDate: string;
  calculatedNpaClass: string;
  descriptionOne: string;
  actualNpaClass: string;
  descriptionTwo: string;
  calculatedNpaPercentage: string;
  actualNpaPercentage: string;
  provisionOnAmount: string;
  calculatedProvision: string;
  actualProvision: string;
}

export interface NpaModificationProcessProps {
  open: boolean;
  onClose: () => void;
  onValidate?: (data: NpaModificationData) => void;
  onModify?: (data: NpaModificationData) => void;
}

type FieldKey = keyof NpaModificationData;

interface FieldConfig {
  key: FieldKey;
  labelKey: string;
  placeholderKey: string;
  icon: "contact" | "calendar";
  readOnly?: boolean;
  lookup?: boolean;
}

const INITIAL_VALUES: NpaModificationData = {
  fromDate: "",
  toDate: "",
  accountNumber: "",
  accountName: "",
  osAmount: "",
  principalOverdueAmount: "",
  interestOverdueAmount: "",
  principalOverdueMonths: "",
  interestOverdueDate: "",
  calculatedNpaClass: "",
  descriptionOne: "",
  actualNpaClass: "",
  descriptionTwo: "",
  calculatedNpaPercentage: "",
  actualNpaPercentage: "",
  provisionOnAmount: "",
  calculatedProvision: "",
  actualProvision: "",
};

const TOP_FIELDS: FieldConfig[] = [
  {
    key: "fromDate",
    labelKey: "npaModification.fields.fromDate",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "toDate",
    labelKey: "npaModification.fields.toDate",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "accountNumber",
    labelKey: "npaModification.fields.accountNumber",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
    lookup: true,
  },
  {
    key: "accountName",
    labelKey: "npaModification.fields.accountName",
    placeholderKey: "npaModification.placeholders.description",
    icon: "calendar",
    readOnly: true,
  },
];

const DETAIL_FIELDS: FieldConfig[] = [
  {
    key: "osAmount",
    labelKey: "npaModification.fields.osAmount",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "principalOverdueAmount",
    labelKey: "npaModification.fields.principalOverdueAmount",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "interestOverdueAmount",
    labelKey: "npaModification.fields.interestOverdueAmount",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "principalOverdueMonths",
    labelKey: "npaModification.fields.principalOverdueMonths",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "interestOverdueDate",
    labelKey: "npaModification.fields.interestOverdueDate",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "calculatedNpaClass",
    labelKey: "npaModification.fields.calculatedNpaClass",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "descriptionOne",
    labelKey: "npaModification.fields.description",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "actualNpaClass",
    labelKey: "npaModification.fields.actualNpaClass",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "descriptionTwo",
    labelKey: "npaModification.fields.description",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "calculatedNpaPercentage",
    labelKey: "npaModification.fields.calculatedNpaPercentage",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "actualNpaPercentage",
    labelKey: "npaModification.fields.actualNpaPercentage",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
  {
    key: "provisionOnAmount",
    labelKey: "npaModification.fields.provisionOnAmount",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "calculatedProvision",
    labelKey: "npaModification.fields.calculatedProvision",
    placeholderKey: "npaModification.placeholders.accountType",
    icon: "calendar",
  },
  {
    key: "actualProvision",
    labelKey: "npaModification.fields.actualProvision",
    placeholderKey: "npaModification.placeholders.guardianName",
    icon: "contact",
  },
];

const buttonBase =
  "flex h-10 min-w-[112px] items-center justify-center gap-2 rounded-md px-6 text-[13px] font-semibold transition";

export default function NpaModificationProcess({
  open,
  onClose,
  onValidate,
  onModify,
}: NpaModificationProcessProps) {
  const { en, t, tRaw } = useBilingual();
  const [values, setValues] = useState<NpaModificationData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [isValidated, setIsValidated] = useState(false);

  if (!open) return null;

  const updateValue = (key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setIsValidated(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    [...TOP_FIELDS, ...DETAIL_FIELDS].forEach((field) => {
      if (!values[field.key].trim()) nextErrors[field.key] = en("common.fieldRequired");
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validate()) return;
    setIsValidated(true);
    onValidate?.(values);
  };

  const handleModify = () => {
    if (!isValidated) return;
    onModify?.(values);
  };

  const handleLookup = () => {
    setValues((prev) => ({
      ...prev,
      accountNumber: "00025050007604",
      accountName: "Akshay Om More",
    }));
    setErrors((prev) => ({ ...prev, accountNumber: undefined, accountName: undefined }));
    setIsValidated(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[1024px] rounded-[22px] bg-white p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-4">
            <img
              src="/add-icn.png"
              alt="NPA Modification"
              className="h-12 w-12 object-contain"
            />
            <div className="min-w-0">
              <h2 className="text-[24px] font-bold leading-tight text-[#111827]">
                {en("npaModification.title")}
                {t("npaModification.title") ? (
                  <span className="text-[#64748B]"> / {t("npaModification.title")}</span>
                ) : null}
              </h2>
              <p className="mt-1 text-[13px] leading-snug text-[#64748B]">
                {en("npaModification.subtitle")}
                {t("npaModification.subtitle") ? (
                  <span> / {t("npaModification.subtitle")}</span>
                ) : null}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#6B7280] text-[#6B7280] transition hover:bg-slate-50"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <FieldSection className="mt-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {TOP_FIELDS.map((field) => (
              <NpaField
                key={field.key}
                field={field}
                value={values[field.key]}
                error={errors[field.key]}
                onChange={(value) => updateValue(field.key, value)}
                onLookup={field.lookup ? handleLookup : undefined}
                en={en}
                t={t}
                tRaw={tRaw}
              />
            ))}
          </div>
        </FieldSection>

        <FieldSection className="mt-5">
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-4">
            {DETAIL_FIELDS.map((field) => (
              <NpaField
                key={field.key}
                field={field}
                value={values[field.key]}
                error={errors[field.key]}
                onChange={(value) => updateValue(field.key, value)}
                en={en}
                t={t}
                tRaw={tRaw}
              />
            ))}
          </div>
        </FieldSection>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleValidate}
            className={`${buttonBase} bg-primary text-white hover:bg-primary-700`}
          >
            {en("common.validate")}
            <Check size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${buttonBase} border border-primary bg-white text-primary hover:bg-primary-50`}
          >
            {en("common.cancel")}
            <X size={16} />
          </button>
          <button
            type="button"
            disabled={!isValidated}
            onClick={handleModify}
            className={`${buttonBase} ${isValidated
                ? "bg-primary text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
          >
            {en("common.modify")}
            <ChevronDown size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}



function FieldSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-primary border-t-4 bg-white p-4 shadow-[0_1px_8px_rgba(37,99,235,0.12)] ${className}`}>
      {children}
    </div>
  );
}

function NpaField({
  field,
  value,
  error,
  onChange,
  onLookup,
  en,
  t,
  tRaw,
}: {
  field: FieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onLookup?: () => void;
  en: (key: string) => string;
  t: (key: string) => string;
  tRaw: (key: string) => string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold leading-none text-[#1F2937]">
        {en(field.labelKey)}
        {t(field.labelKey) ? <span className="text-[#64748B]"> / {t(field.labelKey)}</span> : null}
        <span className="ml-0.5 text-rose-600">*</span>
      </label>
      <div className="flex gap-2">
        <IconInput
          icon={field.icon === "calendar" ? <Calendar size={15} /> : <Contact size={15} />}
          value={value}
          onChange={onChange}
          placeholder={tRaw(field.placeholderKey)}
          readOnly={field.readOnly}
        />
        {onLookup ? (
          <button
            type="button"
            onClick={onLookup}
            className="flex h-9 w-11 shrink-0 items-center justify-center rounded-md bg-[#EEF3FF] text-primary transition hover:bg-primary-100"
          >
            <MoreVertical size={19} strokeWidth={3} />
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-[11px] text-rose-600">{error}</p> : null}
    </div>
  );
}

function IconInput({
  icon,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
}) {
  return (
    <div
      className={`flex h-9 min-w-0 flex-1 items-center rounded-md border border-[#7E8796] px-3 text-[12px] text-slate-700 ${readOnly ? "bg-slate-100" : "bg-white"
        }`}
    >
      <span className="mr-2 shrink-0 text-[#64748B]">{icon}</span>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8B95A5]"
      />
    </div>
  );
}
