"use client";

import React, { useEffect, useState } from "react";
// import Image from "next/image";
import { X, Check, ChevronDown, UserRound, Landmark } from "lucide-react";
import { type BranchRow } from "./BranchMasterTable";
import Image from "../ui/Image";
import SuccessModal from "../shared/SuccessModal";

/* ------------------------------------------------------------------ */
/*  TextField component — Pigmy style                                  */
/* ------------------------------------------------------------------ */

interface TextFieldProps {
  labelEn: string;
  labelHi: string;
  icon?: React.ElementType;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  readOnly?: boolean;
}

function TextField({
  labelEn,
  labelHi,
  icon: Icon,
  placeholder,
  value,
  onChange,
  hasError,
  readOnly,
}: TextFieldProps) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="mb-1.5 block text-[14px] font-semibold text-slate-700">
        {labelEn} <span className="text-slate-400 font-normal">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div
        className={`group flex items-center w-full h-8 rounded-[10px] border px-2.5 transition-all duration-200 ${
          readOnly
            ? "bg-[#f0f2f5] border-slate-200 cursor-not-allowed"
            : hasError
              ? "bg-white border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
              : "bg-white border-slate-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
        }`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={`ml-2 w-full bg-transparent outline-none text-[13.5px] placeholder:text-[13.5px] placeholder:text-slate-400 placeholder:font-normal ${
            readOnly ? "text-slate-500 cursor-not-allowed" : "text-slate-600"
          }`}
        />
      </div>
      {hasError && <p className="mt-1 text-[11px] text-red-500">Required</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CardSection — Pigmy CardSection style (border, radius, shadow)     */
/* ------------------------------------------------------------------ */

function CardSection({
  icon: Icon,
  titleEn,
  titleHi,
  descriptionEn,
  descriptionHi,
  children,
}: {
  icon?: React.ElementType;
  titleEn: string;
  titleHi: string;
  descriptionEn?: string;
  descriptionHi?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#0256cc]/60 border-t-[3.5px] border-t-[#0256cc] rounded-[14px] p-4 sm:p-5 bg-white shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
          {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-slate-800">
            {titleEn} <span className="text-slate-400 font-normal text-xs">/ {titleHi}</span>
          </h2>
          {descriptionEn && (
            <p className="text-[12px] text-slate-500 mt-0.5">
              {descriptionEn} {descriptionHi && `/ ${descriptionHi}`}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form data — UNCHANGED                                              */
/* ------------------------------------------------------------------ */

export interface BranchNonCBSFormData {
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  isDayBeginExecuted: "Yes" | "No" | "";
  isDayEndExecuted: "Yes" | "No" | "";
  isDenominationRequired: "Yes" | "No" | "";
  isYearAutoRenewalAtDayBegin: "Yes" | "No" | "";
  isSBInterestPostAtDayEnd: "Yes" | "No" | "";
  isCAInterestPostAtDayEnd: "Yes" | "No" | "";
  isTDInterestPostAtDayEnd: "Yes" | "No" | "";
  isTLInterestPostAtDayEnd: "Yes" | "No" | "";
  isCCInterestPostAtDayEnd: "Yes" | "No" | "";
}

export const emptyBranchNonCBSFormData: BranchNonCBSFormData = {
  bankCode: "",
  bankName: "",
  branchCode: "",
  branchName: "",
  isDayBeginExecuted: "",
  isDayEndExecuted: "",
  isDenominationRequired: "",
  isYearAutoRenewalAtDayBegin: "",
  isSBInterestPostAtDayEnd: "",
  isCAInterestPostAtDayEnd: "",
  isTDInterestPostAtDayEnd: "",
  isTLInterestPostAtDayEnd: "",
  isCCInterestPostAtDayEnd: "",
};

export function rowToBranchNonCBSFormData(row: BranchRow): BranchNonCBSFormData {
  return {
    ...emptyBranchNonCBSFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
  };
}

const REQUIRED_FIELDS: (keyof BranchNonCBSFormData)[] = [
  "bankCode", "bankName", "branchCode", "branchName",
  "isDayBeginExecuted", "isDayEndExecuted", "isDenominationRequired",
  "isYearAutoRenewalAtDayBegin", "isSBInterestPostAtDayEnd",
  "isCAInterestPostAtDayEnd", "isTDInterestPostAtDayEnd",
  "isTLInterestPostAtDayEnd", "isCCInterestPostAtDayEnd",
];

/* ------------------------------------------------------------------ */
/*  Radio field (Yes/No) — Pigmy YesNoField style                      */
/* ------------------------------------------------------------------ */

interface RadioFieldProps {
  labelEn: string;
  labelHi: string;
  value: "Yes" | "No" | "";
  onChange: (value: "Yes" | "No") => void;
  hasError?: boolean;
  name: string;
}

function RadioField({ labelEn, labelHi, value, onChange, hasError, name }: RadioFieldProps) {
  return (
    <div className="mb-2">
      <label className="block text-[14px] font-semibold text-slate-700 mb-1.5">
        {labelEn} <span className="text-slate-400 font-normal">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-6 mt-1">
        <label className="flex items-center gap-2 text-[14px] text-slate-700 cursor-pointer">
          <input type="radio" name={name} checked={value === "Yes"} onChange={() => onChange("Yes")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
          <span className="font-medium">Yes</span>
        </label>
        <label className="flex items-center gap-2 text-[14px] text-slate-700 cursor-pointer">
          <input type="radio" name={name} checked={value === "No"} onChange={() => onChange("No")} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
          <span className="font-medium">No</span>
        </label>
      </div>
      {hasError && <p className="mt-1 text-[11px] text-red-500">Required</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal — UNCHANGED logic, Pigmy grid/font/border styling            */
/* ------------------------------------------------------------------ */

interface BranchNonCBSModalProps {
  open: boolean;
  initialData: BranchNonCBSFormData;
  onClose: () => void;
  onSave: (data: BranchNonCBSFormData) => void;
}

export function BranchNonCBSModal({ open, initialData, onClose, onSave }: BranchNonCBSModalProps) {
  const [formData, setFormData] = useState<BranchNonCBSFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BranchNonCBSFormData, boolean>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(initialData);
      setValidated(false);
      setErrors({});
      setShowSuccess(false);
    }
  }, [initialData, open]);

  if (!open && !showSuccess) return null;

  const handleChange = <K extends keyof BranchNonCBSFormData>(key: K, value: BranchNonCBSFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const runValidation = (): boolean => {
    const newErrors: Partial<Record<keyof BranchNonCBSFormData, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setValidated(valid);
    return valid;
  };

  const handleValidate = () => {
    runValidation();
  };

  const handleSave = () => {
    if (!validated) return;
    const valid = runValidation();
    if (!valid) return;
    onSave(formData);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      {open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
        <div
          className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[20px] bg-white p-6 sm:p-8 shadow-2xl"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/add-icn.png"
                alt="Branch Parameter Non CBS"
                width={36}
                height={36}
                className="shrink-0"
              />
              <h2 className="text-xl font-bold text-slate-800">
                Branch Parameter Non CBS <span className="text-slate-400 font-normal text-sm">/ शाखा मापदंड (Non-CBS)</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Branch Details */}
          <CardSection
            icon={Landmark}
            titleEn="Branch Details"
            titleHi="शाखेचा तपशील"
            descriptionEn="Bank and branch identification for this Non-CBS parameter."
            descriptionHi="या Non-CBS मापदंडासाठी बँक व शाखा माहिती."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <TextField labelEn="Bank Code" labelHi="बँक कोड" icon={Landmark} placeholder="Enter Bank Code" value={formData.bankCode} onChange={(v) => handleChange("bankCode", v)} hasError={errors.bankCode} />
              <TextField labelEn="Bank Name" labelHi="बँकेचे नाव" icon={Landmark} placeholder="Enter Bank Name" value={formData.bankName} onChange={(v) => handleChange("bankName", v)} hasError={errors.bankName} />
              <TextField labelEn="Branch Code" labelHi="शाखा कोड" icon={Landmark} placeholder="Enter Branch Code" value={formData.branchCode} onChange={(v) => handleChange("branchCode", v)} hasError={errors.branchCode} readOnly />
              <TextField labelEn="Branch Name" labelHi="शाखेचे नाव" icon={Landmark} placeholder="Enter Branch Name" value={formData.branchName} onChange={(v) => handleChange("branchName", v)} hasError={errors.branchName} />
            </div>
          </CardSection>

          {/* Details (Yes/No settings) */}
          <div className="mt-4">
            <CardSection
              icon={UserRound}
              titleEn="Details"
              titleHi="तपशील"
              descriptionEn="Day-end, interest posting and renewal settings for this branch."
              descriptionHi="या शाखेसाठी दिवस-अखेर, व्याज पोस्टिंग व नूतनीकरण सेटिंग्ज."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                <RadioField name="isDayBeginExecuted" labelEn="Is Day Begin Executed" labelHi="दिवस प्रारंभ" value={formData.isDayBeginExecuted} onChange={(v) => handleChange("isDayBeginExecuted", v)} hasError={errors.isDayBeginExecuted} />
                <RadioField name="isDayEndExecuted" labelEn="Is Day End Executed" labelHi="दिवस समाप्त" value={formData.isDayEndExecuted} onChange={(v) => handleChange("isDayEndExecuted", v)} hasError={errors.isDayEndExecuted} />
                <RadioField name="isDenominationRequired" labelEn="Is Denomination Required" labelHi="चलन तपशील" value={formData.isDenominationRequired} onChange={(v) => handleChange("isDenominationRequired", v)} hasError={errors.isDenominationRequired} />
                <RadioField name="isYearAutoRenewalAtDayBegin" labelEn="Is Year Auto Renewal At Day Begin" labelHi="वर्ष नूतनीकरण" value={formData.isYearAutoRenewalAtDayBegin} onChange={(v) => handleChange("isYearAutoRenewalAtDayBegin", v)} hasError={errors.isYearAutoRenewalAtDayBegin} />
                <RadioField name="isSBInterestPostAtDayEnd" labelEn="Is SB Interest Post At Day End" labelHi="एसबी व्याज पोस्ट" value={formData.isSBInterestPostAtDayEnd} onChange={(v) => handleChange("isSBInterestPostAtDayEnd", v)} hasError={errors.isSBInterestPostAtDayEnd} />
                <RadioField name="isCAInterestPostAtDayEnd" labelEn="Is CA Interest Post At Day End" labelHi="सीए व्याज पोस्ट" value={formData.isCAInterestPostAtDayEnd} onChange={(v) => handleChange("isCAInterestPostAtDayEnd", v)} hasError={errors.isCAInterestPostAtDayEnd} />
                <RadioField name="isTDInterestPostAtDayEnd" labelEn="Is TD Interest Post At Day End" labelHi="TD व्याज पोस्ट" value={formData.isTDInterestPostAtDayEnd} onChange={(v) => handleChange("isTDInterestPostAtDayEnd", v)} hasError={errors.isTDInterestPostAtDayEnd} />
                <RadioField name="isTLInterestPostAtDayEnd" labelEn="Is TL Interest Post At Day End" labelHi="TL व्याज पोस्ट" value={formData.isTLInterestPostAtDayEnd} onChange={(v) => handleChange("isTLInterestPostAtDayEnd", v)} hasError={errors.isTLInterestPostAtDayEnd} />
                <RadioField name="isCCInterestPostAtDayEnd" labelEn="Is CC Interest Post At Day End" labelHi="CC व्याज पोस्ट" value={formData.isCCInterestPostAtDayEnd} onChange={(v) => handleChange("isCCInterestPostAtDayEnd", v)} hasError={errors.isCCInterestPostAtDayEnd} />
              </div>
            </CardSection>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pb-1 flex-wrap">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Validate <Check size={14} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Cancel <X size={14} />
            </button>
            <button
              type="button"
              disabled={!validated}
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                validated ? "bg-[#1F67F4] text-white hover:bg-[#0E57EA] shadow-sm" : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
              }`}
            >
              Modify <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
          title="Non CBS Parameter Saved"
          subtitle="Successfully"
          variant="success"
        />
      )}
    </>
  );
}