import Image from "@/components/ui/Image";
import { ChevronRight } from "lucide-react";
import { IMAGES } from "@/assets";
import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizeHero from "@/components/Authorization/AuthorizeTransaction/AuthorizeHero";

/* ===== from PayrollTransactionCard.tsx ===== */
type PayrollTransactionCard_PayrollTransactionCardProps = {
  item: PayrollTransactionData_PayrollTransactionItem;
  onOpen?: (item: PayrollTransactionData_PayrollTransactionItem) => void;
};

const PayrollTransactionCard = ({ item, onOpen }: PayrollTransactionCard_PayrollTransactionCardProps) => {
  const router = useRouter();
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
        disabled={!item.href}
        onClick={() => item.href && router.push(item.href)}
        className={`flex shrink-0 items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${item.href
          ? "border-primary bg-white text-primary hover:bg-primary hover:text-white"
          : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
          }`}
      >
        Open <ChevronRight size={16} />
      </button>
    </div>
  );
};


/* ===== from payrollTransactionData.ts ===== */
export type PayrollTransactionData_PayrollTransactionItem = {
  id: string;
  title: string;
  icon: string;
  href?: string;
};

const PayrollTransactionData_ICON = IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON;

export const PayrollTransactionData_PAYROLL_TRANSACTION_ITEMS: PayrollTransactionData_PayrollTransactionItem[] = [
  { id: "earning-deduction-master", title: "Earning Deduction Master", icon: PayrollTransactionData_ICON },
  { id: "employee-leave-balance", title: "Employee Leave Balance", icon: PayrollTransactionData_ICON, href: "/payroll/transaction/employee-leave-balance" },
  { id: "employee-loan-details", title: "Employee Loan Details", icon: PayrollTransactionData_ICON },
  { id: "update-fix-fields", title: "Update Fix Fields", icon: PayrollTransactionData_ICON },
  { id: "application-authorize", title: "Application Authorize", icon: PayrollTransactionData_ICON },
  { id: "leave-opening-balance", title: "Leave Opening Balance", icon: PayrollTransactionData_ICON },
  { id: "modify-employee-accounts", title: "Modify Employee Accounts", icon: PayrollTransactionData_ICON },
  { id: "employee-salary-posting", title: "Employee Salary Posting", icon: PayrollTransactionData_ICON },
  { id: "salary-calculation", title: "Salary Calculation", icon: PayrollTransactionData_ICON },
  { id: "salary-instruction", title: "Salary Instruction", icon: PayrollTransactionData_ICON },
  { id: "salary-updation", title: "Salary Updation", icon: PayrollTransactionData_ICON },
  { id: "update-attendance", title: "Update Attendance", icon: PayrollTransactionData_ICON },
];


/* ===== from PayrollTransaction.tsx ===== */
const PayrollTransaction = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PayrollTransactionData_PAYROLL_TRANSACTION_ITEMS;
    return PayrollTransactionData_PAYROLL_TRANSACTION_ITEMS.filter((item) =>
      item.title.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Payroll Transaction"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Payroll", onClick: () => router.push("/payroll/master") },
          { label: "Transaction", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <AuthorizeHero title="Payroll Transaction" query={query} onQueryChange={setQuery} />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => (
            <PayrollTransactionCard key={item.id} item={item} />
          ))}

          {filteredItems.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">
              No transactions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollTransaction;
