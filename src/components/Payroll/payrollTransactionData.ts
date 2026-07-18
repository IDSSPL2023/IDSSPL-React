export type PayrollTransactionItem = {
  id: string;
  title: string;
  icon: string;
};

const ICON = "/authorize transaction list icon.png";

export const PAYROLL_TRANSACTION_ITEMS: PayrollTransactionItem[] = [
  { id: "earning-deduction-master", title: "Earning Deduction Master", icon: ICON },
  { id: "employee-leave-balance", title: "Employee Leave Balance", icon: ICON },
  { id: "employee-loan-details", title: "Employee Loan Details", icon: ICON },
  { id: "update-fix-fields", title: "Update Fix Fields", icon: ICON },
  { id: "application-authorize", title: "Application Authorize", icon: ICON },
  { id: "leave-opening-balance", title: "Leave Opening Balance", icon: ICON },
  { id: "modify-employee-accounts", title: "Modify Employee Accounts", icon: ICON },
  { id: "employee-salary-posting", title: "Employee Salary Posting", icon: ICON },
  { id: "salary-calculation", title: "Salary Calculation", icon: ICON },
  { id: "salary-instruction", title: "Salary Instruction", icon: ICON },
  { id: "salary-updation", title: "Salary Updation", icon: ICON },
  { id: "update-attendance", title: "Update Attendance", icon: ICON },
];
