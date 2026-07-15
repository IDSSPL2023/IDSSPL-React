import { useState } from "react";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  Percent,
  Building2,
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
  RadioDayMonth,
  SelectField,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_TD_INTEREST_PAYMENT_DATA,
  type TdInterestPaymentFormData,
} from "@/components/TransactionMaster/AddTdInterestPayment";

export interface AuthorizeTdInterestPaymentModalProps {
  open: boolean;
  initialData?: Partial<TdInterestPaymentFormData>;
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

const AuthorizeTdInterestPaymentFooter = ({
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

const AuthorizeTdInterestPaymentModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeTdInterestPaymentModalProps) => {
  const [data] = useState<TdInterestPaymentFormData>(() => ({
    ...DEFAULT_TD_INTEREST_PAYMENT_DATA,
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
        titleEn="Authorize TD Interest Payment"
        titleHi="ठेव व्याज भुगतान अधिकृत करा"
        subtitleEn="Check information related to the TD interest payment and authorize it."
        subtitleHi="ठेव व्याज भुगतानाशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize TD Interest Payment" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeTdInterestPaymentFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the interest payment being authorized."
          subtitleHi="अधिकृत करावयाच्या व्याज भुगतानाची खाते माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <RadioYesNo
              label="Is HO Transaction"
              labelHi="मुख्य कार्यालय व्यवहार आहे का"
              value={data.isHoTransaction}
              onChange={() => {}}
              disabled
            />

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
              <TextInput icon={<Landmark size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.glAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Up To Date" labelHi="व्याज या तारखेपर्यंत" required>
              <TextInput icon={<Hash size={16} />} value={data.interestUpToDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Account Summary"
          titleHi="खाते सारांश"
          subtitleEn="Deposit account balances and maturity details."
          subtitleHi="ठेव खाते शिल्लक व परिपक्वता तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.depositAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Open Date" labelHi="सुरुवात तारीख" required>
              <DateInput value={data.openDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required>
              <DateInput value={data.maturityDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Rate" labelHi="व्याज दर" required>
              <TextInput icon={<Percent size={16} />} value={data.interestRate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Maturity Value" labelHi="परिपक्वता मूल्य" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.maturityValue} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Period" labelHi="कालावधी" required>
              <TextInput icon={<Hash size={16} />} value={data.period} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Unit Of Period" labelHi="कालावधीचे एकक" required>
              <TextInput icon={<Hash size={16} />} value={data.unitOfPeriod} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.summaryLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.summaryAvailableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.summaryNewLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment Details"
          titleHi="देयक तपशील"
          subtitleEn="Interest payment mode, calculation and cheque details."
          subtitleHi="व्याज भुगतान पद्धत, गणना व धनादेश तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Mode Of Payment"
              labelMr="देयक पद्धत"
              editable={false}
              icon={CreditCard}
              value={data.modeOfPayment}
              onChange={() => {}}
            />

            <FieldShell label="Transfer Account Code" labelHi="बदली खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.transferAccountCode} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Transfer Account Name" labelHi="बदली खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.transferAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentAvailableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.paymentNewLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Last Int Date" labelHi="शेवटची व्याज तारीख" required>
              <DateInput value={data.lastIntDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Days" labelHi="पूर्ण झालेले दिवस" required>
              <TextInput icon={<Hash size={16} />} value={data.completedDays} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Completed Months" labelHi="पूर्ण झालेले महिने" required>
              <TextInput icon={<Hash size={16} />} value={data.completedMonths} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Calculated" labelHi="गणना केलेले व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestCalculated} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Pending Cash Interest" labelHi="प्रलंबित रोख व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.pendingCashInterest} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Pay" labelHi="व्याज प्रदान" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestPay} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Interest Payable" labelHi="देय व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.interestPayable} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Total Interest Paid" labelHi="एकूण व्याज प्रदान केले" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.totalInterestPaid} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioYesNo
              label="Is Renewal"
              labelHi="नूतनीकरण आहे का"
              value={data.isRenewal}
              onChange={() => {}}
              disabled
            />

            <RadioYesNo
              label="Transfer By Cheque"
              labelHi="धनादेशाद्वारे बदली"
              value={data.transferByCheque}
              onChange={() => {}}
              disabled
            />

            <RadioDayMonth
              label="Original / Responding"
              labelHi="मूळ / प्रतिसाद"
              value={data.originalOrResponding === "Original"}
              onChange={() => {}}
              options={["Original", "Responding"]}
              disabled
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
              <TextInput icon={<Hash size={16} />} value={data.chequeSeries} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
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
          titleHi="जीएल / लेखा माहिती"
          subtitleEn="GL outlist, advice and account type details."
          subtitleHi="जीएल आऊटलिस्ट, सल्ला व खाते प्रकार तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="GL Outlist No" labelHi="जीएल आऊटलिस्ट क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.glOutlistNo} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutlistDocNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.description} onChange={() => {}} readOnly />
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

            <FieldShell label="Account Type" labelHi="खाते प्रकार" required>
              <TextInput icon={<Building2 size={16} />} value={data.accountType} onChange={() => {}} readOnly />
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
            title="TD Interest Payment Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="TD Interest Payment Authorization Rejected"
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

export default AuthorizeTdInterestPaymentModal;
