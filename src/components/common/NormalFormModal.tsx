import type { ReactNode } from "react";
import { Check, Loader2, X } from "lucide-react";
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
  /** Drives Save's disabled state — caller owns validation, this component is chrome-only. */
  isValid: boolean;
  /** Shows a spinner on Save and disables all footer buttons while an async save is in flight. */
  saving?: boolean;
  validateLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
}

/**
 * Target 1475x632. Reference: `Property 1=Default.png` (Add Fixed Asset Account).
 * Footer buttons are exactly Validate / Cancel / Save (no dropdown). Validate
 * starts enabled; Save stays disabled until the caller reports `isValid`.
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
  isValid,
  saving = false,
  validateLabel = "Validate",
  cancelLabel = "Cancel",
  saveLabel = "Save",
}: NormalFormModalProps) {
  return (
    <BaseModal
      onClose={onClose}
      maxWidthPx={800}
      title={
        <>
          {titleEn}
          {titleHi && <span className="text-slate-400"> / </span>}
          {titleHi && <span className="text-[#64748B]">{titleHi}</span>}
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
          <button
            type="button"
            onClick={onSave}
            disabled={!isValid || saving}
            className={`flex h-10 min-w-[92px] items-center justify-center gap-1.5 rounded-lg px-5 text-sm font-medium transition ${isValid && !saving ? "bg-primary text-white hover:bg-primary-700" : "cursor-not-allowed bg-slate-100 text-slate-400"
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
        </div>
      }
    >
      {children}
    </BaseModal>
  );
}
