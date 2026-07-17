// src/components/Authorization/BillAuthorize/IBCRealizeUnrealizeAuthorize.tsx
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
  ScrollText,
  Percent,
  Receipt,
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
  ibcDate: string;
  accountCode: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  drawersReferenceNo: string;
  payeeName: string;
  bankAddress1: string;
  address1: string;
  bankAddress2: string;
  address2: string;
  bankAddress3: string;
  address3: string;
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
  realizeUnrealize: string;
  realizeAccountCode: string;
  realizeAccountName: string;
  realizedAmount: string;
  scrollNumber: string;
  realizedInstrumentType: string;
  realizedInstrumentNo: string;
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
  const isDateField = field.key === "ibcDate" || field.key === "instrumentDate";

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

const IBC_DETAILS_FIELDS: FieldConfig[] = [
  { key: "serial", label: "Serial", labelHi: "अनुक्रमांक", placeholder: "Serial", icon: Hash },
  { key: "ibcDate", label: "IBC Date", labelHi: "आवक बिल तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
];

const PAYEE_DETAILS_FIELDS: FieldConfig[] = [
  { key: "bankCode", label: "Bank Code", labelHi: "बँक कोड", placeholder: "Enter Bank Code", icon: Building2 },
  { key: "bankName", label: "Bank Name", labelHi: "बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2 },
  { key: "branchCode", label: "Branch Code", labelHi: "शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark },
  { key: "branchName", label: "Branch Name", labelHi: "शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark },
  { key: "drawersReferenceNo", label: "Drawer's Reference No.", labelHi: "आहरक संदर्भ क्र.", placeholder: "Reference No.", icon: Hash },
  { key: "payeeName", label: "Payee Name", labelHi: "प्राप्तकर्त्याचे नाव", placeholder: "Payee Name", icon: User },
  { key: "bankAddress1", label: "Bank Address 1", labelHi: "बँक पत्ता १", placeholder: "Bank Address 1", icon: MapPin },
  { key: "address1", label: "Address 1", labelHi: "पत्ता १", placeholder: "Address 1", icon: MapPin },
  { key: "bankAddress2", label: "Bank Address 2", labelHi: "बँक पत्ता २", placeholder: "Bank Address 2", icon: MapPin },
  { key: "address2", label: "Address 2", labelHi: "पत्ता २", placeholder: "Address 2", icon: MapPin },
  { key: "bankAddress3", label: "Bank Address 3", labelHi: "बँक पत्ता ३", placeholder: "Bank Address 3", icon: MapPin },
  { key: "address3", label: "Address 3", labelHi: "पत्ता ३", placeholder: "Address 3", icon: MapPin },
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

const REALIZE_DETAILS_FIELDS: FieldConfig[] = [
  { key: "realizeUnrealize", label: "Realize / Unrealize", labelHi: "वसुली / अवसुली", placeholder: "Select", icon: Receipt, select: true, options: [{ value: "realize", label: "Realize" }, { value: "unrealize", label: "Unrealize" }] },
  { key: "realizeAccountCode", label: "Realize Account Code", labelHi: "वसुली खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "realizeAccountName", label: "Realize Account Name", labelHi: "वसुली खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
  { key: "realizedAmount", label: "Realized Amount", labelHi: "वसूल रक्कम", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "scrollNumber", label: "Scroll Number", labelHi: "स्क्रोल क्रमांक", placeholder: "Scroll Number", icon: ScrollText },
  { key: "realizedInstrumentType", label: "Realized Instrument Type", labelHi: "वसूल साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, select: true, options: [{ value: "cheque", label: "Cheque" }, { value: "dd", label: "Demand Draft" }] },
  { key: "realizedInstrumentNo", label: "Realized Instrument No.", labelHi: "वसूल साधन क्रमांक", placeholder: "Instrument No.", icon: Hash },
];

export interface IBCRealizeUnrealizeAuthorizeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function IBCRealizeUnrealizeAuthorizeModal({ open, onClose }: IBCRealizeUnrealizeAuthorizeModalProps) {
  if (!open) return null;

  const [formData] = useState<FormData>({
    serial: "001",
    ibcDate: "2026-07-18",
    accountCode: "0002",
    accountName: "name@company.com",
    bankCode: "SBI001",
    bankName: "State Bank of India",
    branchCode: "1230",
    branchName: "HO Branch",
    drawersReferenceNo: "REF001",
    payeeName: "Payee Name",
    bankAddress1: "Bank Address 1",
    address1: "Address 1",
    bankAddress2: "Bank Address 2",
    address2: "Address 2",
    bankAddress3: "Bank Address 3",
    address3: "Address 3",
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
    realizeUnrealize: "realize",
    realizeAccountCode: "0004",
    realizeAccountName: "Realize Account",
    realizedAmount: "10000",
    scrollNumber: "SCR001",
    realizedInstrumentType: "cheque",
    realizedInstrumentNo: "RINV001",
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

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="IBC Realize / Unrealize Authorize"
        titleHi="आयबीसी रियलाईज/अनरियलाईज अधिकृत"
        subtitleEn="View and authorize the IBC Realize/Unrealize entry."
        subtitleHi="आवक बिल रियलाईज/अनरियलाईज नोंद पहा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src="/person icon.png" alt="IBC Realize/Unrealize Authorize" width={40} height={40} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-5xl"
      >
        <SectionCard
          titleEn="IBC Details"
          titleHi="आवकीची तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<User size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {IBC_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payee Details"
          titleHi="प्राप्तकर्ता तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<Landmark size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {PAYEE_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Realize / Unrealize Details"
          titleHi="वसुली / अवसुली तपशील"
          subtitleEn="Manage customer's personal and identity information."
          subtitleHi="ग्राहकाची वैयक्तिक व संबंधित माहिती व्यवस्थापित करा."
          icon={<CreditCard size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {REALIZE_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

      // Footer
<div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
  <button
    onClick={() => setShowRejectReason(true)}
    className="flex items-center gap-1.5 rounded-lg border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
  >
    <Image src="/Reject.png" alt="Reject" width={16} height={16} />
    Reject
  </button>
  <button
    onClick={onClose}
    className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
  >
    <X size={16} />
    Cancel
  </button>
  <button
    onClick={handleAuthorize}
    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
  >
    <Check size={16} />
    Authorize
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