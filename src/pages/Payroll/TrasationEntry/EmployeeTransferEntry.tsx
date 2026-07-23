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
  employeeId: string;
  name: string;
  designationCode: string;
  designationName: string;
  branch: string;
  department: string;
}

const MOCK_EMPLOYEES: EmployeeLookup[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Rahul Sharma",
    designationCode: "MGR",
    designationName: "Manager",
    branch: "Main Branch",
    department: "Operations",
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Priya Patel",
    designationCode: "SRD",
    designationName: "Senior Developer",
    branch: "City Branch",
    department: "IT",
  },
];

interface EmployeeTransferModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EmployeeTransferEntryModal({
  open,
  onClose,
}: EmployeeTransferModalProps) {
  const [employeeType, setEmployeeType] = useState("New");
  const [transferId, setTransferId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [designationCode, setDesignationCode] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [transferFromBranch, setTransferFromBranch] = useState("");
  const [transferFromDepartment, setTransferFromDepartment] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferToBranch, setTransferToBranch] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [approvedDate, setApprovedDate] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [relievingDate, setRelievingDate] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const rules = {
    employeeType: required("Employee Type is required"),
    transferId: required("Transfer ID is required"),
    employeeId: required("Employee ID is required"),
    employeeName: required("Employee Name is required"),
    designationCode: required("Emp Designation Code is required"),
    transferFromBranch: required("Transfer From Branch is required"),
    transferDate: required("Transfer Date is required"),
    transferToBranch: required("Transfer To Branch is required"),
    newDesignation: required("New Designation is required"),
    approvedDate: required("Approved Date is required"),
    orderDate: required("Order Date is required"),
    remarks: required("Remarks is required"),
  };

  const handleValidate = () => {
    const formValues = {
      employeeType,
      transferId,
      employeeId,
      employeeName,
      designationCode,
      transferFromBranch,
      transferDate,
      transferToBranch,
      newDesignation,
      approvedDate,
      orderDate,
      remarks,
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

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const employeeTypeOptions = [
    { value: "New", label: "New" },
    { value: "Amendment", label: "Amendment" },
  ];
  const branchOptions = [
    { value: "Main Branch", label: "Main Branch" },
    { value: "City Branch", label: "City Branch" },
  ];
  const employeeColumns = [
    { key: "employeeId", header: "Employee ID" },
    { key: "name", header: "Employee Name" },
    { key: "designationCode", header: "Designation Code" },
    { key: "branch", header: "Branch" },
  ];

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Employee Transfer Entry"
        titleHi="कर्मचारी बदली नोंद"
        subtitleEn="Manage employee transfer details."
        subtitleHi="कर्मचाऱ्यांची बदली माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Employee Transfer" width={48} height={48} />
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
        <div className="p-1 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image src={IMAGES.USER} alt="Current Employee Details" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827] dark:text-slate-100">
                  Current Employee Details
                  <span className="ml-2 font-normal text-[#64748B] dark:text-slate-400">/ सध्याची कर्मचारी माहिती</span>
                </h3>
                <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
                  Review the employee's existing branch, designation, and transfer information before
                  processing the transfer.
                  <br />
                  बदली प्रक्रिया करण्यापूर्वी कर्मचाऱ्याची सध्याची शाखा, पद आणि सेवा माहिती तपासा.
                </p>
              </div>
            </div>

            <div className={grid4}>
              <SelectField
                label="Employee Type"
                labelHi="नोंद प्रकार"
                value={employeeType}
                onChange={setEmployeeType}
                options={employeeTypeOptions}
                placeholder="Select Employee Type"
                required
                error={errors.employeeType}
              />

              <TextField
                label="Transfer ID"
                labelHi="बदली आयडी"
                value={transferId}
                onChange={setTransferId}
                placeholder="Enter Amount"
                icon={<Hash size={16} />}
                required
                error={errors.transferId}
              />

              <PicklistField
                label="Employee ID"
                labelHi="कर्मचारी आयडी"
                value={employeeId}
                onOpenPicklist={() => setIsPickerOpen(true)}
                placeholder="Enter Amount"
                required
                error={errors.employeeId}
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
              />

              <TextField
                label="Emp Designation Code"
                labelHi="कर्मचारी पद कोड"
                value={designationCode}
                onChange={setDesignationCode}
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
                value={designationName}
                onChange={setDesignationName}
                placeholder="name@company.com"
                icon={<FileText size={16} />}
                readOnly
                disabled
                required
              />

              <TextField
                label="Transfer From Branch"
                labelHi="सध्याची शाखा"
                value={transferFromBranch}
                onChange={setTransferFromBranch}
                placeholder="name@company.com"
                icon={<Building size={16} />}
                readOnly
                disabled
                required
                error={errors.transferFromBranch}
              />

              <TextField
                label="Transfer From Department"
                labelHi="सध्याचा विभाग"
                value={transferFromDepartment}
                onChange={setTransferFromDepartment}
                placeholder="name@company.com"
                icon={<Building size={16} />}
                readOnly
                disabled
              />

              <TextField
                label="category code"
                labelHi="वर्ग कोड"
                value={categoryCode}
                onChange={setCategoryCode}
                placeholder="name@company.com"
                icon={<Hash size={16} />}
                required
              />

              <TextField
                label="category Name"
                labelHi="श्रेणीचे नाव"
                value={categoryName}
                onChange={setCategoryName}
                placeholder="name@company.com"
                icon={<Landmark size={16} />}
                required
              />

              <DateField
                label="Transfer Date"
                labelHi="बदली दिनांक"
                value={transferDate}
                onChange={setTransferDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.transferDate}
              />
            </div>
          </div>

          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image src={IMAGES.USER} alt="Transfer & Posting Details" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111827] dark:text-slate-100">
                  Transfer & Posting Details
                  <span className="ml-2 font-normal text-[#64748B] dark:text-slate-400">/ बदली व नवीन पदस्थापना तपशील</span>
                </h3>
                <p className="mt-0.5 text-sm text-[#64748B] dark:text-slate-400">
                  Assign the employee's new branch, designation, reporting dates, and transfer remarks.
                  <br />
                  कर्मचाऱ्याची नवीन शाखा, पद, रुजू दिनांक आणि बदलीसंबंधी माहिती नोंदवा.
                </p>
              </div>
            </div>

            <div className={grid4}>
              <SelectField
                label="Transfer To Branch"
                labelHi="नवीन शाखा"
                value={transferToBranch}
                onChange={setTransferToBranch}
                options={branchOptions}
                placeholder="Enter Amount"
                required
                error={errors.transferToBranch}
              />

              <TextField
                label="New Designation"
                labelHi="नवीन पद"
                value={newDesignation}
                onChange={setNewDesignation}
                placeholder="Enter Amount"
                icon={<FileText size={16} />}
                required
                error={errors.newDesignation}
              />

              <DateField
                label="Approved Date"
                labelHi="मंजूरी दिनांक"
                value={approvedDate}
                onChange={setApprovedDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.approvedDate}
              />

              <DateField
                label="Order Date"
                labelHi="आदेश दिनांक"
                value={orderDate}
                onChange={setOrderDate}
                placeholder="YYYY-MM-DD"
                required
                error={errors.orderDate}
              />

              <DateField
                label="Relieving Date"
                labelHi="कार्यमुक्ती दिनांक"
                value={relievingDate}
                onChange={setRelievingDate}
                placeholder="YYYY-MM-DD"
              />

              <DateField
                label="Joining Date"
                labelHi="रुजू दिनांक"
                value={joiningDate}
                onChange={setJoiningDate}
                placeholder="YYYY-MM-DD"
                required
              />

              <TextField
                label="Remarks"
                labelHi="शेरा"
                value={remarks}
                onChange={setRemarks}
                placeholder="Enter Amount"
                icon={<FileText size={16} />}
                required
                error={errors.remarks}
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
            setEmployeeId(row.employeeId);
            setEmployeeName(row.name);
            setDesignationCode(row.designationCode);
            setDesignationName(row.designationName);
            setTransferFromBranch(row.branch);
            setTransferFromDepartment(row.department);
            setIsPickerOpen(false);
          }}
          onClose={() => setIsPickerOpen(false)}
         
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Employee Transfer Saved Successfully"
          subtitle="The employee transfer record has been processed successfully."
        />
      )}
    </>
  );
} 