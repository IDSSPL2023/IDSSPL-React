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
  employeeNo: string;
  name: string;
  designationCode: string;
  designationName: string;
  branchCode: string;
  branchName: string;
}

const MOCK_EMPLOYEES: EmployeeLookup[] = [
  {
    id: "1",
    employeeNo: "EMP001",
    name: "Rahul Sharma",
    designationCode: "MGR",
    designationName: "Manager",
    branchCode: "BR01",
    branchName: "Main Branch",
  },
  {
    id: "2",
    employeeNo: "EMP002",
    name: "Priya Patel",
    designationCode: "SRD",
    designationName: "Senior Developer",
    branchCode: "BR02",
    branchName: "City Branch",
  },
];

interface EmployeeTerminationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EmployeeTerminationModal({
  open,
  onClose,
}: EmployeeTerminationModalProps) {
  const [state, setState] = useState({
    recordType: "New",
    terminationId: "",
    terminationDate: "",
    employeeNo: "",
    employeeName: "",
    categoryCode: "",
    categoryName: "",
    designationCode: "",
    designationName: "",
    branchCode: "",
    branchName: "",
    joinDate: "",
    confirmationDate: "",
    education: "",
    terminationReason: "",
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const update = (key: string, val: string) =>
    setState((prev) => ({ ...prev, [key]: val }));

  const rules = {
    recordType: required("Record Type is required"),
    terminationId: required("Termination ID is required"),
    terminationDate: required("Termination Date is required"),
    employeeNo: required("Employee No is required"),
    employeeName: required("Employee Name is required"),
    designationCode: required("Emp Designation Code is required"),
    branchCode: required("Branch Code is required"),
    joinDate: required("Join Date is required"),
    confirmationDate: required("Confirmation Date is required"),
    terminationReason: required("Termination Reason is required"),
  };

  const handleValidate = () => {
    const err = validateFields(state, rules);
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

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const recordOptions = [
    { value: "New", label: "New" },
    { value: "Amendment", label: "Amendment" },
  ];
  const employeeColumns = [
    { key: "employeeNo", header: "Employee No." },
    { key: "name", header: "Employee Name" },
    { key: "designationCode", header: "Designation Code" },
    { key: "branchName", header: "Branch Name" },
  ];

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Employee Termination"
        titleHi="कर्मचारी सेवानिवृत्ती"
        subtitleEn="Manage employee termination details."
        subtitleHi="कर्मचाऱ्यांची सेवानिवृत्ती माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Employee Termination" width={48} height={48} />
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
        <div className="p-1">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className={grid4}>
              <SelectField
                label="Record Type"
                labelHi="नोंद प्रकार"
                value={state.recordType}
                onChange={(v) => update("recordType", v)}
                options={recordOptions}
                placeholder="Select Record Type"
                required
                error={errors.recordType}
              />

              <TextField
                label="Termination ID"
                labelHi="सेवानिवृत्ती क्रमांक"
                value={state.terminationId}
                onChange={(v) => update("terminationId", v)}
                placeholder="Enter Amount"
                icon={<Hash size={16} />}
                required
                error={errors.terminationId}
              />

              <DateField
                label="Termination Date"
                labelHi="सेवानिवृत्ती दिनांक"
                value={state.terminationDate}
                onChange={(v) => update("terminationDate", v)}
                placeholder="YYYY-MM-DD"
                required
                error={errors.terminationDate}
              />

              <PicklistField
                label="Employee No"
                labelHi="कर्मचारी क्रमांक"
                value={state.employeeNo}
                onOpenPicklist={() => setIsPickerOpen(true)}
                placeholder="Enter Amount"
                required
                error={errors.employeeNo}
              />

              <TextField
                label="Employee Name"
                labelHi="कर्मचारी नाव"
                value={state.employeeName}
                onChange={(v) => update("employeeName", v)}
                placeholder="name@company.com"
                icon={<User size={16} />}
                required
                error={errors.employeeName}
              />

              <TextField
                label="category code"
                labelHi="वर्ग कोड"
                value={state.categoryCode}
                onChange={(v) => update("categoryCode", v)}
                placeholder="name@company.com"
                icon={<Hash size={16} />}
                required
              />

              <TextField
                label="category Name"
                labelHi="श्रेणीचे नाव"
                value={state.categoryName}
                onChange={(v) => update("categoryName", v)}
                placeholder="name@company.com"
                icon={<Landmark size={16} />}
                required
              />

              <TextField
                label="Emp Designation Code"
                labelHi="कर्मचारी पद कोड"
                value={state.designationCode}
                onChange={(v) => update("designationCode", v)}
                placeholder="name@company.com"
                icon={<FileText size={16} />}
                readOnly
                disabled
                required
                error={errors.designationCode}
              />

              <TextField
                label="Employee Designation Name"
                labelHi="कर्मचारी पद नाव"
                value={state.designationName}
                onChange={(v) => update("designationName", v)}
                placeholder="name@company.com"
                icon={<FileText size={16} />}
                readOnly
                disabled
                required
              />

              <TextField
                label="Branch Code"
                labelHi="शाखा कोड"
                value={state.branchCode}
                onChange={(v) => update("branchCode", v)}
                placeholder="name@company.com"
                icon={<Building size={16} />}
                readOnly
                disabled
                required
                error={errors.branchCode}
              />

              <TextField
                label="Branch Name"
                labelHi="शाखेचे नाव"
                value={state.branchName}
                onChange={(v) => update("branchName", v)}
                placeholder="name@company.com"
                icon={<Building size={16} />}
                readOnly
                disabled
                required
              />

              <DateField
                label="Join Date"
                labelHi="रुजू दिनांक"
                value={state.joinDate}
                onChange={(v) => update("joinDate", v)}
                placeholder="YYYY-MM-DD"
                required
                error={errors.joinDate}
              />

              <DateField
                label="Confirmation Date"
                labelHi="कायम नियुक्ती दिनांक"
                value={state.confirmationDate}
                onChange={(v) => update("confirmationDate", v)}
                placeholder="YYYY-MM-DD"
                required
                error={errors.confirmationDate}
              />

              <TextField
                label="Education"
                labelHi="शैक्षणिक पात्रता"
                value={state.education}
                onChange={(v) => update("education", v)}
                placeholder="name@company.com"
                icon={<ClipboardList size={16} />}
                required
              />

              <TextField
                label="Termination Reason"
                labelHi="सेवानिवृत्तीचे कारण"
                value={state.terminationReason}
                onChange={(v) => update("terminationReason", v)}
                placeholder="Enter Amount"
                icon={<FileText size={16} />}
                required
                error={errors.terminationReason}
              />
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
            update("employeeNo", row.employeeNo);
            update("employeeName", row.name);
            update("designationCode", row.designationCode);
            update("designationName", row.designationName);
            update("branchCode", row.branchCode);
            update("branchName", row.branchName);
            setIsPickerOpen(false);
          }}
          onClose={() => setIsPickerOpen(false)}
         
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Employee Termination Saved Successfully"
          subtitle="The employee termination record has been processed successfully."
        />
      )}
    </>
  );
} 