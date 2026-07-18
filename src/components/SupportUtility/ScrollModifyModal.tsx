// @ts-nocheck
import { useMemo, useState } from "react";
import { X, UserRound, MoreVertical, FileSearch, Ban, Hash, FileText } from "lucide-react";
import { getScrollModifyConfig } from "./masterConfig";
import ListModal from "../AccountMaster/ListModal"; // adjust path to wherever ListModal actually lives
import SuccessModal from "../shared/SuccessModal";
import ModalFooterActions from "./ModalFooterActions";

/**
 * Reusable "pick a branch + a scroll/transaction number, validate the header
 * fields, then review a checkable table of the entries tied to that number"
 * modal. Driven entirely by SCROLL_MODIFY_CONFIG in masterConfig.js — any
 * master flagged `uiType: "scrollModify"` can reuse this without a new component.
 */
const ScrollModifyModal = ({ masterKey, onClose, onSave }) => {
  const config = getScrollModifyConfig(masterKey);

  const [branchCode, setBranchCode] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [assignValue, setAssignValue] = useState("");
  const [reasonValue, setReasonValue] = useState("");

  const [rows, setRows] = useState([]);
  const [checked, setChecked] = useState({});
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [picker, setPicker] = useState(null); // "branch" | "number" | null
  const [successOpen, setSuccessOpen] = useState(false);

  const selectedBranch = useMemo(
    () => config?.branches.find((b) => b.code === branchCode) ?? null,
    [config, branchCode]
  );

  const invalidateResult = () => {
    setValidated(false);
    setRows([]);
    setChecked({});
  };

  const handleFieldChange = (field, value) => {
    if (field === "branchCode") setBranchCode(value);
    if (field === "numberValue") setNumberValue(value);
    if (field === "dateValue") setDateValue(value);
    if (field === "assignValue") setAssignValue(value);
    if (field === "reasonValue") setReasonValue(value);
    setErrors((prev) => ({ ...prev, [field]: false }));
    invalidateResult();
  };

  const handlePickBranch = (branch) => {
    handleFieldChange("branchCode", branch.code);
    setPicker(null);
  };

  const handlePickNumber = (number) => {
    handleFieldChange("numberValue", number.code);
    setPicker(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!branchCode.trim()) newErrors.branchCode = true;
    if (!numberValue.trim()) newErrors.numberValue = true;
    if (!dateValue.trim()) newErrors.dateValue = true;
    if (!assignValue.trim()) newErrors.assignValue = true;
    if (!reasonValue.trim()) newErrors.reasonValue = true;

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (isValid) {
      setRows(config?.rowsByNumber[numberValue] ?? []);
      setChecked({});
    } else {
      setRows([]);
      setChecked({});
    }
    setValidated(isValid);
    return isValid;
  };

  const handleDisplay = () => {
    if (!validated || rows.length === 0) return;
    const selectedRows = rows.filter((row) => checked[row.id]);
    onSave?.(selectedRows);
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    onClose();
  };

  if (!config) return null;

  const hasResult = validated && rows.length > 0;
  const emptyMessage = !numberValue.trim()
    ? `No ${config.numberFieldLabel} is selected to show the data`
    : `No records found for this ${config.numberFieldLabel}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
              <UserRound size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1C398E] dark:text-slate-100">
                {config.titleEn}{" "}
                <span className="font-bold text-[#64748B] dark:text-slate-400">/ {config.titleHi}</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {config.subtitleEn} / {config.subtitleHi}
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
        <div className="mt-5 space-y-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                Branch Code <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className={`flex h-11 flex-1 items-center rounded-lg border px-3 ${errors.branchCode ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
                  <UserRound size={18} className="shrink-0 text-[#6B7280]" />
                  <input
                    type="text"
                    readOnly
                    value={branchCode}
                    placeholder="Enter Branch Code"
                    onClick={() => setPicker("branch")}
                    className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="button"
                  title="Search branches"
                  onClick={() => setPicker("branch")}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
              {errors.branchCode && <p className="mt-1 text-xs text-red-500">This field is required</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
                <UserRound size={18} className="shrink-0 text-[#6B7280]" />
                <input
                  type="text"
                  readOnly
                  value={selectedBranch?.name ?? ""}
                  placeholder="Auto-filled from branch code"
                  className="ml-3 w-full bg-transparent text-[15px] text-slate-500 outline-none placeholder:text-[#7C879B] dark:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                {config.numberFieldLabel} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className={`flex h-11 flex-1 items-center rounded-lg border px-3 ${errors.numberValue ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
                  <Hash size={18} className="shrink-0 text-[#6B7280]" />
                  <input
                    type="text"
                    readOnly
                    value={numberValue}
                    placeholder={`Enter ${config.numberFieldLabel}`}
                    onClick={() => setPicker("number")}
                    className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="button"
                  title={`Search ${config.numberFieldLabel}`}
                  onClick={() => setPicker("number")}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
              {errors.numberValue && <p className="mt-1 text-xs text-red-500">This field is required</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                {config.dateFieldLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => handleFieldChange("dateValue", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm ${errors.dateValue ? "border-red-400" : "border-[#B8C2D6]"} bg-white text-[#1F2858] outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`}
              />
              {errors.dateValue && <p className="mt-1 text-xs text-red-500">This field is required</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                {config.assignFieldLabel} <span className="text-red-500">*</span>
              </label>
              <div className={`flex h-11 items-center rounded-lg border px-3 ${errors.assignValue ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
                <UserRound size={18} className="shrink-0 text-[#6B7280]" />
                <input
                  type="text"
                  value={assignValue}
                  placeholder={`Enter ${config.assignFieldLabel}`}
                  onChange={(e) => handleFieldChange("assignValue", e.target.value)}
                  className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              {errors.assignValue && <p className="mt-1 text-xs text-red-500">This field is required</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                Reason of Modification <span className="text-red-500">*</span>
              </label>
              <div className={`flex h-11 items-center rounded-lg border px-3 ${errors.reasonValue ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
                <FileText size={18} className="shrink-0 text-[#6B7280]" />
                <input
                  type="text"
                  value={reasonValue}
                  placeholder="Enter Reason"
                  onChange={(e) => handleFieldChange("reasonValue", e.target.value)}
                  className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              {errors.reasonValue && <p className="mt-1 text-xs text-red-500">This field is required</p>}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800">
          {!hasResult ? (
            <>
              <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(0,1fr))] bg-primary text-white">
                <div className="px-4 py-3 text-left text-sm font-medium">Check</div>
                {config.columns.map((col) => (
                  <div key={col.key} className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">
                    {col.label}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/30">
                  <FileSearch size={34} className="text-primary/70" />
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white ring-4 ring-white dark:ring-slate-900">
                    <Ban size={14} />
                  </span>
                </div>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200">No Data Is Available</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">{emptyMessage}</p>
              </div>
            </>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Check</th>
                  {config.columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="odd:bg-white even:bg-gray-50 border-t border-gray-100 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:border-slate-800"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={!!checked[row.id]}
                        onChange={(e) => setChecked((prev) => ({ ...prev, [row.id]: e.target.checked }))}
                        style={{ accentColor: "#2563EB" }}
                        className="h-4 w-4 rounded"
                      />
                    </td>
                    {config.columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                        {col.key === "indicator" ? (
                          <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-semibold text-primary dark:bg-primary-950/40">
                            {row[col.key]}
                          </span>
                        ) : col.key === "amount" ? (
                          <span className="text-slate-700 dark:text-slate-300">₹ {row[col.key]}</span>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-300">{row[col.key]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ModalFooterActions
          onValidate={validateForm}
          onCancel={onClose}
          onDisplay={handleDisplay}
          canDisplay={hasResult}
        />
      </div>

      {picker === "branch" && (
        <ListModal
          title="Select Branch"
          columns={[
            { key: "code", label: "Branch Code" },
            { key: "name", label: "Branch Name" },
          ]}
          rows={config.branches}
          onSelect={handlePickBranch}
          onClose={() => setPicker(null)}
        />
      )}

      {picker === "number" && (
        <ListModal
          title={`Select ${config.numberFieldLabel}`}
          columns={[
            { key: "code", label: config.numberFieldLabel },
            { key: "name", label: "Description" },
          ]}
          rows={config.numbers}
          onSelect={handlePickNumber}
          onClose={() => setPicker(null)}
        />
      )}

      {successOpen && (
        <SuccessModal
          variant="success"
          title={`${config.titleEn} Modified Successfully`}
          subtitle="The selected records have been updated successfully."
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </div>
  );
};

export default ScrollModifyModal;