"use client";

import React, { useEffect, useState } from "react";
import { X, Check, ChevronDown, Hash, Building2, CreditCard } from "lucide-react";
import { type BranchRow } from "./BranchMasterTable";
import Image from "../ui/Image";
import SuccessModal from "../shared/SuccessModal";

/* ------------------------------------------------------------------ */
/*  Form data — UNCHANGED                                              */
/* ------------------------------------------------------------------ */

export interface TdReceiptLotFormData {
  branchCode: string;
  branchName: string;
  accountType: string;
  fromReceiptNumber: string;
  toReceiptNumber: string;
}

export const emptyTdReceiptLotFormData: TdReceiptLotFormData = {
  branchCode: "",
  branchName: "",
  accountType: "",
  fromReceiptNumber: "",
  toReceiptNumber: "",
};

export function rowToTdReceiptLotFormData(row: BranchRow): TdReceiptLotFormData {
  return {
    ...emptyTdReceiptLotFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
    accountType: "SB",
  };
}

const REQUIRED_FIELDS: (keyof TdReceiptLotFormData)[] = [
  "branchCode",
  "branchName",
  "accountType",
  "fromReceiptNumber",
  "toReceiptNumber",
];

/* ------------------------------------------------------------------ */
/*  TextField — Pigmy style (unchanged look, font, border)             */
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
  required?: boolean;
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
  required,
}: TextFieldProps) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="mb-1.5 block text-[14px] font-semibold text-slate-700">
        {labelEn} <span className="text-slate-400 font-normal">/ {labelHi}</span>
        {required && <span className="text-red-500">*</span>}
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
      {hasError && <p className="mt-1 text-[11px] text-red-500">This field is required</p>}
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
/*  Modal — UNCHANGED logic, Pigmy grid/font/border styling            */
/* ------------------------------------------------------------------ */

interface BranchTdReceiptLotModalProps {
  open: boolean;
  initialData: TdReceiptLotFormData;
  onClose: () => void;
  onSave: (data: TdReceiptLotFormData) => void;
}

export function BranchTdReceiptLotModal({
  open,
  initialData,
  onClose,
  onSave,
}: BranchTdReceiptLotModalProps) {
  const [formData, setFormData] = useState<TdReceiptLotFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TdReceiptLotFormData, boolean>>>({});
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

  const handleChange = <K extends keyof TdReceiptLotFormData>(
    key: K,
    value: TdReceiptLotFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const runValidation = (): boolean => {
    const newErrors: Partial<Record<keyof TdReceiptLotFormData, boolean>> = {};
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={onClose}
        >
        <div
          className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[20px] bg-white p-6 sm:p-8 shadow-2xl"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/td-lot.png"
                alt="Branch TD Receipt Lot"
                width={36}
                height={36}
                className="shrink-0"
              />
              <h2 className="text-xl font-bold text-slate-800">
                Branch TD Receipt Lot{" "}
                <span className="text-slate-400 font-normal text-sm">
                  / शाखा मुद्दत ठेव पावती लॉट
                </span>
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
            icon={Building2}
            titleEn="Branch Details"
            titleHi="शाखेचा तपशील"
            descriptionEn="Branch and account type for this TD receipt lot."
            descriptionHi="या TD पावती लॉटसाठी शाखा व खाते प्रकार."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <TextField
                labelEn="Branch Code"
                labelHi="शाखा कोड"
                icon={Hash}
                placeholder="Enter Branch Code"
                value={formData.branchCode}
                onChange={(v) => handleChange("branchCode", v)}
                hasError={errors.branchCode}
                required
                readOnly
              />
              <TextField
                labelEn="Branch Name"
                labelHi="शाखेचे नाव"
                icon={Building2}
                placeholder="Enter Branch Name"
                value={formData.branchName}
                onChange={(v) => handleChange("branchName", v)}
                hasError={errors.branchName}
                required
              />
              <TextField
                labelEn="Account Type"
                labelHi="खात्याचा प्रकार"
                icon={CreditCard}
                placeholder="Enter Account Type"
                value={formData.accountType}
                onChange={(v) => handleChange("accountType", v)}
                hasError={errors.accountType}
                required
              />
            </div>
          </CardSection>

          {/* Term Deposit Details */}
          <div className="mt-4">
            <CardSection
              icon={Hash}
              titleEn="Term Deposit Details"
              titleHi="मुद्दत ठेव तपशील"
              descriptionEn="Receipt number range to be issued in this lot."
              descriptionHi="या लॉटमध्ये जारी करावयाची पावती क्रमांक श्रेणी."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <TextField
                  labelEn="From Receipt Number"
                  labelHi="चेक क्रमांकापासून"
                  icon={Hash}
                  placeholder="Enter From Receipt Number"
                  value={formData.fromReceiptNumber}
                  onChange={(v) => handleChange("fromReceiptNumber", v)}
                  hasError={errors.fromReceiptNumber}
                  required
                />
                <TextField
                  labelEn="To Receipt Number"
                  labelHi="चेक क्रमांकापर्यंत"
                  icon={Hash}
                  placeholder="Enter To Receipt Number"
                  value={formData.toReceiptNumber}
                  onChange={(v) => handleChange("toReceiptNumber", v)}
                  hasError={errors.toReceiptNumber}
                  required
                />
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
              Save <ChevronDown size={14} />
            </button>
          </div>
        </div>
        </div>
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
          title="TD Receipt Lot Saved"
          subtitle="Successfully"
          variant="success"
        />
      )}
    </>
  );
}