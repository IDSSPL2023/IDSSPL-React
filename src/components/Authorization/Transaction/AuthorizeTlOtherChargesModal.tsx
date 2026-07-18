import { useState } from "react";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  FileText,
  Calendar,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";

export interface TlOtherChargesChargeRow {
  key: string;
  type: string;
  typeHi: string;
  charge: string;
  chargeHi: string;
  glHeadCode: string;
  glDescription: string;
  totalAmount: string;
}

export interface TlOtherChargesFormData {
  scrollNumber: string;
  particular: string;
  accountCode: string;
  insuranceDate: string;
  recoveryAmt: string;
  insuranceFireAmt: string;
  abnFeesAmt: string;
  executionFeesAmt: string;
  chargeRows: TlOtherChargesChargeRow[];
}

export const DEFAULT_TL_OTHER_CHARGES_ROWS: TlOtherChargesChargeRow[] = [
  { key: "insurance", type: "Insurance", typeHi: "विमा", charge: "Insurance", chargeHi: "विमा", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "recovery", type: "Recovery", typeHi: "वसुली", charge: "Recovery", chargeHi: "वसुली", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "insuranceFire", type: "Insurance Fire", typeHi: "आग विमा", charge: "Insurance Fire", chargeHi: "आग विमा", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "abnFees", type: "ABN Fees", typeHi: "एबीएन शुल्क", charge: "ABN Fees", chargeHi: "एबीएन शुल्क", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "executionFees", type: "Execution Fees", typeHi: "अंमलबजावणी शुल्क", charge: "Execution Fees", chargeHi: "अंमलबजावणी शुल्क", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "otherCharges", type: "Other Charges", typeHi: "इतर आकार", charge: "Other Charges", chargeHi: "इतर आकार", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
  { key: "transferGlHead", type: "Transfer GL Head", typeHi: "इतर आकार", charge: "Grand Total", chargeHi: "एकूण रक्कम", glHeadCode: "", glDescription: "", totalAmount: "0.0" },
];

export const DEFAULT_TL_OTHER_CHARGES_DATA: TlOtherChargesFormData = {
  scrollNumber: "",
  particular: "By Cash",
  accountCode: "00025050002501",
  insuranceDate: "2026-05-23",
  recoveryAmt: "500.0",
  insuranceFireAmt: "250.0",
  abnFeesAmt: "150.0",
  executionFeesAmt: "100.0",
  chargeRows: DEFAULT_TL_OTHER_CHARGES_ROWS,
};

export interface AuthorizeTlOtherChargesModalProps {
  open: boolean;
  initialData?: Partial<TlOtherChargesFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

const SectionIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
    <User size={20} className="text-primary" />
  </div>
);

const DisabledLookupTrigger = () => (
  <button
    type="button"
    disabled
    aria-hidden
    className="flex h-11 w-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-slate-300 bg-[#EEF4FF] text-primary opacity-50"
  >
    <MoreVertical size={18} strokeWidth={2.4} />
  </button>
);

const AuthorizeTlOtherChargesFooter = ({
  onReject,
  onCancel,
  onAuthorize,
}: {
  onReject: () => void;
  onCancel: () => void;
  onAuthorize: () => void;
}) => (
  <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
    <button
      type="button"
      onClick={onReject}
      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
    >
      Reject
      <ThumbsDown className="h-4 w-4" />
    </button>

    <button
      type="button"
      onClick={onCancel}
      className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
    >
      Cancel
      <X className="h-4 w-4" />
    </button>

    <button
      type="button"
      onClick={onAuthorize}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
    >
      Authorize
      <ThumbsUp className="h-4 w-4" />
    </button>
  </div>
);

const AuthorizeTlOtherChargesModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeTlOtherChargesModalProps) => {
  const [data] = useState<TlOtherChargesFormData>(() => ({
    ...DEFAULT_TL_OTHER_CHARGES_DATA,
    ...initialData,
  }));
  const [actionModal, setActionModal] = useState<"authorize" | "rejected" | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);

  if (!open) return null;

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const handleAuthorize = () => {
    setActionModal("authorize");
    onAuthorize?.();
  };

  const handleReject = () => setShowRejectReason(true);

  const handleConfirmReject = (reason: string) => {
    setShowRejectReason(false);
    setActionModal("rejected");
    onReject?.(reason);
  };

  const handleDone = () => {
    setActionModal(null);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Authorize TL Other Charges"
        titleHi="मुदत कर्जाचे इतर शुल्क अधिकृत करा"
        subtitleEn="Check information related to the TL other charges and authorize it."
        subtitleHi="मुदत कर्जाच्या इतर शुल्काशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize TL Other Charges" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeTlOtherChargesFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Scroll number for the TL other charges transaction being authorized."
          subtitleHi="अधिकृत करावयाच्या व्यवहाराचा स्कोल क्रमांक."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Scroll Number" labelHi="स्कोल क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Charges Details"
          titleHi="आकारांचा तपशील"
          subtitleEn="GL head, description and amount for each charge type."
          subtitleHi="प्रत्येक शुल्क प्रकारासाठी जीएल हेड, वर्णन व रक्कम."
          icon={<SectionIcon />}
        >
          <div className="border border-slate-200 dark:border-slate-800 rounded-[10px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
              <table className="w-full border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-[#1e1b4b]">
                    {["Type", "GI Head Code", "GI Description", "Charges", "Total Amount", "Tallied"].map((label) => (
                      <th
                        key={label}
                        className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-bold text-white"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {data.chargeRows.map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-2 align-middle">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.type}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{row.typeHi}</div>
                      </td>
                      <td className="px-4 py-2 align-middle text-sm text-slate-600 dark:text-slate-300">
                        {row.glHeadCode || "-"}
                      </td>
                      <td className="px-4 py-2 align-middle text-sm text-slate-600 dark:text-slate-300">
                        {row.glDescription || "-"}
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.charge}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{row.chargeHi}</div>
                      </td>
                      <td className="px-4 py-2 align-middle text-sm font-medium text-slate-700 dark:text-slate-300">
                        {row.totalAmount}
                      </td>
                      <td className="px-4 py-2 align-middle text-sm text-slate-600 dark:text-slate-300">0.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the TL other charges being authorized."
          subtitleHi="अधिकृत करावयाच्या व्यवहाराची खाते माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Insurance" labelHi="विमा" required>
              <TextInput type="date" icon={<Calendar size={16} />} value={data.insuranceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Recovery" labelHi="वसुली" required>
              <TextInput icon={<CreditCard size={16} />} value={data.recoveryAmt} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Insurance Fire" labelHi="आग विमा" required>
              <TextInput icon={<CreditCard size={16} />} value={data.insuranceFireAmt} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="ABN Fees" labelHi="एबीएन शुल्क" required>
              <TextInput icon={<CreditCard size={16} />} value={data.abnFeesAmt} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Execution Fees" labelHi="अंमलबजावणी शुल्क" required>
              <TextInput icon={<CreditCard size={16} />} value={data.executionFeesAmt} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        {showRejectReason && (
          <RejectReasonModal
            titleEn="User Authorize Rejected"
            titleHi="युझर खात्याची स्थिती"
            onClose={() => setShowRejectReason(false)}
            onConfirm={handleConfirmReject}
          />
        )}

        {actionModal === "authorize" && (
          <SuccessModal
            title="TL Other Charges Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="TL Other Charges Authorization Rejected"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="critical"
          />
        )}
      </FormModal>
    </>
  );
};

export default AuthorizeTlOtherChargesModal;
