import { X, Check, ChevronRight, ChevronDown } from "lucide-react";
import Image from "@/components/ui/Image";
import type { ReactNode } from "react";
import { useState } from "react";

export interface FormModalProps {
  onClose: () => void;
  titleEn: string;
  titleHi: string;
  subtitleEn?: string;
  subtitleHi?: string;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
  onValidate?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  isLastTab?: boolean;
  headerIcon?: ReactNode;
  /** Optional content rendered in the header row, to the left of the close button. */
  headerActions?: ReactNode;
  tabActions?: ReactNode;
  maxWidth?: string;
  hideFooter?: boolean;
  customFooter?: ReactNode;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders as a
   * plain inline card with no backdrop, for routes that host the form directly. */
  variant?: "modal" | "page";
}

const FormModal = ({
  onClose,
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  tabs,
  activeTab,
  onTabChange,
  children,
  onValidate,
  onNext,
  onSave,
  isLastTab = false,
  headerIcon,
  headerActions,
  tabActions,
  maxWidth = "max-w-6xl",
  hideFooter = false,
  variant = "modal",
  customFooter,
}: FormModalProps) => {
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const isPage = variant === "page";

  const card = (
    <div
      className={
        isPage
          ? "w-full rounded-2xl bg-white p-6 shadow-2xl"
          : `max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`
      }
    >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            {headerIcon ?? (
              <Image src="/add-icn.png" alt="Add Icon" width={50} height={50} />
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {titleEn}{" "}
                {titleHi ? (
                  <span className="font-bold text-[#64748B]">/ {titleHi}</span>
                ) : null}
              </h2>
              {(subtitleEn || subtitleHi) && (
                <p className="text-sm text-slate-500">
                  {subtitleEn}
                  {subtitleHi && ` / ${subtitleHi}`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {headerActions}
            {!isPage && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`relative shrink-0 pb-2 pt-2 text-sm font-medium transition-colors ${activeTab === tab
                    ? "text-primary"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
          {tabActions}
        </div>

        {/* Content */}
        <div
          className={
            isPage
              ? "mt-3 space-y-4"
              : "mt-3 max-h-[58vh] space-y-4 overflow-y-auto pr-1"
          }
        >
          {children}
        </div>

        {/* Footer */}
        {!hideFooter && (
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onValidate}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Validate <Check size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
            >
              Cancel <X size={16} />
            </button>

            {!isLastTab ? (
              <button
                type="button"
                onClick={onNext}
                className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-200"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSaveMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-200"
                >
                  Save <ChevronDown size={16} />
                </button>
                {saveMenuOpen && (
                  <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setSaveMenuOpen(false);
                        onSave?.();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSaveMenuOpen(false);
                        onSave?.();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50"
                    >
                      Save & New
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Footer */}
        {customFooter && <div className="mt-6">{customFooter}</div>}
    </div>
  );

  if (isPage) return card;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ">
      {card}
    </div>
  );
};

export default FormModal;
