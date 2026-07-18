// components/shared/SectionHeader.tsx
import React from "react";

interface SectionHeaderProps {
  icon?: React.ReactNode;
  titleEn: string;
  titleHi: string;
  subtitleEn?: string;
  subtitleHi?: string;
  className?: string;
  children?: React.ReactNode;
  iconSize?: string;
}

const SectionHeader = ({
  icon,
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  className = "",
  iconSize = "h-10 w-10",
  children,
}: SectionHeaderProps) => {
  return (
    <div
      className={`rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900 ${className}`}
    >
      {/* Header row with icon and title */}
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`flex-shrink-0 ${iconSize}`}>
            {React.cloneElement(icon as React.ReactElement, {
              className: `w-full h-full object-contain ${(icon as React.ReactElement).props.className || ''}`,
            })}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {titleEn} / <span className="text-slate-600 dark:text-slate-400">{titleHi}</span>
          </h3>
          {/* Subtitle - directly below the title */}
          {(subtitleEn || subtitleHi) && (
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
              {subtitleEn}
              {subtitleHi && ` / ${subtitleHi}`}
            </p>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default SectionHeader;