// components/shared/SectionWrapper.tsx
import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  titleEn?: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  iconSize?: string;
}

const SectionWrapper = ({
  children,
  className = "",
  icon,
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  iconSize = "h-10 w-10",
}: SectionWrapperProps) => {
  return (
    <div
      className={`rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900 ${className}`}
    >
      {titleEn && (
        <div className="mb-4 flex items-start gap-3 border-b border-black/5 pb-4">
          {icon && (
            <div className={`shrink-0 ${iconSize}`}>
              {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: `w-full h-full object-contain ${(icon as React.ReactElement<{ className?: string }>).props.className || ""}`,
              })}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {titleEn}
              {titleHi && (
                <>
                  {" / "}
                  <span className="text-slate-600 dark:text-slate-400">{titleHi}</span>
                </>
              )}
            </h3>
            {(subtitleEn || subtitleHi) && (
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                {subtitleEn}
                {subtitleHi && ` / ${subtitleHi}`}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default SectionWrapper;
