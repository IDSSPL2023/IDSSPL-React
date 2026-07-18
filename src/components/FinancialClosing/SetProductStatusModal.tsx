import { useState, useEffect } from "react";
import { Check, X, ChevronDown, MoreVertical, PlusCircle, SquarePen, UserRound, ThumbsUp, Landmark, FileText, Hash, Calendar } from "lucide-react";
import ListModal from "../AccountMaster/ListModal";
import SuccessModal from "../shared/SuccessModal";
import { useBilingual } from "@/i18n/useBilingual";

type Mode = "add" | "view" | "edit";

export interface ProductFormData {
  type: string;
  description: string;
  productCode: string;
  productName: string; // populated from the picklist's "Description" column
  interestApplyDate: string;
  interestFlag: "Yes" | "No" | "";
}

interface ProductPickRow {
  code: string;
  description: string;
}

const MODE_META: Record<Mode, { icon: any }> = {
  add: { icon: PlusCircle },
  edit: { icon: SquarePen },
  view: { icon: UserRound },
};

const DEFAULT_DATA: ProductFormData = {
  type: "",
  description: "",
  productCode: "",
  productName: "",
  interestApplyDate: "",
  interestFlag: "",
};

// Sample data — replace with your actual sub-product source
const PRODUCT_ROWS: ProductPickRow[] = [
  { code: "401", description: "Fixed Deposit Monthly" },
  { code: "402", description: "Fixed Deposit Quarterly" },
  { code: "403", description: "Staff Security Deposit" },
  { code: "404", description: "Fixed Deposit Half Year" },
  { code: "405", description: "Fixed Deposit Yearly" },
  { code: "406", description: "Fixed Deposit Yearly" },
  { code: "407", description: "Matured Cash Certificate" },
  { code: "408", description: "Pigmy Agent Security Deposit" },
  { code: "409", description: "Cumulative Deposit" },
  { code: "410", description: "Fixed Deposit On Maturity" },
  { code: "411", description: "Matured Fixed Deposit" },
  { code: "412", description: "Cash Certificate" },
];

interface SetProductStatusModalProps {
  open: boolean;
  mode?: Mode;
  accountType?: "loan" | "deposit";
  initialData?: Partial<ProductFormData>;
  onClose?: () => void;
  onSave?: (data: ProductFormData) => void;
}

export default function SetProductStatusModal({
  open,
  mode = "add",
  accountType = "loan",
  initialData,
  onClose,
  onSave,
}: SetProductStatusModalProps) {
  const { en } = useBilingual();
  const [data, setData] = useState<ProductFormData>({ ...DEFAULT_DATA, ...initialData });
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  // Only Add lets you pick a product. Both Add and Edit allow changing the
  // date and the interest flag — everything else stays disabled in Edit.
  const canPickProduct = isAdd;
  const canEditDate = isAdd || isEdit;
  const canEditFlag = isAdd || isEdit;

  const getAutoFillFor = (type: "loan" | "deposit") =>
    type === "deposit"
      ? { type: "TD", description: en("Term Deposit") }
      : { type: "TL", description: en("Term Loan") };

  // Native <input type="date"> only accepts "yyyy-mm-dd". Data coming in
  // from initialData/APIs is often "dd/mm/yyyy", "dd-Mon-yyyy", etc., which
  // the input silently renders as blank. Normalize anything parseable.
  const toIsoDate = (value?: string): string => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value; // already ISO

    const ddmmyyyy = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (ddmmyyyy) {
      const [, d, m, y] = ddmmyyyy;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }

    return ""; // unparseable — leave blank rather than crash
  };

  useEffect(() => {
    if (!open) return;
    // Type/Description are always derived from accountType, in every mode —
    // never taken from initialData, since they aren't stored per-record.
    const autoFill = getAutoFillFor(accountType);
    const newData: ProductFormData = {
      ...DEFAULT_DATA,
      ...initialData,
      type: autoFill.type,
      description: autoFill.description,
      interestApplyDate: toIsoDate(initialData?.interestApplyDate),
    };
    setData(newData);
    setErrors({});
    setIsValidated(false);
    setProductPickerOpen(false);
    setSaveMenuOpen(false);
    setSuccessOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, mode, accountType]);

  if (!open) return null;

  const titleEn = isAdd ? "Add Product Status" : isEdit ? "Edit Product Status" : "View Product Status";
  const titleHi = isAdd ? "उत्पादन स्थिती जोडा" : isEdit ? "उत्पादन स्थिती संपादित करा" : "उत्पादन स्थिती पहा";
  const subEn = isAdd
    ? "Fill in the details below to create a new product status."
    : isEdit
      ? "Review and update the details below as needed."
      : "View the product status information and associated details.";
  const subHi = isAdd
    ? "नवीन उत्पादन स्थिती तयार करण्यासाठी खालील तपशील भरा."
    : isEdit
      ? "आवश्यकतेनुसार खालील तपशील तपासा व अद्ययावत करा."
      : "उत्पादन स्थितीची माहिती आणि संबंधित तपशील पहा.";

  const HeaderIcon = MODE_META[mode].icon;

  const markDirty = (key: keyof ProductFormData) => {
    setIsValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const setField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    markDirty(key);
  };

  const runValidation = () => {
    const nextErrors: Record<string, boolean> = {};
    if (!data.type.trim()) nextErrors.type = true;
    if (!data.description.trim()) nextErrors.description = true;
    if (!data.productCode.trim()) nextErrors.productCode = true;
    if (!data.productName.trim()) nextErrors.productName = true;
    if (!data.interestApplyDate.trim()) nextErrors.interestApplyDate = true;
    if (!data.interestFlag.trim()) nextErrors.interestFlag = true;
    setErrors(nextErrors);
    const isValid = Object.keys(nextErrors).length === 0;
    setIsValidated(isValid);
    return isValid;
  };

  const handleValidate = () => runValidation();

  const performSave = () => {
    setSaveMenuOpen(false);
    if (!runValidation()) return;
    onSave?.(data);
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    onClose?.();
  };

  const handleProductPick = (row: ProductPickRow) => {
    setData((prev) => ({ ...prev, productCode: row.code, productName: row.description }));
    setProductPickerOpen(false);
    markDirty("productCode");
    markDirty("productName");
  };

  const inputShell = (opts: { readOnly: boolean; error?: boolean }) =>
    `flex h-11 items-center rounded-lg border bg-white px-3 transition-colors dark:bg-slate-900 ${
      opts.error
        ? "border-red-400"
        : opts.readOnly
          ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
          : "border-[#B8C2D6] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700"
    }`;

  const inputText = (readOnly: boolean) =>
    `ml-3 w-full bg-transparent text-[15px] outline-none ${
      readOnly ? "text-slate-500 dark:text-slate-400" : "text-[#4B5563] dark:text-slate-100"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-[820px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
              <HeaderIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                {titleEn} <span className="font-bold text-[#64748B] dark:text-slate-400">/ {titleHi}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subEn} / {subHi}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <div className="mt-4 bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          {/* Account Type — always read-only, derived from account type */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
              Account Type <span className="font-medium text-gray-500 dark:text-slate-400">/ खात्याचा प्रकार</span>
              <span className="text-red-500">*</span>
            </label>
            <div className={inputShell({ readOnly: true, error: errors.type })}>
              <Landmark size={18} className="shrink-0 text-[#6B7280]" />
              <input type="text" readOnly value={data.type} className={inputText(true)} />
            </div>
            {errors.type && <p className="mt-1 text-xs text-red-500">This field is required</p>}
          </div>

          {/* Description (from account type) — always read-only */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
              Description <span className="font-medium text-gray-500 dark:text-slate-400">/ वर्णन</span>
              <span className="text-red-500">*</span>
            </label>
            <div className={inputShell({ readOnly: true, error: errors.description })}>
              <FileText size={18} className="shrink-0 text-[#6B7280]" />
              <input type="text" readOnly value={data.description} className={inputText(true)} />
            </div>
            {errors.description && <p className="mt-1 text-xs text-red-500">This field is required</p>}
          </div>

          {/* Product Code — pickable only in Add mode */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
              Product Code <span className="font-medium text-gray-500 dark:text-slate-400">/ उत्पादन कोड</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className={`flex-1 ${inputShell({ readOnly: !canPickProduct, error: errors.productCode })}`}>
                <Hash size={18} className="shrink-0 text-[#6B7280]" />
                <input type="text" readOnly value={data.productCode} className={inputText(true)} />
              </div>
              {canPickProduct && (
                <button
                  type="button"
                  title="Search products"
                  onClick={() => setProductPickerOpen(true)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
                >
                  <MoreVertical size={18} />
                </button>
              )}
            </div>
            {errors.productCode && <p className="mt-1 text-xs text-red-500">This field is required</p>}
          </div>

          {/* Description (from selected product) — always read-only */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
              Description <span className="font-medium text-gray-500 dark:text-slate-400">/ वर्णन</span>
              <span className="text-red-500">*</span>
            </label>
            <div className={inputShell({ readOnly: true, error: errors.productName })}>
              <FileText size={18} className="shrink-0 text-[#6B7280]" />
              <input type="text" readOnly value={data.productName} className={inputText(true)} />
            </div>
            {errors.productName && <p className="mt-1 text-xs text-red-500">This field is required</p>}
          </div>

          {/* Interest Apply Date — editable only in Edit mode */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
              Interest Apply Date <span className="font-medium text-gray-500 dark:text-slate-400">/ व्याज लागू होण्याची तारीख</span>
              <span className="text-red-500">*</span>
            </label>
            <div className={inputShell({ readOnly: !canEditDate, error: errors.interestApplyDate })}>
              <Calendar size={18} className="shrink-0 text-[#6B7280]" />
              <input
                type="date"
                readOnly={!canEditDate}
                disabled={!canEditDate}
                value={data.interestApplyDate}
                onChange={(e) => setField("interestApplyDate", e.target.value)}
                className={inputText(!canEditDate)}
              />
            </div>
            {errors.interestApplyDate && <p className="mt-1 text-xs text-red-500">This field is required</p>}
          </div>

          {/* Interest Flag — Yes / No radio, editable only in Add mode */}
          <div className="mb-0 flex  gap-3">
            <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
              Interest Flag <span className="font-medium text-gray-500 dark:text-slate-400">/ व्याज लागू खूण</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-6">
              {(["Yes", "No"] as const).map((opt) => (
                <label
                  key={opt}
                  className={`inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 ${
                    canEditFlag ? "cursor-pointer" : "cursor-not-allowed opacity-70"
                  }`}
                >
                  <input
                    type="radio"
                    name="interestFlag"
                    value={opt}
                    disabled={!canEditFlag}
                    checked={data.interestFlag === opt}
                    onChange={() => setField("interestFlag", opt)}
                    className="h-4 w-4"
                    style={{ accentColor: "#1F67F4" }}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {errors.interestFlag && <p className="mt-1 text-xs text-red-500">This field is required</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          {isView ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
              >
                Cancel <X size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Ok, Got It <ThumbsUp size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleValidate}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Validate <Check size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
              >
                Cancel <X size={16} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  disabled={!isValidated}
                  onClick={() => isValidated && setSaveMenuOpen((o) => !o)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isValidated
                      ? "bg-primary-100 text-primary hover:bg-primary-200"
                      : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                  }`}
                >
                  Save <ChevronDown size={16} />
                </button>
                {saveMenuOpen && isValidated && (
                  <div className="absolute bottom-12 right-0 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <button
                      type="button"
                      onClick={performSave}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sub Product List picklist — Add mode only */}
      {canPickProduct && productPickerOpen && (
        <ListModal
          title={en("setProductStatus.pickerTitle") || "Sub Product List"}
          columns={[
            { key: "code", label: en("setProductStatus.fields.productCode") || "Product Code" },
            { key: "description", label: en("setProductStatus.fields.description") || "Description" },
          ]}
          rows={PRODUCT_ROWS}
          onSelect={handleProductPick}
          onClose={() => setProductPickerOpen(false)}
        />
      )}

      {successOpen && (
        <SuccessModal
          variant="success"
          title={
            en("setProductStatus.successTitle") ||
            (isAdd ? "Product Status Added Successfully" : "Product Status Updated Successfully")
          }
          subtitle={en("setProductStatus.successSubtitle") || ""}
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </div>
  );
}