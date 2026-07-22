import { useState } from "react";
import type { ReactNode } from "react";
import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import BaseModal from "./BaseModal";
import SuccessModal from "./SuccessModal";
import InputRejectModal from "./InputRejectModal";
import RejectModal from "./RejectModal";

export interface AuthorizeFormModalProps {
  onClose: () => void;
  titleEn: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  headerIcon?: ReactNode;
  children: ReactNode;
  onAuthorize: () => void;
  onReject: (reason: string) => void;
  successTitle?: string;
  successSubtitle?: string;
  rejectedTitle?: string;
  rejectedSubtitle?: string;
  rejectReasonTitleEn?: string;
  rejectReasonTitleHi?: string;
  authorizeLabel?: string;
  cancelLabel?: string;
  rejectLabel?: string;
}

type FlowStage = "idle" | "reject-reason" | "authorized" | "rejected";

/**
 * Target 1427x630, 16px radius, 24px padding, `border-t-4 border border-primary`,
 * `shadow-[0_1px_5px_#03003714]`. Footer buttons are exactly Reject / Cancel /
 * Authorize. Owns the Authorize→SuccessModal and Reject→InputRejectModal→RejectModal
 * flow internally, exposing just `onAuthorize`/`onReject(reason)` side-effect callbacks.
 */
export default function AuthorizeFormModal({
  onClose,
  titleEn,
  titleHi,
  subtitleEn,
  subtitleHi,
  headerIcon,
  children,
  onAuthorize,
  onReject,
  successTitle = "Authorized Successfully",
  successSubtitle,
  rejectedTitle = "Authorization is Rejected",
  rejectedSubtitle,
  rejectReasonTitleEn = "Authorization Rejected",
  rejectReasonTitleHi,
  authorizeLabel = "Authorize",
  cancelLabel = "Cancel",
  rejectLabel = "Reject",
}: AuthorizeFormModalProps) {
  const [stage, setStage] = useState<FlowStage>("idle");

  const handleAuthorize = () => {
    onAuthorize();
    setStage("authorized");
  };

  const handleReject = () => setStage("reject-reason");

  const handleRejectSubmit = (reason: string) => {
    onReject(reason);
    setStage("rejected");
  };

  const handleDone = () => {
    setStage("idle");
    onClose();
  };

  if (stage === "reject-reason") {
    return (
      <InputRejectModal
        titleEn={rejectReasonTitleEn}
        titleHi={rejectReasonTitleHi}
        onClose={() => setStage("idle")}
        onSubmit={handleRejectSubmit}
      />
    );
  }

  if (stage === "authorized") {
    return <SuccessModal title={successTitle} subtitle={successSubtitle ?? ""} onClose={handleDone} onDone={handleDone} variant="success" />;
  }

  if (stage === "rejected") {
    return <RejectModal title={rejectedTitle} subtitle={rejectedSubtitle} onClose={handleDone} onDone={handleDone} />;
  }

  return (
    <BaseModal
      onClose={onClose}
      maxWidthPx={1427}
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
      contentClassName="rounded-2xl border border-t-4 border-primary shadow-[0_1px_5px_#03003714] min-h-[500px] max-h-[630px]"
      bodyClassName="px-6 py-5"
      footer={
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            type="button"
            onClick={handleReject}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            {rejectLabel}
            <ThumbsDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
          >
            {cancelLabel}
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleAuthorize}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            {authorizeLabel}
            <ThumbsUp className="h-4 w-4" />
          </button>
        </div>
      }
    >
      {children}
    </BaseModal>
  );
}
