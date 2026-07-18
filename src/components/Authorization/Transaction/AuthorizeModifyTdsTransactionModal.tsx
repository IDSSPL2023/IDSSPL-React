import { useState } from "react";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Calendar,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, DateInput, SelectInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_MODIFY_TDS_DATA,
  type ModifyTdsTransactionFormData,
} from "@/components/TransactionMaster/AddModifyTdsTransaction";

export interface AuthorizeModifyTdsTransactionModalProps {
  open: boolean;
  initialData?: Partial<ModifyTdsTransactionFormData>;
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

const AuthorizeModifyTdsTransactionFooter = ({
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

const AuthorizeModifyTdsTransactionModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeModifyTdsTransactionModalProps) => {
  const [data] = useState<ModifyTdsTransactionFormData>(() => ({
    ...DEFAULT_MODIFY_TDS_DATA,
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
        titleEn="Authorize Modify TDS Transaction"
        titleHi="टीडीएस व्यवहार सुधारणे अधिकृत करा"
        subtitleEn="Check information related to the modified TDS transaction and authorize it."
        subtitleHi="सुधारित टीडीएस व्यवहाराशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize Modify TDS Transaction" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeModifyTdsTransactionFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the modified TDS transaction being authorized."
          subtitleHi="अधिकृत करावयाच्या सुधारित टीडीएस व्यवहाराची खाते माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Select" labelHi="निवडा" required>
              <SelectInput icon={<FileText size={16} />} value={data.selectPaid} onChange={() => {}} options={[data.selectPaid]} readOnly />
            </FieldShell>

            <FieldShell label="Select" labelHi="निवडा" required>
              <SelectInput icon={<FileText size={16} />} value={data.selectAddTds} onChange={() => {}} options={[data.selectAddTds]} readOnly />
            </FieldShell>

            <FieldShell label="Old TDS Date" labelHi="जुनी टीडीएस तारीख" required>
              <DateInput value={data.oldTdsDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New TDS Date" labelHi="नवीन टीडीएस तारीख" required>
              <DateInput value={data.newTdsDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required>
              <TextInput icon={<User size={16} />} value={data.customerId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Pan card Number" labelHi="पॅन कार्ड क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.panCardNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Form 15 H" labelHi="फॉर्म १५ एच" required>
              <TextInput icon={<FileText size={16} />} value={data.form15H} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Form 15 G" labelHi="फॉर्म १५ जी" required>
              <TextInput icon={<FileText size={16} />} value={data.form15G} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="TDS Payable" labelHi="देय टीडीएस" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.tdsPayable} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="TDS Paid" labelHi="भरलेला टीडीएस" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.tdsPaid} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Transaction Amount" labelHi="व्यवहार रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.transactionAmount} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        {showRejectReason && (
          <RejectReasonModal
            titleEn="Modify TDS Transaction Authorize Rejected"
            titleHi="टीडीएस व्यवहार सुधारणा स्थिती"
            onClose={() => setShowRejectReason(false)}
            onConfirm={handleConfirmReject}
          />
        )}

        {actionModal === "authorize" && (
          <SuccessModal
            title="Modify TDS Transaction Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="Modify TDS Transaction Authorization Rejected"
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

export default AuthorizeModifyTdsTransactionModal;
