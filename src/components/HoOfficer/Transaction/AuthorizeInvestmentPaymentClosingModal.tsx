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
import { FieldShell, TextInput, DateInput, SectionCard, RadioYesNo } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_INVESTMENT_ACCOUNT_CLOSE_DATA,
  type InvestmentAccountCloseFormData,
} from "@/components/Authorization/Account/AddInvestmentAccountClose";

export interface AuthorizeInvestmentPaymentClosingModalProps {
  open: boolean;
  initialData?: Partial<InvestmentAccountCloseFormData>;
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

const AuthorizeInvestmentPaymentClosingFooter = ({
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

const AuthorizeInvestmentPaymentClosingModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeInvestmentPaymentClosingModalProps) => {
  const [data] = useState<InvestmentAccountCloseFormData>(() => ({
    ...DEFAULT_INVESTMENT_ACCOUNT_CLOSE_DATA,
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
        titleEn="Authorize Investment Payment ClosingMark"
        titleHi="गुंतवणूक पेमेंट क्लोजिंगमार्क अधिकृत करा"
        subtitleEn="Check information related to the investment payment closing mark and authorize it."
        subtitleHi="गुंतवणूक पेमेंट क्लोजिंगमार्कशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize Investment Payment ClosingMark" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeInvestmentPaymentClosingFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account and deposit information for the investment account being closed."
          subtitleHi="बंद होणाऱ्या गुंतवणूक खात्याची खाते व ठेव माहिती."
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

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput icon={<CreditCard size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Open Date" labelHi="खाते सुरू तारीख" required>
              <DateInput value={data.accountOpenDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Period" labelHi="कालावधी" required>
              <TextInput icon={<Hash size={16} />} value={data.period} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Unit of Period" labelHi="कालावधी एकक" required>
              <TextInput icon={<FileText size={16} />} value={data.unitOfPeriod} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioYesNo
              label="Is Account Close"
              labelHi="खाते बंद आहे का"
              value={data.isAccountClose}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.depositAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Maturity Value" labelHi="परिपक्वता मूल्य" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.maturityValue} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Interest Details"
          titleHi="व्याज तपशील"
          subtitleEn="Interest rate, computation and payment history."
          subtitleHi="व्याज दर, गणना व भुगतान इतिहास."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Interest Rate" labelHi="व्याज दर" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestRate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Payable" labelHi="देय व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestPayable} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Calculated" labelHi="गणलेले व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestCalculated} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Total Interest Paid" labelHi="एकूण दिलेले व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.totalInterestPaid} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Last Interest Date" labelHi="शेवटची व्याज तारीख" required>
              <DateInput value={data.lastInterestDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Upto Date" labelHi="व्याज तारखेपर्यंत" required>
              <DateInput value={data.interestUptoDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Pending Cash Interest" labelHi="प्रलंबित रोख व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.pendingCashInterest} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Months" labelHi="पूर्ण महिने" required>
              <TextInput icon={<Hash size={16} />} value={data.completedMonths} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Days" labelHi="पूर्ण दिवस" required>
              <TextInput icon={<Hash size={16} />} value={data.completedDays} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment Details"
          titleHi="पेमेंट तपशील"
          subtitleEn="Payment mode, outlist, advice and cheque details."
          subtitleHi="भुगतान पद्धत, आऊटलिस्ट, सल्ला व धनादेश तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Payment Mode" labelHi="भुगतान पद्धत" required>
              <TextInput icon={<FileText size={16} />} value={data.paymentMode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Principal Account Code" labelHi="मुद्दल खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.principalAccountCode} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Principal Description" labelHi="मुद्दल वर्णन" required>
              <TextInput icon={<User size={16} />} value={data.principalDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Credit Account" labelHi="व्याज क्रेडिट खाते" required>
              <TextInput icon={<CreditCard size={16} />} value={data.interestCreditAccount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Description" labelHi="व्याज वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.interestDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Outlist No" labelHi="जीएल आऊटलिस्ट क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.glOutlistNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Outlist Description" labelHi="जीएल आऊटलिस्ट वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutlistDescription} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Outlist Doc No" labelHi="आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.outlistDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.adviceNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required>
              <DateInput value={data.adviceDate} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioYesNo
              label="Transfer By Cheque"
              labelHi="धनादेशाद्वारे हस्तांतरण"
              value={data.transferByCheque}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeType} onChange={() => {}} readOnly />
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
            title="Investment Payment ClosingMark Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="Investment Payment ClosingMark Authorization Rejected"
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

export default AuthorizeInvestmentPaymentClosingModal;
