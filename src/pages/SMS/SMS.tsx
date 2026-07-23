// src/components/SMS/SMSRegistrationPage.tsx
import { useState, useRef } from "react";
import { useRouter } from "@/lib/navigation";
import {
  ArrowLeft,
  Home,
  ChevronRight,
  Check,
  X,
  ChevronDown,
  Calendar,
  Type as TypeIcon,
} from "lucide-react";
import {
  FieldShell,
  TextInput,
  RadioYesNo,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";

// ---- DateInput with calendar icon click ----
function DateInputField({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof (el as any).showPicker === "function") {
      (el as any).showPicker();
    } else {
      el.focus();
    }
  };

  return (
    <div className="relative flex items-center">
      <span
        onClick={handleIconClick}
        className="absolute left-3 z-10 cursor-pointer text-slate-400"
      >
        <Calendar size={16} />
      </span>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[42px] w-full rounded-md border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary opacity-0 absolute inset-0 cursor-pointer"
        style={{ opacity: 0, position: "absolute" }}
      />
      <div
        onClick={handleIconClick}
        className={`min-h-[42px] w-full rounded-md border ${
          error ? "border-red-400" : "border-[#E5E7EB]"
        } bg-white py-2.5 pl-10 pr-3 text-sm text-gray-700 outline-none cursor-pointer flex items-center`}
      >
        {value || placeholder || "Select Date"}
      </div>
    </div>
  );
}

// ---- Field config — single consistent icon for every field, matching the reference mock ----
type FieldKind = "text" | "date";

interface FieldConfig {
  id: string;
  label: string;
  labelHi: string;
  placeholder: string;
  kind: FieldKind;
}

const FIELDS: FieldConfig[] = [
  { id: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Account Code", kind: "text" },
  { id: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", kind: "text" },
  { id: "mobileNumber", label: "Mobile Number", labelHi: "मोबाईल नंबर", placeholder: "Enter Mobile Number", kind: "text" },
  { id: "registrationDate", label: "Registration Date", labelHi: "नोंदणी तारीख", placeholder: "Select Registration Date", kind: "date" },
  { id: "registrationPeriod", label: "Registration Period", labelHi: "नोंदणी कालावधी", placeholder: "Enter Registration Period", kind: "text" },
  { id: "smsCount", label: "SMS Count", labelHi: "एसएमएस संख्या", placeholder: "Enter SMS Count", kind: "text" },
  { id: "depositLimit", label: "Deposit Limit", labelHi: "जमा मर्यादा", placeholder: "Enter Deposit Limit", kind: "text" },
  { id: "withdrawalLimit", label: "Withdrawal Limit", labelHi: "काढण्याची मर्यादा", placeholder: "Enter Withdrawal Limit", kind: "text" },
  { id: "beforeAlertDays", label: "Before Alert Days", labelHi: "आधीचे सूचना दिवस", placeholder: "Enter Before Alert Days", kind: "text" },
  { id: "afterAlertDays", label: "After Alert Days", labelHi: "नंतरचे सूचना दिवस", placeholder: "Enter After Alert Days", kind: "text" },
  { id: "beforeSmsLimit", label: "Before SMS Limit", labelHi: "आधीची एसएमएस मर्यादा", placeholder: "Enter Before SMS Limit", kind: "text" },
  { id: "afterSmsLimit", label: "After SMS Limit", labelHi: "नंतरची एसएमएस मर्यादा", placeholder: "Enter After SMS Limit", kind: "text" },
];

interface ToggleConfig {
  id: string;
  label: string;
  labelHi: string;
  subheading?: string;
}

const TOGGLES: ToggleConfig[] = [
  { id: "transactionSms", label: "Transaction SMS", labelHi: "व्यवहार एसएमएस", subheading: "Subheading goes here..." },
  { id: "promotionSms", label: "Promotion SMS", labelHi: "प्रमोशन एसएमएस", subheading: "Subheading goes here..." },
  { id: "alertSms", label: "Alert SMS", labelHi: "सूचना एसएमएस", subheading: "Subheading goes here..." },
  { id: "birthdaySms", label: "Birthday SMS", labelHi: "वाढदिवस एसएमएस", subheading: "Subheading goes here..." },
];

type ToggleValue = "yes" | "no";
type FormState = Record<string, string>;
type TogglesState = {
  transactionSms: ToggleValue;
  promotionSms: ToggleValue;
  alertSms: ToggleValue;
  birthdaySms: ToggleValue;
};

const SMSRegistrationPage = () => {
  const router = useRouter();
  const handleBack = () => router.back();

  const [form, setForm] = useState<FormState>(
    Object.fromEntries(FIELDS.map((f) => [f.id, ""]))
  );
  const [toggles, setToggles] = useState<TogglesState>({
    transactionSms: "yes",
    promotionSms: "yes",
    alertSms: "yes",
    birthdaySms: "yes",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const setField = (id: string, val: string) => {
    setForm((prev) => ({ ...prev, [id]: val }));
    setErrors((prev) => (prev[id] ? { ...prev, [id]: false } : prev));
    setIsValidated(false);
  };

  const setToggle = (id: keyof TogglesState, val: ToggleValue) => {
    setToggles((prev) => ({ ...prev, [id]: val }));
    setIsValidated(false);
  };

  const validateForm = (): boolean => {
    const nextErrors: Record<string, boolean> = {};
    FIELDS.forEach((f) => {
      if (!form[f.id] || form[f.id].trim() === "") {
        nextErrors[f.id] = true;
      }
    });
    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    setIsValidated(valid);
    return valid;
  };

  const handleValidate = () => {
    validateForm();
  };

  const handleSave = () => {
    if (!isValidated) return;
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
  };

  return (
    <div className="min-h-screen app-page-bg p-4">
      <div className="mx-auto max-w-[1600px]">
        {/* Header — flush, no card/border */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#111827]">
              SMS Registration <span className="text-gray-400 font-normal">|</span> SMS नोंदणी
            </h1>
            <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-gray-500">
              <Home size={13} />
              <span>Home</span>
              <ChevronRight size={13} />
              <span>Clerk</span>
              <ChevronRight size={13} />
              <span className="text-primary font-medium">SMS Registration</span>
            </div>
          </div>
        </div>

        {/* Form card — solid border all around, matching the reference exactly */}
        <div className="rounded-2xl border-2 border-primary bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {FIELDS.map((f) => {
              const hasError = !!errors[f.id];
              return (
                <FieldShell key={f.id} label={f.label} labelHi={f.labelHi} required error={hasError}>
                  {f.kind === "date" ? (
                    <DateInputField
                      value={form[f.id]}
                      onChange={(v) => setField(f.id, v)}
                      placeholder={f.placeholder}
                      error={hasError}
                    />
                  ) : (
                    <TextInput
                      icon={<TypeIcon size={15} />}
                      value={form[f.id]}
                      onChange={(v) => setField(f.id, v)}
                      placeholder={f.placeholder}
                      error={hasError}
                    />
                  )}
                </FieldShell>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-gray-100 pt-5 sm:grid-cols-4">
            {TOGGLES.map((t) => (
              <div key={t.id}>
                <p className="text-[13px] font-semibold text-[#111827]">
                  {t.label} <span className="font-normal text-gray-400">/ {t.labelHi}</span>
                </p>
                {t.subheading && (
                  <p className="mb-2 text-[12px] text-gray-400">{t.subheading}</p>
                )}
                <RadioYesNo
                  label=""
                  value={toggles[t.id as keyof TogglesState] === "yes"}
                  onChange={(v) => setToggle(t.id as keyof TogglesState, v ? "yes" : "no")}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Validate <Check size={16} />
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel <X size={16} />
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValidated}
              title={!isValidated ? "Click Validate and fix any errors first" : undefined}
              className={`flex items-center gap-1.5 rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                isValidated
                  ? "bg-primary text-white hover:bg-primary-700"
                  : "cursor-not-allowed bg-primary-100 text-primary-300"
              }`}
            >
              Save <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {successOpen && (
        <SuccessModal
          variant="success"
          title="SMS Registration Successful"
          subtitle="The account has been registered for SMS notifications successfully."
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </div>
  );
};

export default SMSRegistrationPage;