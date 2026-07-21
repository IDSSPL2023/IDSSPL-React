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
  Layers,
} from "lucide-react";
import {
  FieldShell,
  TextInput,
  SelectInput,
  DateInput,
} from "@/components/shared/FormFields";
import type { PayrollRow } from "./PayrollTable";

const RECORD_TYPES = ["New", "Modify", "Close"];
const INSTRUCTION_TYPES = ["Start Salary", "Stop Salary", "Hold Salary", "Revise Salary"];

export interface SalaryInstructionFormModalProps {
  employee: PayrollRow;
  onClose: () => void;
}

const SalaryInstructionFormModal = ({ employee, onClose }: SalaryInstructionFormModalProps) => {
  const [recordType, setRecordType] = useState("New");
  const [instructionType, setInstructionType] = useState("Start Salary");
  const [instructionNo, setInstructionNo] = useState("501");
  const [instructionDate, setInstructionDate] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [remark, setRemark] = useState("");

  const handleValidate = () => {
    toast.success("Salary instruction validated successfully.");
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
                Salary Instruction{" "}
                <span className="font-bold text-[#64748B]">/ वेतन सूचना</span>
              </h2>
              <p className="text-sm text-slate-500">
                Configure earning and deduction components used for payroll calculation and salary processing. /
                वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा.
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
                Employee Information <span className="text-[#64748B]">/ कर्मचारी माहिती</span>
              </h3>
              <p className="text-sm text-slate-500">
                Create or manage salary processing instructions for an employee. /
                कर्मचाऱ्याच्या वेतन प्रक्रियेसाठी सूचना तयार करा किंवा व्यवस्थापित करा.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FieldShell label="Record Type" labelHi="नोंद प्रकार" required>
              <SelectInput
                icon={<Layers size={16} />}
                value={recordType}
                onChange={setRecordType}
                options={RECORD_TYPES}
              />
            </FieldShell>
            <FieldShell label="Instruction Type" labelHi="सूचना प्रकार" required>
              <SelectInput
                icon={<Layers size={16} />}
                value={instructionType}
                onChange={setInstructionType}
                options={INSTRUCTION_TYPES}
              />
            </FieldShell>
            <FieldShell label="Instruction No." labelHi="सूचना क्रमांक" required>
              <TextInput
                icon={<Hash size={16} />}
                value={instructionNo}
                onChange={setInstructionNo}
                placeholder="Instruction No."
              />
            </FieldShell>
            <FieldShell label="Instruction Date" labelHi="सूचना दिनांक" required>
              <DateInput value={instructionDate} onChange={setInstructionDate} />
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
            <FieldShell label="Effective From" labelHi="लागू दिनांक" required>
              <DateInput value={effectiveFrom} onChange={setEffectiveFrom} />
            </FieldShell>
            <FieldShell label="Remark / Reason" labelHi="कारण" required>
              <TextInput
                icon={<FileText size={16} />}
                value={remark}
                onChange={setRemark}
                placeholder="Remark / Reason"
              />
            </FieldShell>
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

export default SalaryInstructionFormModal;
