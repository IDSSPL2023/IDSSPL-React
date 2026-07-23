import { IMAGES } from "@/assets";
import React, { useState, useMemo } from "react";
import { X, Check, Hash, Calendar, MapPin, User, Building2, Landmark, CreditCard, IndianRupee, Percent, FileText, ScrollText, Receipt, ArrowLeftRight, Banknote, History, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { SectionCard } from "@/components/shared/FormFields";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import RejectedModal from "@/components/shared/RejectedModal";
import SuccessModal from "@/components/shared/SuccessModal";
import { useBilingual } from "@/i18n/useBilingual";

/* ===== from IBCAuthorize.tsx ===== */
interface IBCAuthorize_FormData {
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

interface IBCAuthorize_FieldConfig {
  key: keyof IBCAuthorize_FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
}

function IBCAuthorize_FormField({ field, value }: { field: IBCAuthorize_FieldConfig; value: string }) {
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

const IBCAuthorize_ACCOUNT_DETAILS_FIELDS: IBCAuthorize_FieldConfig[] = [
  { key: "serial", label: "Serial", labelHi: "अनुक्रमांक", placeholder: "Serial", icon: Hash },
  { key: "drawersAccountCode", label: "Drawer's Account Code", labelHi: "आहरक खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
];

const IBCAuthorize_PAYEE_TRANSACTION_FIELDS: IBCAuthorize_FieldConfig[] = [
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

const IBCAuthorize_COLLECTION_TEXT_FIELDS: IBCAuthorize_FieldConfig[] = [
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

export interface IBCAuthorize_IBCAuthorizeModalProps {
  open: boolean;
  onClose: () => void;
}

function IBCAuthorizeModal({ open, onClose }: IBCAuthorize_IBCAuthorizeModalProps) {
  // Don't return null early - let it render but hide with CSS
  const [formData] = useState<IBCAuthorize_FormData>({
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
            <Image src={IMAGES.PERSON_ICON} alt="IBC Authorize" width={40} height={40} />
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
            {IBCAuthorize_ACCOUNT_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <IBCAuthorize_FormField field={field} value={formData[field.key] || ""} />
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
            {IBCAuthorize_PAYEE_TRANSACTION_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <IBCAuthorize_FormField field={field} value={formData[field.key] || ""} />
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
            {IBCAuthorize_COLLECTION_TEXT_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <IBCAuthorize_FormField field={field} value={formData[field.key] || ""} />
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


/* ===== from IBCRealizeUnrealizeAuthorize.tsx ===== */
interface IBCRealizeUnrealizeAuthorize_FormData {
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

interface IBCRealizeUnrealizeAuthorize_FieldConfig {
  key: keyof IBCRealizeUnrealizeAuthorize_FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
}

function IBCRealizeUnrealizeAuthorize_FormField({ field, value }: { field: IBCRealizeUnrealizeAuthorize_FieldConfig; value: string }) {
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

const IBCRealizeUnrealizeAuthorize_IBC_DETAILS_FIELDS: IBCRealizeUnrealizeAuthorize_FieldConfig[] = [
  { key: "serial", label: "Serial", labelHi: "अनुक्रमांक", placeholder: "Serial", icon: Hash },
  { key: "ibcDate", label: "IBC Date", labelHi: "आवक बिल तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
];

const IBCRealizeUnrealizeAuthorize_PAYEE_DETAILS_FIELDS: IBCRealizeUnrealizeAuthorize_FieldConfig[] = [
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

const IBCRealizeUnrealizeAuthorize_REALIZE_DETAILS_FIELDS: IBCRealizeUnrealizeAuthorize_FieldConfig[] = [
  { key: "realizeUnrealize", label: "Realize / Unrealize", labelHi: "वसुली / अवसुली", placeholder: "Select", icon: Receipt, select: true, options: [{ value: "realize", label: "Realize" }, { value: "unrealize", label: "Unrealize" }] },
  { key: "realizeAccountCode", label: "Realize Account Code", labelHi: "वसुली खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "realizeAccountName", label: "Realize Account Name", labelHi: "वसुली खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
  { key: "realizedAmount", label: "Realized Amount", labelHi: "वसूल रक्कम", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "scrollNumber", label: "Scroll Number", labelHi: "स्क्रोल क्रमांक", placeholder: "Scroll Number", icon: ScrollText },
  { key: "realizedInstrumentType", label: "Realized Instrument Type", labelHi: "वसूल साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, select: true, options: [{ value: "cheque", label: "Cheque" }, { value: "dd", label: "Demand Draft" }] },
  { key: "realizedInstrumentNo", label: "Realized Instrument No.", labelHi: "वसूल साधन क्रमांक", placeholder: "Instrument No.", icon: Hash },
];

export interface IBCRealizeUnrealizeAuthorize_IBCRealizeUnrealizeAuthorizeModalProps {
  open: boolean;
  onClose: () => void;
}

function IBCRealizeUnrealizeAuthorizeModal({ open, onClose }: IBCRealizeUnrealizeAuthorize_IBCRealizeUnrealizeAuthorizeModalProps) {
  if (!open) return null;

  const [formData] = useState<IBCRealizeUnrealizeAuthorize_FormData>({
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
            <Image src={IMAGES.PERSON_ICON} alt="IBC Realize/Unrealize Authorize" width={40} height={40} />
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
            {IBCRealizeUnrealizeAuthorize_IBC_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <IBCRealizeUnrealizeAuthorize_FormField field={field} value={formData[field.key] || ""} />
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
            {IBCRealizeUnrealizeAuthorize_PAYEE_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <IBCRealizeUnrealizeAuthorize_FormField field={field} value={formData[field.key] || ""} />
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
            {IBCRealizeUnrealizeAuthorize_REALIZE_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <IBCRealizeUnrealizeAuthorize_FormField field={field} value={formData[field.key] || ""} />
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
    <Image src={IMAGES.REJECT} alt="Reject" width={16} height={16} />
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


/* ===== from OBCAuthorize.tsx ===== */
interface OBCAuthorize_FormData {
  serialNo: string;
  obcDate: string;
  accountCode: string;
  accountName: string;
  drawerBankCode: string;
  drawerBankName: string;
  drawerBranchCode: string;
  drawerBranchName: string;
  outlistSerialNo: string;
  glOutlistDescription: string;
  glOutListDocNo: string;
  drawerName: string;
  drawerAddressLine1: string;
  drawerAddressLine2: string;
  drawerAddressLine3: string;
  collectionBankCode: string;
  collectionBankName: string;
  collectionBranchCode: string;
  collectionBranchName: string;
  collectionBankAddressLine1: string;
  collectionBankAddressLine2: string;
  collectionBankAddressLine3: string;
  instrumentType: string;
  instrumentNumber: string;
  instrumentDate: string;
  instrumentAmount: string;
  scrollNumber: string;
}

interface OBCAuthorize_FieldConfig {
  key: keyof OBCAuthorize_FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
}

function OBCAuthorize_FormField({ field, value }: { field: OBCAuthorize_FieldConfig; value: string }) {
  const Icon = field.icon;
  const isDateField = field.key === "obcDate" || field.key === "instrumentDate";

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

const OBCAuthorize_ACCOUNT_DETAILS_FIELDS: OBCAuthorize_FieldConfig[] = [
  { key: "serialNo", label: "Serial No.", labelHi: "अनुक्रमांक", placeholder: "Serial No.", icon: Hash },
  { key: "obcDate", label: "OBC Date", labelHi: "जावक बिल तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
];

const OBCAuthorize_DRAWER_DETAILS_FIELDS: OBCAuthorize_FieldConfig[] = [
  { key: "drawerBankCode", label: "Bank Code", labelHi: "बँक कोड", placeholder: "Enter Bank Code", icon: Building2 },
  { key: "drawerBankName", label: "Bank Name", labelHi: "बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2 },
  { key: "drawerBranchCode", label: "Branch Code", labelHi: "शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark },
  { key: "drawerBranchName", label: "Branch Name", labelHi: "शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark },
  { key: "outlistSerialNo", label: "Outlist Serial No.", labelHi: "आउटलिस्ट अनुक्रमांक", placeholder: "Outlist Serial No.", icon: Hash },
  { key: "glOutlistDescription", label: "GL Outlist Description", labelHi: "जीएल आउटलिस्ट वर्णन", placeholder: "GL Outlist Description", icon: FileText },
  { key: "glOutListDocNo", label: "GL OutList Doc. No.", labelHi: "जीएल आउटलिस्ट दस्तऐवज क्र.", placeholder: "GL OutList Doc No.", icon: Receipt },
  { key: "drawerName", label: "Drawer Name", labelHi: "आहरकाचे नाव", placeholder: "Drawer Name", icon: User },
  { key: "drawerAddressLine1", label: "Drawer Address Line 1", labelHi: "आहरक पत्ता ओळ १", placeholder: "Address Line 1", icon: MapPin },
  { key: "drawerAddressLine2", label: "Drawer Address Line 2", labelHi: "आहरक पत्ता ओळ २", placeholder: "Address Line 2", icon: MapPin },
  { key: "drawerAddressLine3", label: "Drawer Address Line 3", labelHi: "आहरक पत्ता ओळ ३", placeholder: "Address Line 3", icon: MapPin },
];

const OBCAuthorize_COLLECTION_DETAILS_FIELDS: OBCAuthorize_FieldConfig[] = [
  { key: "collectionBankCode", label: "Bank Code", labelHi: "बँक कोड", placeholder: "Enter Bank Code", icon: Building2 },
  { key: "collectionBankName", label: "Bank Name", labelHi: "बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2 },
  { key: "collectionBranchCode", label: "Branch Code", labelHi: "शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark },
  { key: "collectionBranchName", label: "Branch Name", labelHi: "शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark },
  { key: "collectionBankAddressLine1", label: "Bank Address Line 1", labelHi: "बँक पत्ता ओळ १", placeholder: "Address Line 1", icon: MapPin },
  { key: "collectionBankAddressLine2", label: "Bank Address Line 2", labelHi: "बँक पत्ता ओळ २", placeholder: "Address Line 2", icon: MapPin },
  { key: "collectionBankAddressLine3", label: "Bank Address Line 3", labelHi: "बँक पत्ता ओळ ३", placeholder: "Address Line 3", icon: MapPin },
];

const OBCAuthorize_INSTRUMENT_DETAILS_FIELDS: OBCAuthorize_FieldConfig[] = [
  { key: "instrumentType", label: "Instrument Type", labelHi: "साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, select: true, options: [{ value: "cheque", label: "Cheque" }, { value: "dd", label: "Demand Draft" }] },
  { key: "instrumentNumber", label: "Instrument Number", labelHi: "साधन क्रमांक", placeholder: "Instrument Number", icon: Hash },
  { key: "instrumentDate", label: "Instrument Date", labelHi: "साधन तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "instrumentAmount", label: "Instrument Amount", labelHi: "साधन रक्कम", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "scrollNumber", label: "Scroll Number", labelHi: "स्क्रोल क्रमांक", placeholder: "Scroll Number", icon: ScrollText },
];

export interface OBCAuthorize_OBCAuthorizeModalProps {
  open: boolean;
  onClose: () => void;
}

function OBCAuthorizeModal({ open, onClose }: OBCAuthorize_OBCAuthorizeModalProps) {
  if (!open) return null;

  const [formData] = useState<OBCAuthorize_FormData>({
    serialNo: "001",
    obcDate: "2026-07-18",
    accountCode: "0002",
    accountName: "name@company.com",
    drawerBankCode: "SBI001",
    drawerBankName: "State Bank of India",
    drawerBranchCode: "1230",
    drawerBranchName: "HO Branch",
    outlistSerialNo: "OUT001",
    glOutlistDescription: "GL Description",
    glOutListDocNo: "DOC001",
    drawerName: "Drawer Name",
    drawerAddressLine1: "Address Line 1",
    drawerAddressLine2: "Address Line 2",
    drawerAddressLine3: "Address Line 3",
    collectionBankCode: "HDFC002",
    collectionBankName: "HDFC Bank",
    collectionBranchCode: "1240",
    collectionBranchName: "City Branch",
    collectionBankAddressLine1: "Collection Address 1",
    collectionBankAddressLine2: "Collection Address 2",
    collectionBankAddressLine3: "Collection Address 3",
    instrumentType: "cheque",
    instrumentNumber: "INV001",
    instrumentDate: "2026-07-18",
    instrumentAmount: "10000",
    scrollNumber: "SCR001",
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
        titleEn="OBC Authorize"
        titleHi="ओबीसी अधिकृत"
        subtitleEn="View and authorize the Outward Bill Collection entry."
        subtitleHi="जावक बिल वसुली नोंद पहा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src={IMAGES.PERSON_ICON} alt="OBC Authorize" width={40} height={40} />
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
          titleHi="खात्याची तपशील"
          subtitleEn="Enter the account details for outward bill collection."
          subtitleHi="जावक बिल वसुलीसाठी खात्याचा तपशील भरा."
          icon={<User size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {OBCAuthorize_ACCOUNT_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <OBCAuthorize_FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Drawer Details"
          titleHi="आहरकाची तपशील"
          subtitleEn="Select the branch and transaction details before recording cash denominations."
          subtitleHi="रोख रक्कम नोंदवण्यापूर्वी शाखा व व्यवहाराचा तपशील निवडा."
          icon={<Landmark size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {OBCAuthorize_DRAWER_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <OBCAuthorize_FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Collection Details"
          titleHi="वसुली तपशील"
          subtitleEn="Select the branch and transaction details before recording cash denominations."
          subtitleHi="रोख रक्कम नोंदवण्यापूर्वी शाखा व व्यवहाराचा तपशील निवडा."
          icon={<Building2 size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {OBCAuthorize_COLLECTION_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <OBCAuthorize_FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Instrument Details"
          titleHi="साधन तपशील"
          subtitleEn="Select the branch and transaction details before recording cash denominations."
          subtitleHi="रोख रक्कम नोंदवण्यापूर्वी शाखा व व्यवहाराचा तपशील निवडा."
          icon={<CreditCard size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {OBCAuthorize_INSTRUMENT_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <OBCAuthorize_FormField field={field} value={formData[field.key] || ""} />
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
          title="OBC Entry Rejected"
          subtitle="The Outward Bill Collection entry has been rejected."
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
          title="OBC Entry Authorized Successfully"
          subtitle="The Outward Bill Collection entry has been authorized."
        />
      )}
    </>
  );
}


/* ===== from OBCRealizeUnrealizeAuthorize.tsx ===== */
interface OBCRealizeUnrealizeAuthorize_FormData {
  serialNo: string;
  obcDate: string;
  accountCode: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  instrumentType: string;
  instrumentNumber: string;
  instrumentDate: string;
  instrumentAmount: string;
  drawerName: string;
  drawerAddressLine1: string;
  drawerAddressLine2: string;
  drawerAddressLine3: string;
  bankAddressLine1: string;
  bankAddressLine2: string;
  bankAddressLine3: string;
  scrollNumber: string;
  realizeUnrealize: string;
  paymentMode: string;
  realizeAccountCode: string;
  realizeAccountName: string;
  realizeBankCode: string;
  realizeBankName: string;
  realizeBranchCode: string;
  realizeBranchName: string;
  adviceNumber: string;
  realizedAmount: string;
  otherBankCommission: string;
  ourBankCommission: string;
  postage: string;
  otherCharges: string;
  serviceTax: string;
}

interface OBCRealizeUnrealizeAuthorize_FieldConfig {
  key: keyof OBCRealizeUnrealizeAuthorize_FormData;
  label: string;
  labelHi: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
}

function OBCRealizeUnrealizeAuthorize_FormField({ field, value }: { field: OBCRealizeUnrealizeAuthorize_FieldConfig; value: string }) {
  const Icon = field.icon;
  const isDateField = field.key === "obcDate" || field.key === "instrumentDate";

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

const OBCRealizeUnrealizeAuthorize_OBC_DETAILS_FIELDS: OBCRealizeUnrealizeAuthorize_FieldConfig[] = [
  { key: "serialNo", label: "Serial No.", labelHi: "अनुक्रमांक", placeholder: "Serial No.", icon: Hash },
  { key: "obcDate", label: "OBC Date", labelHi: "जावक बिल तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
];

const OBCRealizeUnrealizeAuthorize_DRAWER_DETAILS_FIELDS: OBCRealizeUnrealizeAuthorize_FieldConfig[] = [
  { key: "bankCode", label: "Bank Code", labelHi: "बँक कोड", placeholder: "Enter Bank Code", icon: Building2 },
  { key: "bankName", label: "Bank Name", labelHi: "बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2 },
  { key: "branchCode", label: "Branch Code", labelHi: "शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark },
  { key: "branchName", label: "Branch Name", labelHi: "शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark },
  { key: "instrumentType", label: "Instrument Type", labelHi: "साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, select: true, options: [{ value: "cheque", label: "Cheque" }, { value: "dd", label: "Demand Draft" }] },
  { key: "instrumentNumber", label: "Instrument Number", labelHi: "साधन क्रमांक", placeholder: "Instrument Number", icon: Hash },
  { key: "instrumentDate", label: "Instrument Date", labelHi: "साधन तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "instrumentAmount", label: "Instrument Amount", labelHi: "साधन रक्कम", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "drawerName", label: "Drawer Name", labelHi: "आहरकाचे नाव", placeholder: "Drawer Name", icon: User },
  { key: "drawerAddressLine1", label: "Drawer Address Line 1", labelHi: "आहरक पत्ता ओळ १", placeholder: "Address Line 1", icon: MapPin },
  { key: "drawerAddressLine2", label: "Drawer Address Line 2", labelHi: "आहरक पत्ता ओळ २", placeholder: "Address Line 2", icon: MapPin },
  { key: "drawerAddressLine3", label: "Drawer Address Line 3", labelHi: "आहरक पत्ता ओळ ३", placeholder: "Address Line 3", icon: MapPin },
  { key: "bankAddressLine1", label: "Bank Address Line 1", labelHi: "बँक पत्ता ओळ १", placeholder: "Address Line 1", icon: MapPin },
  { key: "bankAddressLine2", label: "Bank Address Line 2", labelHi: "बँक पत्ता ओळ २", placeholder: "Address Line 2", icon: MapPin },
  { key: "bankAddressLine3", label: "Bank Address Line 3", labelHi: "बँक पत्ता ओळ ३", placeholder: "Address Line 3", icon: MapPin },
  { key: "scrollNumber", label: "Scroll Number", labelHi: "स्क्रोल क्रमांक", placeholder: "Scroll Number", icon: ScrollText },
];

const OBCRealizeUnrealizeAuthorize_REALIZATION_TEXT_FIELDS: OBCRealizeUnrealizeAuthorize_FieldConfig[] = [
  { key: "paymentMode", label: "Payment Mode", labelHi: "भरणा पद्धत", placeholder: "Select Payment Mode", icon: CreditCard, select: true, options: [{ value: "cash", label: "Cash" }, { value: "transfer", label: "Transfer" }] },
  { key: "realizeAccountCode", label: "Realize Account Code", labelHi: "वसुली खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "realizeAccountName", label: "Realize Account Name", labelHi: "वसुली खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
  { key: "realizeBankCode", label: "Realize Bank Code", labelHi: "वसुली बँक कोड", placeholder: "Enter Bank Code", icon: Building2 },
  { key: "realizeBankName", label: "Realize Bank Name", labelHi: "वसुली बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2 },
  { key: "realizeBranchCode", label: "Realize Branch Code", labelHi: "वसुली शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark },
  { key: "realizeBranchName", label: "Realize Branch Name", labelHi: "वसुली शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark },
  { key: "adviceNumber", label: "Advice Number", labelHi: "सूचना क्रमांक", placeholder: "Advice Number", icon: Receipt },
  { key: "realizedAmount", label: "Realized Amount", labelHi: "वसूल रक्कम", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "otherBankCommission", label: "Other Bank Commission", labelHi: "इतर बँक कमिशन", placeholder: "Enter Amount", icon: Percent },
  { key: "ourBankCommission", label: "Our Bank Commission", labelHi: "आमचे बँक कमिशन", placeholder: "Enter Amount", icon: Percent },
  { key: "postage", label: "Postage", labelHi: "टपाल खर्च", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "otherCharges", label: "Other Charges", labelHi: "इतर शुल्क", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "serviceTax", label: "Service Tax", labelHi: "सेवा कर", placeholder: "Enter Amount", icon: Percent },
];

export interface OBCRealizeUnrealizeAuthorize_OBCRealizeUnrealizeAuthorizeModalProps {
  open: boolean;
  onClose: () => void;
}

function OBCRealizeUnrealizeAuthorizeModal({ open, onClose }: OBCRealizeUnrealizeAuthorize_OBCRealizeUnrealizeAuthorizeModalProps) {
  if (!open) return null;

  const [formData] = useState<OBCRealizeUnrealizeAuthorize_FormData>({
    serialNo: "001",
    obcDate: "2026-07-18",
    accountCode: "0002",
    accountName: "name@company.com",
    bankCode: "SBI001",
    bankName: "State Bank of India",
    branchCode: "1230",
    branchName: "HO Branch",
    instrumentType: "cheque",
    instrumentNumber: "INV001",
    instrumentDate: "2026-07-18",
    instrumentAmount: "10000",
    drawerName: "Drawer Name",
    drawerAddressLine1: "Address Line 1",
    drawerAddressLine2: "Address Line 2",
    drawerAddressLine3: "Address Line 3",
    bankAddressLine1: "Bank Address 1",
    bankAddressLine2: "Bank Address 2",
    bankAddressLine3: "Bank Address 3",
    scrollNumber: "SCR001",
    realizeUnrealize: "no",
    paymentMode: "cash",
    realizeAccountCode: "0004",
    realizeAccountName: "Realize Account",
    realizeBankCode: "HDFC002",
    realizeBankName: "HDFC Bank",
    realizeBranchCode: "1240",
    realizeBranchName: "City Branch",
    adviceNumber: "ADV001",
    realizedAmount: "10000",
    otherBankCommission: "0",
    ourBankCommission: "0",
    postage: "0",
    otherCharges: "0",
    serviceTax: "0",
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
        titleEn="OBC Realize / Unrealize Authorize"
        titleHi="ओबीसी रियलाईज/अनरियलाईज अधिकृत"
        subtitleEn="View and authorize the OBC Realize/Unrealize entry."
        subtitleHi="जावक बिल रियलाईज/अनरियलाईज नोंद पहा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src={IMAGES.PERSON_ICON} alt="OBC Realize/Unrealize Authorize" width={40} height={40} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-5xl"
      >
        <SectionCard
          titleEn="OBC Details"
          titleHi="खात्याचा तपशील"
          subtitleEn="Enter the account details for outward bill collection."
          subtitleHi="जावक बिल वसुलीसाठी खात्याचा तपशील भरा."
          icon={<User size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {OBCRealizeUnrealizeAuthorize_OBC_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <OBCRealizeUnrealizeAuthorize_FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Drawer Details"
          titleHi="आहरकाची तपशील"
          subtitleEn="Select the branch and transaction details before recording cash denominations."
          subtitleHi="रोख रक्कम नोंदवण्यापूर्वी शाखा व व्यवहाराचा तपशील निवडा."
          icon={<Landmark size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            {OBCRealizeUnrealizeAuthorize_DRAWER_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <OBCRealizeUnrealizeAuthorize_FormField field={field} value={formData[field.key] || ""} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Realization Details"
          titleHi="वसुलीचा तपशील"
          subtitleEn="Select the branch and transaction details before recording cash denominations."
          subtitleHi="रोख रक्कम नोंदवण्यापूर्वी शाखा व व्यवहाराचा तपशील निवडा."
          icon={<CreditCard size={20} className="text-primary" />}
        >
          <div className={`${grid4} mt-2`}>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Realize / Unrealize <span className="text-slate-400 font-normal">/ वसुली</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2 text-[11px] text-slate-500 cursor-not-allowed">
                  <input type="radio" checked={formData.realizeUnrealize === "yes"} disabled className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] text-slate-500 cursor-not-allowed">
                  <input type="radio" checked={formData.realizeUnrealize === "no"} disabled className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium">No</span>
                </label>
              </div>
            </div>
            {OBCRealizeUnrealizeAuthorize_REALIZATION_TEXT_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <OBCRealizeUnrealizeAuthorize_FormField field={field} value={formData[field.key] || ""} />
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
          title="OBC Entry Rejected"
          subtitle="The Outward Bill Collection entry has been rejected."
        />
      )}

      {showSuccess && (
        <SuccessModal
          onClose={handleSuccessClose}
          onDone={handleSuccessClose}
          title="OBC Entry Authorized Successfully"
          subtitle="The Outward Bill Collection entry has been authorized."
        />
      )}
    </>
  );
}


/* ===== from BillAuthorizationOptions.tsx ===== */
const ICON_MAP = {
  Landmark,
  ArrowLeftRight,
  Banknote,
  History,
};

const BILL_OPTIONS = [
  {
    key: "ibc-authorize",
    icon: "Landmark",
    titleEn: "IBC Authorize",
    titleHi: "आयबीसी अधिकृत करा",
  },
  {
    key: "ibc-realize-unrealize-authorize",
    icon: "ArrowLeftRight",
    titleEn: "IBC Realize Unrealize Authorize",
    titleHi: "आयबीसी रिअलाइझ अनरिअलाइझ अधिकृत करा",
  },
  {
    key: "obc-authorize",
    icon: "Banknote",
    titleEn: "OBC Authorize",
    titleHi: "ओबीसी अधिकृत करा",
  },
  {
    key: "obc-realize-unrealize-authorize",
    icon: "History",
    titleEn: "OBC Realize Unrealize Authorize",
    titleHi: "ओबीसी रिअलाइझ अनरिअलाइझ अधिकृत करा",
  },
];

export default function BillAuthorizationOptions() {
  const { en } = useBilingual();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(en("supportUtility.allMasters"));
  
  // Modal state - simple boolean with key
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: string | null;
  }>({ isOpen: false, type: null });

  const TABS = [en("supportUtility.allMasters"), en("supportUtility.recentlyUsed")];

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return BILL_OPTIONS;
    return BILL_OPTIONS.filter(
      (item) =>
        item.titleEn.toLowerCase().includes(q) ||
        item.titleHi.toLowerCase().includes(q)
    );
  }, [query]);

  // Open modal function
  const openModal = (type: string) => {
    setModalState({ isOpen: true, type });
  };

  // Close modal function
  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  const Card = ({ icon, titleEn, titleHi, onOpen }: any) => {
    const Icon = ICON_MAP[icon as keyof typeof ICON_MAP] || Landmark;
    return (
      <div
        className="group flex cursor-pointer items-center justify-between rounded-md border border-[#E5E7EB] bg-white px-5 py-3 transition-all duration-200 hover:border-[#D7E3FF] hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        onClick={onOpen}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
            <Icon className="text-white" size={22} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white">
              {titleEn}
            </h3>
            <p className="mt-1 text-[13px] text-[#9CA3AF]">{titleHi}</p>
          </div>
        </div>
        <span className="rounded-full border border-[#2563EB] bg-[#EEF4FF] px-5 py-2 text-[15px] font-medium text-[#2563EB] transition group-hover:bg-[#E2ECFF]">
          {en("supportUtility.open")}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="mx-auto min-w-7xl p-4">
        <div className="rounded-xl bg-white p-5 dark:bg-slate-900">
          {/* Hero */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 px-6 py-10 text-center">
            <h1 className="text-[38px] font-bold text-white">Bill Authorization</h1>
            <div className="mx-auto mt-6 flex max-w-xl items-center rounded-full bg-white px-4 py-2 shadow-lg">
              <Search size={18} className="mr-2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Bill Authorization..."
                className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
              <button className="rounded-md bg-primary-700 px-5 py-2 text-sm font-medium text-white hover:bg-primary-800">
                {en("supportUtility.show")}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 mb-4 flex gap-6 border-b border-gray-200 dark:border-slate-800">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredOptions.map((option) => (
              <Card
                key={option.key}
                icon={option.icon}
                titleEn={option.titleEn}
                titleHi={option.titleHi}
                onOpen={() => openModal(option.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Render Modals based on state */}
      {modalState.isOpen && modalState.type === "ibc-authorize" && (
        <IBCAuthorizeModal open={true} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "ibc-realize-unrealize-authorize" && (
        <IBCRealizeUnrealizeAuthorizeModal open={true} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "obc-authorize" && (
        <OBCAuthorizeModal open={true} onClose={closeModal} />
      )}
      {modalState.isOpen && modalState.type === "obc-realize-unrealize-authorize" && (
        <OBCRealizeUnrealizeAuthorizeModal open={true} onClose={closeModal} />
      )}
    </>
  );
}
