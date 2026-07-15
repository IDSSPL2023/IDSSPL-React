import type { ElementType } from "react";
import { Smartphone, Mail, KeyRound, X } from "lucide-react";

export type OtpMethodId = "sms" | "email" | "token";

interface OtpMethodOption {
  id: OtpMethodId;
  label: string;
  labelHi: string;
  description: string;
  icon: ElementType;
}

const OTP_METHODS: OtpMethodOption[] = [
  {
    id: "sms",
    label: "OTP via SMS",
    labelHi: "एसएमएसद्वारे ओटीपी",
    description: "Sent to your registered mobile number",
    icon: Smartphone,
  },
  {
    id: "email",
    label: "OTP via Email",
    labelHi: "ईमेलद्वारे ओटीपी",
    description: "Sent to your registered email address",
    icon: Mail,
  },
  {
    id: "token",
    label: "OTP via Token",
    labelHi: "टोकनद्वारे ओटीपी",
    description: "Generate using your hardware/software token",
    icon: KeyRound,
  },
];

interface OtpMethodModalProps {
  onSelect: (method: OtpMethodId) => void;
  onClose: () => void;
}

export default function OtpMethodModal({ onSelect, onClose }: OtpMethodModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-3xl rounded-[22px] bg-gradient-to-br from-white to-[#EAF8FB] px-8 py-10 shadow-[0px_10px_32px_rgba(0,0,0,0.15)] dark:from-slate-900 dark:to-slate-900">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <X size={18} />
        </button>

        <h2 className="text-center text-[26px] font-medium text-[#1A1A1A] dark:text-slate-100">
          Choose OTP Method
          <span className="text-slate-400"> / </span>
          <span className="text-[18px] text-[#808080] dark:text-slate-500">ओटीपी पद्धत निवडा</span>
        </h2>
        <p className="mt-2 text-center text-[15px] text-[#626262] dark:text-slate-400">
          Select how you&apos;d like to receive your one-time password
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {OTP_METHODS.map(({ id, label, labelHi, description, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-[#D8E3F0] bg-white px-5 py-7 text-center shadow-sm transition hover:border-primary hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary transition group-hover:bg-primary group-hover:text-white">
                <Icon size={26} />
              </span>
              <span className="text-[16px] font-medium leading-tight text-[#1A1A1A] dark:text-slate-100">
                {label}
                <br />
                <span className="text-[13px] font-normal text-[#808080] dark:text-slate-500">{labelHi}</span>
              </span>
              <span className="text-[12px] leading-snug text-[#626262] dark:text-slate-400">{description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
