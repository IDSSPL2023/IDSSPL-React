// components/shared/SectionWrapper.tsx
import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper = ({ children, className = "" }: SectionWrapperProps) => {
  return (
    <div
      className={`rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;
