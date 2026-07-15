import { useState, useEffect, useRef } from "react";
import Image from "@/components/ui/Image";
import { useRouter, useSearchParams } from "@/lib/navigation";
import { STATIC_LOGIN_ID, STATIC_OTP, createAuthSession } from "@/lib/auth";
import AuthLayout from "@/layouts/AuthLayout";

const OTP_LENGTH = 6;

const OtpVerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || STATIC_LOGIN_ID;
  const method = searchParams.get("method");
  const destinationLabel =
    method === "email"
      ? "your registered email"
      : method === "token"
      ? "your token device"
      : "your registered mobile";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(30);
  const [, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(30);
    setCanResend(false);
    setOtpError("");
    inputsRef.current[0]?.focus();
  };

  const CheckOTPverify = () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) return;

    if (code !== STATIC_OTP) {
      setOtpError("Invalid OTP. Please try again.");
      return;
    }

    createAuthSession(userId);
    router.push("/dashboard");
  };

  const isOtpFilled = otp.join("").length === OTP_LENGTH;

  return (
    <AuthLayout contentClassName="w-full max-w-[557px]">
      {/* OTP Card */}
      <div className="flex flex-col justify-center items-center px-[54px] py-10 gap-2.5 w-[557px] h-[433px] bg-gradient-to-br from-white to-[#EAF8FB] shadow-[0px_10px_32px_rgba(0,0,0,0.15)] rounded-[22px] mt-8 dark:from-slate-900 dark:to-slate-900">
        <div className="flex flex-col items-center gap-2.5 w-[412px] h-[369px]">
          <Image
            src="/Sidebar/Icon.png"
            alt="otp-icon"
            width={82}
            height={82}
            className="w-[82px] h-[82px]"
          />
          <p
            className="font-medium text-[24px] leading-[24px] text-center w-[332px] h-[24px] dark:text-slate-100"
            style={{ fontFamily: "'Instrument Sans'", color: "#000000" }}
          >
            OTP Verification
          </p>
          <p
            className="font-normal text-[16px] leading-[24px] text-center flex justify-center items-center text-[#626262] w-[332px] h-[24px] dark:text-slate-400"
            style={{ fontFamily: "'Instrument Sans'" }}
          >
            Enter the OTP Sent to {destinationLabel}
          </p>

          {/* OTP inputs */}
          <div className="flex flex-row items-center justify-center gap-3.5 h-[61px]">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center rounded-xl border border-[#D8E3F0] bg-white text-lg font-medium text-[#000000] outline-none shadow-sm focus:border-[#1668C8] focus:ring-2 focus:ring-[#1668C8]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            ))}
          </div>

          {otpError && (
            <p className="text-xs text-red-500 text-center">{otpError}</p>
          )}

          <p
            className="font-medium text-[16px] leading-[24px] text-center text-primary"
            style={{ fontFamily: "Instrument Sans" }}
          >
            00:{timer.toString().padStart(2, "0")}
          </p>

          <p
            className="font-normal text-[16px] leading-[24px] text-center text-[#626262] dark:text-slate-400"
            style={{ fontFamily: "Instrument Sans" }}
          >
            Didn't receive the OTP?{" "}
            <span
              className="font-medium text-primary cursor-pointer"
              onClick={handleResendOTP}
            >
              Resend
            </span>
          </p>
        </div>

        <button
          disabled={!isOtpFilled}
          onClick={CheckOTPverify}
          className="flex flex-row justify-center items-center px-6 py-4 gap-1.5 w-[356px] h-14 bg-primary shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)] rounded-[18px] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify →
        </button>
      </div>
    </AuthLayout>
  );
};

export default OtpVerificationPage;
