import { useState, type ReactNode } from "react";
import { Check, ChevronDown, Loader2, ThumbsUp, X } from "lucide-react";
import BaseModal from "./BaseModal";

export interface NormalFormModalProps {
  onClose: () => void;
  titleEn: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  headerIcon?: ReactNode;
  children: ReactNode;
  /** Caller runs its own field validation and updates its error state; button stays enabled always. */
  onValidate: () => void;
  onSave: () => void;
  /** When provided, Save becomes a dropdown offering "Save" and "Save & New" (matches the Head Office Add form); omit for a plain Save button (e.g. Edit). */
  onSaveAndNew?: () => void;
  /** Drives Save's disabled state — caller owns validation, this component is chrome-only. */
  isValid: boolean;
  /** Shows a spinner on Save and disables all footer buttons while an async save is in flight. */
  saving?: boolean;
  validateLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  /** Read-only display: swaps the Validate/Cancel/Save footer for a single Cancel/Ok-Got-It pair; onValidate/onSave are unused. */
  viewOnly?: boolean;
}

/**
 * Target 1475x632. Reference: `Property 1=Default.png` (Add Fixed Asset Account).
 * Footer buttons are Validate / Cancel / Save, styled to match the Head Office
 * Master Add form (Save becomes a Save/Save & New dropdown when `onSaveAndNew`
 * is supplied). Validate starts enabled; Save stays disabled until the caller
 * reports `isValid`.
 */
export default function NormalFormModal({
  onClose,
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  headerIcon,
  children,
  onValidate,
  onSave,
  onSaveAndNew,
  isValid,
  saving = false,
  validateLabel = "Validate",
  cancelLabel = "Cancel",
  saveLabel = "Save",
  viewOnly = false,
}: NormalFormModalProps) {
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

  return (
    <BaseModal
      onClose={onClose}
      maxWidthPx={800}
      title={
        <>
          <span className="font-bold text-[#1C398E] dark:text-slate-100">{titleEn}</span>
          {titleHi && <span className="text-slate-400"> / </span>}
          {titleHi && <span className="font-bold text-[#64748B] dark:text-slate-400">{titleHi}</span>}
        </>
      }
      subtitle={
        subtitleEn && (
          <>
            {subtitleEn}
            {subtitleHi && <span className="text-slate-400"> / </span>}
            {subtitleHi}
          </>
        )
      }
      icon={headerIcon}
      contentClassName="rounded-xl  max-h-[632px]"
      bodyClassName="px-6 py-5"
      footer={
        viewOnly ? (
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-primary-500 px-5 text-sm font-medium text-primary transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-700"
            >
              Ok, Got It
              <ThumbsUp className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={onValidate}
              disabled={saving}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {validateLabel}
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-primary-500 px-5 text-sm font-medium text-primary transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
              <X className="h-4 w-4" />
            </button>
            {onSaveAndNew ? (
              <div className="relative">
                <button
                  type="button"
                  disabled={!isValid || saving}
                  onClick={() => isValid && !saving && setSaveMenuOpen((o) => !o)}
                  className={`flex h-10 items-center justify-center gap-1.5 rounded-lg px-5 text-sm font-medium transition ${
                    isValid && !saving
                      ? "bg-primary-100 text-primary hover:bg-primary-200"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                  }`}
                >
                  {saving ? (
                    <>
                      Saving <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      {saveLabel} <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
                {saveMenuOpen && isValid && !saving && (
                  <div className="absolute bottom-12 right-0 z-10 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={() => {
                        setSaveMenuOpen(false);
                        onSave();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSaveMenuOpen(false);
                        onSaveAndNew();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Save & New
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onSave}
                disabled={!isValid || saving}
                className={`flex h-10 min-w-[92px] items-center justify-center gap-1.5 rounded-lg px-5 text-sm font-medium transition ${
                  isValid && !saving
                    ? "bg-primary-100 text-primary hover:bg-primary-200"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                }`}
              >
                {saving ? (
                  <>
                    Saving <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  saveLabel
                )}
              </button>
            )}
          </div>
        )
      }
    >
      {children}
    </BaseModal>
  );
}
