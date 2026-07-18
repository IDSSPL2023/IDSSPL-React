import Image from "@/components/ui/Image";
import { ChevronRight } from "lucide-react";
import type { PayrollTransactionItem } from "./payrollTransactionData";

type PayrollTransactionCardProps = {
  item: PayrollTransactionItem;
  onOpen?: (item: PayrollTransactionItem) => void;
};

const PayrollTransactionCard = ({ item, onOpen }: PayrollTransactionCardProps) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
        <Image
          src={item.icon}
          alt=""
          width={56}
          height={56}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">
          {item.title}
        </h3>
      </div>

      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
      >
        Open <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default PayrollTransactionCard;
