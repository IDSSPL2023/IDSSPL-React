import SuccessModal from "./SuccessModal";

export interface RejectModalProps {
  onClose: () => void;
  onDone: () => void;
  title?: string;
  subtitle?: string;
}

/**
 * Thin preset wrapper around `SuccessModal`'s rejection variant — the final
 * red-X confirmation shown after a reject reason is submitted. Kept as its
 * own named file (per the folder spec) without duplicating the layout.
 */
export default function RejectModal({
  onClose,
  onDone,
  title = "Account Authorization is Rejected",
  subtitle,
}: RejectModalProps) {
  return (
    <SuccessModal onClose={onClose} onDone={onDone} title={title} subtitle={subtitle} variant="rejection" />
  );
}
