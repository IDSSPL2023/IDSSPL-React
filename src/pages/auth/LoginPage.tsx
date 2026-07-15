import { useState } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { STATIC_LOGIN_ID, STATIC_PASSWORD } from "@/lib/auth";
import AuthLayout from "@/layouts/AuthLayout";
import OtpMethodModal, { type OtpMethodId } from "@/components/auth/OtpMethodModal";

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

  const handleOtpMethodSelect = (method: OtpMethodId) => {
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
