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
import { FieldShell, TextInput, DateInput, SectionCard, RadioDayMonth } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_HO_TRANSFER_DATA,
  type HoTransferFormData,
} from "@/components/HO-Clerk/AddHoTransfer";

export interface AuthorizeHoTransferModalProps {
  open: boolean;
  initialData?: Partial<HoTransferFormData>;
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

const AuthorizeHoTransferFooter = ({
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

const AuthorizeHoTransferModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeHoTransferModalProps) => {
  const [data] = useState<HoTransferFormData>(() => ({
    ...DEFAULT_HO_TRANSFER_DATA,
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
        titleEn="Authorize HO Transfer Entry"
        titleHi="HO हस्तांतरण नोंद अधिकृत करा"
        subtitleEn="Check information related to the HO transfer entry and authorize it."
        subtitleHi="HO हस्तांतरण नोंदीशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize HO Transfer Entry" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeHoTransferFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the HO transfer being authorized."
          subtitleHi="अधिकृत करावयाच्या हस्तांतरणाची खाते माहिती."
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

            <RadioDayMonth
              label="Debit / Credit"
              labelHi="डेबिट / क्रेडिट"
              value={data.debitCreditMode === "Debit"}
              onChange={() => {}}
              options={["Debit", "Credit"]}
              disabled
            />

            <FieldShell label="Debit Amount" labelHi="डेबिट रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.debitAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Credit Amount" labelHi="क्रेडिट रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.creditAmount} onChange={() => {}} readOnly />
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

            <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.customerName} onChange={() => {}} readOnly />
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

            <FieldShell label="Uncleared Balance" labelHi="अस्पष्ट शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.unclearBalance} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Transaction Details"
          titleHi="व्यवहाराचा तपशील"
          subtitleEn="Outlist, advice and instrument details for the transfer."
          subtitleHi="हस्तांतरणाचा आऊटलिस्ट, सल्ला व साधन तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.outlistSerial} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="GL Outlist Description" labelHi="जीएल आऊटलिस्ट वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutlistDesc} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutListDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioDayMonth
              label="Original / Responding"
              labelHi="मूळ / प्रतिसाद"
              value={data.originalResponding === "Original"}
              onChange={() => {}}
              options={["Original", "Responding"]}
              disabled
            />

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required>
              <DateInput value={data.adviceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Amount" labelHi="रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.amount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Instrument Type" labelHi="साधन प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.instrumentType} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Instrument Number" labelHi="साधन क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.instrumentNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Instrument Date" labelHi="साधन तारीख" required>
              <DateInput value={data.instrumentDate} onChange={() => {}} readOnly />
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
            title="HO Transfer Entry Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="HO Transfer Entry Authorization Rejected"
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

export default AuthorizeHoTransferModal;
