import { useState } from "react";
import Image from "@/components/ui/Image";
import {
  User,
  CreditCard,
  IndianRupee,
  FileText,
  Hash,
  MapPin,
  Phone,
  Mail,
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
  SelectField,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_RTGS_DATA,
  type RtgsFormData,
} from "@/components/TransactionMaster/AddRtgs";

export interface AuthorizeRtgsModalProps {
  open: boolean;
  initialData?: Partial<RtgsFormData>;
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

const AuthorizeRtgsFooter = ({
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

const AuthorizeRtgsModal = ({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeRtgsModalProps) => {
  const [data] = useState<RtgsFormData>(() => ({
    ...DEFAULT_RTGS_DATA,
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
        titleEn="Authorize RTGS"
        titleHi="आरटीजीएस अधिकृत करा"
        subtitleEn="Check information related to the RTGS transaction and authorize it."
        subtitleHi="आरटीजीएस व्यवहाराशी संबंधित माहिती तपासा आणि अधिकृत करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Authorize RTGS" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <AuthorizeRtgsFooter onReject={handleReject} onCancel={onClose} onAuthorize={handleAuthorize} />
        }
      >
        <SectionCard
          titleEn="RTGS Details"
          titleHi="आरटीजीएस तपशील"
          subtitleEn="Transaction mode and type for this RTGS transaction."
          subtitleHi="या आरटीजीएस व्यवहाराचा प्रकार व पद्धत."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <SelectField
              labelEn="Transaction Mode"
              labelMr="व्यवहार पद्धत"
              editable={false}
              icon={CreditCard}
              value={data.transactionMode}
              onChange={() => {}}
            />

            <SelectField
              labelEn="Transaction Type"
              labelMr="व्यवहाराचा प्रकार"
              editable={false}
              icon={FileText}
              value={data.transactionType}
              onChange={() => {}}
            />

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.scrollNumber} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Transfer Details"
          titleHi="हस्तांतरण तपशील"
          subtitleEn="Account information for the RTGS transfer being authorized."
          subtitleHi="अधिकृत करावयाच्या आरटीजीएस हस्तांतरणाची खाते माहिती."
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

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.newLedgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 1" labelHi="पत्ता १" required>
              <TextInput icon={<MapPin size={16} />} value={data.transferAddress1} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 2" labelHi="पत्ता २" required>
              <TextInput icon={<MapPin size={16} />} value={data.transferAddress2} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 3" labelHi="पत्ता ३" required>
              <TextInput icon={<MapPin size={16} />} value={data.transferAddress3} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Outlist Serial" labelHi="आऊटलिस्ट अनुक्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Hash size={16} />} value={data.outlistSerial} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <SelectField
              labelEn="GL Outlist Description"
              labelMr="जीएल आऊटलिस्ट वर्णन"
              editable={false}
              icon={FileText}
              value={data.glOutlistDescription}
              onChange={() => {}}
            />

            <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<FileText size={16} />} value={data.glOutlistDocNo} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <SelectField
              labelEn="Cheque Type"
              labelMr="धनादेश प्रकार"
              editable={false}
              icon={FileText}
              value={data.chequeType}
              onChange={() => {}}
            />

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required>
              <TextInput icon={<FileText size={16} />} value={data.chequeSeries} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required>
              <TextInput icon={<Hash size={16} />} value={data.chequeNumber} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश दिनांक" required>
              <DateInput value={data.chequeDate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Cash Details"
          titleHi="रोख तपशील"
          subtitleEn="Applicant's details for a cash-based RTGS transaction."
          subtitleHi="रोख आरटीजीएस व्यवहारासाठी अर्जदाराचा तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Name Of Applicant" labelHi="अर्जदाराचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.nameOfApplicant} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 1" labelHi="पत्ता १" required>
              <TextInput icon={<MapPin size={16} />} value={data.cashAddress1} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 2" labelHi="पत्ता २" required>
              <TextInput icon={<MapPin size={16} />} value={data.cashAddress2} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Address 3" labelHi="पत्ता ३" required>
              <TextInput icon={<MapPin size={16} />} value={data.cashAddress3} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Remitter Details"
          titleHi="प्रेषक तपशील"
          subtitleEn="Remitting bank and applicant contact information."
          subtitleHi="प्रेषक बँक व अर्जदार संपर्क माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Remitting Bank IFSC Code" labelHi="प्रेषक बँक आयएफएससी कोड" required>
              <TextInput icon={<Landmark size={16} />} value={data.remittingBankIfscCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Application Contact No. (M)" labelHi="अर्ज संपर्क क्रमांक (मो.)" required>
              <TextInput icon={<Phone size={16} />} value={data.applicationContactNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Residence" labelHi="निवासस्थान" required>
              <TextInput icon={<Phone size={16} />} value={data.residence} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Office" labelHi="कार्यालय" required>
              <TextInput icon={<Phone size={16} />} value={data.office} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Application Email ID" labelHi="अर्ज ईमेल आयडी" required>
              <TextInput icon={<Mail size={16} />} value={data.applicationEmailId} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Beneficiary Details"
          titleHi="लाभार्थी तपशील"
          subtitleEn="Beneficiary and their bank details for this transaction."
          subtitleHi="या व्यवहारासाठी लाभार्थी व त्यांचा बँक तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Beneficiary Name" labelHi="लाभार्थीचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.beneficiaryName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Beneficiary Account Code" labelHi="लाभार्थी खाते कोड" required>
              <TextInput icon={<CreditCard size={16} />} value={data.beneficiaryAccountCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC Code" labelHi="आयएफएससी कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<Landmark size={16} />} value={data.ifscCode} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="IFSC Bank Name" labelHi="आयएफएससी बँकेचे नाव" required>
              <TextInput icon={<Landmark size={16} />} value={data.ifscBankName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC Branch Name" labelHi="आयएफएससी शाखेचे नाव" required>
              <TextInput icon={<Landmark size={16} />} value={data.ifscBranchName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC Center Name" labelHi="आयएफएससी केंद्राचे नाव" required>
              <TextInput icon={<MapPin size={16} />} value={data.ifscCenterName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC District Name" labelHi="आयएफएससी जिल्ह्याचे नाव" required>
              <TextInput icon={<MapPin size={16} />} value={data.ifscDistrictName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC State Name" labelHi="आयएफएससी राज्याचे नाव" required>
              <TextInput icon={<MapPin size={16} />} value={data.ifscStateName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="IFSC Address" labelHi="आयएफएससी पत्ता" required>
              <TextInput icon={<MapPin size={16} />} value={data.ifscAddress} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Beneficiary Contact No." labelHi="लाभार्थी संपर्क क्रमांक" required>
              <TextInput icon={<Phone size={16} />} value={data.beneficiaryContactNo} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Beneficiary Address 1" labelHi="लाभार्थी पत्ता १" required>
              <TextInput icon={<MapPin size={16} />} value={data.beneficiaryAddress1} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Beneficiary Address 2" labelHi="लाभार्थी पत्ता २" required>
              <TextInput icon={<MapPin size={16} />} value={data.beneficiaryAddress2} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Zip" labelHi="पिन कोड" required>
              <TextInput icon={<Hash size={16} />} value={data.zip} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="City" labelHi="शहर" required>
              <TextInput icon={<MapPin size={16} />} value={data.city} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="State" labelHi="राज्य" required>
              <TextInput icon={<MapPin size={16} />} value={data.state} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Sender To Receiver Info" labelHi="प्रेषक ते प्राप्तकर्ता माहिती" required>
              <TextInput icon={<FileText size={16} />} value={data.senderToReceiverInfo} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard
          titleEn="Payment Details"
          titleHi="देयक तपशील"
          subtitleEn="Remitting amount, charges and tax for this transaction."
          subtitleHi="या व्यवहारासाठी प्रेषित रक्कम, शुल्क व कर."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Remitting Amount" labelHi="प्रेषित रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.remittingAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Applicable Charges" labelHi="लागू शुल्क" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.applicableCharges} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Service Tax" labelHi="सेवा कर" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput icon={<IndianRupee size={16} />} value={data.serviceTax} onChange={() => {}} readOnly />
                </div>
                <DisabledLookupTrigger />
              </div>
            </FieldShell>

            <FieldShell label="Total Amount" labelHi="एकूण रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.totalAmount} onChange={() => {}} readOnly />
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
            title="RTGS Authorized Successfully"
            subtitle=""
            onClose={handleDone}
            onDone={handleDone}
            variant="success"
          />
        )}

        {actionModal === "rejected" && (
          <SuccessModal
            title="RTGS Authorization Rejected"
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

export default AuthorizeRtgsModal;
