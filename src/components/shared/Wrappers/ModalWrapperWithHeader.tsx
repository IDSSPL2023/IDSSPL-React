// components/shared/ModalWrapper.tsx
import React from "react";
import { X, LucideIcon } from "lucide-react";

export interface ModalButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface ModalHeaderProps {
  icon?: LucideIcon | React.ReactNode | string;
  iconColor?: string;
  iconBgColor?: string;
  iconSize?: number;
  title: string;
  titleHi?: string;
  subtitle?: string;
  subtitleHi?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface ModalWrapperProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  maxWidth?:
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "full";
  className?: string;
  header?: ModalHeaderProps;
  footerButtons?: ModalButton[];
  footerAlign?: "left" | "center" | "right";
  showDefaultClose?: boolean;
  renderFooter?: () => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  noPadding?: boolean;
}

const ModalWrapperWithHeader = ({
  open,
  onClose,
  children,
  maxWidth = "5xl",
  className = "",
  header,
  footerButtons = [],
  footerAlign = "right",
  showDefaultClose = true,
  renderFooter,
  renderHeader,
  noPadding = false,
}: ModalWrapperProps) => {
  if (!open) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const getButtonClasses = (button: ModalButton) => {
    const baseClasses =
      "flex w-[147px] h-[48px] items-center justify-center gap-2 rounded-lg pt-[15px] pr-[24px] pb-[15px] pl-[24px] text-sm font-medium opacity-100 transition-colors";

    if (button.className) return `${baseClasses} ${button.className}`;

    const variantClasses = {
      primary: "bg-primary text-white hover:bg-primary-700",
      secondary:
        "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
      danger: "bg-red-500 text-white hover:bg-red-600",
      success: "bg-green-500 text-white hover:bg-green-600",
      outline: "border border-primary-500 text-primary hover:bg-primary-50",
    };

    return `${baseClasses} ${variantClasses[button.variant || "primary"]}`;
  };

  const renderIcon = () => {
    if (!header?.icon) return null;

    const { icon, iconColor, iconBgColor, iconSize = 64 } = header;

    // If icon is a string (image URL or imported image)
    if (typeof icon === "string") {
      // Check if it's an image URL or base64
      if (
        icon.startsWith("data:") ||
        icon.startsWith("http") ||
        icon.includes("/")
      ) {
        return (
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${iconBgColor} overflow-hidden`}
          >
            <img src={icon} alt="icon" className="h-16 w-16 object-cover" />
          </div>
        );
      }
      // If it's a simple text/emoji
      return (
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${iconBgColor}`}
        >
          <span className={`${iconColor} text-lg font-bold`}>{icon}</span>
        </div>
      );
    }

    // If icon is a React element (custom SVG or component)
    if (React.isValidElement(icon)) {
      const element = icon as React.ReactElement<any>;
      return (
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${iconBgColor}`}
        >
          {React.cloneElement(element, {
            className: `${iconColor} h-5 w-5`,
            size: iconSize,
          } as any)}
        </div>
      );
    }

    // If icon is a function (LucideIcon or custom component)
    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<any>;
      return (
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBgColor}`}
        >
          <IconComponent className={iconColor} size={iconSize} />
        </div>
      );
    }

    return null;
  };

  const renderModalHeader = () => {
    if (renderHeader) return renderHeader();
    if (!header) return null;

    const {
      title,
      titleHi,
      subtitle,
      subtitleHi,
      onClose: headerOnClose,
      showCloseButton = true,
    } = header;

    return (
    
        <div className="shrink-0 p-6 pb-4">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {renderIcon()}
              <div>
                <h2 className="text-2xl font-bold text-[#101828] dark:text-slate-100">
                  {title}
                  {titleHi && (
                    <span className="font-bold text-[#64748B] dark:text-slate-400">
                      {" "}
                      / {titleHi}
                    </span>
                  )}
                </h2>
                {(subtitle || subtitleHi) && (
                  <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
                    {subtitle}
                    {subtitle && subtitleHi && " / "}
                    {subtitleHi}
                  </p>
                )}
              </div>
            </div>
            {showCloseButton && (headerOnClose || onClose) && (
              <button
                type="button"
                onClick={headerOnClose || onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

    );
  };

  return (
    
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      
    <div
       className={`rounded-[20px] bg-white p-5 dark:bg-slate-900 ${className}`}
       onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
     >
      <div
        className={`flex max-h-[92vh]  border-x border-b border-t-4 border-primary w-full ${maxWidthClasses[maxWidth]} flex-col rounded-3xl bg-white dark:bg-slate-900 ${className}`}
      >
        {/* Header */}
        {renderModalHeader()}

        {/* Content */}
        <div
          className={`flex-1 overflow-y-auto ${noPadding ? "" : "px-6 pb-4"}`}
        >
          {children}
        </div>


    </div>

        {/* Footer */}
        {(footerButtons.length > 0 || showDefaultClose || renderFooter) && (
          <div className="shrink-0 px-6 pt-5 pb-3">
            <div
              className={`flex items-center gap-3 ${alignClasses[footerAlign]}`}
            >
              {renderFooter ? (
                renderFooter()
              ) : (
                <>
                  {footerButtons.map((button, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={button.onClick}
                      disabled={button.disabled}
                      className={getButtonClasses(button)}
                    >
                      {button.label}
                      {button.icon}
                    </button>
                  ))}

                  {showDefaultClose && onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalWrapperWithHeader;
