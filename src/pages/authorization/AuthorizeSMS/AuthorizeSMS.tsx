import { IMAGES } from "@/assets";
import React, { useState } from "react";
import {
  X,
  Check,
  Hash,
  Calendar,
  Phone,
  MessageSquare,
  Home,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "@/components/ui/Image";
import { useRouter } from "@/lib/navigation";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import RejectedModal from "@/components/shared/RejectedModal";
import TextInput from "@/components/shared/Inputs/TextInput";

// ==========================================
// TYPES
// ==========================================

interface FormData {
  accountCode: string;
  accountName: string;
  mobileNumber: string;
  registrationDate: string;
  registrationPeriod: string;
  smsCount: string;
  depositLimit: string;
  withdrawalLimit: string;
  beforeAlertDays: string;
  afterAlertDays: string;
  beforeSmsLimit: string;
  afterSmsLimit: string;
  transactionSms: string;
  promotionSms: string;
  alertSms: string;
  birthdaySms: string;
}

// ==========================================
// DATE INPUT COMPONENT
// ==========================================

function DateInputField({
  labelEn,
  labelHi,
  value,
  placeholder,
  error,
  required = true,
  readOnly = true,
}: {
  labelEn: string;
  labelHi: string;
  value: string;
  placeholder?: string;
  error?: boolean;
  required?: boolean;
  readOnly?: boolean;
}) {
  const inputId = React.useId();
  const errorId = React.useId();

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-[1rem] font-medium text-black"
      >
        {labelEn}
        <span className="font-medium text-gray-500"> / {labelHi}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex h-12 items-center rounded-xl border px-3 transition-colors ${
          error ? "border-red-400" : "border-[#6A7282]"
        } ${readOnly ? "bg-[#F3F4F6] cursor-not-allowed" : "bg-white"}`}
      >
        <Calendar
          size={20}
          className="shrink-0 text-[#6B7280]"
          aria-hidden="true"
        />
        <span className="ml-3 w-full truncate text-[15px] text-slate-500">
          {value || placeholder || "Select Date"}
        </span>
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-500">
          This field is required
        </p>
      )}
    </div>
  );
}

// ==========================================
// YES/NO FIELD
// ==========================================

function YesNoField({
  label,
  labelHi,
  value,
}: {
  label: string;
  labelHi: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[1rem] font-medium text-black">
        {label}
        <span className="font-medium text-gray-500"> / {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-6 mt-1">
        <label className="flex items-center gap-2 text-[15px] text-slate-500 cursor-not-allowed">
          <input
            type="radio"
            checked={value === "yes"}
            disabled
            className="w-4 h-4 text-blue-600"
          />
          <span className="font-medium">Yes</span>
        </label>
        <label className="flex items-center gap-2 text-[15px] text-slate-500 cursor-not-allowed">
          <input
            type="radio"
            checked={value === "no"}
            disabled
            className="w-4 h-4 text-blue-600"
          />
          <span className="font-medium">No</span>
        </label>
      </div>
    </div>
  );
}

// ==========================================
// SUCCESS MODAL
// ==========================================

function SuccessModalComponent({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-[30px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#DCEBFF] opacity-90" />
        <div className="absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-[#DCEBFF] opacity-90" />
        <button
          onClick={onClose}
          className="absolute right-7 top-7 text-[#6F7785] hover:scale-105 transition"
        >
          <X size={28} strokeWidth={2.2} />
        </button>
        <div className="px-12 py-14 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-[105px] w-[105px] rounded-full border border-dashed border-[#3F73F5]/20" />
            {[
              "top-0 left-1/2",
              "top-4 left-3",
              "top-6 right-3",
              "left-0 top-1/2",
              "right-0 top-1/2",
              "bottom-5 left-3",
              "bottom-4 right-4",
              "bottom-0 left-1/2",
            ].map((cls, i) => (
              <span
                key={i}
                className={`absolute ${cls} h-[4px] w-[4px] rounded-full bg-[#3F73F5]`}
              />
            ))}
            <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#416EF4] shadow-[0_10px_20px_rgba(65,110,244,0.35)]">
              <Check size={44} strokeWidth={3.5} color="white" />
            </div>
          </div>
          <h2 className="mt-10 text-center text-[26px] font-bold leading-[34px] text-black">
            Authorized Successfully
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            The SMS registration has been authorized successfully.
          </p>
          <button
            onClick={onClose}
            className="mt-9 h-[45px] min-w-[88px] rounded-lg bg-[#1F67F4] px-6 text-lg font-semibold text-white shadow-md hover:bg-[#0E57EA]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FIELD CONFIG
// ==========================================

const SMS_FIELDS = [
  { key: "accountCode", labelEn: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Amount", icon: Hash },
  { key: "accountName", labelEn: "Account Name", labelHi: "खात्याचे नाव", placeholder: "name@company.com", icon: Hash },
  { key: "mobileNumber", labelEn: "Mobile Number", labelHi: "मोबाईल नंबर", placeholder: "name@company.com", icon: Phone },
  { key: "registrationDate", labelEn: "Registration Date", labelHi: "नोंदणी तारीख", placeholder: "Select date", isDate: true },
  { key: "registrationPeriod", labelEn: "Registration Period", labelHi: "नोंदणी कालावधी", placeholder: "Enter Amount", icon: Hash },
  { key: "smsCount", labelEn: "SMS Count", labelHi: "एसएमएस संख्या", placeholder: "Enter Amount", icon: Hash },
  { key: "depositLimit", labelEn: "Deposit Limit", labelHi: "जमा मर्यादा", placeholder: "Enter Amount", icon: Hash },
  { key: "withdrawalLimit", labelEn: "Withdrawal Limit", labelHi: "काढण्याची मर्यादा", placeholder: "Enter Amount", icon: Hash },
  { key: "beforeAlertDays", labelEn: "Before Alert Days", labelHi: "आधीचे सूचना दिवस", placeholder: "Enter Amount", icon: Hash },
  { key: "afterAlertDays", labelEn: "After Alert Days", labelHi: "नंतरचे सूचना दिवस", placeholder: "Enter Amount", icon: Hash },
  { key: "beforeSmsLimit", labelEn: "Before SMS Limit", labelHi: "आधीची एसएमएस मर्यादा", placeholder: "Enter Amount", icon: Hash },
  { key: "afterSmsLimit", labelEn: "After SMS Limit", labelHi: "नंतरची एसएमएस मर्यादा", placeholder: "Enter Amount", icon: Hash },
];

const TOGGLE_FIELDS = [
  { key: "transactionSms", label: "Transaction SMS", labelHi: "व्यवहार एसएमएस" },
  { key: "promotionSms", label: "Promotion SMS", labelHi: "प्रमोशन एसएमएस" },
  { key: "alertSms", label: "Alert SMS", labelHi: "सूचना एसएमएस" },
  { key: "birthdaySms", label: "Birthday SMS", labelHi: "वाढदिवस एसएमएस" },
];

// ==========================================
// MAIN PAGE
// ==========================================

export default function AuthorizeSMS() {
  const router = useRouter();
  const handleBack = () => router.back();

  const [formData] = useState<FormData>({
    accountCode: "0002",
    accountName: "name@company.com",
    mobileNumber: "9876543210",
    registrationDate: "2026-07-18",
    registrationPeriod: "12",
    smsCount: "100",
    depositLimit: "50000",
    withdrawalLimit: "25000",
    beforeAlertDays: "3",
    afterAlertDays: "2",
    beforeSmsLimit: "5",
    afterSmsLimit: "3",
    transactionSms: "yes",
    promotionSms: "no",
    alertSms: "yes",
    birthdaySms: "no",
  });

  const [showRejectReason, setShowRejectReason] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReject = (reason: string) => {
    console.log("Rejection reason:", reason);
    setShowRejectReason(false);
    setShowRejected(true);
  };

  const handleAuthorize = () => setShowSuccess(true);
  const handleRejectedDone = () => {
    setShowRejected(false);
  };
  const handleSuccessClose = () => {
    setShowSuccess(false);
    handleBack();
  };

  const grid4 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="min-h-screen app-page-bg p-4">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
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
              SMS Registration Authorize <span className="text-gray-400 font-normal">|</span> एसएमएस नोंदणी अधिकृत
            </h1>

           <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-gray-500">
              <Home size={13} />
              <span>Home</span>
              <ChevronRight size={13} />
              <span>Authorization</span>
              <ChevronRight size={13} />
              <span className="text-primary font-medium">SMS Authorize</span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border-2 border-primary bg-white p-6 shadow-sm">
          {/* SMS Details */}
          <div className="mb-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  SMS Details{" "}
                  <span className="text-xs font-normal text-slate-400">
                    / एसएमएस तपशील
                  </span>
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  View SMS registration details for authorization.
                </p>
              </div>
            </div>
            <div className={`${grid4} mt-4`}>
              {SMS_FIELDS.map((field) => {
                if (field.isDate) {
                  return (
                    <DateInputField
                      key={field.key}
                      labelEn={field.labelEn}
                      labelHi={field.labelHi}
                      value={formData[field.key as keyof FormData] as string}
                      placeholder={field.placeholder}
                      readOnly={true}
                    />
                  );
                }
                return (
                  <TextInput
                    key={field.key}
                    labelEn={field.labelEn}
                    labelHi={field.labelHi}
                    icon={field.icon as LucideIcon}
                    value={formData[field.key as keyof FormData] as string}
                    placeholder={field.placeholder}
                    onChange={() => {}}
                    readOnly={true}
                    required={true}
                  />
                );
              })}
            </div>
          </div>

          {/* SMS Types */}
          <div className="mb-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  SMS Types{" "}
                  <span className="text-xs font-normal text-slate-400">
                    / एसएमएस प्रकार
                  </span>
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Configure SMS notification types.
                </p>
              </div>
            </div>
            <div className={`${grid4} mt-4`}>
              {TOGGLE_FIELDS.map((field) => (
                <div key={field.key}>
                  <YesNoField
                    label={field.label}
                    labelHi={field.labelHi}
                    value={formData[field.key as keyof FormData] as string}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              onClick={() => setShowRejectReason(true)}
              className="flex items-center gap-1.5 rounded-lg border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <Image src={IMAGES.REJECT} alt="Reject" width={16} height={16} />
              Reject
            </button>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary-50"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleAuthorize}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Check size={16} />
              Authorize
            </button>
          </div>
        </div>
      </div>

      {showRejectReason && (
        <RejectReasonModal
          onClose={() => setShowRejectReason(false)}
          onConfirm={handleReject}
          titleEn="Reason for Rejection"
          titleHi="नाकारण्याचे कारण"
        />
      )}

      {showRejected && (
        <RejectedModal
          onClose={handleRejectedDone}
          onDone={handleRejectedDone}
          title="SMS Registration Rejected"
          subtitle="The SMS registration entry has been rejected."
        />
      )}

      {showSuccess && (
        <SuccessModalComponent onClose={handleSuccessClose} />
      )}
    </div>
  );
}
