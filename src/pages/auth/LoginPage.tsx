import { useState } from "react";
import type { ElementType } from "react";
import { Smartphone, Mail, KeyRound, X, User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { STATIC_LOGIN_ID, STATIC_PASSWORD } from "@/lib/auth";
import AuthLayout from "@/layouts/AuthLayout";

/* ===== from OtpMethodModal.tsx ===== */
export type OtpMethodModal_OtpMethodId = "sms" | "email" | "token";

interface OtpMethodModal_OtpMethodOption {
  id: OtpMethodModal_OtpMethodId;
  label: string;
  labelHi: string;
  description: string;
  icon: ElementType;
}

const OtpMethodModal_OTP_METHODS: OtpMethodModal_OtpMethodOption[] = [
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

interface OtpMethodModal_OtpMethodModalProps {
  onSelect: (method: OtpMethodModal_OtpMethodId) => void;
  onClose: () => void;
}

function OtpMethodModal({ onSelect, onClose }: OtpMethodModal_OtpMethodModalProps) {
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
          {OtpMethodModal_OTP_METHODS.map(({ id, label, labelHi, description, icon: Icon }) => (
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


/* ===== from LoginPage.tsx ===== */
const LoginPage = () => {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userIdTouched, setUserIdTouched] = useState(false);
  const [showOtpMethodModal, setShowOtpMethodModal] = useState(false);

  const isFormValid = userId && password;

  const handleUserIdChange = (value: string) => {
    setUserId(value);
    if (!value) {
      setUserIdError("User ID is required.");
    } else {
      setUserIdError("");
    }
  };

  const handleUserIdBlur = () => {
    setUserIdTouched(true);
    if (!userId) {
      setUserIdError("User ID is required.");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError("");
  };

  const handleSubmit = () => {
    setUserIdTouched(true);
    if (!userId) {
      setUserIdError("User ID is required.");
      return;
    }
    if (userId.trim().toLowerCase() !== STATIC_LOGIN_ID) {
      setUserIdError("Invalid User ID.");
      return;
    }
    if (password !== STATIC_PASSWORD) {
      setPasswordError("Invalid Password.");
      return;
    }
    setShowOtpMethodModal(true);
  };

  const handleOtpMethodSelect = (method: OtpMethodModal_OtpMethodId) => {
    setShowOtpMethodModal(false);
    router.push(
      `/otp-verification?userId=${encodeURIComponent(userId.trim())}&method=${method}`
    );
  };

  return (
    <AuthLayout>
      {/* Form */}
      <div className="w-full mt-6 flex flex-col gap-5">
        {/* User ID */}
        <div>
          <label className="text-[15px] font-medium text-[#312E81] dark:text-indigo-300">
            User ID | <span className="text-[#808080] dark:text-slate-500">यूजर आयडी</span>
            <span className="text-red-500 ml-1 dark:text-red-400">*</span>
          </label>
          <div
            className={`mt-1 flex items-center gap-2 rounded-lg border bg-white px-3 h-[50px] shadow-sm dark:bg-slate-900 ${
              userIdTouched && userIdError
                ? "border-red-500 focus-within:border-red-500 dark:border-red-500 dark:focus-within:border-red-400"
                : "border-[#696FC7] focus-within:border-[#3730A3] dark:border-slate-700 dark:focus-within:border-indigo-400"
            }`}
          >
            <User
              size={18}
              className={
                userIdTouched && userIdError
                  ? "text-red-500 dark:text-red-400"
                  : "text-[#475569] dark:text-slate-400"
              }
            />
            <input
              type="text"
              value={userId}
              onChange={(e) => handleUserIdChange(e.target.value)}
              onBlur={handleUserIdBlur}
              placeholder="Enter Your User Id"
              className="w-full outline-none text-sm text-[#475569] placeholder:text-[#475569] bg-transparent dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
          {userIdTouched && userIdError && (
            <p className="text-xs text-red-500 mt-1 dark:text-red-400">{userIdError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-[15px] font-medium text-[#312E81] dark:text-indigo-300">
            Password | <span className="text-[#808080] dark:text-slate-500">पासवर्ड</span>
            <span className="text-red-500 ml-1 dark:text-red-400">*</span>
          </label>
          <div className="mt-1 flex items-center gap-2 rounded-lg border border-[#696FC7] bg-white px-3 h-[50px] focus-within:border-[#3730A3] shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-indigo-400">
            <Lock size={18} className="text-[#475569] dark:text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter Your Password"
              className="w-full outline-none text-sm text-[#475569] placeholder:text-[#475569] bg-transparent dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#475569] dark:text-slate-400"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordError && (
            <p className="text-xs text-red-500 mt-1 dark:text-red-400">{passwordError}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={!isFormValid}
          onClick={handleSubmit}
          className="mt-4 h-[54px] w-full rounded-xl bg-primary text-white font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0b7384] transition"
        >
          Proceed to OTP Verification
          <ArrowRight size={18} />
        </button>
      </div>

      {showOtpMethodModal && (
        <OtpMethodModal
          onSelect={handleOtpMethodSelect}
          onClose={() => setShowOtpMethodModal(false)}
        />
      )}
    </AuthLayout>
  );
};

export default LoginPage;
