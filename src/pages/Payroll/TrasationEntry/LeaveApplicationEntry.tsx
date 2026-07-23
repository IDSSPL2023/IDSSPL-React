import { IMAGES } from "@/assets";
import { useState } from "react";
import {
  User,
  Hash,
  FileText,
  Landmark,
  Building,
  ClipboardList,
  X,
  Check,
  ChevronsDown,
  FileOutput,
} from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";
import TextField from "@/components/common/TextField";
import SelectField from "@/components/common/SelectField";
import DateField from "@/components/common/DateField";
import PicklistField from "@/components/common/PicklistField";
import PicklistModal from "@/components/common/PicklistModal";
import { validateFields, isFormValid, required } from "@/components/common/validation";

interface EmployeeLookup {
  id: string;
  employeeCode: string;
  name: string;
  designationCode: string;
  designationName: string;
  branchCode: string;
  branchName: string;
}

const MOCK_EMPLOYEES: EmployeeLookup[] = [
  {
    id: "1",
    employeeCode: "101",
    name: "Rohit Sharma",
    designationCode: "CLK",
    designationName: "Clerk",
    branchCode: "BR01",
    branchName: "Main Branch",
  },
  {
    id: "2",
    employeeCode: "102",
    name: "Sneha Joshi",
    designationCode: "OFF",
    designationName: "Officer",
    branchCode: "BR02",
    branchName: "City Branch",
  },
];

interface LeaveHistoryRow {
  recordId: string;
  empCode: string;
  empName: string;
  fromDate: string;
  toDate: string;
  leaveCode: string;
  leaveDays: string;
  leaveBal: string;
}

const MOCK_LEAVE_HISTORY: LeaveHistoryRow[] = [
  {
    recordId: "1",
    empCode: "101",
    empName: "Rohit Sharma",
    fromDate: "04-Jul-2026",
    toDate: "04-Jul-2026",
    leaveCode: "Sick Leave",
    leaveDays: "1",
    leaveBal: "3000",
  },
  {
    recordId: "2",
    empCode: "101",
    empName: "Rohit Sharma",
    fromDate: "16-Jul-2026",
    toDate: "16-Jul-2026",
    leaveCode: "Privilege Leave",
    leaveDays: "1",
    leaveBal: "2000",
  },
];

interface LeaveApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LeaveApplicationEntryModal({
  open,
  onClose,
}: LeaveApplicationModalProps) {
  const [recordId, setRecordId] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [trnDate, setTrnDate] = useState("");
  const [designationCode, setDesignationCode] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [natureOfLeave, setNatureOfLeave] = useState("");
  const [employeeBranchCode, setEmployeeBranchCode] = useState("");
  const [employeeBranchName, setEmployeeBranchName] = useState("");
  const [previousBalance, setPreviousBalance] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [periodOfLeaves, setPeriodOfLeaves] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [leaveType, setLeaveType] = useState<"Paid" | "Unpaid">("Paid");
  const [leaveReason, setLeaveReason] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const rules = {
    recordId: required("Record Id is required"),
    employeeCode: required("Employee Code is required"),
    employeeName: required("Employee Name is required"),
    applicationDate: required("Application Date is required"),
    trnDate: required("TRN Date is required"),
    natureOfLeave: required("Nature Of Leave is required"),
    periodOfLeaves: required("Period of Leaves is required"),
    fromDate: required("From Date is required"),
    toDate: required("To Date is required"),
    leaveReason: required("Leave Reason is required"),
  };

  const handleValidate = () => {
    const formValues = {
      recordId,
      employeeCode,
      employeeName,
      applicationDate,
      trnDate,
      natureOfLeave,
      periodOfLeaves,
      fromDate,
      toDate,
      leaveReason,
    };
    const err = validateFields(formValues, rules);
    setErrors(err);
    if (isFormValid(err)) setIsValidated(true);
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 border border-black rounded-[20px] p-6";
  const natureOfLeaveOptions = [
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Privilege Leave", label: "Privilege Leave" },
    { value: "Casual Leave", label: "Casual Leave" },
  ];
  const employeeColumns = [
    { key: "employeeCode", header: "Emp Code" },
    { key: "name", header: "Emp Name" },
    { key: "designationCode", header: "Designation Code" },
    { key: "branchName", header: "Branch Name" },
  ];

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Leave Application Entry"
        titleHi="रजेच्या अर्जाची नोंद"
        subtitleEn="Configure earning and deduction components used for payroll calculation and salary processing."
        subtitleHi="वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Leave Application" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-6xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>

            <button
              type="button"
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Generate
              <FileOutput className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Save
              <ChevronsDown className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="p-1 flex flex-col gap-5">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image src={IMAGES.USER} alt="Update Attendance Details" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827] dark:text-slate-100">
                  Update Attendance Details
                  <span className="ml-2 font-normal text-[#64748B] dark:text-slate-400">/ उपस्थितीचा तपशील अद्ययावत करा</span>
                </h3>
                <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
                  Create or manage salary processing instructions for an employee.
                  <br />
                  कर्मचाऱ्यांसाठी वेतन प्रक्रियेसंबंधी सूचना तयार करा किंवा व्यवस्थापित करा.
                </p>
              </div>
            </div>

            <div className={grid4}>
              <TextField
                label="Record Id"
                labelHi="नोंद क्रमांक"
                value={recordId}
                onChange={setRecordId}
                placeholder="Enter Amount"
                icon={<Hash size={16} />}
                required
                error={errors.recordId}
              />

              <PicklistField
                label="Employee Code"
                labelHi="कर्मचारी क्रमांक"
                value={employeeCode}
                onOpenPicklist={() => setIsPickerOpen(true)}
                placeholder="Select Employee"
                required
                error={errors.employeeCode}
              />

              <TextField
                label="Employee Name"
                labelHi="कर्मचारी नाव"
                value={employeeName}
                onChange={setEmployeeName}
                placeholder="name@company.com"
                icon={<User size={16} />}
                required
                error={errors.employeeName}
                readOnly
                disabled
              />

              <DateField
                label="Application Date"
                labelHi="अर्ज दिनांक"
                value={applicationDate}
                onChange={setApplicationDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.applicationDate}
              />

              <DateField
                label="TRN Date"
                labelHi="व्यवहार दिनांक"
                value={trnDate}
                onChange={setTrnDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.trnDate}
              />

              <TextField
                label="Designation Code"
                labelHi="पद कोड"
                value={designationCode}
                onChange={setDesignationCode}
                placeholder="name@company.com"
                icon={<FileText size={16} />}
                readOnly
                disabled
                required
              />

              <TextField
                label="Designation Name"
                labelHi="पद नाव"
                value={designationName}
                onChange={setDesignationName}
                placeholder="name@company.com"
                icon={<FileText size={16} />}
                readOnly
                disabled
                required
              />

              <SelectField
                label="Nature Of Leave"
                labelHi="रजेचा प्रकार"
                value={natureOfLeave}
                onChange={setNatureOfLeave}
                options={natureOfLeaveOptions}
                placeholder="Select Leave Type"
                required
                error={errors.natureOfLeave}
              />

              <TextField
                label="Employee Branch Code"
                labelHi="शाखा कोड"
                value={employeeBranchCode}
                onChange={setEmployeeBranchCode}
                placeholder="name@company.com"
                icon={<Building size={16} />}
                readOnly
                disabled
                required
              />

              <TextField
                label="Employee Branch Name"
                labelHi="शाखेचे नाव"
                value={employeeBranchName}
                onChange={setEmployeeBranchName}
                placeholder="name@company.com"
                icon={<Building size={16} />}
                readOnly
                disabled
                required
              />

              <TextField
                label="Previous Balance"
                labelHi="मागील शिल्लक"
                value={previousBalance}
                onChange={setPreviousBalance}
                placeholder="Enter Amount"
                icon={<Landmark size={16} />}
                readOnly
                disabled
                required
              />

              <TextField
                label="Current Balance"
                labelHi="सद्य शिल्लक"
                value={currentBalance}
                onChange={setCurrentBalance}
                placeholder="Enter Amount"
                icon={<Landmark size={16} />}
                readOnly
                disabled
                required
              />

              <TextField
                label="Period of Leaves"
                labelHi="रजा कालावधी"
                value={periodOfLeaves}
                onChange={setPeriodOfLeaves}
                placeholder="Enter Amount"
                icon={<ClipboardList size={16} />}
                required
                error={errors.periodOfLeaves}
              />

              <DateField
                label="From Date"
                labelHi="पासून दिनांक"
                value={fromDate}
                onChange={setFromDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.fromDate}
              />

              <DateField
                label="To Date"
                labelHi="पर्यंत दिनांक"
                value={toDate}
                onChange={setToDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.toDate}
              />

              <div className="flex min-w-0 flex-col">
                <label className="mb-1.5 block truncate text-sm font-medium text-[#1F2858]">
                  Leave Type
                </label>
                <p className="mb-1 text-xs text-[#64748B] dark:text-slate-400">वेतनासह की वेतनाशिवाय ते निवडा</p>
                <div className="flex h-11 items-center gap-5">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="leaveType"
                      checked={leaveType === "Paid"}
                      onChange={() => setLeaveType("Paid")}
                      className="h-4 w-4 accent-primary"
                    />
                    Paid
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="leaveType"
                      checked={leaveType === "Unpaid"}
                      onChange={() => setLeaveType("Unpaid")}
                      className="h-4 w-4 accent-primary"
                    />
                    Unpaid
                  </label>
                </div>
              </div>
            </div>

            {/* Leave Reason - Textarea with black border */}
            <div className="mt-5 flex flex-col border border-black rounded-[20px] p-6">
              <label className="mb-1.5 block text-sm font-medium text-[#1F2858]">
                Leave Reason
                <span className="ml-2 font-normal text-[#64748B]">/ रजेचे कारण</span>
                <span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Enter Amount"
                rows={3}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-400 ${
                  errors.leaveReason
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-primary"
                }`}
              />
              {errors.leaveReason && (
                <span className="mt-1 text-xs text-red-500">{errors.leaveReason}</span>
              )}
            </div>

            {/* Leave History Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-black">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1B2143] text-white">
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Record ID</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Emp Code</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Emp Name</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">From Date</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">To Date</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Leave Code</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Leave Days</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Leave Bal</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LEAVE_HISTORY.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-200 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800"
                    >
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.recordId}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.empCode}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.empName}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.fromDate}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.toDate}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.leaveCode}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.leaveDays}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.leaveBal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </FormModal>

      {isPickerOpen && (
        <PicklistModal
          title="Employee List"
          columns={employeeColumns}
          rows={MOCK_EMPLOYEES}
          rowKey={(r) => r.id}
          onSelect={(row) => {
            setEmployeeCode(row.employeeCode);
            setEmployeeName(row.name);
            setDesignationCode(row.designationCode);
            setDesignationName(row.designationName);
            setEmployeeBranchCode(row.branchCode);
            setEmployeeBranchName(row.branchName);
            setIsPickerOpen(false);
          }}
          onClose={() => setIsPickerOpen(false)}
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Leave Application Saved Successfully"
          subtitle="The leave application record has been processed successfully."
        />
      )}
    </>
  );
}