import { useMemo, useState } from "react";
import { FileSignature } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import FilterModal, {
  defaultValues,
  type CustomerFilters,
} from "@/components/CustomerMaster/FilterModal";
import PayrollTable, { type PayrollRow } from "@/components/Payroll/PayrollTable";
import SalaryInstructionFormModal from "@/pages/Payroll/Master/SalaryInstructionFormModal";

const employeeRows: PayrollRow[] = [
  { id: 1, employeeId: "EMP001", employeeName: "Rahul Sharma", employmentType: "Permanent", designation: "Accountant", gender: "Male", status: "Active" },
  { id: 2, employeeId: "EMP002", employeeName: "Priya Singh", employmentType: "Contract", designation: "Officer", gender: "Female", status: "Active" },
  { id: 3, employeeId: "EMP003", employeeName: "Amit Verma", employmentType: "Permanent", designation: "Executive", gender: "Male", status: "Inactive" },
  { id: 4, employeeId: "EMP004", employeeName: "Sneha Patel", employmentType: "Permanent", designation: "Manager", gender: "Female", status: "Active" },
];

const SalaryInstructionPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<CustomerFilters>(defaultValues);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [instructionEmployee, setInstructionEmployee] = useState<PayrollRow | null>(null);

  const filteredRows = useMemo(
    () =>
      employeeRows.filter((row) => {
        if (
          filters.customerId &&
          !row.employeeId.toLowerCase().includes(filters.customerId.toLowerCase())
        ) return false;
        if (filters.status && row.status !== filters.status) return false;
        return true;
      }),
    [filters]
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <NavbarCM
        titleEn="Salary Instruction"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Payroll", href: "/payroll/master" },
          { label: "Transaction", href: "/payroll/transaction" },
          { label: "Salary Instruction", href: "#" },
        ]}
        onBack={() => router.back()}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={() => setFilters(defaultValues)}
      />

      <main className="p-4 sm:p-6">
        <PayrollTable
          rows={filteredRows}
          actions={(row) => [
            { key: "salary-instruction", label: "Salary Instruction", icon: FileSignature, onClick: () => setInstructionEmployee(row) },
          ]}
        />
      </main>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={setFilters}
            />
          </div>
        </div>
      )}

      {instructionEmployee && (
        <SalaryInstructionFormModal
          employee={instructionEmployee}
          onClose={() => setInstructionEmployee(null)}
        />
      )}
    </div>
  );
};

export default SalaryInstructionPage;
