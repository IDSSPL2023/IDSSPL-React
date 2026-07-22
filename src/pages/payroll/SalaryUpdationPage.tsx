import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Save } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import SuccessModal from "@/components/shared/SuccessModal";
import SalaryUpdationTable, { type SalaryUpdationRow, type SalaryFieldKey } from "@/pages/Payroll/Master/SalaryUpdationTable";
import SalaryUpdationFilterModal, {
  defaultValues,
  type SalaryUpdationFilters,
} from "@/pages/Payroll/Master/SalaryUpdationFilterModal";

const initialRows: SalaryUpdationRow[] = [
  { id: 1, employeeId: "EMP001", employeeName: "Rahul Sharma", selected: false, basicSalary: "25000", other: "1500", travelAll: "800", diff: "0.0", totalAll: "27300", loan: "500.0", payAvd: "0.0", shares: "200.0", kkfFund: "150.0" },
  { id: 2, employeeId: "EMP002", employeeName: "Priya Singh", selected: false, basicSalary: "18000", other: "1200", travelAll: "600", diff: "0.0", totalAll: "19800", loan: "0.0", payAvd: "0.0", shares: "150.0", kkfFund: "100.0" },
  { id: 3, employeeId: "EMP003", employeeName: "Amit Verma", selected: false, basicSalary: "32000", other: "2000", travelAll: "1000", diff: "0.0", totalAll: "35000", loan: "1200.0", payAvd: "0.0", shares: "300.0", kkfFund: "200.0" },
  { id: 4, employeeId: "EMP004", employeeName: "Sneha Patel", selected: false, basicSalary: "40000", other: "2500", travelAll: "1200", diff: "0.0", totalAll: "43700", loan: "0.0", payAvd: "0.0", shares: "400.0", kkfFund: "250.0" },
];

const SalaryUpdationPage = () => {
  const router = useRouter();
  const [rows, setRows] = useState<SalaryUpdationRow[]>(initialRows);
  const [filters, setFilters] = useState<SalaryUpdationFilters>(defaultValues);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const selectedCount = rows.filter((row) => row.selected).length;

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (
          filters.employeeId &&
          !row.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
        ) return false;
        if (
          filters.employeeName &&
          !row.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())
        ) return false;
        if (filters.basicSalary && row.basicSalary !== filters.basicSalary) return false;
        if (filters.other && row.other !== filters.other) return false;
        if (filters.travelAll && row.travelAll !== filters.travelAll) return false;
        if (filters.diff && row.diff !== filters.diff) return false;
        if (filters.totalAll && row.totalAll !== filters.totalAll) return false;
        if (filters.loan && row.loan !== filters.loan) return false;
        if (filters.payAvd && row.payAvd !== filters.payAvd) return false;
        if (filters.shares && row.shares !== filters.shares) return false;
        if (filters.kkfFund && row.kkfFund !== filters.kkfFund) return false;
        return true;
      }),
    [rows, filters]
  );

  const filteredIds = new Set(filteredRows.map((row) => row.id));

  const handleToggleAll = (selected: boolean) => {
    setRows((prev) => prev.map((row) => (filteredIds.has(row.id) ? { ...row, selected } : row)));
  };

  const handleToggleRow = (id: number) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, selected: !row.selected } : row)));
  };

  const handleFieldChange = (id: number, key: SalaryFieldKey, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const handleSave = () => {
    if (selectedCount === 0) {
      toast.error("Select at least one employee to update.");
      return;
    }
    setIsSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    setRows((prev) => prev.map((row) => ({ ...row, selected: false })));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      <NavbarCM
        titleEn="Salary Updation"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Payroll", href: "/payroll/master" },
          { label: "Transaction", href: "/payroll/transaction" },
          { label: "Salary Updation", href: "#" },
        ]}
        onBack={() => router.back()}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={() => setFilters(defaultValues)}
        onAdd={handleSave}
        addLabel="Update Salary"
        addIcon={Save}
      />

      <main className="p-4 sm:p-6">
        <SalaryUpdationTable
          rows={filteredRows}
          onToggleAll={handleToggleAll}
          onToggleRow={handleToggleRow}
          onFieldChange={handleFieldChange}
        />
      </main>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <SalaryUpdationFilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={setFilters}
            />
          </div>
        </div>
      )}

      {isSuccessOpen && (
        <SuccessModal
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
          title="Salary Updated Successfully"
          subtitle={`${selectedCount} employee${selectedCount > 1 ? "s" : ""} updated.`}
        />
      )}
    </div>
  );
};

export default SalaryUpdationPage;
