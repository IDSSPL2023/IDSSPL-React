import { MouseEventHandler, useEffect, useState } from "react";
import {
  IdCard,
  User,
  Building2,
  Calendar,
  X,
  ThumbsUp,
  ThumbsDown,
  IndianRupee,
  Percent,
  Wallet,
  FileText,
} from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "../../shared/FormModal";
import { FieldShell, SectionCard, SelectField, TextInput } from "../../shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";

/* ===================== Shared types ===================== */

export interface AuthorizePigmyCloseData {
  // Account Details
  accountCode: string;
  accountName: string;
  agentId: string;
  agentName: string;
  // Account Summary
  customerId: string;
  customerName: string;
  openDate: string;
  maturityDate: string;
  interestRate: string;
  principalAmount: string;
  ledgerBalance: string;
  availableBalance: string;
  // Payment Details
  modeOfPayment: string;
  transferAcCode: string;
  transferAcName: string;
  // Recovery Summary
  totalDepositAmount: string;
  recoveryPrincipalAmount: string;
  recoveryInterestAmount: string;
  chargesAmount: string;
}

/* ===================== Config ===================== */

const CONFIG = {
  icon: "/shield-check.png",
  titleEn: "Authorize Pigmy Close Details",
  titleHi: "पिग्मी बंद तपशील अधिकृत करा",
  descEn: "Check information related to the Pigmy account closing and Authorize them.",
  descHi: "पिग्मी खाते बंद करण्याशी संबंधित माहिती तपासा आणि अधिकृत करा",
};

const DEFAULT_DATA: AuthorizePigmyCloseData = {
  accountCode: "PIG0012",
  accountName: "Akshay Om More",
  agentId: "AG0012",
  agentName: "Suresh Naik",
  customerId: "00012",
  customerName: "Akshay Om More",
  openDate: "27-Feb-2025",
  maturityDate: "27-Feb-2026",
  interestRate: "6%",
  principalAmount: "6,000",
  ledgerBalance: "6,360",
  availableBalance: "6,360",
  modeOfPayment: "Cash",
  transferAcCode: "1001",
  transferAcName: "Saving Account",
  totalDepositAmount: "6,000",
  recoveryPrincipalAmount: "6,000",
  recoveryInterestAmount: "360",
  chargesAmount: "0",
};

/* ===================== Modal ===================== */

export interface AuthorizePigmyCloseProps {
  open: boolean;
  initialData?: Partial<AuthorizePigmyCloseData>;
  onClose?: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

function AuthorizePigmyCloseModal({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizePigmyCloseProps) {
  const [data, setData] = useState<AuthorizePigmyCloseData>({
    ...DEFAULT_DATA,
    ...initialData,
  });
  const [actionModel, setActionModel] = useState<"authorize" | "rejected" | null>(null);
  const [showRejectReason, setShowRejectReason] = useState(false);

  useEffect(() => {
    if (open) {
      setData({ ...DEFAULT_DATA, ...initialData });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleAuthorize = () => {
    setActionModel("authorize");
    onAuthorize && onAuthorize();
  };

  const handleReject = () => {
    setShowRejectReason(true);
  };

  const handleConfirmReject = (reason: string) => {
    setShowRejectReason(false);
    setActionModel("rejected");
    onReject && onReject(reason);
  };

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const CustomFooterButton = () => {
    return (
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={handleReject}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          Reject
          <ThumbsDown className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
        >
          Cancel
          <X className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleAuthorize}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
        >
          Authorize
          <ThumbsUp className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const ToolPick = ({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary hover:bg-primary-200"
    >
      <IdCard size={18} />
    </button>
  );

  const DetailsForm = () => {
    return (
      <>
        <SectionCard titleEn="Account Details" titleHi="खाते तपशील" subtitleEn="Pigmy account being closed" subtitleHi="बंद होणारे पिग्मी खाते" icon="/User.png">
          <div className={grid4}>
            <FieldShell label="Account Code" labelHi="खाते कोड" required>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput icon={<IdCard size={16} />} value={data.accountCode} onChange={() => {}} readOnly />
                </div>
                <ToolPick onClick={() => {}} />
              </div>
            </FieldShell>

            <FieldShell label="Account Name" labelHi="खात्याचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.accountName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Agent ID" labelHi="एजंट आयडी" required>
              <TextInput icon={<IdCard size={16} />} value={data.agentId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Agent Name" labelHi="एजंटचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.agentName} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard titleEn="Account Summary" titleHi="खाते सारांश" subtitleEn="System-derived account balances" subtitleHi="प्रणाली-व्युत्पन्न खाते शिल्लक" icon="/User.png">
          <div className={grid4}>
            <FieldShell label="Customer Id" labelHi="ग्राहक आयडी" required>
              <TextInput icon={<IdCard size={16} />} value={data.customerId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required>
              <TextInput icon={<User size={16} />} value={data.customerName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Open Date" labelHi="उघडण्याची तारीख" required>
              <TextInput icon={<Calendar size={16} />} value={data.openDate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required>
              <TextInput icon={<Calendar size={16} />} value={data.maturityDate} onChange={() => {}} readOnly />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Interest Rate" labelHi="व्याजदर" required>
              <TextInput icon={<Percent size={16} />} value={data.interestRate} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Principal Amount" labelHi="मुद्दल रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.principalAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Ledger Balance" labelHi="लेजर शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.ledgerBalance} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Available Balance" labelHi="उपलब्ध शिल्लक" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.availableBalance} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard titleEn="Payment Details" titleHi="पेमेंट तपशील" subtitleEn="Where the closing balance is paid out" subtitleHi="अंतिम शिल्लक कोठे दिली जाईल" icon="/User.png">
          <div className={grid4}>
            <SelectField labelEn="Mode of Payment" labelMr="पेमेंट पद्धत" editable={false} icon={Wallet} value={data.modeOfPayment} onChange={() => {}} />

            <FieldShell label="Transfer A/c Code" labelHi="ट्रान्सफर खाते कोड" required>
              <TextInput icon={<IdCard size={16} />} value={data.transferAcCode} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Transfer A/c Name" labelHi="ट्रान्सफर खात्याचे नाव" required>
              <TextInput icon={<Building2 size={16} />} value={data.transferAcName} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>

        <SectionCard titleEn="Recovery Summary" titleHi="वसुली सारांश" subtitleEn="Principal, interest and charges recovered" subtitleHi="वसूल केलेले मुद्दल, व्याज व शुल्क" icon="/User.png">
          <div className={grid4}>
            <FieldShell label="Total Deposit Amount" labelHi="एकूण ठेव रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.totalDepositAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Recovery Principal Amount" labelHi="वसुली मुद्दल रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.recoveryPrincipalAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Recovery Interest Amount" labelHi="वसुली व्याज रक्कम" required>
              <TextInput icon={<IndianRupee size={16} />} value={data.recoveryInterestAmount} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Charges Amount" labelHi="शुल्क रक्कम" required>
              <TextInput icon={<FileText size={16} />} value={data.chargesAmount} onChange={() => {}} readOnly />
            </FieldShell>
          </div>
        </SectionCard>
      </>
    );
  };

  return (
    <>
      <FormModal
        onClose={() => onClose?.()}
        titleEn={CONFIG.titleEn}
        titleHi={CONFIG.titleHi}
        subtitleEn={CONFIG.descEn}
        subtitleHi={CONFIG.descHi}
        tabs={["Details"]}
        activeTab="Details"
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={<CustomFooterButton />}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={CONFIG.icon} alt={CONFIG.titleEn} width={50} height={50} />
          </div>
        }
      >
        <DetailsForm />

        {showRejectReason && (
          <RejectReasonModal onClose={() => setShowRejectReason(false)} onConfirm={handleConfirmReject} />
        )}

        {actionModel === "authorize" && (
          <SuccessModal
            title="Authorized Successfully"
            subtitle="Your Pigmy Account Closing is Authorized Successfully."
            onClose={() => {
              (setActionModel(null), onClose && onClose());
            }}
            onDone={() => {
              (setActionModel(null), onClose && onClose());
            }}
            variant="success"
          />
        )}

        {actionModel === "rejected" && (
          <SuccessModal
            title="Account Closing Authorization is Rejected"
            subtitle="Your Pigmy account closing authorization is rejected."
            onClose={() => {
              (setActionModel(null), onClose && onClose());
            }}
            onDone={() => {
              (setActionModel(null), onClose && onClose());
            }}
            variant="critical"
          />
        )}
      </FormModal>
    </>
  );
}

export default AuthorizePigmyCloseModal;
