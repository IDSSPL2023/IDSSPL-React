import React, { useEffect, useState } from "react";
import { X, Check, ChevronDown, MoreVertical, Smartphone, UserRound, IdCard, Landmark, Hash, BookOpen, Layers, Type, type LucideIcon } from "lucide-react";
import type { BranchRow } from "./BranchMasterTable";

export interface ChequeBookLotFormData {
  branchCode: string;
  branchName: string;
  accountType: string;
  chequeType: string;
  chequeNoFrom: string;
  chequeNoTo: string;
  leavesPerBook: string;
  noOfBooks: string;
  chequeSeries: string;
}

export const emptyChequeBookLotFormData: ChequeBookLotFormData = {
  branchCode: "",
  branchName: "",
  accountType: "",
  chequeType: "",
  chequeNoFrom: "",
  chequeNoTo: "",
  leavesPerBook: "",
  noOfBooks: "",
  chequeSeries: "",
};

export function rowToChequeBookLotFormData(row: BranchRow): ChequeBookLotFormData {
  return {
    ...emptyChequeBookLotFormData,
    branchCode: row.branchCode,
    branchName: row.branchName,
  };
}

const ACCOUNT_TYPE_OPTIONS = ["SB", "CA", "CC", "OD", "TD", "RD"];
const CHEQUE_TYPE_OPTIONS = ["CTS", "MICR", "Non-MICR"];

const REQUIRED_FIELDS: (keyof ChequeBookLotFormData)[] = [
  "branchCode", "branchName", "accountType",
  "chequeType", "chequeNoFrom", "chequeNoTo",
  "leavesPerBook", "noOfBooks", "chequeSeries",
];

interface TextFieldProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  readOnly?: boolean;
  trailing?: React.ReactNode;
}

function TextField({ labelEn, labelHi, icon: Icon, placeholder, value, onChange, hasError, readOnly = false, trailing }: TextFieldProps) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-[13px] font-medium text-black dark:text-slate-100">
        {labelEn} <span className="font-medium text-gray-500 dark:text-slate-400">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <div
          className={`flex h-11 w-full items-center rounded-lg border px-3 transition-colors ${hasError
              ? "border-red-400 bg-white dark:bg-slate-900"
              : readOnly
                ? "border-slate-400 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                : "border-[#B8C2D6] bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 dark:bg-slate-900 dark:border-slate-700"
            }`}
        >
          <Icon size={18} className="shrink-0 text-[#6B7280] dark:text-slate-400" />
          {readOnly ? (
            <span className={`ml-3 w-full truncate text-[15px] ${value ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>{value || placeholder}</span>
          ) : (
            <input
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              className="ml-3 w-full bg-transparent text-[15px] text-[#4B5563] outline-none placeholder:text-[#7C879B] dark:text-slate-100 dark:placeholder-slate-500"
            />
          )}
        </div>
        {trailing}
      </div>
      {hasError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">This field is required</p>}
    </div>
  );
}

interface SelectFieldProps {
  labelEn: string;
  labelHi: string;
  icon: LucideIcon;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  hasError?: boolean;
  readOnly?: boolean;
  trailing?: React.ReactNode;
}

function SelectField({ labelEn, labelHi, icon: Icon, placeholder, value, options, onChange, hasError, readOnly = false, trailing }: SelectFieldProps) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-[13px] font-medium text-black dark:text-slate-100">
        {labelEn} <span className="font-medium text-gray-500 dark:text-slate-400">/ {labelHi}</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <div
          className={`relative flex h-11 w-full items-center rounded-lg border px-3 ${hasError ? "border-red-400 bg-white dark:bg-slate-900" : readOnly ? "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800" : "border-[#B8C2D6] bg-white dark:bg-slate-900 dark:border-slate-700"
            }`}
        >
          <Icon size={18} className="shrink-0 text-[#6B7280] dark:text-slate-400" />
          {readOnly ? (
            <span className={`ml-3 w-full truncate text-[15px] ${value ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>{value || placeholder}</span>
          ) : (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="ml-3 w-full appearance-none bg-transparent text-[15px] text-[#4B5563] outline-none dark:text-slate-100"
            >
              <option value="">{placeholder}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          <ChevronDown size={16} className="shrink-0 text-gray-400 dark:text-slate-500" />
        </div>
        {trailing}
      </div>
      {hasError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">This field is required</p>}
    </div>
  );
}

interface SectionHeaderProps {
  icon: LucideIcon;
  titleEn: string;
  titleHi: string;
}

function SectionHeader({ icon: Icon, titleEn, titleHi }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-primary dark:bg-slate-800">
        <Icon size={18} />
      </div>
      <h3 className="text-lg font-bold text-black dark:text-slate-100">
        {titleEn} <span className="font-bold text-[#64748B] dark:text-slate-400">/ {titleHi}</span>
      </h3>
    </div>
  );
}

export interface BranchChequeBookLotModalProps {
  open: boolean;
  initialData?: ChequeBookLotFormData;
  onClose?: () => void;
  onSave?: (data: ChequeBookLotFormData) => void;
}

export default function BranchChequeBookLotModal({ open, initialData = emptyChequeBookLotFormData, onClose, onSave }: BranchChequeBookLotModalProps) {
  const [formData, setFormData] = useState<ChequeBookLotFormData>(initialData);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ChequeBookLotFormData, boolean>>>({});

  useEffect(() => {
    setFormData(initialData);
    setValidated(false);
    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = <K extends keyof ChequeBookLotFormData>(key: K, value: ChequeBookLotFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleValidate = () => {
    const newErrors: Partial<Record<keyof ChequeBookLotFormData, boolean>> = {};
    REQUIRED_FIELDS.forEach((key) => {
      if (!formData[key]?.toString().trim()) newErrors[key] = true;
    });
    setErrors(newErrors);
    setValidated(Object.keys(newErrors).length === 0);
  };

  const handleSave = () => {
    if (!validated) return;
    onSave?.(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl dark:bg-slate-900"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white">
              <Smartphone size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black dark:text-slate-100">
                Branch Cheque Book Lot /<span className="font-bold text-[#64748B] dark:text-slate-400"> शाखा धनादेश पुस्तक लॉट</span>
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <SectionHeader icon={UserRound} titleEn="Branch Details" titleHi="शाखेचा तपशील" />
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
            <TextField labelEn="Branch Code" labelHi="शाखा कोड" icon={Landmark} placeholder="Enter Branch Code" value={formData.branchCode} onChange={(v) => handleChange("branchCode", v)} hasError={errors.branchCode} readOnly />
            <TextField labelEn="Branch Name" labelHi="शाखेचे नाव" icon={Landmark} placeholder="Enter Branch Name" value={formData.branchName} onChange={(v) => handleChange("branchName", v)} hasError={errors.branchName} readOnly />
            <SelectField
              labelEn="Account Type"
              labelHi="खात्याचा प्रकार"
              icon={UserRound}
              placeholder="Select Account Type"
              value={formData.accountType}
              options={ACCOUNT_TYPE_OPTIONS}
              onChange={(v) => handleChange("accountType", v)}
              hasError={errors.accountType}
              trailing={
                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#B8C2D6] bg-[#EEF4FF] text-primary transition-colors hover:bg-[#DCE9FF] dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <MoreVertical size={18} />
                </button>
              }
            />
          </div>
        </div>

        <div className="mt-4 bg-white rounded-[20px] border-x border-b border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-slate-900">
          <SectionHeader icon={IdCard} titleEn="Cheque Details" titleHi="तपशील तपासा" />
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
            <SelectField labelEn="Cheque Type" labelHi="चेक प्रकार" icon={IdCard} placeholder="Select Cheque Type" value={formData.chequeType} options={CHEQUE_TYPE_OPTIONS} onChange={(v) => handleChange("chequeType", v)} hasError={errors.chequeType} />
            <TextField labelEn="Cheque No From" labelHi="चेक क्रमांकापासून" icon={Hash} placeholder="Enter Cheque No From" value={formData.chequeNoFrom} onChange={(v) => handleChange("chequeNoFrom", v)} hasError={errors.chequeNoFrom} />
            <TextField labelEn="Cheque No To" labelHi="चेक क्रमांकापर्यंत" icon={Hash} placeholder="Enter Cheque No To" value={formData.chequeNoTo} onChange={(v) => handleChange("chequeNoTo", v)} hasError={errors.chequeNoTo} />

            <TextField labelEn="Leaves per Book" labelHi="प्रत्येक पुस्तकातील पानांची संख्या" icon={BookOpen} placeholder="Enter Leaves per Book" value={formData.leavesPerBook} onChange={(v) => handleChange("leavesPerBook", v)} hasError={errors.leavesPerBook} />
            <TextField labelEn="No Of Books" labelHi="धनादेश पुस्तकांची संख्या" icon={Layers} placeholder="Enter No Of Books" value={formData.noOfBooks} onChange={(v) => handleChange("noOfBooks", v)} hasError={errors.noOfBooks} />
            <TextField labelEn="Cheque Series" labelHi="चेक प्रकार" icon={Type} placeholder="Enter Cheque Series" value={formData.chequeSeries} onChange={(v) => handleChange("chequeSeries", v)} hasError={errors.chequeSeries} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button type="button" onClick={handleValidate} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
            Validate <Check size={16} />
          </button>
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50">
            Cancel <X size={16} />
          </button>
          <button
            type="button"
            disabled={!validated}
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${validated ? "bg-primary-100 text-primary hover:bg-primary-200" : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-600"
              }`}
          >
            Save <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
