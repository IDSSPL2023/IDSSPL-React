import { useState } from "react";
import { User, Hash, CreditCard, IndianRupee, FileText, IdCard, Fingerprint, Phone, Landmark, MoreVertical } from "lucide-react";
import { AuthorizeFormModal } from "@/components/common";
import { IMAGES } from "@/assets";
import Image from "@/components/ui/Image";
import { FieldShell, TextInput, DateInput, SectionCard, RadioYesNo, RadioDayMonth } from "@/components/shared/FormFields";
import { DEFAULT_CASH_DEPOSIT_DATA, type CashDepositFormData } from "@/components/TransactionMaster/AddCashDeposit";

export interface AuthorizeCashDepositModalProps {
  open: boolean;
  initialData?: Partial<CashDepositFormData>;
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

/** Shared across the Authorization/Transaction (Cash Deposit) and HO-Officer Cash Deposit authorize flows. */
const AuthorizeCashDepositModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
  titleEn = "Authorize Cash Deposit",
  titleHi = "रोख जमा अधिकृत करा",
  subtitleEn = "Check information related to the cash deposit and authorize it.",
  subtitleHi = "रोख जमा व्यवहाराशी संबंधित माहिती तपासा आणि अधिकृत करा.",
  successTitle = "Cash Deposit Authorized Successfully",
  rejectedTitle = "Cash Deposit Authorization Rejected",
}: AuthorizeCashDepositModalProps) => {
  const [data] = useState<CashDepositFormData>(() => ({
    ...DEFAULT_CASH_DEPOSIT_DATA,
    ...initialData,
  }));

  if (!open) return null;

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  return (
    <>
      <AuthorizeFormModal
        onClose={onClose}
        titleEn={titleEn}
        titleHi={titleHi}
        subtitleEn={subtitleEn}
        subtitleHi={subtitleHi}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.AUTHORIZE_USER} alt="Authorize Cash Deposit" width={50} height={50} />
          </div>
        }
        onAuthorize={() => onAuthorize?.()}
        onReject={(reason) => onReject?.(reason)}
        successTitle={successTitle}
        successSubtitle=""
        rejectedTitle={rejectedTitle}
        rejectedSubtitle=""
        rejectReasonTitleEn="User Authorize Rejected"
        rejectReasonTitleHi="युझर खात्याची स्थिती"
      >
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the cash deposit being authorized."
          subtitleHi="अधिकृत करावयाच्या रोख जमा व्यवहाराची खाते माहिती."
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

            <FieldShell label="Account Type" labelHi="खात्याचा प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<CreditCard size={16} />} value={data.accountType} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
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
              <TextInput icon={<Landmark size={16} />} value={data.glAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.glAccountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Last Transaction Date" labelHi="शेवटची व्यवहार तारीख" required>
              <DateInput value={data.lastTransactionDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Account Review Date" labelHi="खाते पुनरावलोकन तारीख" required>
              <DateInput value={data.accountReviewDate} onChange={() => {}} readOnly />
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
              <TextInput icon={<IndianRupee size={16} />} value={data.unclearedBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Limit Amount" labelHi="मर्यादा रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.limitAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Drawing Power" labelHi="कर्ज उचलण्याची क्षमता" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.drawingPower} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Last OD Date" labelHi="शेवटची ओडी तारीख" required>
              <DateInput value={data.lastOdDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="OD Interest" labelHi="ओडी व्याज" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.odInterest} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="PAN Card Number" labelHi="पॅन कार्ड क्रमांक" required>
              <TextInput icon={<IdCard size={16} />} value={data.panCardNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Aadhaar Number" labelHi="आधार क्रमांक" required>
              <TextInput icon={<Fingerprint size={16} />} value={data.aadhaarNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Mobile Number" labelHi="मोबाईल क्रमांक" required>
              <TextInput icon={<Phone size={16} />} value={data.mobileNumber} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Transaction Details"
          titleHi="व्यवहाराचा तपशील"
          subtitleEn="Deposit amount and outlist related information."
          subtitleHi="जमा रक्कम व आऊटलिस्ट संबंधित माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Amount" labelHi="रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.amount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Amount in Words" labelHi="शब्दात रक्कम" required>
              <TextInput icon={<FileText size={16} />} value={data.amountInWords} onChange={() => {}} readOnly />
            </FieldShell>

            <RadioYesNo
              label="Is Pigmy Collection"
              labelHi="पिग्मी संकलन आहे का"
              value={data.isPigmyCollection}
              onChange={() => {}}
              disabled
            />

            <FieldShell label="Agent ID" labelHi="एजंट आयडी" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.agentId} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <RadioDayMonth
              label="Original / Responding"
              labelHi="मूळ / प्रतिसाद"
              value={data.originalResponding === "Original"}
              onChange={() => {}}
              options={["Original", "Responding"]}
              disabled
            />

            <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.outlistSerial} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput icon={<FileText size={16} />} value={data.description} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="GL Out List Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput icon={<FileText size={16} />} value={data.glOutListDocNo} onChange={() => {}} readOnly />
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

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput icon={<FileText size={16} />} value={data.particular} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>
      </AuthorizeFormModal>
    </>
  );
};

export default AuthorizeCashDepositModal;
