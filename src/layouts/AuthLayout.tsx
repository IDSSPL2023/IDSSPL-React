import { IMAGES } from "@/assets";
import type { ReactNode } from "react";
import Image from "@/components/ui/Image";

/**
 * Shared chrome for the unauthenticated pages (login + OTP): the gradient
 * background, the left-hand bank image, the centered logo and the
 * "CBS Software Bank / Welcome Back" heading block. Each page supplies only
 * its own form area as `children`.
 */
export default function AuthLayout({
  children,
  contentClassName = "w-[527px]",
}: {
  children: ReactNode;
  /** Width/constraints for the content column; differs slightly per page. */
  contentClassName?: string;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-[#EEF8FF] to-[#D0E7F6] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex w-full h-screen">
        {/* Left Image */}
        <img
          src={IMAGES.LOGIN}
          alt="bank"
          className="h-screen w-auto object-cover flex-shrink-0"
        />

        {/* Right */}
        <div className="relative flex-1 pt-[10px] flex flex-col items-center">
          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Image
              src={IMAGES.LOGO}
              alt="IDSSPL Logo"
              width={353}
              height={118}
              className="w-[353px] h-[118px]"
            />
          </div>

          {/* Content */}
          <div className={`absolute top-[121px] flex flex-col items-center ${contentClassName}`}>
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
                keeps your customers' trust at the heart of every transaction.
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
