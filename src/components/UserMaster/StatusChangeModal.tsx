import { StatusModal } from "@/components/common";
import type { StatusOption } from "@/components/common";

export type UserStatusValue = "Active" | "Inactive";

export interface StatusChangeModalProps {
  open: boolean;
  currentStatus?: UserStatusValue;
  onClose?: () => void;
  onSubmit?: (status: UserStatusValue) => void;
}

const STATUS_OPTIONS: StatusOption<UserStatusValue>[] = [
  { value: "Active", label: "Active", tone: "success" },
  { value: "Inactive", label: "Inactive", tone: "rejected" },
];

/** Built on the common `StatusModal`. */
export default function StatusChangeModal({ open, currentStatus = "Active", onClose, onSubmit }: StatusChangeModalProps) {
  if (!open) return null;

  return (
    <StatusModal<UserStatusValue>
      onClose={() => onClose?.()}
      currentStatus={currentStatus}
      options={STATUS_OPTIONS}
      onSubmit={onSubmit}
      title="Status"
      titleHi="स्टेटस"
    />
  );
}
