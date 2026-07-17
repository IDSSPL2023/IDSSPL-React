import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  Landmark,
  Package,
  FileText,
  IndianRupee,
  Hash,
  Calendar,
  Check,
  X,
  MoreVertical,
  Upload,
  HandCoins,
  FileCheck2,
  ArrowLeftRight,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SelectInput, DateInput } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import ListModal from "@/components/AccountMaster/ListModal";
import Pagination from "@/components/shared/Pagination";

type PickRow = { code: string; name: string };

const BRANCH_LIST: PickRow[] = [
  { code: "0002", name: "Balaji Branch" },
  { code: "0003", name: "Main Branch" },
];

const PRODUCT_LIST: PickRow[] = [
  { code: "0002", name: "PG Import Product" },
  { code: "0005", name: "PG Standard Product" },
];

const CONTRA_HEAD_LIST: PickRow[] = [
  { code: "TRDR", name: "Transfer Debit Head" },
  { code: "TRCR", name: "Transfer Credit Head" },
];

const RECON_CODE_LIST: PickRow[] = [
  { code: "RC01", name: "PG Reconciliation Code" },
  { code: "RC02", name: "PG Suspense Code" },
];

const MACHINE_TYPE_OPTIONS = ["Balaji", "Main Branch", "Sub Branch"];
const TRANSACTION_TYPE_OPTIONS = ["Credit", "Debit"];

type PickerStringField =
  | "branchCode"
  | "branchName"
  | "productCode"
  | "productDescription"
  | "contraAccountHead"
  | "contraDescription"
  | "reconCode"
  | "reconDescription";
type PickerField = "branchCode" | "productCode" | "contraAccountHead" | "reconCode";

const PICKER_CONFIG: Record<
  PickerField,
  { title: string; codeField: PickerStringField; nameField: PickerStringField; codeLabel: string; nameLabel: string; rows: PickRow[] }
> = {
  branchCode: { title: "Branch List", codeField: "branchCode", nameField: "branchName", codeLabel: "Branch Code", nameLabel: "Branch Name", rows: BRANCH_LIST },
  productCode: { title: "Product List", codeField: "productCode", nameField: "productDescription", codeLabel: "Product Code", nameLabel: "Description", rows: PRODUCT_LIST },
  contraAccountHead: { title: "Contra Account Head List", codeField: "contraAccountHead", nameField: "contraDescription", codeLabel: "Head Code", nameLabel: "Description", rows: CONTRA_HEAD_LIST },
  reconCode: { title: "Recon Code List", codeField: "reconCode", nameField: "reconDescription", codeLabel: "Recon Code", nameLabel: "Description", rows: RECON_CODE_LIST },
};

export interface NewPgTransactionImportFormData {
  machineType: string;
  branchCode: string;
  branchName: string;
  totalAmount: string;
  productCode: string;
  productDescription: string;
  contraAccountHead: string;
  contraDescription: string;
  reconCode: string;
  reconDescription: string;
  adviceNo: string;
  adviceDate: string;
  transactionType: string;
  particular: string;
  contraHeadParticular: string;
}

export const DEFAULT_NEW_PG_TRANSACTION_IMPORT_DATA: NewPgTransactionImportFormData = {
  machineType: "Balaji",
  branchCode: "0002",
  branchName: "Balaji Branch",
  totalAmount: "1,00,000.00",
  productCode: "0002",
  productDescription: "PG Import Product",
  contraAccountHead: "TRDR",
  contraDescription: "Transfer Debit Head",
  reconCode: "RC01",
  reconDescription: "PG Reconciliation Code",
  adviceNo: "ADV/2026/0001",
  adviceDate: "2026-07-17",
  transactionType: "Credit",
  particular: "PG Import Transaction",
  contraHeadParticular: "PG Import Contra Entry",
};

const TEXT_FIELD_KEYS: (keyof NewPgTransactionImportFormData)[] = [
  "machineType",
  "branchCode",
  "branchName",
  "totalAmount",
  "productCode",
  "productDescription",
  "contraAccountHead",
  "contraDescription",
  "reconCode",
  "reconDescription",
  "adviceNo",
  "adviceDate",
  "transactionType",
  "particular",
  "contraHeadParticular",
];

const validateNewPgTransactionImport = (
  data: NewPgTransactionImportFormData
): Record<keyof NewPgTransactionImportFormData, boolean> => {
  const isEmpty = (v: string) => v.trim() === "";
  const errors = {} as Record<keyof NewPgTransactionImportFormData, boolean>;
  TEXT_FIELD_KEYS.forEach((key) => {
    errors[key] = isEmpty(data[key] as string);
  });
  return errors;
};

const checkAmountForImport = () => new Promise<void>((resolve) => setTimeout(resolve, 500));

const createNewPgTransactionImport = (data: NewPgTransactionImportFormData) =>
  new Promise<NewPgTransactionImportFormData>((resolve) => setTimeout(() => resolve(data), 600));

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const LookupTrigger = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary transition hover:bg-[#DDEAFF]"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

interface ImportAccountRow {
  id: string;
  accountCode: string;
  name: string;
  account1: string;
  account2: string;
  account3: string;
  account4: string;
  account5: string;
  account6: string;
  account7: string;
}

/** Account 1 & 2 hold linked/mapped account references; Account 3-7 hold amounts. */
const LINKED_ACCOUNT_FIELDS = ["account1", "account2"] as const;
const AMOUNT_ACCOUNT_FIELDS = ["account3", "account4", "account5", "account6", "account7"] as const;

const ACCOUNT_TABLE_COLUMNS: { key: string; label: string }[] = [
  { key: "accountCode", label: "Account Code" },
  { key: "name", label: "Name" },
  { key: "account1", label: "Account 1" },
  { key: "account2", label: "Account 2" },
  { key: "account3", label: "Account 3" },
  { key: "account4", label: "Account 4" },
  { key: "account5", label: "Account 5" },
  { key: "account6", label: "Account 6" },
  { key: "account7", label: "Account 7" },
  { key: "totalAccount", label: "Total Account" },
];

const NAME_SAMPLES = ["Null", "Active", "Pending", "Completed", "Canceled", "In Progress"];
const HEAD_CODE_SAMPLES = ["E", "A", "B", "C", "D"];

const buildAccountRows = (count: number): ImportAccountRow[] =>
  Array.from({ length: count }, (_, i) => {
    const step = i % 5;
    return {
      id: `row-${i + 1}`,
      accountCode: `0000000040${String(120 + i).padStart(4, "0")}`,
      name: NAME_SAMPLES[i % NAME_SAMPLES.length],
      account1: "100.0",
      account2: "50",
      account3: String(50 + step * 25),
      account4: HEAD_CODE_SAMPLES[step],
      account5: (step * 0.6).toFixed(1),
      account6: (step * 0.5).toFixed(1),
      account7: String(step),
    };
  });

/** Total Account is a read-only sum of the numeric account columns. */
const computeRowTotal = (row: ImportAccountRow) =>
  AMOUNT_ACCOUNT_FIELDS.reduce((sum, field) => sum + (parseFloat(row[field]) || 0), 0).toFixed(1);

const TABLE_PAGE_SIZE = 10;

export interface AddNewPgTransactionImportProps {
  onClose: () => void;
  onSave?: (data: NewPgTransactionImportFormData) => void;
  variant?: "modal" | "page";
}

const AddNewPgTransactionImport = ({ onClose, onSave, variant = "modal" }: AddNewPgTransactionImportProps) => {
  const [form, setForm] = useState<NewPgTransactionImportFormData>(DEFAULT_NEW_PG_TRANSACTION_IMPORT_DATA);
  const [isValidated, setIsValidated] = useState(false);
  const [isAmountChecked, setIsAmountChecked] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewPgTransactionImportFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<ImportAccountRow[]>(() => buildAccountRows(42));
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({ "row-1": true });
  const [page, setPage] = useState(1);

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const totalPages = Math.max(1, Math.ceil(rows.length / TABLE_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => rows.slice((currentPage - 1) * TABLE_PAGE_SIZE, currentPage * TABLE_PAGE_SIZE),
    [rows, currentPage]
  );
  const isPageFullySelected = pageRows.length > 0 && pageRows.every((r) => selectedRows[r.id]);

  const markDirty = (field: keyof NewPgTransactionImportFormData) => {
    setIsValidated(false);
    setIsAmountChecked(false);
    setErrors((e) => (e[field] ? { ...e, [field]: false } : e));
  };

  const updateField = (field: keyof NewPgTransactionImportFormData, value: string) => {
    markDirty(field);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePickRow = (row: PickRow) => {
    if (!activePicker) return;
    const { codeField, nameField } = PICKER_CONFIG[activePicker];
    markDirty(codeField);
    markDirty(nameField);
    setForm((f) => ({ ...f, [codeField]: row.code, [nameField]: row.name }));
    setActivePicker(null);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success(`${file.name} imported successfully.`);
    }
    e.target.value = "";
  };

  const toggleRowSelected = (id: string, checked: boolean) => {
    setSelectedRows((s) => ({ ...s, [id]: checked }));
  };

  const toggleSelectAllOnPage = (checked: boolean) => {
    setSelectedRows((s) => {
      const next = { ...s };
      pageRows.forEach((r) => {
        next[r.id] = checked;
      });
      return next;
    });
  };

  const updateRowField = (id: string, field: keyof Omit<ImportAccountRow, "id">, value: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleValidate = () => {
    const newErrors = validateNewPgTransactionImport(form);
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    setIsValidated(!hasErrors);
    setIsAmountChecked(false);
    if (hasErrors) {
      toast.error("Please fill all required fields before validating.");
    } else {
      toast.success("All fields validated successfully.");
    }
  };

  const handleCheckAmount = async () => {
    if (!isValidated || isChecking) return;
    setIsChecking(true);
    await checkAmountForImport();
    setIsChecking(false);
    setIsAmountChecked(true);
    toast.success("Amount checked successfully.");
  };

  const handleCreateTransaction = async () => {
    if (!isAmountChecked || isSaving) return;
    setIsSaving(true);
    await createNewPgTransactionImport(form);
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setForm(DEFAULT_NEW_PG_TRANSACTION_IMPORT_DATA);
    setErrors({});
    setIsValidated(false);
    setIsAmountChecked(false);
    setFileName("");
    onClose();
  };

  const handleSuccessDone = () => {
    onSave?.(form);
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        onDone={handleSuccessDone}
        title="PG Transaction Import Created Successfully"
        subtitle="Please Authorize"
      />
    );
  }

  return (
    <FormModal
      onClose={handleCancel}
      titleEn="Transaction Details"
      titleHi="व्यवहाराचा तपशील"
      subtitleEn="Search and verify the customer's account before initiating the transfer."
      subtitleHi="हस्तांतरणापूर्वी खात्याची माहिती तपासा."
      headerIcon={<SectionIcon />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      headerActions={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1.5 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary-50"
          >
            Import
            <Upload size={16} />
          </button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
          <div className="flex h-10 min-w-[200px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600">
            <FileText size={16} className="shrink-0 text-slate-400" />
            <span className="truncate">{fileName || "No file selected"}</span>
          </div>
        </div>
      }
      hideFooter
      variant={variant}
      customFooter={
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
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
            onClick={handleCheckAmount}
            disabled={!isValidated || isChecking}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isValidated && !isChecking
                ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isChecking ? "Checking..." : "Check Amount"}
            <HandCoins className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleCreateTransaction}
            disabled={!isAmountChecked || isSaving}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              isAmountChecked && !isSaving
                ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Creating..." : "Create Transaction"}
            <FileCheck2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <div className={grid4}>
          <FieldShell label="Machine Type" labelHi="यंत्राचा प्रकार" required error={errors.machineType}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.machineType}
              onChange={(v) => updateField("machineType", v)}
              options={MACHINE_TYPE_OPTIONS}
              placeholder="Select Machine Type"
              error={errors.machineType}
            />
          </FieldShell>

          <FieldShell label="Branch Code" labelHi="शाखा कोड" required error={errors.branchCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Landmark size={16} />}
                  value={form.branchCode}
                  onChange={(v) => updateField("branchCode", v)}
                  placeholder="Select Account Code"
                  error={errors.branchCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("branchCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Branch Name" labelHi="शाखेचे नाव" required error={errors.branchName}>
            <TextInput icon={<User size={16} />} value={form.branchName} onChange={() => {}} readOnly error={errors.branchName} />
          </FieldShell>

          <FieldShell label="Total Amount" labelHi="एकूण रक्कम" required error={errors.totalAmount}>
            <TextInput
              icon={<IndianRupee size={16} />}
              value={form.totalAmount}
              onChange={() => {}}
              readOnly
              error={errors.totalAmount}
            />
          </FieldShell>

          <FieldShell label="Product Code" labelHi="उत्पादन क्रमांक" required error={errors.productCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Package size={16} />}
                  value={form.productCode}
                  onChange={(v) => updateField("productCode", v)}
                  placeholder="Enter Product Code"
                  error={errors.productCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("productCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Description" labelHi="वर्णन" required error={errors.productDescription}>
            <TextInput icon={<FileText size={16} />} value={form.productDescription} onChange={() => {}} readOnly error={errors.productDescription} />
          </FieldShell>

          <FieldShell label="Contra Account Head" labelHi="प्रतिखाते शीर्षक" required error={errors.contraAccountHead}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.contraAccountHead}
                  onChange={(v) => updateField("contraAccountHead", v)}
                  placeholder="Enter Description"
                  error={errors.contraAccountHead}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("contraAccountHead")} />
            </div>
          </FieldShell>

          <FieldShell label="Description" labelHi="वर्णन" required error={errors.contraDescription}>
            <TextInput icon={<FileText size={16} />} value={form.contraDescription} onChange={() => {}} readOnly error={errors.contraDescription} />
          </FieldShell>

          <FieldShell label="Recon. Code" labelHi="जुळणी कोड" required error={errors.reconCode}>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  icon={<Hash size={16} />}
                  value={form.reconCode}
                  onChange={(v) => updateField("reconCode", v)}
                  placeholder="Enter Description"
                  error={errors.reconCode}
                />
              </div>
              <LookupTrigger onClick={() => setActivePicker("reconCode")} />
            </div>
          </FieldShell>

          <FieldShell label="Description" labelHi="वर्णन" required error={errors.reconDescription}>
            <TextInput icon={<FileText size={16} />} value={form.reconDescription} onChange={() => {}} readOnly error={errors.reconDescription} />
          </FieldShell>

          <FieldShell label="Advice No." labelHi="सल्ला क्रमांक" required error={errors.adviceNo}>
            <TextInput
              icon={<Hash size={16} />}
              value={form.adviceNo}
              onChange={() => {}}
              readOnly
              error={errors.adviceNo}
            />
          </FieldShell>

          <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required error={errors.adviceDate}>
            <DateInput value={form.adviceDate} onChange={() => {}} readOnly error={errors.adviceDate} />
          </FieldShell>

          <FieldShell label="Transaction Type" labelHi="व्यवहाराचा प्रकार" required error={errors.transactionType}>
            <SelectInput
              icon={<FileText size={16} />}
              value={form.transactionType}
              onChange={() => {}}
              options={TRANSACTION_TYPE_OPTIONS}
              placeholder="Select Transaction Type"
              error={errors.transactionType}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Particular" labelHi="तपशील" required error={errors.particular}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.particular}
              onChange={() => {}}
              readOnly
              error={errors.particular}
            />
          </FieldShell>

          <FieldShell label="Contra Head Particular" labelHi="प्रतिखाते तपशील" required error={errors.contraHeadParticular}>
            <TextInput
              icon={<FileText size={16} />}
              value={form.contraHeadParticular}
              onChange={() => {}}
              readOnly
              error={errors.contraHeadParticular}
            />
          </FieldShell>
        </div>
      </div>

      <div className="mt-6 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[1300px] table-fixed border-collapse">
            <thead>
              <tr className="bg-[#1e1b4b]">
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isPageFullySelected}
                    onChange={(e) => toggleSelectAllOnPage(e.target.checked)}
                    className="h-4 w-4 accent-white"
                  />
                </th>
                {ACCOUNT_TABLE_COLUMNS.map((col) => (
                  <th key={col.key} className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-white">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, idx) => {
                const isSelected = !!selectedRows[row.id];
                return (
                  <tr
                    key={row.id}
                    className={`${idx !== pageRows.length - 1 ? "border-b border-gray-100" : ""} ${
                      isSelected ? "bg-primary-50/40" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleRowSelected(row.id, e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                    <td className="truncate px-4 py-2.5 text-sm font-medium text-slate-800">{row.accountCode}</td>
                    <td className="px-4 py-2.5">
                      <input
                        value={row.name}
                        onChange={(e) => updateRowField(row.id, "name", e.target.value)}
                        className={`w-full rounded-md border px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                          isSelected ? "border-[#0A66D8] bg-white" : "border-slate-200 bg-slate-50"
                        }`}
                      />
                    </td>
                    {LINKED_ACCOUNT_FIELDS.map((field) => (
                      <td key={field} className="px-4 py-2.5">
                        <div className="relative">
                          <ArrowLeftRight size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-primary" />
                          <input
                            value={row[field]}
                            onChange={(e) => updateRowField(row.id, field, e.target.value)}
                            className={`w-full rounded-md border py-1.5 pl-6 pr-2 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                              isSelected ? "border-[#0A66D8] bg-white" : "border-[#B8D4FF] bg-[#F5F9FF]"
                            }`}
                          />
                        </div>
                      </td>
                    ))}
                    {AMOUNT_ACCOUNT_FIELDS.map((field) => (
                      <td key={field} className="px-4 py-2.5">
                        <div className="relative">
                          <IndianRupee size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            value={row[field]}
                            onChange={(e) => updateRowField(row.id, field, e.target.value)}
                            className={`w-full rounded-md border py-1.5 pl-6 pr-2 text-sm text-slate-700 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${
                              isSelected ? "border-[#0A66D8] bg-white" : "border-slate-200 bg-slate-50"
                            }`}
                          />
                        </div>
                      </td>
                    ))}
                    <td className="px-4 py-2.5">
                      <div className="relative">
                        <IndianRupee size={12} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#6A7282]" />
                        <div className="w-full rounded-md border border-[#6A7282] bg-[#F3F4F6] py-1.5 pl-6 pr-2 text-sm text-slate-700">
                          {computeRowTotal(row)}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {activePicker && (
        <ListModal
          title={PICKER_CONFIG[activePicker].title}
          columns={[
            { key: "code", label: PICKER_CONFIG[activePicker].codeLabel },
            { key: "name", label: PICKER_CONFIG[activePicker].nameLabel },
          ]}
          rows={PICKER_CONFIG[activePicker].rows}
          onSelect={handlePickRow}
          onClose={() => setActivePicker(null)}
        />
      )}
    </FormModal>
  );
};

export default AddNewPgTransactionImport;
