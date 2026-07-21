import { useState } from "react";
import { toast } from "react-toastify";
import {
  X,
  Check,
  FileText,
  ChevronDown,
  User,
  IdCard,
  Hash,
} from "lucide-react";
import { FieldShell, TextInput, DateInput } from "@/components/shared/FormFields";
import type { PayrollRow } from "./PayrollTable";

type LeaveOpeningRow = {
  key: string;
  leaveCode: string;
  leaveName: string;
  oldBalance: number;
  newBalance: string;
};

const initialLeaveRows: LeaveOpeningRow[] = [
  { key: "1", leaveCode: "1", leaveName: "Privilege Leave", oldBalance: 0, newBalance: "" },
  { key: "2", leaveCode: "2", leaveName: "Sick Leave", oldBalance: 0, newBalance: "" },
  { key: "3", leaveCode: "3", leaveName: "Casual Leave", oldBalance: 0, newBalance: "" },
  { key: "4", leaveCode: "4", leaveName: "Unavailed Privilege Leave", oldBalance: 0, newBalance: "" },
  { key: "5", leaveCode: "5", leaveName: "Maternity Leave", oldBalance: 0, newBalance: "" },
  { key: "6", leaveCode: "6", leaveName: "Union Leave", oldBalance: 0, newBalance: "" },
  { key: "7", leaveCode: "7", leaveName: "Special Leave for Sports", oldBalance: 0, newBalance: "" },
  { key: "8", leaveCode: "8", leaveName: "Extra-ordinary Leave", oldBalance: 0, newBalance: "" },
  { key: "9", leaveCode: "9", leaveName: "Compensatory Off", oldBalance: 0, newBalance: "" },
];

export interface LeaveOpeningBalanceFormModalProps {
  employee: PayrollRow;
  onClose: () => void;
}

const LeaveOpeningBalanceFormModal = ({ employee, onClose }: LeaveOpeningBalanceFormModalProps) => {
  const [leaveDate, setLeaveDate] = useState("");
  const [rows, setRows] = useState<LeaveOpeningRow[]>(initialLeaveRows);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleChecked = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateNewBalance = (key: string, value: string) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, newBalance: value } : row)));
  };

  const handleValidate = () => {
    toast.success("Leave opening balance validated successfully.");
  };

  const handleDisplayVouchers = () => {
    toast.info(`Showing vouchers for ${employee.employeeName}.`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[96vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl no-scrollbar"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Leave Opening Balance{" "}
                <span className="font-bold text-[#64748B]">/ रजा प्रारंभिक शिल्लक</span>
              </h2>
              <p className="text-sm text-slate-500">
                Assign or update the employee's opening leave balance for the selected leave type. /
                निवडलेल्या रजा प्रकारासाठी कर्मचाऱ्याची प्रारंभिक रजा शिल्लक निश्चित करा किंवा अद्ययावत करा.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-3 rounded-3xl border-2 border-t-4 border-primary p-6">
          <div className="mb-4 flex items-start gap-3 border-b border-primary-100 pb-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1C398E]">
                Leave Opening Balance Details <span className="text-[#64748B]">/ रजा प्रारंभिक शिल्लक तपशील</span>
              </h3>
              <p className="text-sm text-slate-500">
                Select the employee, choose the leave type, and define the opening leave balance. /
                कर्मचारी निवडा, रजा प्रकार निवडा आणि प्रारंभिक रजा शिल्लक निश्चित करा.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FieldShell label="Leave Date" labelHi="रजा दिनांक" required>
              <DateInput value={leaveDate} onChange={setLeaveDate} />
            </FieldShell>
            <FieldShell label="Employee No." labelHi="कर्मचारी क्रमांक" required>
              <TextInput
                icon={<IdCard size={16} />}
                value={employee.employeeId}
                onChange={() => {}}
                readOnly
                placeholder="Employee No."
              />
            </FieldShell>
            <FieldShell label="Employee Name" labelHi="कर्मचारी नाव" required>
              <TextInput
                icon={<User size={16} />}
                value={employee.employeeName}
                onChange={() => {}}
                readOnly
                placeholder="Employee Name"
              />
            </FieldShell>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1F2858]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white whitespace-nowrap">Check</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white whitespace-nowrap">Leave Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white whitespace-nowrap">Leave Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white whitespace-nowrap">Old Balance</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white whitespace-nowrap">New Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td className="px-4 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={Boolean(checked[row.key])}
                        onChange={() => toggleChecked(row.key)}
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3 align-middle text-sm font-medium text-[#1C398E]">{row.leaveCode}</td>
                    <td className="px-4 py-3 align-middle">
                      <TextInput value={row.leaveName} onChange={() => {}} readOnly />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <TextInput
                        icon={<Hash size={16} />}
                        value={String(row.oldBalance)}
                        onChange={() => {}}
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <TextInput
                        icon={<Hash size={16} />}
                        type="number"
                        value={row.newBalance}
                        onChange={(v) => updateNewBalance(row.key, v)}
                        placeholder="New Balance"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleValidate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Validate <Check size={16} />
          </button>
          <button
            type="button"
            onClick={handleDisplayVouchers}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Display Vouchers <FileText size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Cancel <X size={16} />
          </button>
          <button
            type="button"
            disabled
            className="flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400"
          >
            Bounce <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveOpeningBalanceFormModal;
