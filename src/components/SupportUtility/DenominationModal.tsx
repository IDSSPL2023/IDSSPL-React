// @ts-nocheck
import { useMemo, useState } from "react";
import { X, UserRound, MoreVertical, ChevronDown, IndianRupee, Wallet } from "lucide-react";
import { getDenominationConfig } from "./masterConfig";
import ListModal from "../AccountMaster/ListModal"; // adjust path to wherever ListModal actually lives
import SuccessModal from "../shared/SuccessModal";
import ModalFooterActions from "./ModalFooterActions";

/**
 * "Cash handling context + denomination-wise note/coin count" modal. Driven
 * entirely by DENOMINATION_CONFIG in masterConfig.js — any master flagged
 * `uiType: "denomination"` can reuse this without a new component.
 */
const DenominationModal = ({ masterKey, onClose, onSave }) => {
  const config = getDenominationConfig(masterKey);

  const [userId, setUserId] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [modifyOption, setModifyOption] = useState(config?.modifyOptions[0]?.value ?? "");
  const [amounts, setAmounts] = useState({});

  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const selectedUser = useMemo(
    () => config?.users.find((u) => u.code === userId) ?? null,
    [config, userId]
  );

  const invalidate = () => setValidated(false);

  const handlePickUser = (user) => {
    setUserId(user.code);
    setErrors((prev) => ({ ...prev, userId: false }));
    setPickerOpen(false);
    invalidate();
  };

  const handleAmountChange = (key, value) => {
    setAmounts((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
    invalidate();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userId.trim()) newErrors.userId = true;
    if (!asOnDate.trim()) newErrors.asOnDate = true;

    config.denominationFields.forEach((field) => {
      const value = amounts[field.key];
      if (!value || !value.toString().trim()) {
        newErrors[field.key] = true;
      } else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
        newErrors[field.key] = true;
      }
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setValidated(isValid);
    return isValid;
  };

  const handleDisplay = () => {
    if (!validated) return;
    onSave?.({ userId, asOnDate, modifyOption, amounts });
    setSuccessOpen(true);
  };

  const handleSuccessDone = () => {
    setSuccessOpen(false);
    onClose();
  };

  if (!config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
              <Wallet size={24} />
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

        {/* Cash Handling Information */}
        <div className="mt-5 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
              <UserRound size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F2858] dark:text-slate-100">
                {config.infoTitleEn} <span className="font-normal text-slate-500 dark:text-slate-400">/ {config.infoTitleHi}</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {config.infoSubtitleEn} / {config.infoSubtitleHi}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                User ID <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className={`flex h-11 flex-1 items-center rounded-lg border px-3 ${errors.userId ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
                  <UserRound size={18} className="shrink-0 text-[#6B7280]" />
                  <input
                    type="text"
                    readOnly
                    value={userId}
                    placeholder="Enter User ID"
                    onClick={() => setPickerOpen(true)}
                    className="ml-3 w-full cursor-pointer bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="button"
                  title="Search users"
                  onClick={() => setPickerOpen(true)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition hover:bg-[#E2ECFF] dark:border-slate-700 dark:bg-primary-950/40"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
              {errors.userId && <p className="mt-1 text-xs text-red-500">This field is required</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                User Name <span className="text-red-500">*</span>
              </label>
              <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
                <UserRound size={18} className="shrink-0 text-[#6B7280]" />
                <input
                  type="text"
                  readOnly
                  value={selectedUser?.name ?? ""}
                  placeholder="Auto-filled from user ID"
                  className="ml-3 w-full bg-transparent text-[15px] text-slate-500 outline-none placeholder:text-[#7C879B] dark:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                As On Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={asOnDate}
                onChange={(e) => {
                  setAsOnDate(e.target.value);
                  setErrors((prev) => ({ ...prev, asOnDate: false }));
                  invalidate();
                }}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm ${errors.asOnDate ? "border-red-400" : "border-[#B8C2D6]"} bg-white text-[#1F2858] outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`}
              />
              {errors.asOnDate && <p className="mt-1 text-xs text-red-500">This field is required</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                Modify <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={modifyOption}
                  onChange={(e) => {
                    setModifyOption(e.target.value);
                    invalidate();
                  }}
                  className="w-full appearance-none rounded-lg border border-[#B8C2D6] bg-white px-3 py-2.5 pr-9 text-sm text-[#1F2858] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {config.modifyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.labelEn}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              </div>
            </div>
          </div>
        </div>

        {/* Cash Denomination Summary */}
        <div className="mt-5 rounded-[20px] border-x border-b border-t-4 border-primary bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-primary-950/40">
              <IndianRupee size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1F2858] dark:text-slate-100">
                {config.summaryTitleEn} <span className="font-normal text-slate-500 dark:text-slate-400">/ {config.summaryTitleHi}</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {config.summarySubtitleEn} / {config.summarySubtitleHi}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.denominationFields.map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-[16px] font-semibold text-[#1F2858] dark:text-slate-100">
                  {field.labelEn} <span className="text-red-500">*</span>
                </label>
                <div className={`flex h-11 items-center rounded-lg border px-3 ${errors[field.key] ? "border-red-400" : "border-[#B8C2D6]"} bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-700 dark:bg-slate-900`}>
                  <IndianRupee size={18} className="shrink-0 text-[#6B7280]" />
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amounts[field.key] ?? ""}
                    placeholder="Enter Amount"
                    onChange={(e) => handleAmountChange(field.key, e.target.value)}
                    className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                {errors[field.key] && <p className="mt-1 text-xs text-red-500">Enter a valid amount</p>}
              </div>
            ))}
          </div>
        </div>

        <ModalFooterActions
          onValidate={validateForm}
          onCancel={onClose}
          onDisplay={handleDisplay}
          canDisplay={validated}
        />
      </div>

      {pickerOpen && (
        <ListModal
          title="Select User"
          columns={[
            { key: "code", label: "User ID" },
            { key: "name", label: "User Name" },
          ]}
          rows={config.users}
          onSelect={handlePickUser}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {successOpen && (
        <SuccessModal
          variant="success"
          title={`${config.titleEn} Modified Successfully`}
          subtitle="The cash denomination details have been recorded successfully."
          onClose={handleSuccessDone}
          onDone={handleSuccessDone}
        />
      )}
    </div>
  );
};

export default DenominationModal;
