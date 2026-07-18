// @ts-nocheck
import { useMemo, useState } from "react";
import { X, Check, ChevronDown, UserRound, MoreVertical, FileSearch, Ban, Calendar, FileText } from "lucide-react";
import { getAccountLookupConfig } from "./masterConfig";
import ListModal from "../AccountMaster/ListModal"; // adjust path to wherever ListModal actually lives
import SuccessModal from "../shared/SuccessModal";

/**
 * Reusable "pick an account, then review/edit a checkable table of records
 * tied to it" modal. Driven entirely by ACCOUNT_LOOKUP_CONFIG in
 * masterConfig.js — any master flagged `uiType: "accountLookupTable"` can
 * reuse this without a new component.
 */
const AccountLookupTableModal = ({ masterKey, onClose, onSave }) => {
  const config = getAccountLookupConfig(masterKey);
  const [accountCode, setAccountCode] = useState("");
  const [rows, setRows] = useState([]);
  const [checked, setChecked] = useState({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectMode, setSelectMode] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("pdf");
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const isAuditTrail = config?.type === "auditTrail";

  const selectedAccount = useMemo(
    () => config?.accounts.find((a) => a.code === accountCode) ?? null,
    [config, accountCode]
  );

  const handleAccountChange = (code) => {
    setAccountCode(code);
    setRows(config?.rowsByAccount[code] ?? []);
    setChecked({});
    setValidated(false);
    setErrors({});
    setFieldErrors({});
  };

  // Called when a row is chosen from the ListModal picklist
  const handlePickAccount = (account) => {
    handleAccountChange(account.code);
    setPickerOpen(false);
  };

  const handleFieldChange = (rowId, key, value) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row)));
    setValidated(false);
    setFieldErrors((prev) => ({ ...prev, [`${rowId}-${key}`]: false }));
  };

  const handleFormChange = (field, value) => {
    if (field === "fromDate") setFromDate(value);
    if (field === "toDate") setToDate(value);
    if (field === "reportType") setReportType(value);
    if (field === "selectMode") {
      setSelectMode(value);
      if (value === "all") {
        setAccountCode("");
      }
    }
    setValidated(false);
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateAuditTrail = () => {
    const newErrors = {};

    if (selectMode === "single" && !accountCode.trim()) {
      newErrors.accountCode = true;
    }

    if (!fromDate.trim()) {
      newErrors.fromDate = true;
    }

    if (!toDate.trim()) {
      newErrors.toDate = true;
    }

    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      newErrors.toDate = true;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    return isValid;
  };

  const validateInterestReceivable = () => {
    const newFieldErrors = {};
    const selectedRowIds = Object.keys(checked).filter((id) => checked[id]);
    
    if (selectedRowIds.length === 0) {
      setFieldErrors({});
      setValidated(false);
      return false;
    }

    selectedRowIds.forEach((rowId) => {
      const row = rows.find((r) => r.id === rowId);
      if (row) {
        // Validate interestAmount
        if (!row.interestAmount || row.interestAmount.trim() === "") {
          newFieldErrors[`${rowId}-interestAmount`] = true;
        } else if (isNaN(parseFloat(row.interestAmount)) || parseFloat(row.interestAmount) < 0) {
          newFieldErrors[`${rowId}-interestAmount`] = true;
        }
        
        // Validate penalAmount
        if (!row.penalAmount || row.penalAmount.trim() === "") {
          newFieldErrors[`${rowId}-penalAmount`] = true;
        } else if (isNaN(parseFloat(row.penalAmount)) || parseFloat(row.penalAmount) < 0) {
          newFieldErrors[`${rowId}-penalAmount`] = true;
        }
      }
    });

    setFieldErrors(newFieldErrors);
    const isValid = Object.keys(newFieldErrors).length === 0;
    setValidated(isValid);
    return isValid;
  };

  const handleValidate = () => {
    if (isAuditTrail) {
      validateAuditTrail();
      return;
    }
    validateInterestReceivable();
  };

  const handleReport = () => {
    if (!validated) return;
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    onSave?.();
    onClose();
  };

  const handleSave = () => {
    if (!validated) return;
    const selectedRows = rows.filter((row) => checked[row.id]);
    onSave?.(selectedRows);
    setSuccessOpen(true);
  };

  if (!config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
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

        {/* Account picker */}
        {/* <div className="mt-5 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900"> */}
          
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
              Account Code <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex h-11 flex-1 items-center rounded-lg border border-[#B8C2D6] bg-white px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900">
                <UserRound size={18} className="shrink-0 text-[#6B7280]" />
                <input
                  type="text"
                  readOnly
                  value={accountCode}
                  placeholder="Select account"
                  onClick={() => setPickerOpen(true)}
                  className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                title="Search accounts"
                onClick={() => setPickerOpen(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
              Account Name
            </label>
            <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
              <UserRound size={18} className="shrink-0 text-[#6B7280]" />
              <input
                type="text"
                readOnly
                value={selectedAccount?.name ?? ""}
                placeholder="name"
                className="ml-3 w-full bg-transparent text-[15px] text-slate-500 outline-none placeholder:text-[#7C879B] dark:text-slate-400"
              />
            </div>
          </div>
        </div>
        {/* </div> */}

        {isAuditTrail ? (
          <div className="mt-5 space-y-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-sm font-semibold text-[#1F2858] dark:text-slate-100">Select</p>
                <div className="mt-3 flex items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                    <input
                      type="radio"
                      name="support-audit-select"
                      checked={selectMode === "all"}
                      value="all"
                      onChange={() => handleFormChange("selectMode", "all")}
                      className="h-4 w-4"
                    />
                    All
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                    <input
                      type="radio"
                      name="support-audit-select"
                      checked={selectMode === "single"}
                      value="single"
                      onChange={() => handleFormChange("selectMode", "single")}
                      className="h-4 w-4"
                    />
                    Single
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                    Account Code {selectMode === "single" ? <span className="text-red-500">*</span> : null}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`flex h-11 flex-1 items-center rounded-lg border px-3 ${errors.accountCode ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
                      <UserRound size={18} className="shrink-0 text-[#6B7280]" />
                      <input
                        type="text"
                        readOnly
                        value={accountCode}
                        placeholder="Select account"
                        onClick={() => setPickerOpen(true)}
                        className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>
                    <button
                      type="button"
                      title="Search accounts"
                      onClick={() => setPickerOpen(true)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  {errors.accountCode && selectMode === "single" && (
                    <p className="mt-2 text-sm text-red-500">Please select an account code.</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                    Account Name
                  </label>
                  <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
                    <UserRound size={18} className="shrink-0 text-[#6B7280]" />
                    <input
                      type="text"
                      readOnly
                      value={selectedAccount?.name ?? ""}
                      placeholder="name"
                      className="ml-3 w-full bg-transparent text-[15px] text-slate-500 outline-none placeholder:text-[#7C879B] dark:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => handleFormChange("fromDate", e.target.value)}
                  className={`w-full rounded-lg border px-3 py-3 text-sm ${errors.fromDate ? "border-red-400" : "border-[#B8C2D6]"} bg-white text-[#1F2858] outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`}
                />
                {errors.fromDate && <p className="mt-2 text-sm text-red-500">Please provide a valid from date.</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => handleFormChange("toDate", e.target.value)}
                  className={`w-full rounded-lg border px-3 py-3 text-sm ${errors.toDate ? "border-red-400" : "border-[#B8C2D6]"} bg-white text-[#1F2858] outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`}
                />
                {errors.toDate && <p className="mt-2 text-sm text-red-500">Please provide a valid to date.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm font-semibold text-[#1F2858] dark:text-slate-100">Report Type</p>
              <div className="mt-3 flex items-center gap-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  <input
                    type="radio"
                    name="report-type"
                    value="pdf"
                    checked={reportType === "pdf"}
                    onChange={() => handleFormChange("reportType", "pdf")}
                    className="h-4 w-4"
                  />
                  PDF Format
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  <input
                    type="radio"
                    name="report-type"
                    value="xls"
                    checked={reportType === "xls"}
                    onChange={() => handleFormChange("reportType", "xls")}
                    className="h-4 w-4"
                  />
                  XLS Format
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800">
            {!accountCode || rows.length === 0 ? (
              <>
                <div className="grid grid-cols-5 bg-primary text-white">
                  <div className="px-4 py-3 text-left text-sm font-medium">Check</div>
                  {config.columns.map((col) => (
                    <div key={col.key} className="px-4 py-3 text-left text-sm font-medium">
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
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {accountCode ? "No records found for this account" : "No Account is selected to show the data"}
                  </p>
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
                        <td key={col.key} className="px-4 py-3">
                          {col.editable ? (
                            <div className={`flex h-9 max-w-[140px] items-center gap-2 rounded-md border px-2 ${fieldErrors[`${row.id}-${col.key}`] ? "border-red-400 bg-red-50" : "border-[#B8C2D6] bg-white"} dark:border-slate-700 dark:bg-slate-900`}>
                              <FileText size={14} className="shrink-0 text-[#6B7280]" />
                              <input
                                type="text"
                                value={row[col.key] ?? ""}
                                onChange={(e) => handleFieldChange(row.id, col.key, e.target.value)}
                                className="w-full bg-transparent text-[13px] text-[#4B5563] outline-none dark:text-slate-100"
                              />
                            </div>
                          ) : col.key === "interestDate" ? (
                            <div className="flex h-9 max-w-[140px] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 dark:border-slate-700 dark:bg-slate-800">
                              <Calendar size={14} className="shrink-0 text-[#6B7280]" />
                              <span className="text-[13px] text-slate-500 dark:text-slate-400">{row[col.key]}</span>
                            </div>
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
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
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
          <button
            type="button"
            disabled={isAuditTrail ? !validated : !validated}
            onClick={isAuditTrail ? handleReport : handleSave}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isAuditTrail
                ? validated
                  ? "bg-primary text-white hover:bg-primary-700"
                  : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                : validated
                  ? "bg-primary text-white hover:bg-primary-700"
                  : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
            }`}
          >
            Save <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Account picklist, opened via the three-dot button (or clicking the input) */}
      {pickerOpen && (
        <ListModal
          title="Select Account"
          columns={[
            { key: "code", label: "Account Code" },
            { key: "name", label: "Account Name" },
          ]}
          rows={config.accounts}
          onSelect={handlePickAccount}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {successOpen && (
        <SuccessModal
          variant="success"
          title={isAuditTrail ? "Support Audit Trail Generated" : "Interest Receivable Modified Successfully"}
          subtitle={isAuditTrail ? "The report request has been processed successfully." : "The interest receivable records have been updated successfully."}
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </div>
  );
};

export default AccountLookupTableModal;