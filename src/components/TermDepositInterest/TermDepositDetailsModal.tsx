// src/components/Authorization/Transaction/TermDepositDetailModal.tsx

import { useState, useEffect } from "react";
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
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  SelectInput,
  DateInput,
  SectionCard,
  RadioYesNo,
} from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import {
  DEFAULT_TD_INTEREST_PAYMENT_DATA,
  type TdInterestPaymentFormData,
} from "@/components/TransactionMaster/AddTdInterestPayment";

export interface TermDepositDetailModalProps {
  open: boolean;
  mode: "view" | "authorize" | "reject";
  initialData?: Partial<TdInterestPaymentFormData>;
  onClose: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
  onEdit?: () => void;
}

const MODE_OF_PAYMENT_OPTIONS = ["Cash", "Transfer", "Cheque"];

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

const TermDepositDetailFooter = ({
  mode,
  onReject,
  onCancel,
  onAuthorize,
  onEdit,
  isAuthorizing,
}: {
  mode: "view" | "authorize" | "reject";
  onReject: () => void;
  onCancel: () => void;
  onAuthorize: () => void;
  onEdit?: () => void;
  isAuthorizing?: boolean;
}) => {
  if (mode === "view") {
    return (
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
        >
          Close
          <X className="h-4 w-4" />
        </button>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Edit
            <User className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  if (mode === "reject") {
    return (
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
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
          onClick={onReject}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          Confirm Reject
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Authorize mode
  return (
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
        disabled={isAuthorizing}
        className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-medium text-white transition ${
          isAuthorizing
            ? "bg-primary-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary-700"
        }`}
      >
        {isAuthorizing ? "Authorizing..." : "Authorize"}
        <ThumbsUp className="h-4 w-4" />
      </button>
    </div>
  );
};

const TermDepositDetailModal = ({
  open,
  mode = "view",
  initialData,
  onClose,
  onAuthorize,
  onReject,
  onEdit,
}: TermDepositDetailModalProps) => {
  const [data] = useState<TdInterestPaymentFormData>(() => ({
    ...DEFAULT_TD_INTEREST_PAYMENT_DATA,
    ...initialData,
  }));
  const [actionModal, setActionModal] = useState<"authorize" | "rejected" | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>("");

  if (!open) return null;

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const isReadOnly = mode === "view" || mode === "authorize" || mode === "reject";

  const getTitle = () => {
    switch (mode) {
      case "view":
        return { en: "Term Deposit Interest Payment Details", hi: "ठराविक ठेव व्याज भुगतान तपशील" };
      case "authorize":
        return { en: "Authorize Term Deposit Interest Payment", hi: "ठराविक ठेवीवरील व्याज देयक अधिकृत करा" };
      case "reject":
        return { en: "Reject Term Deposit Interest Payment", hi: "ठराविक ठेवीवरील व्याज देयक नाकारा" };
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "view":
        return { 
          en: "View details of the term deposit interest payment.", 
          hi: "ठराविक ठेव व्याज भुगतानाचे तपशील पहा." 
        };
      case "authorize":
        return { 
          en: "Check information related to the term deposit interest payment and authorize it.", 
          hi: "ठराविक ठेवीवरील व्याज देयकाशी संबंधित माहिती तपासा आणि अधिकृत करा." 
        };
      case "reject":
        return { 
          en: "Review the term deposit interest payment details before rejecting.", 
          hi: "नाकारण्यापूर्वी ठराविक ठेव व्याज भुगतान तपशीलांची पुनरावलोकन करा." 
        };
    }
  };

  const title = getTitle();
  const subtitle = getSubtitle();

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setActionModal("authorize");
    // Don't call onAuthorize immediately - wait for success modal to show
  };

  const handleAuthorizeConfirm = () => {
    // This is called when the user clicks "Done" on the success modal
    onAuthorize?.();
    handleDone();
  };

  const handleReject = () => {
    if (mode === "reject") {
      // Direct reject without reason modal
      setActionModal("rejected");
      setRejectReason("Rejected by user");
      // Don't call onReject immediately - wait for success modal to show
    } else {
      setShowRejectReason(true);
    }
  };

  const handleConfirmReject = (reason: string) => {
    setShowRejectReason(false);
    setActionModal("rejected");
    setRejectReason(reason);
    // Don't call onReject immediately - wait for success modal to show
  };

  const handleRejectConfirm = () => {
    // This is called when the user clicks "Done" on the success modal
    onReject?.(rejectReason);
    handleDone();
  };

  const handleDone = () => {
    setActionModal(null);
    setIsAuthorizing(false);
    setShowRejectReason(false);
    onClose();
  };

  // If actionModal is set, show the success modal and don't render the form modal
  if (actionModal === "authorize") {
    return (
      <SuccessModal
        title="Term Deposit Interest Payment Authorized Successfully"
        subtitle="The term deposit interest payment has been authorized."
        onClose={handleAuthorizeConfirm}
        onDone={handleAuthorizeConfirm}
        variant="success"
      />
    );
  }

  if (actionModal === "rejected") {
    return (
      <SuccessModal
        title="Term Deposit Interest Payment Authorization Rejected"
        subtitle="The term deposit interest payment authorization has been rejected."
        onClose={handleRejectConfirm}
        onDone={handleRejectConfirm}
        variant="critical"
      />
    );
  }

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn={title.en}
        titleHi={title.hi}
        subtitleEn={subtitle.en}
        subtitleHi={subtitle.hi}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/Authorize User.png" alt="Term Deposit Interest Payment" width={50} height={50} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={
          <TermDepositDetailFooter
            mode={mode}
            onReject={handleReject}
            onCancel={onClose}
            onAuthorize={handleAuthorize}
            onEdit={onEdit}
            isAuthorizing={isAuthorizing}
          />
        }
      >
        {/* Status Badge */}
        {mode === "reject" && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-700 border border-red-200">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">This transaction is being rejected</span>
          </div>
        )}

        {mode === "view" && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 border border-blue-200">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Viewing transaction details</span>
          </div>
        )}

        {/* {mode === "authorize" && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-yellow-700 border border-yellow-200">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">This transaction is pending authorization</span>
          </div>
        )} */}

        {/* Section 1 — Account Details */}
        <SectionCard
          titleEn="Account Details"
          titleHi="खाते तपशील"
          subtitleEn="Account information for the term deposit interest payment."
          subtitleHi="ठराविक ठेव व्याज भुगतानाची खाते माहिती."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <RadioYesNo
              label="Is HO Transaction"
              labelHi="मुख्य कार्यालय व्यवहार आहे का"
              value={data.isHoTransaction}
              onChange={() => {}}
              disabled={isReadOnly}
            />

            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput 
                    icon={<CreditCard size={16} />} 
                    value={data.accountCode} 
                    onChange={() => {}} 
                    readOnly={isReadOnly} 
                  />
                </div>
                {isReadOnly ? <DisabledLookupTrigger /> : null}
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput 
                icon={<User size={16} />} 
                value={data.accountName} 
                onChange={() => {}} 
                readOnly 
              />
            </FieldShell>

            <FieldShell label="GL Account Code" labelHi="जीएल खाते कोड" required>
              <TextInput 
                icon={<Landmark size={16} />} 
                value={data.glAccountCode} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="GL Account Name" labelHi="जीएल खात्याचे नाव" required>
              <TextInput 
                icon={<User size={16} />} 
                value={data.glAccountName} 
                onChange={() => {}} 
                readOnly 
              />
            </FieldShell>

            <FieldShell label="Interest Up To Date" labelHi="व्याज या तारखेपर्यंत" required>
              <TextInput 
                icon={<Hash size={16} />} 
                value={data.interestUpToDate} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Scroll Number" labelHi="स्क्रोल क्रमांक" required>
              <TextInput 
                icon={<Hash size={16} />} 
                value={data.scrollNumber} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Section 2 — Account Summary */}
        <SectionCard
          titleEn="Account Summary"
          titleHi="खाते सारांश"
          subtitleEn="Deposit account balances and maturity details."
          subtitleHi="ठेव खाते शिल्लक व परिपक्वता तपशील."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.depositAmount} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Open Date" labelHi="सुरुवात तारीख" required>
              <DateInput 
                value={data.openDate} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required>
              <DateInput 
                value={data.maturityDate} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Interest Rate" labelHi="व्याज दर" required>
              <TextInput 
                icon={<Percent size={16} />} 
                value={data.interestRate} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Maturity Value" labelHi="परिपक्वता मूल्य" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.maturityValue} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Period" labelHi="कालावधी" required>
              <TextInput 
                icon={<Hash size={16} />} 
                value={data.period} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Unit Of Period" labelHi="कालावधीचे एकक" required>
              <TextInput 
                icon={<Hash size={16} />} 
                value={data.unitOfPeriod} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.summaryLedgerBalance} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.summaryAvailableBalance} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.summaryNewLedgerBalance} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Section 3 — Payment Details */}
        <SectionCard
          titleEn="Payment Details"
          titleHi="देयक तपशील"
          subtitleEn="Manage interest payment and cheque related information."
          subtitleHi="व्याज प्रदान व धनादेश संबंधित माहिती व्यवस्थापित करा."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="Mode Of Payment" labelHi="देयक पद्धत" required>
              <SelectInput
                icon={<CreditCard size={16} />}
                value={data.modeOfPayment}
                onChange={() => {}}
                options={MODE_OF_PAYMENT_OPTIONS}
                // disabled={isReadOnly}
              />
            </FieldShell>

            <FieldShell label="Transfer Account Code" labelHi="बदली खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput 
                    icon={<CreditCard size={16} />} 
                    value={data.transferAccountCode} 
                    onChange={() => {}} 
                    readOnly={isReadOnly} 
                  />
                </div>
                {isReadOnly ? <DisabledLookupTrigger /> : null}
              </div>
            </FieldShell>

            <FieldShell label="Transfer Account Name" labelHi="बदली खात्याचे नाव" required>
              <TextInput 
                icon={<User size={16} />} 
                value={data.transferAccountName} 
                onChange={() => {}} 
                readOnly 
              />
            </FieldShell>

            <FieldShell label="Particular" labelHi="तपशील" required>
              <TextInput 
                icon={<FileText size={16} />} 
                value={data.particular} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="खातेवही शिल्लक" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.paymentLedgerBalance} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.paymentAvailableBalance} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="New Ledger Balance" labelHi="नवीन खातेवही शिल्लक" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.paymentNewLedgerBalance} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Last Int Date" labelHi="शेवटची व्याज तारीख" required>
              <DateInput 
                value={data.lastIntDate} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Completed Days" labelHi="पूर्ण झालेले दिवस" required>
              <TextInput 
                icon={<Hash size={16} />} 
                value={data.completedDays} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Completed Months" labelHi="पूर्ण झालेले महिने" required>
              <TextInput 
                icon={<Hash size={16} />} 
                value={data.completedMonths} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Interest Calculated" labelHi="गणना केलेले व्याज" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.interestCalculated} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Pending Cash Interest" labelHi="प्रलंबित रोख व्याज" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.pendingCashInterest} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Interest Pay" labelHi="व्याज प्रदान" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.interestPay} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Interest Payable" labelHi="देय व्याज" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.interestPayable} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Total Interest Paid" labelHi="एकूण व्याज प्रदान केले" required>
              <TextInput 
                icon={<IndianRupee size={16} />} 
                value={data.totalInterestPaid} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <RadioYesNo
              label="Is Renewal"
              labelHi="नूतनीकरण आहे का"
              value={data.isRenewal}
              onChange={() => {}}
              disabled={isReadOnly}
            />

            <RadioYesNo
              label="Transfer By Cheque"
              labelHi="धनादेशाद्वारे बदली"
              value={data.transferByCheque}
              onChange={() => {}}
              disabled={isReadOnly}
            />

            <FieldShell label="Original / Responding" labelHi="मूळ / प्रतिसाद" required>
              <TextInput 
                icon={<FileText size={16} />} 
                value={data.originalOrResponding} 
                onChange={() => {}} 
                readOnly 
              />
            </FieldShell>

            <FieldShell label="Cheque Type" labelHi="धनादेश प्रकार" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput 
                    icon={<FileText size={16} />} 
                    value={data.chequeType} 
                    onChange={() => {}} 
                    readOnly={isReadOnly} 
                  />
                </div>
                {isReadOnly ? <DisabledLookupTrigger /> : null}
              </div>
            </FieldShell>

            <FieldShell label="Cheque Series" labelHi="धनादेश मालिका" required>
              <TextInput 
                icon={<Hash size={16} />} 
                value={data.chequeSeries} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Cheque Number" labelHi="धनादेश क्रमांक" required>
              <TextInput 
                icon={<Hash size={16} />} 
                value={data.chequeNumber} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Cheque Date" labelHi="धनादेश तारीख" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <DateInput 
                    value={data.chequeDate} 
                    onChange={() => {}} 
                    readOnly={isReadOnly} 
                  />
                </div>
                {isReadOnly ? <DisabledLookupTrigger /> : null}
              </div>
            </FieldShell>
          </div>
        </SectionCard>

        {/* Section 4 — GL / Accounting Information */}
        <SectionCard
          titleEn="GL / Accounting Information"
          titleHi="जीएल / लेखा माहिती"
          subtitleEn="Manage GL outlist and advice related information."
          subtitleHi="जीएल आऊटलिस्ट व सल्ला संबंधित माहिती व्यवस्थापित करा."
          icon={<SectionIcon />}
        >
          <div className={`${grid4} mt-2`}>
            <FieldShell label="GL Outlist No" labelHi="जीएल आऊटलिस्ट क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput 
                    icon={<FileText size={16} />} 
                    value={data.glOutlistNo} 
                    onChange={() => {}} 
                    readOnly={isReadOnly} 
                  />
                </div>
                {isReadOnly ? <DisabledLookupTrigger /> : null}
              </div>
            </FieldShell>

            <FieldShell label="GL Outlist Doc No" labelHi="जीएल आऊटलिस्ट दस्तऐवज क्रमांक" required>
              <TextInput 
                icon={<FileText size={16} />} 
                value={data.glOutlistDocNo} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput 
                icon={<FileText size={16} />} 
                value={data.description} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Advice Number" labelHi="सल्ला क्रमांक" required>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput 
                    icon={<Hash size={16} />} 
                    value={data.adviceNumber} 
                    onChange={() => {}} 
                    readOnly={isReadOnly} 
                  />
                </div>
                {isReadOnly ? <DisabledLookupTrigger /> : null}
              </div>
            </FieldShell>

            <FieldShell label="Advice Date" labelHi="सल्ला तारीख" required>
              <DateInput 
                value={data.adviceDate} 
                onChange={() => {}} 
                readOnly={isReadOnly} 
              />
            </FieldShell>

            <FieldShell label="Account Type" labelHi="खाते प्रकार" required>
              <TextInput 
                icon={<Building2 size={16} />} 
                value={data.accountType} 
                onChange={() => {}} 
                readOnly 
              />
            </FieldShell>
          </div>
        </SectionCard>
      </FormModal>

      {/* Reject Reason Modal */}
      {showRejectReason && (
        <RejectReasonModal
          titleEn="Authorization Rejected"
          titleHi="अधिकृतता नाकारली"
          onClose={() => setShowRejectReason(false)}
          onConfirm={handleConfirmReject}
        />
      )}
    </>
  );
};

export default TermDepositDetailModal;