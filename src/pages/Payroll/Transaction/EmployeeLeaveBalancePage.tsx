// import { useMemo, useState } from "react";
// import { useRouter } from "@/lib/navigation";
// import NavbarCM from "@/components/CustomerMaster/NavbarCM";
// import EmployeeLeaveBalanceFilterModal, {
//   defaultValues,
//   type LeaveBalanceFilters,
// } from "@/pages/Payroll/Master/EmployeeLeaveBalanceFilterModal";
// import EmployeeLeaveBalanceTable, {
//   type LeaveBalanceRow,
// } from "@/pages/Payroll/Master/EmployeeLeaveBalanceTable";

// const leaveBalanceRows: LeaveBalanceRow[] = [
//   { id: 1, employeeId: "EMP001", employeeName: "Rahul Sharma", employmentType: "Permanent", designation: "Accountant", gender: "Male", status: "Active", earnLeave: 12, sickLeave: 6, casualLeave: 8, asOnDate: "2026-07-01" },
//   { id: 2, employeeId: "EMP002", employeeName: "Priya Singh", employmentType: "Contract", designation: "Officer", gender: "Female", status: "Active", earnLeave: 9, sickLeave: 5, casualLeave: 7, asOnDate: "2026-07-01" },
//   { id: 3, employeeId: "EMP003", employeeName: "Amit Verma", employmentType: "Permanent", designation: "Executive", gender: "Male", status: "Inactive", earnLeave: 15, sickLeave: 4, casualLeave: 6, asOnDate: "2026-07-01" },
//   { id: 4, employeeId: "EMP004", employeeName: "Sneha Patel", employmentType: "Permanent", designation: "Manager", gender: "Female", status: "Active", earnLeave: 18, sickLeave: 7, casualLeave: 9, asOnDate: "2026-07-01" },
// ];

// const EmployeeLeaveBalancePage = () => {
//   const router = useRouter();
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filters, setFilters] = useState<LeaveBalanceFilters>(defaultValues);

//   const filteredRows = useMemo(
//     () =>
//       leaveBalanceRows.filter((row) => {
//         if (
//           filters.employeeId &&
//           !row.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
//         ) return false;
//         if (
//           filters.employeeName &&
//           !row.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())
//         ) return false;
//         if (
//           filters.employmentType &&
//           !row.employmentType.toLowerCase().includes(filters.employmentType.toLowerCase())
//         ) return false;
//         if (
//           filters.designation &&
//           !row.designation.toLowerCase().includes(filters.designation.toLowerCase())
//         ) return false;
//         if (filters.earnLeave && String(row.earnLeave) !== filters.earnLeave) return false;
//         if (filters.sickLeave && String(row.sickLeave) !== filters.sickLeave) return false;
//         if (filters.casualLeave && String(row.casualLeave) !== filters.casualLeave) return false;
//         if (filters.date && row.asOnDate !== filters.date) return false;
//         return true;
//       }),
//     [filters]
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
//       <NavbarCM
//         titleEn="Employee Leave Balance"
//         breadcrumbs={[
//           { label: "Home", href: "/dashboard" },
//           { label: "Payroll", href: "/payroll/master" },
//           { label: "Transaction", href: "/payroll/transaction" },
//           { label: "Employee Leave Balance", href: "#" },
//         ]}
//         onBack={() => router.back()}
//         isSearchVisible={isSearchVisible}
//         filters={filters}
//         onToggleSearch={() => setIsSearchVisible(true)}
//         onOpenFilter={() => setIsFilterOpen(true)}
//         onResetFilters={() => setFilters(defaultValues)}
//       />

//       <main className="p-4 sm:p-6">
//         <EmployeeLeaveBalanceTable rows={filteredRows} />
//       </main>

//       {isFilterOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//           onClick={() => setIsFilterOpen(false)}
//         >
//           <div onClick={(event) => event.stopPropagation()}>
//             <EmployeeLeaveBalanceFilterModal
//               initialValues={filters}
//               onClose={() => setIsFilterOpen(false)}
//               onApply={setFilters}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeLeaveBalancePage;
