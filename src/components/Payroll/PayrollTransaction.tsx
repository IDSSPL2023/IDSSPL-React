import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizeHero from "@/components/Authorization/AuthorizeTransaction/AuthorizeHero";
import PayrollTransactionCard from "./PayrollTransactionCard";
import { PAYROLL_TRANSACTION_ITEMS, type PayrollTransactionItem } from "./payrollTransactionData";

const PayrollTransaction = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const TRANSACTION_ROUTES: Partial<Record<PayrollTransactionItem["id"], string>> = {
    "employee-leave-balance": "/payroll/transaction/employee-leave-balance",
    "employee-loan-details": "/payroll/transaction/employee-loan-details",
    "leave-opening-balance": "/payroll/transaction/leave-opening-balance",
    "salary-instruction": "/payroll/transaction/salary-instruction",
    "salary-updation": "/payroll/transaction/salary-updation",
    "update-attendance": "/payroll/transaction/update-attendance",
  };

  const handleOpen = (item: PayrollTransactionItem) => {
    const route = TRANSACTION_ROUTES[item.id];
    if (route) router.push(route);
  };

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAYROLL_TRANSACTION_ITEMS;
    return PAYROLL_TRANSACTION_ITEMS.filter((item) =>
      item.title.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
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
            <PayrollTransactionCard key={item.id} item={item} onOpen={handleOpen} />
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
