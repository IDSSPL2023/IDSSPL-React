import { useEffect, useRef, useState } from "react";
import { User, Lock, Building2, ArrowRight, Eye, EyeOff, ChevronDown } from "lucide-react";
import Image from "@/components/ui/Image";
import { useRouter } from "@/lib/navigation";
import { STATIC_LOGIN_ID, STATIC_PASSWORD } from "@/lib/auth";
import OtpMethodModal, { type OtpMethodId } from "@/components/auth/OtpMethodModal";

const branchOptions = [
  { value: "001", label: "001 - Main Branch" },
  { value: "002", label: "002 - Mumbai Branch" },
  { value: "003", label: "003 - Pune Branch" },
];

const BranchDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = branchOptions.find((b) => b.value === value);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 justify-between text-sm text-[#475569] bg-transparent outline-none dark:text-slate-300"
      >
        <span className="flex items-center gap-2">
          <Building2 size={18} className="text-[#475569] dark:text-slate-400" />
          {selected ? selected.label : "Select Branch Code"}
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-[180px] bg-white border border-[#696FC7] rounded-lg shadow-md overflow-hidden dark:bg-slate-900 dark:border-slate-700">
          {branchOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm text-[#475569] hover:bg-[#EEF8FF] cursor-pointer dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LoginPage = () => {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [branchCode, setBranchCode] = useState("");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-[#EEF8FF] to-[#D0E7F6] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex w-full h-screen">
        {/* Left Image */}
        <img
          src="/login.png"
          alt="bank"
          className="h-screen w-auto object-cover flex-shrink-0"
        />

        {/* Right */}
        <div className="relative flex-1 pt-[10px] flex flex-col items-center">
          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Image
                 src="/logo.png"
              alt="IDSSPL Logo"
              width={353}
    height={118}
    className="w-[353px] h-[118px]"
            />
          </div>

          {/* Login content */}
          <div className="absolute top-[121px] w-[527px] flex flex-col items-center">
            <div className="flex flex-col items-start gap-4 w-full">
              <h2
                className="font-medium text-[32px] leading-[110%] text-center w-full"
                style={{ color: "#3730A3", fontFamily: "Literata" }}
              >
                CBS Software Bank
              </h2>
              <h3 className="font-normal text-[28px] leading-[110%] text-center text-[#1A1A1A] w-full dark:text-slate-100">
                Welcome Back
              </h3>
              <p className="font-normal text-[16px] text-center text-[#393939] w-full dark:text-slate-400">
                Empowering banks with a secure, future-ready platform that
                keeps your customers' trust at the heart of every
                transaction.
              </p>
            </div>

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

              {/* Branch Code */}
              <div>
                <label className="text-[15px] font-medium text-[#312E81] dark:text-indigo-300">
                  Branch Code | <span className="text-[#808080] dark:text-slate-500">शाखा कोड</span>
                </label>
                <div className="mt-1 flex items-center rounded-lg border border-[#696FC7] bg-white px-3 h-[50px] focus-within:border-[#3730A3] shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-indigo-400">
                  <BranchDropdown value={branchCode} onChange={setBranchCode} />
                </div>
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
          </div>
        </div>
      </div>

      {showOtpMethodModal && (
        <OtpMethodModal
          onSelect={handleOtpMethodSelect}
          onClose={() => setShowOtpMethodModal(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;