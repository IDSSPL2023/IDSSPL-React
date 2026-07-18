// @ts-nocheck
import { useState } from "react";
import { X, Check, UserRound, MoreVertical, FileText } from "lucide-react";
import SuccessModal from "../shared/SuccessModal";

const SupportAuditTrailModal = ({ onClose }) => {
  const [selectMode, setSelectMode] = useState("all");
  const [accountCode, setAccountCode] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("pdf");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleFormChange = (field, value) => {
    setErrors({});
    setValidated(false);
    
    if (field === "selectMode") {
      setSelectMode(value);
      if (value === "all") {
        setAccountCode("");
        setSelectedAccount(null);
      }
    } else if (field === "accountCode") {
      setAccountCode(value);
      setSelectedAccount({ code: value, name: "Sample Account Name" });
    } else if (field === "fromDate") {
      setFromDate(value);
    } else if (field === "toDate") {
      setToDate(value);
    } else if (field === "reportType") {
      setReportType(value);
    }
  };

  const validateForm = () => {
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

  const handleValidate = () => {
    validateForm();
  };

  const handleReport = () => {
    if (!validated) return;
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    onClose();
  };

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
                Support Audit Trail
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View the parameter information and associated details.
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
        <div className="mt-5 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          {/* Select Section */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-[#1F2858] dark:text-slate-100">Select</p>
            <label className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
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
            <label className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
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

          {/* Account Code and Account Name */}
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
                    placeholder="0002"
                    onClick={() => handleFormChange("accountCode", "0002")}
                    className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="button"
                  title="Search accounts"
                  onClick={() => handleFormChange("accountCode", "0002")}
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
                  placeholder="name@company.com"
                  className="ml-3 w-full bg-transparent text-[15px] text-slate-500 outline-none placeholder:text-[#7C879B] dark:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* From Date and To Date */}
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

          {/* Report Type */}
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
            disabled={!validated}
            onClick={handleReport}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              validated
                ? "bg-primary text-white hover:bg-primary-700"
                : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
            }`}
          >
            Report <FileText size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
          >
            Cancel <X size={16} />
          </button>
        </div>
      </div>

      {successOpen && (
        <SuccessModal
          variant="success"
          title="Support Audit Trail Generated"
          subtitle="The report request has been processed successfully."
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </div>
  );
};

export default SupportAuditTrailModal;
