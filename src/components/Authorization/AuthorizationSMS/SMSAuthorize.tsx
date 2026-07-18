// src/components/Authorization/AuthorizationSMS/SMSAuthorize.tsx
import React, { useState } from "react";
import {
  X,
  Check,
  Hash,
  Calendar,
  Phone,
  Type as TypeIcon,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { SectionCard } from "@/components/shared/FormFields";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import RejectedModal from "@/components/shared/RejectedModal";
import SuccessModal from "@/components/shared/SuccessModal";

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

interface FieldConfig {
  key: keyof FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
  readOnly?: boolean;
}

// ==========================================
// SHARED PRIMITIVES
// ==========================================

function FormField({ field, value }: { field: FieldConfig; value: string }) {
  const Icon = field.icon;
  const isDateField = field.key === "registrationDate";

  if (field.select) {
    return (
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
          {field.label}
          <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
          <select
            value={value}
            disabled
            className="w-full h-8 rounded-[10px] border pl-8 pr-3 text-[11px] outline-none focus:ring-1 appearance-none bg-[#f0f2f5] text-slate-500 cursor-not-allowed border-slate-200"
          >
            <option value="">{field.placeholder}</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  if (isDateField) {
    return (
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
          {field.label}
          <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 z-10 text-slate-400 cursor-default">
            <Calendar size={16} />
          </span>
          <input
            type="date"
            value={value}
            disabled
            className="min-h-[32px] w-full rounded-lg border bg-[#f0f2f5] border-slate-200 cursor-not-allowed py-1.5 pl-10 pr-3 text-[11px] text-slate-500 outline-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {field.label}
        <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center w-full h-8 rounded-[10px] border px-2.5 bg-[#f0f2f5] border-slate-200 cursor-not-allowed">
          <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={field.placeholder}
            value={value}
            disabled
            className="ml-2 w-full bg-transparent outline-none text-[11px] text-slate-500 cursor-not-allowed placeholder:text-[11px] placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

function YesNoField({ label, labelHi, value }: { label: string; labelHi: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {label} <span className="text-slate-400 font-normal">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-6 mt-1">
        <label className="flex items-center gap-2 text-[11px] text-slate-500 cursor-not-allowed">
          <input type="radio" checked={value === "yes"} disabled className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium">Yes</span>
        </label>
        <label className="flex items-center gap-2 text-[11px] text-slate-500 cursor-not-allowed">
          <input type="radio" checked={value === "no"} disabled className="w-3.5 h-3.5 text-blue-600" />
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
        <button onClick={onClose} className="absolute right-7 top-7 text-[#6F7785] hover:scale-105 transition">
          <X size={28} strokeWidth={2.2} />
        </button>
        <div className="px-12 py-14 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-[105px] w-[105px] rounded-full border border-dashed border-[#3F73F5]/20" />
            {["top-0 left-1/2", "top-4 left-3", "top-6 right-3", "left-0 top-1/2", "right-0 top-1/2", "bottom-5 left-3", "bottom-4 right-4", "bottom-0 left-1/2"].map((cls, i) => (
              <span key={i} className={`absolute ${cls} h-[4px] w-[4px] rounded-full bg-[#3F73F5]`} />
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

const SMS_FIELDS: FieldConfig[] = [
  { key: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Amount", icon: Hash, readOnly: true },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "name@company.com", icon: TypeIcon, readOnly: true },
  { key: "mobileNumber", label: "Mobile Number", labelHi: "मोबाईल नंबर", placeholder: "name@company.com", icon: Phone, readOnly: true },
  { key: "registrationDate", label: "Registration Date", labelHi: "नोंदणी तारीख", placeholder: "Select date", icon: Calendar, readOnly: true },
  { key: "registrationPeriod", label: "Registration Period", labelHi: "नोंदणी कालावधी", placeholder: "Enter Amount", icon: Hash, readOnly: true },
  { key: "smsCount", label: "SMS Count", labelHi: "एसएमएस संख्या", placeholder: "Enter Amount", icon: Hash, readOnly: true },
  { key: "depositLimit", label: "Deposit Limit", labelHi: "जमा मर्यादा", placeholder: "Enter Amount", icon: Hash, readOnly: true },
  { key: "withdrawalLimit", label: "Withdrawal Limit", labelHi: "काढण्याची मर्यादा", placeholder: "Enter Amount", icon: Hash, readOnly: true },
  { key: "beforeAlertDays", label: "Before Alert Days", labelHi: "आधीचे सूचना दिवस", placeholder: "Enter Amount", icon: Hash, readOnly: true },
  { key: "afterAlertDays", label: "After Alert Days", labelHi: "नंतरचे सूचना दिवस", placeholder: "Enter Amount", icon: Hash, readOnly: true },
  { key: "beforeSmsLimit", label: "Before SMS Limit", labelHi: "आधीची एसएमएस मर्यादा", placeholder: "Enter Amount", icon: Hash, readOnly: true },
  { key: "afterSmsLimit", label: "After SMS Limit", labelHi: "नंतरची एसएमएस मर्यादा", placeholder: "Enter Amount", icon: Hash, readOnly: true },
];

const TOGGLE_FIELDS = [
  { key: "transactionSms", label: "Transaction SMS", labelHi: "व्यवहार एसएमएस" },
  { key: "promotionSms", label: "Promotion SMS", labelHi: "प्रमोशन एसएमएस" },
  { key: "alertSms", label: "Alert SMS", labelHi: "सूचना एसएमएस" },
  { key: "birthdaySms", label: "Birthday SMS", labelHi: "वाढदिवस एसएमएस" },
];

// ==========================================
// MAIN MODAL
// ==========================================

export interface SMSAuthorizeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SMSAuthorizeModal({ open, onClose }: SMSAuthorizeModalProps) {
  if (!open) return null;

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
    onClose();
  };
  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const grid4 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="SMS Registration Authorize"
        titleHi="एसएमएस नोंदणी अधिकृत"
        subtitleEn="View and authorize the SMS registration entry."
        subtitleHi="एसएमएस नोंदणी नोंद पहा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src="/person icon.png" alt="SMS Authorize" width={40} height={40} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-5xl"
      >
        {/* SMS Details */}
        <SectionCard
          titleEn="SMS Details"
          titleHi="एसएमएस तपशील"
          subtitleEn="View SMS registration details for authorization."
          subtitleHi="अधिकृततेसाठी एसएमएस नोंदणी तपशील पहा."
          icon={<MessageSquare size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {SMS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* SMS Types - Toggles */}
        <SectionCard
          titleEn="SMS Types"
          titleHi="एसएमएस प्रकार"
          subtitleEn="Configure SMS notification types."
          subtitleHi="एसएमएस सूचना प्रकार कॉन्फिगर करा."
          icon={<MessageSquare size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
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
        </SectionCard>

        {/* Footer - Reject, Cancel, Authorize */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={() => setShowRejectReason(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <Image src="/Reject.png" alt="Reject" width={16} height={16} />
            Reject
          </button>
          <button
            onClick={onClose}
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
      </FormModal>

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
    </>
  );
}