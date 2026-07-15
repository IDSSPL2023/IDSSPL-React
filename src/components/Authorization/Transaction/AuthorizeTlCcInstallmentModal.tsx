import { useState } from "react";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  Percent,
  Landmark,
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
  RadioYesNo,
  SelectField,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_TL_CC_INSTALLMENT_DATA,
  type TlCcInstallmentFormData,
} from "@/components/TransactionMaster/AddTlCcInstallment";

export interface AuthorizeTlCcInstallmentModalProps {
  open: boolean;
  initialData?: Partial<TlCcInstallmentFormData>;
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

const AuthorizeTlCcInstallmentFooter = ({
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

const AuthorizeTlCcInstallmentModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeTlCcInstallmentModalProps) => {
  const [data] = useState<TlCcInstallmentFormData>(() => ({
    ...DEFAULT_TL_CC_INSTALLMENT_DATA,
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
        titleEn="Authorize TL/CC Installment"
        titleHi="TLCC हप्ता अधिकृत करा"
        subtitleEn="Check information related to the TL/CC installment and authorize it."
        subtitleHi="TLCC हप्त्याशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize TL/CC Installment" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeTlCcInstallmentFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the installment being authorized."
          subtitleHi="अधिकृत करावयाच्या हप्त्याची खाते माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <RadioYesNo
              label="Is Ho Transaction"
              labelHi="मुख्य कार्यालय व्यवहार आहे का"
              value={data.isHoTransaction}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Account Type" labelHi="खाते प्रकार" required>
              <TextInput icon={<CreditCard size={16} />} value={data.accountType} onChange={() => {}} readOnly />
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

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<Landmark size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.glAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Review Date" labelHi="पुनरावलोकन तारीख" required>
              <DateInput value={data.reviewDate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Account Summary"
          titleHi="ठेव सारांश"
          subtitleEn="Deposit, installment and balance summary."
          subtitleHi="ठेव, हप्ता व शिल्लक सारांश."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.depositAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Surcharge" labelHi="अधिभार" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.surcharge} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Amount" labelHi="व्याज रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Installment Type ID" labelHi="हप्ता प्रकार" required>
              <TextInput icon={<FileText size={16} />} value={data.installmentTypeId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Open Date" labelHi="खाते उघडण्याची तारीख" required>
              <DateInput value={data.openDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Period" labelHi="कालावधी" required>
              <TextInput icon={<Hash size={16} />} value={data.period} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Months" labelHi="पूर्ण महिने" required>
              <TextInput icon={<Hash size={16} />} value={data.completedMonths} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Overdue" labelHi="Overdue" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.overdue} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.newLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Rate" labelHi="व्याजदर" required>
              <TextInput icon={<Percent size={16} />} value={data.interestRate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Mode of payment, cheque and posting details."
          subtitleHi="पेमेंट पद्धत, धनादेश व नोंद तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Mode of Payment"
              labelMr="पेमेंट पद्धत"
              editable={false}
              icon={CreditCard}
              value={data.modeOfPayment}
              onChange={() => {}}
            />

            <FieldShell label="Transfer A/c Code" labelHi="स्थानांतरण खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.transferAccountCode} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Transfer A/c Name" labelHi="स्थानांतरण खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.transferAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<Landmark size={16} />} value={data.paymentGlAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.paymentGlAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentAvailableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खाते शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentNewLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular 1" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular1} onChange={() => {}} readOnly />
            </FieldShell>

            <SelectField
              labelEn="Original / Responding"
              labelMr="मूळ / प्रतिसाद"
              editable={false}
              icon={FileText}
              value={data.originalResponding}
              onChange={() => {}}
            />

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
              <TextInput icon={<FileText size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required>
              <DateInput value={data.chequeDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Upto Date" labelHi="व्याज अंतिम तारीख" required>
              <DateInput value={data.interestUpToDate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="GL Posting Details"
          titleHi="जीएल नोंद तपशील"
          subtitleEn="GL outlist and advice details."
          subtitleHi="जीएल आऊटलिस्ट व सल्ला तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="GL Out List No" labelHi="जीएल बाह्य यादी क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.glOutlistNo} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="GL Out List Doc. No" labelHi="जीएल दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutlistDocNo} onChange={() => {}} readOnly />
            </FieldShell>

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
            title="TL/CC Installment Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="TL/CC Installment Authorization Rejected"
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

export default AuthorizeTlCcInstallmentModal;
