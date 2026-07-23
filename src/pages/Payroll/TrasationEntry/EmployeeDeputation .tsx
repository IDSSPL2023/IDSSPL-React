import { IMAGES } from "@/assets";
import { useState, useMemo } from "react";
import {
  User,
  Hash,
  FileText,
  Landmark,
  Building,
  ClipboardList,
  X,
  Check,
  Trash2,
  ChevronsDown,
  ChevronRight,
  FileOutput,
} from "lucide-react";
import Image from "@/components/ui/Image";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import AuthorizeHero from "@/components/Authorization/AuthorizeTransaction/AuthorizeHero";
import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";
import TextField from "@/components/common/TextField";
import SelectField from "@/components/common/SelectField";
import DateField from "@/components/common/DateField";
import PicklistField from "@/components/common/PicklistField";
import PicklistModal from "@/components/common/PicklistModal";
import { validateFields, isFormValid, required } from "@/components/common/validation";

// ============================================================
// SHARED MOCK DATA
// ============================================================

interface DeputationEmployee {
  id: string; name: string; employeeNo: string; designationCode: string; designationName: string; categoryCode: string; category: string;
}
const MOCK_DEPUTATION_EMPLOYEES: DeputationEmployee[] = [
  { id: "1", name: "Rahul Sharma", employeeNo: "EMP001", designationCode: "MGR", designationName: "Manager", categoryCode: "CAT01", category: "Permanent" },
  { id: "2", name: "Priya Patel", employeeNo: "EMP002", designationCode: "SRD", designationName: "Senior Developer", categoryCode: "CAT02", category: "Contract" },
];

interface PromotionEmployee { id: string; employeeId: string; name: string; designationCode: string; designationName: string; }
const MOCK_PROMOTION_EMPLOYEES: PromotionEmployee[] = [
  { id: "1", employeeId: "EMP001", name: "Rahul Sharma", designationCode: "MGR", designationName: "Manager" },
  { id: "2", employeeId: "EMP002", name: "Priya Patel", designationCode: "SRD", designationName: "Senior Developer" },
];

interface ResignationEmployee { id: string; employeeNo: string; name: string; designationCode: string; designationName: string; branchCode: string; branchName: string; }
const MOCK_RESIGNATION_EMPLOYEES: ResignationEmployee[] = [
  { id: "1", employeeNo: "EMP001", name: "Rahul Sharma", designationCode: "MGR", designationName: "Manager", branchCode: "BR01", branchName: "Main Branch" },
  { id: "2", employeeNo: "EMP002", name: "Priya Patel", designationCode: "SRD", designationName: "Senior Developer", branchCode: "BR02", branchName: "City Branch" },
];

// ============================================================
// EMPLOYEE DEPUTATION MODAL
// ============================================================

function EmployeeDeputationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [select, setSelect] = useState<"Yes" | "No">("No");
  const [deductionId, setDeductionId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [employeeNo, setEmployeeNo] = useState("");
  const [name, setName] = useState("");
  const [designationCode, setDesignationCode] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [transformForm, setTransformForm] = useState("");
  const [transformForm2, setTransformForm2] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [category, setCategory] = useState("");
  const [deputedTo, setDeputedTo] = useState("Earnings");
  const [categoryTo, setCategoryTo] = useState("Monthly");
  const [designationTo, setDesignationTo] = useState("Monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [remark, setRemark] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const rules = { 
    employeeNo: required("Employee No. is required"), 
    name: required("Name is required"), 
    designationCode: required("Designation Code is required"), 
    designationName: required("Designation Name is required"), 
    fromDate: required("From Date is required"), 
    toDate: required("To Date is required") 
  };
  
  const handleValidate = () => {
    const err = validateFields({ employeeNo, name, designationCode, designationName, fromDate, toDate }, rules);
    setErrors(err);
    if (isFormValid(err)) setIsValidated(true);
  };
  
  const handleSave = () => { if (isValidated) setShowSuccess(true); };
  const handleDone = () => { setShowSuccess(false); onClose(); };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3";
  const options = [{ value: "Earnings", label: "Earnings" }, { value: "Deductions", label: "Deductions" }, { value: "Allowances", label: "Allowances" }];
  const catOptions = [{ value: "Monthly", label: "Monthly" }, { value: "Weekly", label: "Weekly" }, { value: "Daily", label: "Daily" }];

  return (
    <>
      <FormModal onClose={onClose} titleEn="Employee Deputation" titleHi="कर्मचारी नेमणूक" subtitleEn="Configure earning and deduction components." subtitleHi="वेतन गणना व प्रक्रिया करण्यासाठी कमाई व कपात घटकांची संरचना करा." headerIcon={<div className="flex h-12 w-12 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Deputation" width={48} height={48} /></div>} tabs={[]} activeTab="" onTabChange={() => {}} hideFooter maxWidth="max-w-6xl" customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Check className="h-4 w-4" /> Validate</button>
          <button disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg border px-5 py-2.5 text-sm font-semibold ${isValidated ? "border-red-500 text-red-600 hover:bg-red-50" : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"}`}><Trash2 className="h-4 w-4" /> Delete</button>
          <button disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg border px-5 py-2.5 text-sm font-semibold ${isValidated ? "border-green-600 text-green-700 hover:bg-green-50" : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"}`}><Check className="h-4 w-4" /> Update</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"><X className="h-4 w-4" /> Cancel</button>
          <button onClick={handleSave} disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><ChevronsDown className="h-4 w-4" /> Save</button>
        </div>
      }>
        <div className="p-1 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Information" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Employee Information / कर्मचारी माहिती</h3><p className="mt-0.5 text-sm text-[#64748B]">Select the employee and basic record information before configuring the loan deduction.</p></div></div>
            <div className={grid4}>
              <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Select / निवडा</label><div className="flex items-center gap-6 pt-2"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="select" checked={select === "Yes"} onChange={() => setSelect("Yes")} className="h-4 w-4 accent-[#1565D8]" /><span className="text-sm font-medium">Yes</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="select" checked={select === "No"} onChange={() => setSelect("No")} className="h-4 w-4 accent-[#1565D8]" /><span className="text-sm font-medium">No</span></label></div></div>
              <PicklistField label="Deduction ID" value={deductionId} onOpenPicklist={() => setIsPickerOpen(true)} placeholder="Enter Amount" icon={<Hash size={16} />} required />
              <DateField label="Date" value={date} onChange={setDate} placeholder="YYYY-MM-DD" required />
              <PicklistField label="Employee No." labelHi="कर्मचारी क्रमांक" value={employeeNo} onOpenPicklist={() => setIsPickerOpen(true)} placeholder="Select Employee" required error={errors.employeeNo} />
              <TextField label="Name" value={name} onChange={setName} placeholder="Name" icon={<User size={16} />} required error={errors.name} />
              <TextField label="Employee Designation Code" value={designationCode} onChange={setDesignationCode} placeholder="Designation Code" icon={<FileText size={16} />} readOnly required error={errors.designationCode} />
              <TextField label="Employee Designation Name" value={designationName} onChange={setDesignationName} placeholder="Designation Name" icon={<FileText size={16} />} readOnly required error={errors.designationName} />
              <TextField label="Transform Form" value={transformForm} onChange={setTransformForm} placeholder="Transform" icon={<ClipboardList size={16} />} />
              <TextField label="Transform Form" value={transformForm2} onChange={setTransformForm2} placeholder="Transform" icon={<ClipboardList size={16} />} />
              <TextField label="Category Code" value={categoryCode} onChange={setCategoryCode} placeholder="Category Code" icon={<Hash size={16} />} readOnly />
              <TextField label="Category" value={category} onChange={setCategory} placeholder="Category Name" icon={<Landmark size={16} />} readOnly />
            </div>
          </div>
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Transfer Details" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Transfer Details / हस्तांतरण तपशील</h3><p className="mt-0.5 text-sm text-[#64748B]">Configure the employee loan account and monthly deduction details for payroll processing.</p></div></div>
            <div className={grid3}>
              <SelectField label="Deputed To" value={deputedTo} onChange={setDeputedTo} options={options} placeholder="Select Deputed To" required />
              <SelectField label="Category To" value={categoryTo} onChange={setCategoryTo} options={catOptions} placeholder="Select Category To" required />
              <SelectField label="Designation To" value={designationTo} onChange={setDesignationTo} options={catOptions} placeholder="Select Designation To" required />
              <DateField label="From Date" value={fromDate} onChange={setFromDate} placeholder="YYYY-MM-DD" required error={errors.fromDate} />
              <DateField label="To Date" value={toDate} onChange={setToDate} placeholder="YYYY-MM-DD" required error={errors.toDate} />
              <TextField label="Remark" value={remark} onChange={setRemark} placeholder="Remark" icon={<FileText size={16} />} />
            </div>
          </div>
        </div>
      </FormModal>
      {isPickerOpen && <PicklistModal title="Employee List" columns={[{ key: "employeeNo", header: "Employee No." }, { key: "name", header: "Name" }, { key: "designationName", header: "Designation" }]} rows={MOCK_DEPUTATION_EMPLOYEES} rowKey={(r) => r.id} onSelect={(row) => { setEmployeeNo(row.employeeNo); setName(row.name); setDesignationCode(row.designationCode); setDesignationName(row.designationName); setCategoryCode(row.categoryCode); setCategory(row.category); setIsPickerOpen(false); }} onClose={() => setIsPickerOpen(false)} />}
      {showSuccess && <SuccessModal onClose={handleDone} onDone={handleDone} title="Employee Deputation Saved Successfully" subtitle="The employee deputation record has been processed successfully." />}
    </>
  );
}

// ============================================================
// EMPLOYEE PROMOTION MODAL
// ============================================================

function EmployeePromotionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState({ 
    promotionId: "", promotionDate: "", recordType: "New", branch: "", 
    employeeId: "", employeeName: "", designationCode: "", designationName: "", 
    education: "", joinDate: "", confirmationDate: "", basicInOldGrade: "", promotionCategory: "", 
    promotionCategory2: "", incrementAmount: "", basicInNewGrade: "", promotionFrom: "", 
    asPerDated: "", approvalDate: "", depositMobilization: "", recoveryOfDues: "", 
    advance: "", formationOfShgs: "", toBranch: "", relievingDate: "", joiningDate: "", 
    section: "", designation: "" 
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const update = (key: string, val: string) => setState(prev => ({ ...prev, [key]: val }));
  
  const rules = { 
    promotionId: required("Promotion ID is required"), 
    promotionDate: required("Promotion Date is required"), 
    recordType: required("Record Type is required"), 
    branch: required("Branch is required"), 
    employeeId: required("Employee ID is required"), 
    employeeName: required("Employee Name is required"), 
    designationCode: required("Designation Code is required"), 
    education: required("Education is required"), 
    joinDate: required("Join Date is required"), 
    confirmationDate: required("Confirmation Date is required"), 
    basicInOldGrade: required("Basic in Old Grade is required"), 
    promotionCategory: required("Promotion Category is required") 
  };
  
  const handleValidate = () => { 
    const err = validateFields(state, rules); 
    setErrors(err); 
    if (isFormValid(err)) setIsValidated(true); 
  };
  
  const handleSave = () => { if (isValidated) setShowSuccess(true); };
  const handleDone = () => { setShowSuccess(false); onClose(); };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const recordOptions = [{ value: "New", label: "New" }, { value: "Amendment", label: "Amendment" }, { value: "Reversal", label: "Reversal" }];
  const catOptions = [{ value: "Regular", label: "Regular" }, { value: "Special", label: "Special" }, { value: "Time Bound", label: "Time Bound" }];

  return (
    <>
      <FormModal onClose={onClose} titleEn="Employee Promotion" titleHi="कर्मचारी पदोन्नती" subtitleEn="Manage employee promotion, salary grade, and transfer posting details." subtitleHi="कर्मचाऱ्यांची पदोन्नती, वेतन श्रेणी व बदलीची माहिती व्यवस्थापित करा." headerIcon={<div className="flex h-12 w-12 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Promotion" width={48} height={48} /></div>} tabs={[]} activeTab="" onTabChange={() => {}} hideFooter maxWidth="max-w-6xl" customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Check className="h-4 w-4" /> Validate</button>
          <button disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><FileOutput className="h-4 w-4" /> Generate</button>
          <button onClick={handleSave} disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><Check className="h-4 w-4" /> Save</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"><X className="h-4 w-4" /> Cancel</button>
        </div>
      }>
        <div className="p-1 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Details" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Employee Details / कर्मचारी तपशील</h3><p className="mt-0.5 text-sm text-[#64748B]">Select the employee and review current employment information before processing the promotion.</p></div></div>
            <div className={grid4}>
              <TextField label="Promotion ID" value={state.promotionId} onChange={(v) => update("promotionId", v)} placeholder="Enter Amount" icon={<Hash size={16} />} required error={errors.promotionId} />
              <DateField label="Promotion Date" value={state.promotionDate} onChange={(v) => update("promotionDate", v)} placeholder="YYYY-MM-DD" required error={errors.promotionDate} />
              <SelectField label="Record Type" value={state.recordType} onChange={(v) => update("recordType", v)} options={recordOptions} placeholder="Select Record Type" required error={errors.recordType} />
              <TextField label="Branch" value={state.branch} onChange={(v) => update("branch", v)} placeholder="name@company.com" icon={<Building size={16} />} required error={errors.branch} />
              <PicklistField label="Employee ID" value={state.employeeId} onOpenPicklist={() => setIsPickerOpen(true)} placeholder="Key No" required error={errors.employeeId} />
              <TextField label="Employee Name" value={state.employeeName} onChange={(v) => update("employeeName", v)} placeholder="name@company.com" icon={<User size={16} />} required error={errors.employeeName} />
              <TextField label="Employee Designation Code" value={state.designationCode} onChange={(v) => update("designationCode", v)} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required error={errors.designationCode} />
              <TextField label="Employee Designation Name" value={state.designationName} onChange={(v) => update("designationName", v)} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled />
              <TextField label="Education" value={state.education} onChange={(v) => update("education", v)} placeholder="name@company.com" icon={<ClipboardList size={16} />} required error={errors.education} />
              <DateField label="Join Date" value={state.joinDate} onChange={(v) => update("joinDate", v)} placeholder="YYYY-MM-DD" required error={errors.joinDate} />
              <DateField label="Confirmation Date" value={state.confirmationDate} onChange={(v) => update("confirmationDate", v)} placeholder="YYYY-MM-DD" required error={errors.confirmationDate} />
              <TextField label="Basic in Old Grade" value={state.basicInOldGrade} onChange={(v) => update("basicInOldGrade", v)} placeholder="Enter Amount" icon={<Landmark size={16} />} required error={errors.basicInOldGrade} />
              <SelectField label="Promotion Category" value={state.promotionCategory} onChange={(v) => update("promotionCategory", v)} options={catOptions} placeholder="Enter Amount" required error={errors.promotionCategory} />
            </div>
          </div>
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Promotion Details" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Promotion Details / पदोन्नती तपशील</h3><p className="mt-0.5 text-sm text-[#64748B]">Configure promotion grade, salary increment, and approval information.</p></div></div>
            <div className={grid4}>
              <SelectField label="Promotion Category" value={state.promotionCategory2} onChange={(v) => update("promotionCategory2", v)} options={catOptions} placeholder="Enter Amount" required />
              <TextField label="Promotion Increment Amount" value={state.incrementAmount} onChange={(v) => update("incrementAmount", v)} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Basic in New Grade" value={state.basicInNewGrade} onChange={(v) => update("basicInNewGrade", v)} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Promotion From" value={state.promotionFrom} onChange={(v) => update("promotionFrom", v)} placeholder="Enter Amount" icon={<FileText size={16} />} required />
              <TextField label="As Per Dated" value={state.asPerDated} onChange={(v) => update("asPerDated", v)} placeholder="Key No" icon={<FileText size={16} />} required />
              <DateField label="Approval Date" value={state.approvalDate} onChange={(v) => update("approvalDate", v)} placeholder="YYYY-MM-DD" required />
              <TextField label="Deposit Mobilization" value={state.depositMobilization} onChange={(v) => update("depositMobilization", v)} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Recovery of Dues" value={state.recoveryOfDues} onChange={(v) => update("recoveryOfDues", v)} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Advance" value={state.advance} onChange={(v) => update("advance", v)} placeholder="Enter Amount" icon={<Landmark size={16} />} required />
              <TextField label="Formation of SHGs" value={state.formationOfShgs} onChange={(v) => update("formationOfShgs", v)} placeholder="Enter Amount" icon={<ClipboardList size={16} />} required />
            </div>
          </div>
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Transfer & Posting Details" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Transfer & Posting Details / बदली व पदस्थापना तपशील</h3><p className="mt-0.5 text-sm text-[#64748B]">Assign the employee's new posting, department and designation after promotion.</p></div></div>
            <div className={grid4}>
              <TextField label="To Branch" value={state.toBranch} onChange={(v) => update("toBranch", v)} placeholder="Enter Amount" icon={<Building size={16} />} required />
              <DateField label="Relieving Date" value={state.relievingDate} onChange={(v) => update("relievingDate", v)} placeholder="YYYY-MM-DD" required />
              <DateField label="Joining Date" value={state.joiningDate} onChange={(v) => update("joiningDate", v)} placeholder="YYYY-MM-DD" required />
              <TextField label="Section" value={state.section} onChange={(v) => update("section", v)} placeholder="Enter Amount" icon={<ClipboardList size={16} />} required />
              <TextField label="Designation" value={state.designation} onChange={(v) => update("designation", v)} placeholder="Enter Amount" icon={<FileText size={16} />} required />
            </div>
          </div>
        </div>
      </FormModal>
      {isPickerOpen && <PicklistModal title="Employee List" columns={[{ key: "employeeId", header: "Employee ID" }, { key: "name", header: "Employee Name" }, { key: "designationCode", header: "Designation Code" }]} rows={MOCK_PROMOTION_EMPLOYEES} rowKey={(r) => r.id} onSelect={(row) => { update("employeeId", row.employeeId); update("employeeName", row.name); update("designationCode", row.designationCode); update("designationName", row.designationName); setIsPickerOpen(false); }} onClose={() => setIsPickerOpen(false)} />}
      {showSuccess && <SuccessModal onClose={handleDone} onDone={handleDone} title="Employee Promotion Saved Successfully" subtitle="The employee promotion record has been processed successfully." />}
    </>
  );
}

// ============================================================
// EMPLOYEE RESIGNATION MODAL
// ============================================================

function EmployeeResignationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState({ 
    recordType: "New", resignationNo: "", trnDate: "", employeeNo: "", employeeName: "", 
    designationCode: "", designationName: "", branchCode: "", branchName: "", 
    categoryCode: "", categoryName: "", education: "", joinDate: "", confirmationDate: "", 
    resignationDate: "", resignationReason: "" 
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const update = (key: string, val: string) => setState(prev => ({ ...prev, [key]: val }));
  
  const rules = { 
    recordType: required("Record Type is required"), 
    resignationNo: required("Resignation No is required"), 
    trnDate: required("Trn Date is required"), 
    employeeNo: required("Employee No is required"), 
    employeeName: required("Employee Name is required"), 
    designationCode: required("Emp Designation Code is required"), 
    branchCode: required("Branch Code is required"), 
    joinDate: required("Join Date is required"), 
    confirmationDate: required("Confirmation Date is required"), 
    resignationDate: required("Resignation Date is required"), 
    resignationReason: required("Resignation Reason is required") 
  };
  
  const handleValidate = () => { 
    const err = validateFields(state, rules); 
    setErrors(err); 
    if (isFormValid(err)) setIsValidated(true); 
  };
  
  const handleSave = () => { if (isValidated) setShowSuccess(true); };
  const handleDone = () => { setShowSuccess(false); onClose(); };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const recordOptions = [{ value: "New", label: "New" }, { value: "Amendment", label: "Amendment" }];

  return (
    <>
      <FormModal onClose={onClose} titleEn="Employee Resignation" titleHi="कर्मचारी राजीनामा" subtitleEn="Manage employee resignation details." subtitleHi="कर्मचाऱ्यांची राजीनामा माहिती व्यवस्थापित करा." headerIcon={<div className="flex h-12 w-12 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Resignation" width={48} height={48} /></div>} tabs={[]} activeTab="" onTabChange={() => {}} hideFooter maxWidth="max-w-6xl" customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Check className="h-4 w-4" /> Validate</button>
          <button disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><FileOutput className="h-4 w-4" /> Generate</button>
          <button onClick={handleSave} disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><Check className="h-4 w-4" /> Save</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"><X className="h-4 w-4" /> Cancel</button>
        </div>
      }>
        <div className="p-1">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className={grid4}>
              <SelectField label="Record Type" value={state.recordType} onChange={(v) => update("recordType", v)} options={recordOptions} placeholder="Select Record Type" required error={errors.recordType} />
              <TextField label="Resignation No" value={state.resignationNo} onChange={(v) => update("resignationNo", v)} placeholder="Enter Amount" icon={<Hash size={16} />} required error={errors.resignationNo} />
              <DateField label="Trn Date" value={state.trnDate} onChange={(v) => update("trnDate", v)} placeholder="YYYY-MM-DD" required error={errors.trnDate} />
              <PicklistField label="Employee No" value={state.employeeNo} onOpenPicklist={() => setIsPickerOpen(true)} placeholder="Enter Amount" required error={errors.employeeNo} />
              <TextField label="Employee Name" value={state.employeeName} onChange={(v) => update("employeeName", v)} placeholder="name@company.com" icon={<User size={16} />} required error={errors.employeeName} />
              <TextField label="Emp Designation Code" value={state.designationCode} onChange={(v) => update("designationCode", v)} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required error={errors.designationCode} />
              <TextField label="Employee Designation Name" value={state.designationName} onChange={(v) => update("designationName", v)} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required />
              <TextField label="Branch Code" value={state.branchCode} onChange={(v) => update("branchCode", v)} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required error={errors.branchCode} />
              <TextField label="Branch Name" value={state.branchName} onChange={(v) => update("branchName", v)} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required />
              <TextField label="category code" value={state.categoryCode} onChange={(v) => update("categoryCode", v)} placeholder="name@company.com" icon={<Hash size={16} />} required />
              <TextField label="category Name" value={state.categoryName} onChange={(v) => update("categoryName", v)} placeholder="name@company.com" icon={<Landmark size={16} />} required />
              <TextField label="Education" value={state.education} onChange={(v) => update("education", v)} placeholder="name@company.com" icon={<ClipboardList size={16} />} required />
              <DateField label="Join Date" value={state.joinDate} onChange={(v) => update("joinDate", v)} placeholder="YYYY-MM-DD" required error={errors.joinDate} />
              <DateField label="Confirmation Date" value={state.confirmationDate} onChange={(v) => update("confirmationDate", v)} placeholder="YYYY-MM-DD" required error={errors.confirmationDate} />
              <TextField label="Resignation Date" value={state.resignationDate} onChange={(v) => update("resignationDate", v)} placeholder="Enter Amount" icon={<FileText size={16} />} required error={errors.resignationDate} />
              <TextField label="Resignation Reason" value={state.resignationReason} onChange={(v) => update("resignationReason", v)} placeholder="Enter Amount" icon={<FileText size={16} />} required error={errors.resignationReason} />
            </div>
          </div>
        </div>
      </FormModal>
      {isPickerOpen && <PicklistModal title="Employee List" columns={[{ key: "employeeNo", header: "Employee No." }, { key: "name", header: "Employee Name" }, { key: "designationCode", header: "Designation Code" }]} rows={MOCK_RESIGNATION_EMPLOYEES} rowKey={(r) => r.id} onSelect={(row) => { update("employeeNo", row.employeeNo); update("employeeName", row.name); update("designationCode", row.designationCode); update("designationName", row.designationName); update("branchCode", row.branchCode); update("branchName", row.branchName); setIsPickerOpen(false); }} onClose={() => setIsPickerOpen(false)}/>}
      {showSuccess && <SuccessModal onClose={handleDone} onDone={handleDone} title="Employee Resignation Saved Successfully" subtitle="The employee resignation record has been processed successfully." />}
    </>
  );
}

// ============================================================
// EMPLOYEE SUSPENSION INFORMATION MODAL
// ============================================================

interface SuspensionEmployee {
  id: string; employeeNo: string; name: string; designationCode: string; designationName: string; branchCode: string; branchName: string; categoryCode: string; categoryName: string;
}

const MOCK_SUSPENSION_EMPLOYEES: SuspensionEmployee[] = [
  { id: "1", employeeNo: "EMP001", name: "Rahul Sharma", designationCode: "MGR", designationName: "Manager", branchCode: "BR01", branchName: "Main Branch", categoryCode: "CAT01", categoryName: "Permanent" },
  { id: "2", employeeNo: "EMP002", name: "Priya Patel", designationCode: "SRD", designationName: "Senior Developer", branchCode: "BR02", branchName: "City Branch", categoryCode: "CAT02", categoryName: "Contract" },
];

function EmployeeSuspensionInformationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [employeeType, setEmployeeType] = useState("New");
  const [suspensionNo, setSuspensionNo] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [designationCode, setDesignationCode] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [education, setEducation] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [confirmationDate, setConfirmationDate] = useState("");
  const [suspensionFromDate, setSuspensionFromDate] = useState("");
  const [suspensionToDate, setSuspensionToDate] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [suspensionOrderNo, setSuspensionOrderNo] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const rules = {
    employeeType: required("Employee Type is required"),
    suspensionNo: required("Suspension No is required"),
    employeeNo: required("Employee No is required"),
    employeeName: required("Employee Name is required"),
    designationCode: required("Designation Code is required"),
    branchCode: required("Branch Code is required"),
    joinDate: required("Join Date is required"),
    confirmationDate: required("Confirmation Date is required"),
    suspensionFromDate: required("Suspension From Date is required"),
    suspensionToDate: required("Suspension To Date is required"),
    suspensionReason: required("Suspension Reason is required"),
  };

  const handleValidate = () => {
    const err = validateFields({ employeeType, suspensionNo, employeeNo, employeeName, designationCode, branchCode, joinDate, confirmationDate, suspensionFromDate, suspensionToDate, suspensionReason }, rules);
    setErrors(err);
    if (isFormValid(err)) setIsValidated(true);
  };

  const handleSave = () => { if (isValidated) setShowSuccess(true); };
  const handleDone = () => { setShowSuccess(false); onClose(); };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const employeeTypeOptions = [{ value: "New", label: "New" }, { value: "Existing", label: "Existing" }];
  const salaryTypeOptions = [{ value: "Monthly", label: "Monthly" }, { value: "Weekly", label: "Weekly" }, { value: "Daily", label: "Daily" }];
  const employeeColumns = [{ key: "employeeNo", header: "Employee No." }, { key: "name", header: "Employee Name" }, { key: "designationName", header: "Designation" }, { key: "branchName", header: "Branch Name" }];

  return (
    <>
      <FormModal onClose={onClose} titleEn="Employee Suspension Information" titleHi="कर्मचारी निलंबन माहिती" subtitleEn="Manage employee suspension details." subtitleHi="कर्मचाऱ्यांची निलंबन माहिती व्यवस्थापित करा." headerIcon={<div className="flex h-12 w-12 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Suspension" width={48} height={48} /></div>} tabs={[]} activeTab="" onTabChange={() => {}} hideFooter maxWidth="max-w-6xl" customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Check className="h-4 w-4" /> Validate</button>
          <button onClick={handleSave} disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><ChevronsDown className="h-4 w-4" /> Save</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"><X className="h-4 w-4" /> Cancel</button>
        </div>
      }>
        <div className="p-1 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Details" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Employee Details / कर्मचारी तपशील</h3><p className="mt-0.5 text-sm text-[#64748B]">Select the employee and review current employment information before processing the suspension.</p></div></div>
            <div className={grid4}>
              <SelectField label="Employee Type" labelHi="नोंद प्रकार" value={employeeType} onChange={setEmployeeType} options={employeeTypeOptions} placeholder="Select Type" required error={errors.employeeType} />
              <TextField label="Suspension No" labelHi="निलंबन क्रमांक" value={suspensionNo} onChange={setSuspensionNo} placeholder="Enter Amount" icon={<Hash size={16} />} required error={errors.suspensionNo} />
              <PicklistField label="Employee No" labelHi="कर्मचारी क्रमांक" value={employeeNo} onOpenPicklist={() => setIsPickerOpen(true)} placeholder="Enter Amount" required error={errors.employeeNo} />
              <TextField label="Employee Name" labelHi="कर्मचारी नाव" value={employeeName} onChange={setEmployeeName} placeholder="name@company.com" icon={<User size={16} />} required error={errors.employeeName} />
              <TextField label="Education" labelHi="शैक्षणिक पात्रता" value={education} onChange={setEducation} placeholder="name@company.com" icon={<ClipboardList size={16} />} required />
              <TextField label="Branch Code" labelHi="शाखा कोड" value={branchCode} onChange={setBranchCode} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required error={errors.branchCode} />
              <TextField label="Branch Name" labelHi="शाखेचे नाव" value={branchName} onChange={setBranchName} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required />
              <TextField label="category code" labelHi="वर्ग कोड" value={categoryCode} onChange={setCategoryCode} placeholder="name@company.com" icon={<Hash size={16} />} readOnly disabled />
              <TextField label="category Name" labelHi="श्रेणीचे नाव" value={categoryName} onChange={setCategoryName} placeholder="name@company.com" icon={<Landmark size={16} />} readOnly disabled />
              <TextField label="Employee Designation Code" labelHi="कर्मचारी पद कोड" value={designationCode} onChange={setDesignationCode} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required error={errors.designationCode} />
              <TextField label="Employee Designation Name" labelHi="कर्मचारी पद नाव" value={designationName} onChange={setDesignationName} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required />
              <DateField label="Join Date" labelHi="रुजू दिनांक" value={joinDate} onChange={setJoinDate} placeholder="YYYY-MM-DD" required error={errors.joinDate} />
              <DateField label="Confirmation Date" labelHi="कायम नियुक्ती दिनांक" value={confirmationDate} onChange={setConfirmationDate} placeholder="YYYY-MM-DD" required error={errors.confirmationDate} />
            </div>
          </div>
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Suspension Details" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Suspension Details / निलंबन तपशील</h3><p className="mt-0.5 text-sm text-[#64748B]">Configure suspension grade, salary increment and approval information.</p></div></div>
            <div className={grid4}>
              <DateField label="Suspension From Date" labelHi="निलंबन सुरू होण्याची तारीख" value={suspensionFromDate} onChange={setSuspensionFromDate} placeholder="YYYY-MM-DD" required error={errors.suspensionFromDate} />
              <DateField label="Suspension To Date" labelHi="निलंबन समाप्ती तारीख" value={suspensionToDate} onChange={setSuspensionToDate} placeholder="YYYY-MM-DD" required error={errors.suspensionToDate} />
              <SelectField label="Salary Type" labelHi="पगार प्रकार" value={salaryType} onChange={setSalaryType} options={salaryTypeOptions} placeholder="Select Type" required />
              <TextField label="Suspension Order No" labelHi="निलंबन आदेश क्रमांक" value={suspensionOrderNo} onChange={setSuspensionOrderNo} placeholder="Enter Amount" icon={<FileText size={16} />} required />
              <TextField label="Suspension Reason" labelHi="निलंबनाचे कारण" value={suspensionReason} onChange={setSuspensionReason} placeholder="Enter Amount" icon={<FileText size={16} />} required error={errors.suspensionReason} />
            </div>
          </div>
        </div>
      </FormModal>
      {isPickerOpen && <PicklistModal title="Employee List" columns={employeeColumns} rows={MOCK_SUSPENSION_EMPLOYEES} rowKey={(r) => r.id} onSelect={(row) => { setEmployeeNo(row.employeeNo); setEmployeeName(row.name); setDesignationCode(row.designationCode); setDesignationName(row.designationName); setBranchCode(row.branchCode); setBranchName(row.branchName); setCategoryCode(row.categoryCode); setCategoryName(row.categoryName); setIsPickerOpen(false); }} onClose={() => setIsPickerOpen(false)} />}
      {showSuccess && <SuccessModal onClose={handleDone} onDone={handleDone} title="Employee Suspension Saved Successfully" subtitle="The employee suspension record has been processed successfully." />}
    </>
  );
}

// ============================================================
// EMPLOYEE TERMINATION MODAL
// ============================================================

interface TerminationEmployee { id: string; employeeNo: string; name: string; designationCode: string; designationName: string; branchCode: string; branchName: string; }
const MOCK_TERMINATION_EMPLOYEES: TerminationEmployee[] = [
  { id: "1", employeeNo: "EMP001", name: "Rahul Sharma", designationCode: "MGR", designationName: "Manager", branchCode: "BR01", branchName: "Main Branch" },
  { id: "2", employeeNo: "EMP002", name: "Priya Patel", designationCode: "SRD", designationName: "Senior Developer", branchCode: "BR02", branchName: "City Branch" },
];

function EmployeeTerminationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState({ recordType: "New", terminationId: "", terminationDate: "", employeeNo: "", employeeName: "", categoryCode: "", categoryName: "", designationCode: "", designationName: "", branchCode: "", branchName: "", joinDate: "", confirmationDate: "", education: "", terminationReason: "" });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const update = (key: string, val: string) => setState(prev => ({ ...prev, [key]: val }));
  const rules = { recordType: required("Record Type is required"), terminationId: required("Termination ID is required"), terminationDate: required("Termination Date is required"), employeeNo: required("Employee No is required"), employeeName: required("Employee Name is required"), designationCode: required("Emp Designation Code is required"), branchCode: required("Branch Code is required"), joinDate: required("Join Date is required"), confirmationDate: required("Confirmation Date is required"), terminationReason: required("Termination Reason is required") };
  const handleValidate = () => { const err = validateFields(state, rules); setErrors(err); if (isFormValid(err)) setIsValidated(true); };
  const handleSave = () => { if (isValidated) setShowSuccess(true); };
  const handleDone = () => { setShowSuccess(false); onClose(); };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const recordOptions = [{ value: "New", label: "New" }, { value: "Amendment", label: "Amendment" }];
  const employeeColumns = [{ key: "employeeNo", header: "Employee No." }, { key: "name", header: "Employee Name" }, { key: "designationCode", header: "Designation Code" }, { key: "branchName", header: "Branch Name" }];

  return (
    <>
      <FormModal onClose={onClose} titleEn="Employee Termination" titleHi="कर्मचारी सेवानिवृत्ती" subtitleEn="Manage employee termination details." subtitleHi="कर्मचाऱ्यांची सेवानिवृत्ती माहिती व्यवस्थापित करा." headerIcon={<div className="flex h-12 w-12 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Termination" width={48} height={48} /></div>} tabs={[]} activeTab="" onTabChange={() => {}} hideFooter maxWidth="max-w-6xl" customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Check className="h-4 w-4" /> Validate</button>
          <button disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><FileOutput className="h-4 w-4" /> Generate</button>
          <button onClick={handleSave} disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><ChevronsDown className="h-4 w-4" /> Save</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"><X className="h-4 w-4" /> Cancel</button>
        </div>
      }>
        <div className="p-1">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className={grid4}>
              <SelectField label="Record Type" labelHi="नोंद प्रकार" value={state.recordType} onChange={(v) => update("recordType", v)} options={recordOptions} placeholder="Select Record Type" required error={errors.recordType} />
              <TextField label="Termination ID" labelHi="सेवानिवृत्ती क्रमांक" value={state.terminationId} onChange={(v) => update("terminationId", v)} placeholder="Enter Amount" icon={<Hash size={16} />} required error={errors.terminationId} />
              <DateField label="Termination Date" labelHi="सेवानिवृत्ती दिनांक" value={state.terminationDate} onChange={(v) => update("terminationDate", v)} placeholder="YYYY-MM-DD" required error={errors.terminationDate} />
              <PicklistField label="Employee No" labelHi="कर्मचारी क्रमांक" value={state.employeeNo} onOpenPicklist={() => setIsPickerOpen(true)} placeholder="Enter Amount" required error={errors.employeeNo} />
              <TextField label="Employee Name" labelHi="कर्मचारी नाव" value={state.employeeName} onChange={(v) => update("employeeName", v)} placeholder="name@company.com" icon={<User size={16} />} required error={errors.employeeName} />
              <TextField label="category code" labelHi="वर्ग कोड" value={state.categoryCode} onChange={(v) => update("categoryCode", v)} placeholder="name@company.com" icon={<Hash size={16} />} required />
              <TextField label="category Name" labelHi="श्रेणीचे नाव" value={state.categoryName} onChange={(v) => update("categoryName", v)} placeholder="name@company.com" icon={<Landmark size={16} />} required />
              <TextField label="Emp Designation Code" labelHi="कर्मचारी पद कोड" value={state.designationCode} onChange={(v) => update("designationCode", v)} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required error={errors.designationCode} />
              <TextField label="Employee Designation Name" labelHi="कर्मचारी पद नाव" value={state.designationName} onChange={(v) => update("designationName", v)} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required />
              <TextField label="Branch Code" labelHi="शाखा कोड" value={state.branchCode} onChange={(v) => update("branchCode", v)} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required error={errors.branchCode} />
              <TextField label="Branch Name" labelHi="शाखेचे नाव" value={state.branchName} onChange={(v) => update("branchName", v)} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required />
              <DateField label="Join Date" labelHi="रुजू दिनांक" value={state.joinDate} onChange={(v) => update("joinDate", v)} placeholder="YYYY-MM-DD" required error={errors.joinDate} />
              <DateField label="Confirmation Date" labelHi="कायम नियुक्ती दिनांक" value={state.confirmationDate} onChange={(v) => update("confirmationDate", v)} placeholder="YYYY-MM-DD" required error={errors.confirmationDate} />
              <TextField label="Education" labelHi="शैक्षणिक पात्रता" value={state.education} onChange={(v) => update("education", v)} placeholder="name@company.com" icon={<ClipboardList size={16} />} required />
              <TextField label="Termination Reason" labelHi="सेवानिवृत्तीचे कारण" value={state.terminationReason} onChange={(v) => update("terminationReason", v)} placeholder="Enter Amount" icon={<FileText size={16} />} required error={errors.terminationReason} />
            </div>
          </div>
        </div>
      </FormModal>
      {isPickerOpen && <PicklistModal title="Employee List" columns={employeeColumns} rows={MOCK_TERMINATION_EMPLOYEES} rowKey={(r) => r.id} onSelect={(row) => { update("employeeNo", row.employeeNo); update("employeeName", row.name); update("designationCode", row.designationCode); update("designationName", row.designationName); update("branchCode", row.branchCode); update("branchName", row.branchName); setIsPickerOpen(false); }} onClose={() => setIsPickerOpen(false)} />}
      {showSuccess && <SuccessModal onClose={handleDone} onDone={handleDone} title="Employee Termination Saved Successfully" subtitle="The employee termination record has been processed successfully." />}
    </>
  );
}

// ============================================================
// EMPLOYEE TRANSFER ENTRY MODAL (ONLY ONE)
// ============================================================

interface TransferEmployee { id: string; employeeId: string; name: string; designationCode: string; designationName: string; branch: string; department: string; }
const MOCK_TRANSFER_EMPLOYEES: TransferEmployee[] = [
  { id: "1", employeeId: "EMP001", name: "Rahul Sharma", designationCode: "MGR", designationName: "Manager", branch: "Main Branch", department: "Operations" },
  { id: "2", employeeId: "EMP002", name: "Priya Patel", designationCode: "SRD", designationName: "Senior Developer", branch: "City Branch", department: "IT" },
];

function EmployeeTransferEntryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    const err = validateFields({ employeeType, transferId, employeeId, employeeName, designationCode, transferFromBranch, transferDate, transferToBranch, newDesignation, approvedDate, orderDate, remarks }, rules);
    setErrors(err);
    if (isFormValid(err)) setIsValidated(true);
  };

  const handleSave = () => { if (isValidated) setShowSuccess(true); };
  const handleDone = () => { setShowSuccess(false); onClose(); };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const employeeTypeOptions = [{ value: "New", label: "New" }, { value: "Amendment", label: "Amendment" }];
  const branchOptions = [{ value: "Main Branch", label: "Main Branch" }, { value: "City Branch", label: "City Branch" }];
  const employeeColumns = [{ key: "employeeId", header: "Employee ID" }, { key: "name", header: "Employee Name" }, { key: "designationCode", header: "Designation Code" }, { key: "branch", header: "Branch" }];

  return (
    <>
      <FormModal onClose={onClose} titleEn="Employee Transfer Entry" titleHi="कर्मचारी बदली नोंद" subtitleEn="Manage employee transfer details." subtitleHi="कर्मचाऱ्यांची बदली माहिती व्यवस्थापित करा." headerIcon={<div className="flex h-12 w-12 items-center justify-center"><Image src={IMAGES.USER} alt="Employee Transfer" width={48} height={48} /></div>} tabs={[]} activeTab="" onTabChange={() => {}} hideFooter maxWidth="max-w-6xl" customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Check className="h-4 w-4" /> Validate</button>
          <button onClick={handleSave} disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><ChevronsDown className="h-4 w-4" /> Save</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"><X className="h-4 w-4" /> Cancel</button>
        </div>
      }>
        <div className="p-1 flex flex-col gap-6">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Current Employee Details" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Current Employee Details / सध्याची कर्मचारी माहिती</h3><p className="mt-0.5 text-sm text-[#64748B]">Review the employee's existing branch, designation, and transfer information before processing the transfer.</p></div></div>
            <div className={grid4}>
              <SelectField label="Employee Type" labelHi="नोंद प्रकार" value={employeeType} onChange={setEmployeeType} options={employeeTypeOptions} placeholder="Select Employee Type" required error={errors.employeeType} />
              <TextField label="Transfer ID" labelHi="बदली आयडी" value={transferId} onChange={setTransferId} placeholder="Enter Amount" icon={<Hash size={16} />} required error={errors.transferId} />
              <PicklistField label="Employee ID" labelHi="कर्मचारी आयडी" value={employeeId} onOpenPicklist={() => setIsPickerOpen(true)} placeholder="Enter Amount" required error={errors.employeeId} />
              <TextField label="Employee Name" labelHi="कर्मचारी नाव" value={employeeName} onChange={setEmployeeName} placeholder="name@company.com" icon={<User size={16} />} required error={errors.employeeName} />
              <TextField label="Emp Designation Code" labelHi="कर्मचारी पद कोड" value={designationCode} onChange={setDesignationCode} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required error={errors.designationCode} />
              <TextField label="Employee Designation Name" labelHi="कर्मचारी पद नाव" value={designationName} onChange={setDesignationName} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required />
              <TextField label="Transfer From Branch" labelHi="सध्याची शाखा" value={transferFromBranch} onChange={setTransferFromBranch} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required error={errors.transferFromBranch} />
              <TextField label="Transfer From Department" labelHi="सध्याचा विभाग" value={transferFromDepartment} onChange={setTransferFromDepartment} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled />
              <TextField label="category code" labelHi="वर्ग कोड" value={categoryCode} onChange={setCategoryCode} placeholder="name@company.com" icon={<Hash size={16} />} required />
              <TextField label="category Name" labelHi="श्रेणीचे नाव" value={categoryName} onChange={setCategoryName} placeholder="name@company.com" icon={<Landmark size={16} />} required />
              <DateField label="Transfer Date" labelHi="बदली दिनांक" value={transferDate} onChange={setTransferDate} placeholder="YYYY-MM-DD" required error={errors.transferDate} />
            </div>
          </div>
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Transfer & Posting Details" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Transfer & Posting Details / बदली व नवीन पदस्थापना तपशील</h3><p className="mt-0.5 text-sm text-[#64748B]">Assign the employee's new branch, designation, reporting dates, and transfer remarks.</p></div></div>
            <div className={grid4}>
              <SelectField label="Transfer To Branch" labelHi="नवीन शाखा" value={transferToBranch} onChange={setTransferToBranch} options={branchOptions} placeholder="Enter Amount" required error={errors.transferToBranch} />
              <TextField label="New Designation" labelHi="नवीन पद" value={newDesignation} onChange={setNewDesignation} placeholder="Enter Amount" icon={<FileText size={16} />} required error={errors.newDesignation} />
              <DateField label="Approved Date" labelHi="मंजूरी दिनांक" value={approvedDate} onChange={setApprovedDate} placeholder="YYYY-MM-DD" required error={errors.approvedDate} />
              <DateField label="Order Date" labelHi="आदेश दिनांक" value={orderDate} onChange={setOrderDate} placeholder="YYYY-MM-DD" required error={errors.orderDate} />
              <DateField label="Relieving Date" labelHi="कार्यमुक्ती दिनांक" value={relievingDate} onChange={setRelievingDate} placeholder="YYYY-MM-DD" />
              <DateField label="Joining Date" labelHi="रुजू दिनांक" value={joiningDate} onChange={setJoiningDate} placeholder="YYYY-MM-DD" required />
              <TextField label="Remarks" labelHi="शेरा" value={remarks} onChange={setRemarks} placeholder="Enter Amount" icon={<FileText size={16} />} required error={errors.remarks} />
            </div>
          </div>
        </div>
      </FormModal>
      {isPickerOpen && <PicklistModal title="Employee List" columns={employeeColumns} rows={MOCK_TRANSFER_EMPLOYEES} rowKey={(r) => r.id} onSelect={(row) => { setEmployeeId(row.employeeId); setEmployeeName(row.name); setDesignationCode(row.designationCode); setDesignationName(row.designationName); setTransferFromBranch(row.branch); setTransferFromDepartment(row.department); setIsPickerOpen(false); }} onClose={() => setIsPickerOpen(false)} />}
      {showSuccess && <SuccessModal onClose={handleDone} onDone={handleDone} title="Employee Transfer Saved Successfully" subtitle="The employee transfer record has been processed successfully." />}
    </>
  );
}

// ============================================================
// LEAVE APPLICATION ENTRY MODAL
// ============================================================

interface LeaveEmployee { id: string; employeeCode: string; name: string; designationCode: string; designationName: string; branchCode: string; branchName: string; }
const MOCK_LEAVE_EMPLOYEES: LeaveEmployee[] = [
  { id: "1", employeeCode: "101", name: "Rohit Sharma", designationCode: "CLK", designationName: "Clerk", branchCode: "BR01", branchName: "Main Branch" },
  { id: "2", employeeCode: "102", name: "Sneha Joshi", designationCode: "OFF", designationName: "Officer", branchCode: "BR02", branchName: "City Branch" },
];

function LeaveApplicationEntryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    const err = validateFields({ recordId, employeeCode, employeeName, applicationDate, trnDate, natureOfLeave, periodOfLeaves, fromDate, toDate, leaveReason }, rules);
    setErrors(err);
    if (isFormValid(err)) setIsValidated(true);
  };

  const handleSave = () => { if (isValidated) setShowSuccess(true); };
  const handleDone = () => { setShowSuccess(false); onClose(); };

  const grid4 = "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4";
  const natureOfLeaveOptions = [{ value: "Sick Leave", label: "Sick Leave" }, { value: "Privilege Leave", label: "Privilege Leave" }, { value: "Casual Leave", label: "Casual Leave" }];
  const employeeColumns = [{ key: "employeeCode", header: "Emp Code" }, { key: "name", header: "Emp Name" }, { key: "designationCode", header: "Designation Code" }, { key: "branchName", header: "Branch Name" }];

  return (
    <>
      <FormModal onClose={onClose} titleEn="Leave Application Entry" titleHi="रजा अर्ज नोंद" subtitleEn="Manage leave application details." subtitleHi="रजा अर्ज माहिती व्यवस्थापित करा." headerIcon={<div className="flex h-12 w-12 items-center justify-center"><Image src={IMAGES.USER} alt="Leave Application" width={48} height={48} /></div>} tabs={[]} activeTab="" onTabChange={() => {}} hideFooter maxWidth="max-w-6xl" customFooter={
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Check className="h-4 w-4" /> Validate</button>
          <button disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><FileOutput className="h-4 w-4" /> Generate</button>
          <button onClick={handleSave} disabled={!isValidated} className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold ${isValidated ? "bg-[#1565D8] text-white hover:bg-blue-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}><ChevronsDown className="h-4 w-4" /> Save</button>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-slate-50"><X className="h-4 w-4" /> Cancel</button>
        </div>
      }>
        <div className="p-1 flex flex-col gap-5">
          <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center"><Image src={IMAGES.USER} alt="Leave Application" width={40} height={40} /></div><div><h3 className="text-base font-semibold text-[#111827]">Leave Application Details / रजा अर्ज तपशील</h3><p className="mt-0.5 text-sm text-[#64748B]">Create or manage leave application for an employee.</p></div></div>
            <div className={grid4}>
              <TextField label="Record Id" value={recordId} onChange={setRecordId} placeholder="Enter Amount" icon={<Hash size={16} />} required error={errors.recordId} />
              <PicklistField label="Employee Code" value={employeeCode} onOpenPicklist={() => setIsPickerOpen(true)} placeholder="Select Employee" required error={errors.employeeCode} />
              <TextField label="Employee Name" value={employeeName} onChange={setEmployeeName} placeholder="name@company.com" icon={<User size={16} />} required error={errors.employeeName} />
              <DateField label="Application Date" value={applicationDate} onChange={setApplicationDate} placeholder="YYYY-MM-DD" required error={errors.applicationDate} />
              <DateField label="TRN Date" value={trnDate} onChange={setTrnDate} placeholder="YYYY-MM-DD" required error={errors.trnDate} />
              <TextField label="Designation Code" value={designationCode} onChange={setDesignationCode} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required />
              <TextField label="Designation Name" value={designationName} onChange={setDesignationName} placeholder="name@company.com" icon={<FileText size={16} />} readOnly disabled required />
              <SelectField label="Nature Of Leave" value={natureOfLeave} onChange={setNatureOfLeave} options={natureOfLeaveOptions} placeholder="Select Leave Type" required error={errors.natureOfLeave} />
              <TextField label="Employee Branch Code" value={employeeBranchCode} onChange={setEmployeeBranchCode} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required />
              <TextField label="Employee Branch Name" value={employeeBranchName} onChange={setEmployeeBranchName} placeholder="name@company.com" icon={<Building size={16} />} readOnly disabled required />
              <TextField label="Previous Balance" value={previousBalance} onChange={setPreviousBalance} placeholder="Enter Amount" icon={<Landmark size={16} />} readOnly disabled required />
              <TextField label="Current Balance" value={currentBalance} onChange={setCurrentBalance} placeholder="Enter Amount" icon={<Landmark size={16} />} readOnly disabled required />
              <TextField label="Period of Leaves" value={periodOfLeaves} onChange={setPeriodOfLeaves} placeholder="Enter Amount" icon={<ClipboardList size={16} />} required error={errors.periodOfLeaves} />
              <DateField label="From Date" value={fromDate} onChange={setFromDate} placeholder="YYYY-MM-DD" required error={errors.fromDate} />
              <DateField label="To Date" value={toDate} onChange={setToDate} placeholder="YYYY-MM-DD" required error={errors.toDate} />
              <div className="flex min-w-0 flex-col">
                <label className="mb-1.5 block truncate text-sm font-medium text-[#1F2858]">Leave Type</label>
                <div className="flex h-11 items-center gap-5">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"><input type="radio" name="leaveType" checked={leaveType === "Paid"} onChange={() => setLeaveType("Paid")} className="h-4 w-4 accent-primary" /> Paid</label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"><input type="radio" name="leaveType" checked={leaveType === "Unpaid"} onChange={() => setLeaveType("Unpaid")} className="h-4 w-4 accent-primary" /> Unpaid</label>
                </div>
              </div>
              <TextField label="Leave Reason" value={leaveReason} onChange={setLeaveReason} placeholder="Enter Amount" icon={<FileText size={16} />} required error={errors.leaveReason} />
            </div>
          </div>
        </div>
      </FormModal>
      {isPickerOpen && <PicklistModal title="Employee List" columns={employeeColumns} rows={MOCK_LEAVE_EMPLOYEES} rowKey={(r) => r.id} onSelect={(row) => { setEmployeeCode(row.employeeCode); setEmployeeName(row.name); setDesignationCode(row.designationCode); setDesignationName(row.designationName); setEmployeeBranchCode(row.branchCode); setEmployeeBranchName(row.branchName); setIsPickerOpen(false); }} onClose={() => setIsPickerOpen(false)}  />}
      {showSuccess && <SuccessModal onClose={handleDone} onDone={handleDone} title="Leave Application Saved Successfully" subtitle="The leave application record has been processed successfully." />}
    </>
  );
}

// ============================================================
// MASTER CARD LIST
// ============================================================

type MasterMenuItem = { id: string; title: string; description: string; icon: string };

const MASTER_ITEMS: MasterMenuItem[] = [
  { id: "employee-deputation", title: "Employee Deputation", description: "Configure employee deputation details", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "employee-promotion", title: "Employee Promotion", description: "Configure employee promotion details", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "employee-resignation", title: "Employee Resignation", description: "Configure employee resignation details", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "employee-transfer-entry", title: "Employee Transfer Entry", description: "Configure employee transfer details", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "leave-application-entry", title: "Leave Application Entry", description: "Configure leave application details", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "employee-suspension", title: "Employee Suspension Information", description: "Configure employee suspension details", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
  { id: "employee-termination", title: "Employee Termination", description: "Configure employee termination details", icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON },
];

function MasterCard({ item, onOpen }: { item: MasterMenuItem; onOpen?: (item: MasterMenuItem) => void }) {
  return (
    <div role="button" tabIndex={0} onClick={() => onOpen?.(item)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen?.(item); }} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"><Image src={item.icon} alt="" width={56} height={56} className="h-full w-full object-contain" /></div>
      <div className="min-w-0 flex-1"><h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">{item.title}</h3><p className="text-sm text-[#64748B] dark:text-slate-400">{item.description}</p></div>
      <button type="button" onClick={(e) => { e.stopPropagation(); onOpen?.(item); }} className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white">Open <ChevronRight size={16} /></button>
    </div>
  );
}

// ============================================================
// MASTER PAGE
// ============================================================

export default function EmployeeMasterPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MASTER_ITEMS;
    return MASTER_ITEMS.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav titleEn="Employee Master" breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Payroll", onClick: () => router.push("/payroll/master") }, { label: "Employee Master", href: "#" }]} onBack={() => router.back()} />
      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <AuthorizeHero title="Transaction Entry" query={query} onQueryChange={setQuery} />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => <MasterCard key={item.id} item={item} onOpen={(i) => setActiveModal(i.id)} />)}
          {filteredItems.length === 0 && <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">No records found.</p>}
        </div>
      </div>
      <EmployeeDeputationModal open={activeModal === "employee-deputation"} onClose={() => setActiveModal(null)} />
      <EmployeePromotionModal open={activeModal === "employee-promotion"} onClose={() => setActiveModal(null)} />
      <EmployeeResignationModal open={activeModal === "employee-resignation"} onClose={() => setActiveModal(null)} />
      <EmployeeTransferEntryModal open={activeModal === "employee-transfer-entry"} onClose={() => setActiveModal(null)} />
      <LeaveApplicationEntryModal open={activeModal === "leave-application-entry"} onClose={() => setActiveModal(null)} />
      <EmployeeSuspensionInformationModal open={activeModal === "employee-suspension"} onClose={() => setActiveModal(null)} />
      <EmployeeTerminationModal open={activeModal === "employee-termination"} onClose={() => setActiveModal(null)} />
    </div>
  );
}