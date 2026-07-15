import { ArrowUpDown } from "lucide-react";

interface SortableHeaderLabelProps {
  label: string;
  sortable?: boolean;
}

export default function SortableHeaderLabel({ label, sortable = false }: SortableHeaderLabelProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      {sortable && <ArrowUpDown size={13} className="opacity-80" />}
    </span>
  );
}
