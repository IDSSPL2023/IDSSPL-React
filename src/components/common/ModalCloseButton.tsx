import { ICONS } from "@/assets";
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
      className={`w-11 aspect-square ${className}`}
    >
      <img src={ICONS.CLOSE_CIRCLE} alt="close-btn" />
    </button>
  );
}
