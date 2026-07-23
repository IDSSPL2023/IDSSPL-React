// import { useMemo, useState } from "react";
// import { toast } from "react-toastify";
// import { CalendarCheck } from "lucide-react";
// import { useRouter } from "@/lib/navigation";
// import NavbarCM from "@/components/CustomerMaster/NavbarCM";
// import SuccessModal from "@/components/shared/SuccessModal";
// import UpdateAttendanceTable, {
//   type AttendanceRow,
//   type AttendanceFieldKey,
// } from "@/pages/Payroll/Master/UpdateAttendanceTable";
// import UpdateAttendanceFilterModal, {
//   defaultValues,
//   type AttendanceFilters,
// } from "@/pages/Payroll/Master/UpdateAttendanceFilterModal";

// const initialRows: AttendanceRow[] = [
//   { id: 1, employeeId: "1", employeeName: "Rohit Sharma", selected: false, daysOfMonth: "30", workingDays: "28", paidLeaves: "1", unpaidLeaves: "1", payDays: "28" },
//   { id: 2, employeeId: "2", employeeName: "Virat Kohli", selected: false, daysOfMonth: "30", workingDays: "30", paidLeaves: "0", unpaidLeaves: "0", payDays: "30" },
//   { id: 3, employeeId: "3", employeeName: "Priya Singh", selected: false, daysOfMonth: "30", workingDays: "29", paidLeaves: "1", unpaidLeaves: "0", payDays: "29" },
//   { id: 4, employeeId: "4", employeeName: "Sneha Patel", selected: false, daysOfMonth: "30", workingDays: "27", paidLeaves: "2", unpaidLeaves: "1", payDays: "27" },
// ];

// const UpdateAttendancePage = () => {
//   const router = useRouter();
//   const [rows, setRows] = useState<AttendanceRow[]>(initialRows);
//   const [filters, setFilters] = useState<AttendanceFilters>(defaultValues);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isSuccessOpen, setIsSuccessOpen] = useState(false);

//   const selectedCount = rows.filter((row) => row.selected).length;

//   const filteredRows = useMemo(
//     () =>
//       rows.filter((row) => {
//         if (
//           filters.employeeId &&
//           !row.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
//         ) return false;
//         if (
//           filters.employeeName &&
//           !row.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())
//         ) return false;
//         if (filters.daysOfMonth && row.daysOfMonth !== filters.daysOfMonth) return false;
//         if (filters.workingDays && row.workingDays !== filters.workingDays) return false;
//         if (filters.paidLeaves && row.paidLeaves !== filters.paidLeaves) return false;
//         if (filters.unpaidLeaves && row.unpaidLeaves !== filters.unpaidLeaves) return false;
//         if (filters.payDays && row.payDays !== filters.payDays) return false;
//         return true;
//       }),
//     [rows, filters]
//   );

//   const filteredIds = new Set(filteredRows.map((row) => row.id));

//   const handleToggleAll = (selected: boolean) => {
//     setRows((prev) => prev.map((row) => (filteredIds.has(row.id) ? { ...row, selected } : row)));
//   };

//   const handleToggleRow = (id: number) => {
//     setRows((prev) => prev.map((row) => (row.id === id ? { ...row, selected: !row.selected } : row)));
//   };

//   const handleFieldChange = (id: number, key: AttendanceFieldKey, value: string) => {
//     setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
//   };

//   const handleSave = () => {
//     if (selectedCount === 0) {
//       toast.error("Select at least one employee to update.");
//       return;
//     }
//     setIsSuccessOpen(true);
//   };

//   const handleSuccessClose = () => {
//     setIsSuccessOpen(false);
//     setRows((prev) => prev.map((row) => ({ ...row, selected: false })));
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
//       <NavbarCM
//         titleEn="Update Attendance"
//         breadcrumbs={[
//           { label: "Home", href: "/dashboard" },
//           { label: "Payroll", href: "/payroll/master" },
//           { label: "Transaction", href: "/payroll/transaction" },
//           { label: "Update Attendance", href: "#" },
//         ]}
//         onBack={() => router.back()}
//         isSearchVisible={isSearchVisible}
//         filters={filters}
//         onToggleSearch={() => setIsSearchVisible(true)}
//         onOpenFilter={() => setIsFilterOpen(true)}
//         onResetFilters={() => setFilters(defaultValues)}
//         onAdd={handleSave}
//         addLabel="Update Attendance"
//         addIcon={CalendarCheck}
//       />

//       <main className="p-4 sm:p-6">
//         <UpdateAttendanceTable
//           rows={filteredRows}
//           onToggleAll={handleToggleAll}
//           onToggleRow={handleToggleRow}
//           onFieldChange={handleFieldChange}
//         />
//       </main>

//       {isFilterOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
//           onClick={() => setIsFilterOpen(false)}
//         >
//           <div onClick={(event) => event.stopPropagation()}>
//             <UpdateAttendanceFilterModal
//               initialValues={filters}
//               onClose={() => setIsFilterOpen(false)}
//               onApply={setFilters}
//             />
//           </div>
//         </div>
//       )}

//       {isSuccessOpen && (
//         <SuccessModal
//           onClose={handleSuccessClose}
//           onDone={handleSuccessClose}
//           title="Attendance Updated Successfully"
//           subtitle={`${selectedCount} employee${selectedCount > 1 ? "s" : ""} updated.`}
//         />
//       )}
//     </div>
//   );
// };

// export default UpdateAttendancePage;
