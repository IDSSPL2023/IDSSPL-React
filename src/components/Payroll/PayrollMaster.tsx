import { useMemo, useState } from "react";
import NavbarCM from "../CustomerMaster/NavbarCM";
import FilterModal, {
  defaultValues,
  type CustomerFilters,
} from "../CustomerMaster/FilterModal";
import { useRouter } from "@/lib/navigation";
import PayrollTable, { type PayrollRow } from "./PayrollTable";
import AddEmployee from "./AddEmployee";

const initialRows: PayrollRow[] = [
  { id: 1, employeeId: "EMP001", employeeName: "Rahul Sharma", employmentType: "Permanent", designation: "Accountant", gender: "Male", status: "Active" },
  { id: 2, employeeId: "EMP002", employeeName: "Priya Singh", employmentType: "Contract", designation: "Officer", gender: "Female", status: "Active" },
  { id: 3, employeeId: "EMP003", employeeName: "Amit Verma", employmentType: "Permanent", designation: "Executive", gender: "Male", status: "Inactive" },
  { id: 4, employeeId: "EMP004", employeeName: "Sneha Patel", employmentType: "Permanent", designation: "Manager", gender: "Female", status: "Active" },
];

const PayrollMaster = () => {
  const router = useRouter();
  const [rows, setRows] = useState<PayrollRow[]>(initialRows);
  const [filters, setFilters] = useState<CustomerFilters>(defaultValues);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (
          filters.customerId &&
          !row.employeeId.toLowerCase().includes(filters.customerId.toLowerCase())
        ) return false;
        if (filters.status && row.status !== filters.status) return false;
        return true;
      }),
    [filters, rows]
  );

  const nextEmployeeId = `EMP${String(rows.length + 1).padStart(3, "0")}`;

  const handleEmployeeSaved = (employee: PayrollRow) => {
    setRows((currentRows) => [...currentRows, employee]);
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] dark:bg-slate-950">
      <NavbarCM
        titleEn="Payroll Master"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Master", href: "#" },
          { label: "Payroll Master", href: "/payroll/master" },
        ]}
        onBack={() => router.back()}
        onAdd={() => setIsAddOpen(true)}
        isSearchVisible={isSearchVisible}
        filters={filters}
        onToggleSearch={() => setIsSearchVisible(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        onResetFilters={() => setFilters(defaultValues)}
      />

      <main className="p-4 sm:p-6">
        <PayrollTable rows={filteredRows} />
      </main>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setIsFilterOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={setFilters}
            />
          </div>
        </div>
      )}

      {isAddOpen && (
        <AddEmployee
          onClose={() => setIsAddOpen(false)}
          onSave={handleEmployeeSaved}
          nextEmployeeId={nextEmployeeId}
        />
      )}
    </div>
  );
};

export default PayrollMaster
