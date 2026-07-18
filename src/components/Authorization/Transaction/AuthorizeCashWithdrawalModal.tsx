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
  RadioYesNo,
  RadioDayMonth,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_CASH_WITHDRAWAL_DATA,
  type CashWithdrawalFormData,
} from "@/components/TransactionMaster/AddCashWithdrawal";

export interface AuthorizeCashWithdrawalModalProps {
  open: boolean;
  initialData?: Partial<CashWithdrawalFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
  titleEn?: string;
  titleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  successTitle?: string;
  rejectedTitle?: string;
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

const AuthorizeCashWithdrawalFooter = ({
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

const AuthorizeCashWithdrawalModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
  titleEn = "Authorize Cash Withdrawal",
  titleHi = "रोख रक्कम काढणे अधिकृत करा",
  subtitleEn = "Check information related to the cash withdrawal and authorize it.",
  subtitleHi = "रोख रक्कम काढण्याशी संबंधित माहिती तपासा आणि अधिकृत करा.",
  successTitle = "Cash Withdrawal Authorized Successfully",
  rejectedTitle = "Cash Withdrawal Authorization Rejected",
}: AuthorizeCashWithdrawalModalProps) => {
  const [data] = useState<CashWithdrawalFormData>(() => ({
    ...DEFAULT_CASH_WITHDRAWAL_DATA,
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
        titleEn={titleEn}
        titleHi={titleHi}
        subtitleEn={subtitleEn}
        subtitleHi={subtitleHi}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize Cash Withdrawal" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeCashWithdrawalFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the withdrawal being authorized."
          subtitleHi="अधिकृत करावयाच्या रोख रक्कम काढण्याची खाते माहिती."
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

            <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountType} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<User size={16} />} value={data.description} onChange={() => {}} readOnly />
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

            <FieldShell label="Account Review Date" labelHi="खाते पुनरावलोकन तारीख" required>
              <DateInput value={data.accountReviewDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Mobile Number" labelHi="मोबाईल क्रमांक" required>
              <TextInput icon={<User size={16} />} value={data.mobileNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Aadhar Number" labelHi="आधार क्रमांक" required>
              <TextInput icon={<User size={16} />} value={data.aadharNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="PAN Code" labelHi="पॅन कोड" required>
              <TextInput icon={<User size={16} />} value={data.panCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Operation ID" labelHi="खाते ऑपरेशन आयडी" required>
              <TextInput icon={<User size={16} />} value={data.accountOperationId} onChange={() => {}} readOnly />
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

            <FieldShell label="Last Transaction ID" labelHi="शेवटचा व्यवहार आयडी" required>
              <TextInput icon={<User size={16} />} value={data.lastTransactionId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Uncleared Balance" labelHi="अस्पष्ट शिल्लक" required>
              <TextInput icon={<User size={16} />} value={data.unclearBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Limit Amount" labelHi="मर्यादा रक्कम" required>
              <TextInput icon={<User size={16} />} value={data.limitAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Drawing Power" labelHi="कर्ज उचलण्याची क्षमता" required>
              <TextInput icon={<User size={16} />} value={data.drawingPower} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Check Book Status" labelHi="चेकबुक स्थिती" required>
              <TextInput icon={<User size={16} />} value={data.checkBookStatus} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Transaction Identification"
          titleHi="आदान-प्रदान ओळख"
          subtitleEn="Withdrawal mode, amount and instrument details."
          subtitleHi="काढण्याची पद्धत, रक्कम व साधन तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <RadioDayMonth
              label="Original / Responding"
              labelHi="मूळ / प्रतिसाद"
              value={data.originalResponding === "Original"}
              onChange={() => {}}
              options={["Original", "Responding"]}
              disabled
            />

            <FieldShell label="Outlist Series" labelHi="आऊटलिस्ट मालिका" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<User size={16} />} value={data.outlistSeries} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="GL Outlist Description" labelHi="जीएल आऊटलिस्ट वर्णन" required>
              <TextInput icon={<User size={16} />} value={data.glOutlistDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Outlist Document Number" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<User size={16} />} value={data.glOutlistDocumentNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioDayMonth
              label="Withdrawal By"
              labelHi="काढण्याची पद्धत"
              value={data.withdrawalBy === "Cash"}
              onChange={() => {}}
              options={["Cash", "Cheque"]}
              disabled
            />

            <FieldShell label="Amount" labelHi="रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.amount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Amount in words" labelHi="शब्दात रक्कम" required>
              <TextInput icon={<User size={16} />} value={data.amountInWords} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<User size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Token Number" labelHi="टोकन क्रमांक" required>
              <TextInput icon={<User size={16} />} value={data.chequeStatus} onChange={() => {}} readOnly />
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
              <TextInput icon={<FileText size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <DateInput value={data.chequeDate} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="GL / Accounting Information"
          titleHi="जीएल / लेखापरीक्षा माहिती"
          subtitleEn="GL outlist, advice and cash limit details."
          subtitleHi="जीएल आऊटलिस्ट, सल्ला व रोख मर्यादा तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="GL Outlist No" labelHi="जीएल आऊटलिस्ट क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<User size={16} />} value={data.glOutlistNo} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<User size={16} />} value={data.glOutlistDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.descriptionGl} onChange={() => {}} readOnly />
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

            <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required>
              <TextInput icon={<User size={16} />} value={data.accountTypeGl} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cash Limit" labelHi="रोख मर्यादा" required>
              <TextInput icon={<User size={16} />} value={data.cashLimit} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="TDS on limit Pan Card/ Customer ID" labelHi="मर्यादेवर टीडीएस" required>
              <TextInput icon={<User size={16} />} value={data.tdsOnLimit} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Total Transaction on Customer ID" labelHi="ग्राहक आयडीवरील एकूण व्यवहार" required>
              <TextInput icon={<User size={16} />} value={data.totalTransactionCustomerId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Total Transaction on PAN Card" labelHi="पॅन कार्डवरील एकूण व्यवहार" required>
              <TextInput icon={<User size={16} />} value={data.totalTransactionPanCard} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<User size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.glAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Transaction View From Date" labelHi="व्यवहार दृश्य प्रारंभ तारीख" required>
              <DateInput value={data.transactionViewFromDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="To Date" labelHi="अंतिम तारीख" required>
              <DateInput value={data.toDate} onChange={() => {}} readOnly />
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
            title={successTitle}
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title={rejectedTitle}
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

export default AuthorizeCashWithdrawalModal;
