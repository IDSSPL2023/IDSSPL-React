import { X } from "lucide-react";

export interface ModalCloseButtonProps {
  onClose: () => void;
  className?: string;
}

/** Standard top-right modal close icon — same size/border/icon/hover everywhere. */
export default function ModalCloseButton({ onClose, className = "" }: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 ${className}`}
    >
      <X size={18} strokeWidth={2.5} />
    </button>
  );
}
