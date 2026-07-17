// src/components/Authorization/BillAuthorize/OBCAuthorize.tsx
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
  FileText,
  Receipt,
  CreditCard,
  IndianRupee,
  ScrollText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { SectionCard } from "@/components/shared/FormFields";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import RejectedModal from "@/components/shared/RejectedModal";
import SuccessModal from "@/components/shared/SuccessModal";

interface FormData {
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

const ACCOUNT_DETAILS_FIELDS: FieldConfig[] = [
  { key: "serialNo", label: "Serial No.", labelHi: "अनुक्रमांक", placeholder: "Serial No.", icon: Hash },
  { key: "obcDate", label: "OBC Date", labelHi: "जावक बिल तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "accountCode", label: "Account Code", labelHi: "खाते कोड", placeholder: "Enter Account Code", icon: MapPin },
  { key: "accountName", label: "Account Name", labelHi: "खात्याचे नाव", placeholder: "Enter Account Name", icon: User },
];

const DRAWER_DETAILS_FIELDS: FieldConfig[] = [
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

const COLLECTION_DETAILS_FIELDS: FieldConfig[] = [
  { key: "collectionBankCode", label: "Bank Code", labelHi: "बँक कोड", placeholder: "Enter Bank Code", icon: Building2 },
  { key: "collectionBankName", label: "Bank Name", labelHi: "बँकेचे नाव", placeholder: "Enter Bank Name", icon: Building2 },
  { key: "collectionBranchCode", label: "Branch Code", labelHi: "शाखा कोड", placeholder: "Enter Branch Code", icon: Landmark },
  { key: "collectionBranchName", label: "Branch Name", labelHi: "शाखेचे नाव", placeholder: "Enter Branch Name", icon: Landmark },
  { key: "collectionBankAddressLine1", label: "Bank Address Line 1", labelHi: "बँक पत्ता ओळ १", placeholder: "Address Line 1", icon: MapPin },
  { key: "collectionBankAddressLine2", label: "Bank Address Line 2", labelHi: "बँक पत्ता ओळ २", placeholder: "Address Line 2", icon: MapPin },
  { key: "collectionBankAddressLine3", label: "Bank Address Line 3", labelHi: "बँक पत्ता ओळ ३", placeholder: "Address Line 3", icon: MapPin },
];

const INSTRUMENT_DETAILS_FIELDS: FieldConfig[] = [
  { key: "instrumentType", label: "Instrument Type", labelHi: "साधन प्रकार", placeholder: "Select Instrument Type", icon: CreditCard, select: true, options: [{ value: "cheque", label: "Cheque" }, { value: "dd", label: "Demand Draft" }] },
  { key: "instrumentNumber", label: "Instrument Number", labelHi: "साधन क्रमांक", placeholder: "Instrument Number", icon: Hash },
  { key: "instrumentDate", label: "Instrument Date", labelHi: "साधन तारीख", placeholder: "DD-MMM-YYYY", icon: Calendar },
  { key: "instrumentAmount", label: "Instrument Amount", labelHi: "साधन रक्कम", placeholder: "Enter Amount", icon: IndianRupee },
  { key: "scrollNumber", label: "Scroll Number", labelHi: "स्क्रोल क्रमांक", placeholder: "Scroll Number", icon: ScrollText },
];

export interface OBCAuthorizeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OBCAuthorizeModal({ open, onClose }: OBCAuthorizeModalProps) {
  if (!open) return null;

  const [formData] = useState<FormData>({
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
            <Image src="/person icon.png" alt="OBC Authorize" width={40} height={40} />
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
            {ACCOUNT_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
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
            {DRAWER_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
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
            {COLLECTION_DETAILS_FIELDS.map((field) => (
              <div key={field.key} data-field={field.key}>
                <FormField field={field} value={formData[field.key] || ""} />
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
            {INSTRUMENT_DETAILS_FIELDS.map((field) => (
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