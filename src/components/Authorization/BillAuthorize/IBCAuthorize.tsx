// src/components/Authorization/BillAuthorize/IBCAuthorize.tsx
import React, { useState } from "react";
import {
  X,
  Check,
  Hash,
  Calendar,
  MapPin,
  User,
  Building2,
  Landmark,
  CreditCard,
  IndianRupee,
  Percent,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { SectionCard } from "@/components/shared/FormFields";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import RejectedModal from "@/components/shared/RejectedModal";
import SuccessModal from "@/components/shared/SuccessModal";

interface FormData {
  serial: string;
  drawersAccountCode: string;
  accountName: string;
  payeeBankCode: string;
  payeeBankName: string;
  payeeBranchCode: string;
  payeeBranchName: string;
  drawersReferenceNo: string;
  payeeName: string;
  payeeBankAddress1: string;
  payeeAddress1: string;
  payeeBankAddress2: string;
  payeeAddress2: string;
  payeeBankAddress3: string;
  payeeAddress3: string;
  instrumentType: string;
  instrumentDate: string;
  chequeType: string;
  chequeSeries: string;
  instrumentNumber: string;
  instrumentAmount: string;
  ddComm: string;
  ourBankCommi: string;
  postage: string;
  otherCharges: string;
  collectionBankCode: string;
  collectionBankName: string;
  collectionBranchCode: string;
  collectionBranchName: string;
  collectionBankAddress1: string;
  collectionBankAddress2: string;
  collectionBankAddress3: string;
  selectInstrument: string;
  collInstrumentType: string;
  collInstrumentDate: string;
  collChequeType: string;
  collChequeSeries: string;
  collInstrumentNumber: string;
  collInstrumentAmount: string;
}

interface FieldConfig {
  key: keyof FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
}

function FormField({ field, value }: { field: FieldConfig; value: string }) {
  const Icon = field.icon;
  const isDateField = field.key === "instrumentDate" || field.key === "collInstrumentDate";

  if (field.select) {
    return (
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
          {field.label}
          <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
          <select value={value} disabled className="w-full h-8 rounded-[10px] border pl-8 pr-3 text-[11px] outline-none focus:ring-1 appearance-none bg-[#f0f2f5] text-slate-500 cursor-not-allowed border-slate-200">
            <option value="">{field.placeholder}</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  if (isDateField) {
    return (
      <div>
        <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
          {field.label}
          <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 z-10 text-slate-400 cursor-default"><Calendar size={16} /></span>
          <input type="date" value={value} disabled className="min-h-[32px] w-full rounded-lg border bg-[#f0f2f5] border-slate-200 cursor-not-allowed py-1.5 pl-10 pr-3 text-[11px] text-slate-500 outline-none" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {field.label}
        <span className="text-slate-400 font-normal"> / {field.labelHi}</span>
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center w-full h-8 rounded-[10px] border px-2.5 bg-[#f0f2f5] border-slate-200 cursor-not-allowed">
          <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input type="text" placeholder={field.placeholder} value={value} disabled className="ml-2 w-full bg-transparent outline-none text-[11px] text-slate-500 cursor-not-allowed placeholder:text-[11px] placeholder:text-slate-400" />
        </div>
      </div>
    </div>
  );
}

const ACCOUNT_DETAILS_FIELDS: FieldConfig[] = [
  { key: "serial", label: "Serial", labelHi: "अनुक्रमांक", placeholder: "Serial", icon: Hash },
  { key: "drawersAccountCode", label: "Drawer's Account Code", labelHi: "आहरक खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
];

const PAYEE_TRANSACTION_FIELDS: FieldConfig[] = [
  { key: "payeeBankCode", label: "Payee Bank Code", labelHi: "प्राप्तकर्ता बँक कोड", placeholder: "Enter Bank Code", icon: Building2 },
  { key: "payeeBankName", label: "Payee Bank Name", labelHi: "प्राप्तकर्ता बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2 },
  { key: "payeeBranchCode", label: "Payee Branch Code", labelHi: "प्राप्तकर्ता शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark },
  { key: "payeeBranchName", label: "Payee Branch Name", labelHi: "प्राप्तकर्ता शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark },
  { key: "drawersReferenceNo", label: "Drawer's Reference No.", labelHi: "आहरक संदर्भ क्र.", placeholder: "Reference No.", icon: Hash },
  { key: "payeeName", label: "Payee Name", labelHi: "प्राप्तकर्त्याचे नाव", placeholder: "Payee Name", icon: User },
  { key: "payeeBankAddress1", label: "Payee Bank Address1", labelHi: "प्राप्तकर्ता बँक पत्ता १", placeholder: "Bank Address 1", icon: MapPin },
  { key: "payeeAddress1", label: "Payee Address1", labelHi: "प्राप्तकर्ता पत्ता १", placeholder: "Address 1", icon: MapPin },
  { key: "payeeBankAddress2", label: "Payee Bank Address2", labelHi: "प्राप्तकर्ता बँक पत्ता २", placeholder: "Bank Address 2", icon: MapPin },
  { key: "payeeAddress2", label: "Payee Address 2", labelHi: "प्राप्तकर्ता पत्ता २", placeholder: "Address 2", icon: MapPin },
  { key: "payeeBankAddress3", label: "Payee Bank Address3", labelHi: "प्राप्तकर्ता बँक पत्ता ३", placeholder: "Bank Address 3", icon: MapPin },
  { key: "payeeAddress3", label: "Payee Address3", labelHi: "प्राप्तकर्ता पत्ता ३", placeholder: "Address 3", icon: MapPin },
  { key: "instrumentType", label: "Instrument Type", labelHi: "साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, select: true, options: [{ value: "cheque", label: "Cheque" }, { value: "dd", label: "Demand Draft" }] },
  { key: "instrumentDate", label: "Instrument Date", labelHi: "साधन तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "chequeType", label: "Cheque Type", labelHi: "चेक प्रकार", placeholder: "Select Cheque Type", icon: FileText, select: true, options: [{ value: "bearer", label: "Bearer" }, { value: "order", label: "Order" }] },
  { key: "chequeSeries", label: "Cheque Series", labelHi: "चेक मालिका", placeholder: "Cheque Series", icon: Hash },
  { key: "instrumentNumber", label: "Instrument Number", labelHi: "साधन क्रमांक", placeholder: "Instrument Number", icon: Hash },
  { key: "instrumentAmount", label: "Instrument Amount", labelHi: "साधन रक्कम", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "ddComm", label: "D.D. Comm.", labelHi: "डीडी कमिशन", placeholder: "Enter Amount", icon: Percent },
  { key: "ourBankCommi", label: "Our Bank Commi.", labelHi: "आमचे बँक कमिशन", placeholder: "Enter Amount", icon: Percent },
  { key: "postage", label: "Postage", labelHi: "टपाल खर्च", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "otherCharges", label: "Other Charges", labelHi: "इतर शुल्क", placeholder: "Enter Amount", icon: IndianRupee },
];

const COLLECTION_TEXT_FIELDS: FieldConfig[] = [
  { key: "collectionBankCode", label: "Collection Bank Code", labelHi: "संकलन बँक कोड", placeholder: "Enter Bank Code", icon: Building2 },
  { key: "collectionBankName", label: "Collection Bank Name", labelHi: "संकलन बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2 },
  { key: "collectionBranchCode", label: "Collection Branch Code", labelHi: "संकलन शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark },
  { key: "collectionBranchName", label: "Collection Branch Name", labelHi: "संकलन शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark },
  { key: "collectionBankAddress1", label: "Collection Bank Address 1", labelHi: "संकलन बँक पत्ता १", placeholder: "Address 1", icon: MapPin },
  { key: "collectionBankAddress2", label: "Collection Bank Address 2", labelHi: "संकलन बँक पत्ता २", placeholder: "Address 2", icon: MapPin },
  { key: "selectInstrument", label: "Select Instrument", labelHi: "साधन निवडा", placeholder: "Select Instrument", icon: CreditCard, select: true, options: [{ value: "cheque", label: "Cheque" }, { value: "dd", label: "Demand Draft" }] },
  { key: "collectionBankAddress3", label: "Collection Bank Address 3", labelHi: "संकलन बँक पत्ता ३", placeholder: "Address 3", icon: MapPin },
  { key: "collInstrumentType", label: "Instrument Type", labelHi: "साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, select: true, options: [{ value: "cheque", label: "Cheque" }, { value: "dd", label: "Demand Draft" }] },
  { key: "collInstrumentDate", label: "Instrument Date", labelHi: "साधन तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "collChequeType", label: "Cheque Type", labelHi: "चेक प्रकार", placeholder: "Select Cheque Type", icon: FileText, select: true, options: [{ value: "bearer", label: "Bearer" }, { value: "order", label: "Order" }] },
  { key: "collChequeSeries", label: "Cheque Series", labelHi: "चेक मालिका", placeholder: "Cheque Series", icon: Hash },
  { key: "collInstrumentNumber", label: "Instrument Number", labelHi: "साधन क्रमांक", placeholder: "Instrument Number", icon: Hash },
  { key: "collInstrumentAmount", label: "Instrument Amount", labelHi: "साधन रक्कम", placeholder: "Enter Amount", icon: IndianRupee },
];

export interface IBCAuthorizeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function IBCAuthorizeModal({ open, onClose }: IBCAuthorizeModalProps) {
  // Don't return null early - let it render but hide with CSS
  const [formData] = useState<FormData>({
    serial: "001",
    drawersAccountCode: "0002",
    accountName: "name@company.com",
    payeeBankCode: "SBI001",
    payeeBankName: "State Bank of India",
    payeeBranchCode: "1230",
    payeeBranchName: "HO Branch",
    drawersReferenceNo: "REF001",
    payeeName: "Payee Name",
    payeeBankAddress1: "Bank Address 1",
    payeeAddress1: "Address 1",
    payeeBankAddress2: "Bank Address 2",
    payeeAddress2: "Address 2",
    payeeBankAddress3: "Bank Address 3",
    payeeAddress3: "Address 3",
    instrumentType: "cheque",
    instrumentDate: "2026-07-18",
    chequeType: "bearer",
    chequeSeries: "CHQ001",
    instrumentNumber: "INV001",
    instrumentAmount: "10000",
    ddComm: "0",
    ourBankCommi: "0",
    postage: "0",
    otherCharges: "0",
    collectionBankCode: "HDFC002",
    collectionBankName: "HDFC Bank",
    collectionBranchCode: "1240",
    collectionBranchName: "City Branch",
    collectionBankAddress1: "Collection Address 1",
    collectionBankAddress2: "Collection Address 2",
    collectionBankAddress3: "Collection Address 3",
    selectInstrument: "cheque",
    collInstrumentType: "cheque",
    collInstrumentDate: "2026-07-18",
    collChequeType: "bearer",
    collChequeSeries: "CHQ002",
    collInstrumentNumber: "INV002",
    collInstrumentAmount: "5000",
  });

  const [showRejectReason, setShowRejectReason] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReject = (reason: string) => {
    console.log("Rejection reason:", reason);
    setShowRejectReason(false);
    setShowRejected(true);
  };

  const handleAuthorize = () => setShowSuccess(true);
  const handleRejectedDone = () => { setShowRejected(false); onClose(); };
  const handleSuccessClose = () => { setShowSuccess(false); onClose(); };

  const grid4 = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";

  // Hide modal when not open using CSS instead of early return
  if (!open) return null;

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="IBC Authorize"
        titleHi="आयबीसी अधिकृत"
        subtitleEn="View and authorize the Inward Bill Collection entry."
        subtitleHi="आवक बिल संकलन नोंद पहा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src="/person icon.png" alt="IBC Authorize" width={40} height={40} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-5xl"
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<User size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {ACCOUNT_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payee Transaction Details"
          titleHi="प्राप्तकर्ता व्यवहार तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<Landmark size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {PAYEE_TRANSACTION_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Collection Transaction Details"
          titleHi="संकलन व्यवहार तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<Building2 size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {COLLECTION_TEXT_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={() => setShowRejectReason(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            Reject <X size={16} />
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary-50"
          >
            Cancel <X size={16} />
          </button>
          <button
            onClick={handleAuthorize}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Authorize <Check size={16} />
          </button>
        </div>
      </FormModal>

      {showRejectReason && (
        <RejectReasonModal
          onClose={() => setShowRejectReason(false)}
          onConfirm={handleReject}
          titleEn="Reason for Rejection"
          titleHi="नाकारण्याचे कारण"
        />
      )}

      {showRejected && (
        <RejectedModal
          onClose={handleRejectedDone}
          onDone={handleRejectedDone}
          title="IBC Entry Rejected"
          subtitle="The Inward Bill Collection entry has been rejected."
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
          title="IBC Entry Authorized Successfully"
          subtitle="The Inward Bill Collection entry has been authorized."
        />
      )}
    </>
  );
}