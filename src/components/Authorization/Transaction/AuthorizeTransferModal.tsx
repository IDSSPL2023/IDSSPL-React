import { useState } from "react";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  DateInput,
  SectionCard,
  SelectField,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_TRANSFER_DATA,
  type TransferFormData,
} from "@/components/TransactionMaster/AddTransfer";

export interface AuthorizeTransferModalProps {
  open: boolean;
  initialData?: Partial<TransferFormData>;
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

const AuthorizeTransferFooter = ({
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

const AuthorizeTransferModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeTransferModalProps) => {
  const [data] = useState<TransferFormData>(() => ({
    ...DEFAULT_TRANSFER_DATA,
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
        titleEn="Authorize Transfer"
        titleHi="हस्तांतरण अधिकृत करा"
        subtitleEn="Check information related to the transfer and authorize it."
        subtitleHi="हस्तांतरण व्यवहाराशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize Transfer" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeTransferFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Scroll Details"
          titleHi="स्क्रोल तपशील"
          subtitleEn="Transaction type and scroll identification for this transfer."
          subtitleHi="या हस्तांतरणासाठी स्क्रोल व व्यवहाराचा प्रकार."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Sub Scroll No" labelHi="उप स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.subScrollNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Debit Amount" labelHi="नावे रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.debitAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Credit Amount" labelHi="जमा रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.creditAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Uncleared Balance" labelHi="अस्पष्ट शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.unclearedBalance} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the transfer being authorized."
          subtitleHi="अधिकृत करावयाच्या हस्तांतरणाची खाते माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountType} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.description} onChange={() => {}} readOnly />
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

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<CreditCard size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.glAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required>
              <TextInput icon={<Hash size={16} />} value={data.customerId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Review Date" labelHi="खाते पुनरावलोकन तारीख" required>
              <DateInput value={data.accountReviewDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Last Transaction Date" labelHi="शेवटची व्यवहार तारीख" required>
              <DateInput value={data.lastTransactionDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.newLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Limit Amount" labelHi="मर्यादा रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.limitAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Drawing Power" labelHi="कर्ज उचलण्याची क्षमता" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.drawingPower} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment & Instrument Details"
          titleHi="पेमेंट व साधन तपशील"
          subtitleEn="Payment narration and cheque or instrument details."
          subtitleHi="पेमेंट व धनादेशाची माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Transaction Type"
              labelMr="व्यवहाराचा प्रकार"
              editable={false}
              icon={FileText}
              value={data.transactionType}
              onChange={() => {}}
            />

            <FieldShell label="Transaction Amount" labelHi="व्यवहार रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.transactionAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Transaction Amount in words" labelHi="शब्दात रक्कम" required>
              <TextInput icon={<User size={16} />} value={data.transactionAmountInWords} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.outlistSerial} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.descriptionPayment} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Out List Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.glOutListDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Book Status" labelHi="चेकबुक स्थिती" required>
              <TextInput icon={<User size={16} />} value={data.chequeBookStatus} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.chequeType} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeSeries} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required>
              <DateInput value={data.chequeDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Original / Responding" labelHi="मूळ / प्रतिसाद" required>
              <TextInput icon={<User size={16} />} value={data.originalResponding} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
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
            title="Transfer Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="Transfer Authorization Rejected"
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

export default AuthorizeTransferModal;
