import { MouseEventHandler, useEffect, useState } from "react";
import {
  User,
  IdCard,
  Building2,
  HomeIcon,
  FlagIcon,
  X,
  ChevronDown,
  MoreVertical,
  FileText,
  Wallet,
  Calendar,
  CalendarClock,
  ShieldAlert,
  CodeIcon,
  UserCheck,
  DollarSign,
  Percent,
  Coins,
  CreditCard,
  Wrench,
  ArrowLeftRight,
  Hexagon,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "../../../shared/FormModal";
import {
  FieldShell,
  RadioDayMonth,
  SelectField,
  TextInput,
} from "../../../shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";

/* ===================== Shared types ===================== */

export interface AuthorizeDepositAccountData {
  applicationNumber: string;
  customerId: string;
  customerName: string;
  categoryCode: string;
  riskCategory: string;
  introducerAccountCode: string;
  introducerAccountName: string;
  dateOfApplication: string;
  accountOperationCapacityId: string;
  minBalanceId: string;
  // Deposit specific fields
  accountType?: string;
  accountOpenDate?: string;
  unitOfPeriodDay?: boolean;
  periodDeposit?: string;
  interestRate?: string;
  maturityDate?: string;
  interestPaidInCashDay?: boolean;
  rateDiscountedDay?: boolean;
  interestPaymentFrequency?: string;
  depositAmount?: string;
  depositAmountWords?: string;
  cash?: string;
  clearing?: string;
  transfer?: string;
  creditAccountCode?: string;
  creditAccountName?: string;
  maturityAmount?: string;
  // Nominee specific fields
  salutationCode?: string;
  nomineeCustomerId?: string;
  nomineeName?: string;
  relation?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
}

/* ===================== Config ===================== */

const CONFIG = {
  icon: "/shield-check.png",
  titleEn: "Authorize Deposit Account",
  titleHi: "ठेवीचे खाते अधिकृत करा",
  descEn: "Check information related to the Account and Authorize them.",
  descHi: "कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती",
};

const DEFAULT_DATA: AuthorizeDepositAccountData = {
  applicationNumber: "12",
  customerId: "00012",
  customerName: "Akshay Om More",
  categoryCode: "Public",
  riskCategory: "Low",
  introducerAccountCode: "1001",
  introducerAccountName: "Saving Account",
  dateOfApplication: "27-Feb-2026",
  accountOperationCapacityId: "Self",
  minBalanceId: "200",
  // Deposit defaults
  accountType: "TD",
  accountOpenDate: "23-May-2026",
  unitOfPeriodDay: true,
  periodDeposit: "7",
  interestRate: "1.2",
  maturityDate: "23-May-2026",
  interestPaidInCashDay: true,
  rateDiscountedDay: true,
  interestPaymentFrequency: "Monthly",
  depositAmount: "100",
  depositAmountWords: "One Hundred",
  cash: "100",
  clearing: "0",
  transfer: "0",
  creditAccountCode: "2001",
  creditAccountName: "Akshay Om More",
  maturityAmount: "23,990",
  // Nominee defaults
  salutationCode: "MR",
  nomineeCustomerId: "00012",
  nomineeName: "Akshay Om More",
  relation: "Father",
  address1: "Kolhapur",
  address2: "Kolhapur",
  address3: "Kolhapur",
  zip: "416005",
  city: "Kolhapur",
  state: "Maharashtra",
  country: "India",
};

/* ===================== UserDetailsModal ===================== */

export interface AuthorizeDepositAccountProps {
  open: boolean;
  initialData?: Partial<AuthorizeDepositAccountData>;
  onClose?: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

function AuthorizeDepositAccountModal({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeDepositAccountProps) {
  const [data, setData] = useState<AuthorizeDepositAccountData>({
    ...DEFAULT_DATA,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionModel, setActionModel] = useState<
    "authorize" | "rejected" | null
  >(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Details");
  const TABS = ["Details", "Deposit", "Nominee", "Joint Holder"] as const;

  useEffect(() => {
    if (open) {
      setData({ ...DEFAULT_DATA, ...initialData });
      setErrors({});
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleNext = () => {
    const idx = TABS.indexOf(activeTab);
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1]);
  };

  type TabKey = (typeof TABS)[number];

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

  const isLastStep = activeTab === "Joint Holder";

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

  const CustomFooterButton = () => {
    return (
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
        {isLastStep && (
          <button
            type="button"
            onClick={handleReject}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            Reject
            <ThumbsDown className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-5 py-2 text-sm font-medium text-primary transition hover:bg-slate-50"
        >
          Cancel
          <X className="h-4 w-4" />
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={handleAuthorize}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Authorize
            <ThumbsUp className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            Next
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </button>
        )}
      </div>
    );
  };

  const ToolPick = ({
    onClick,
  }: {
    onClick: MouseEventHandler<HTMLButtonElement>;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary hover:bg-primary-200"
    >
      <MoreVertical size={20} />
    </button>
  );

  function SrNoField({ value }: { value?: string | number }) {
    return (
      <div className="flex h-full max-w-max flex-col">
        <span className="mb-1.5 block truncate whitespace-nowrap text-sm font-medium text-[#1F2858]">
          Sr No
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-600 bg-slate-50 text-sm font-normal text-[#4B5563]">
          {value ?? "\u2014"}
        </div>
      </div>
    );
  }

  const DetailsForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid4}>
          <FieldShell
            label="Application Number"
            labelHi="अर्ज क्रमांक"
            required
          >
            <TextInput
              icon={<FileText size={16} />}
              value={data.applicationNumber}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Customer Id" labelHi="ग्राहक आयडी" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<IdCard size={16} />}
                  value={data.customerId}
                  onChange={() => {}}
                  readOnly
                  error={!!errors.customerId}
                />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
            {errors.customerId && (
              <p className="mt-1 text-sm text-red-500">{errors.customerId}</p>
            )}
          </FieldShell>

          <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required>
            <TextInput
              icon={<User size={16} />}
              value={data.customerName}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Category Code" labelHi="कॅटेगरी कोड" required>
            <TextInput
              icon={<Building2 size={16} />}
              value={data.categoryCode}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>

        <div className={`${grid3} mt-4`}>
          <FieldShell label="Risk Category" labelHi="धोक्याचा प्रकार" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<ShieldAlert size={16} />}
                  value={data.riskCategory}
                  onChange={() => {}}
                  readOnly
                  error={!!errors.branchCode}
                />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell
            label="Introducer Account Code"
            labelHi="ओळखपत्र खात्याचा कोड"
            required
          >
            <TextInput
              icon={<CodeIcon size={16} />}
              value={data.introducerAccountCode}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell
            label="Introducer Account Name"
            labelHi="ओळखपत्र खात्याचे नाव"
            required
          >
            <TextInput
              icon={<Wallet size={16} />}
              value={data.introducerAccountName}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell
            label="Date of Application"
            labelHi="अर्जाची तारीख"
            required
          >
            <TextInput
              icon={<Calendar size={16} />}
              value={data.dateOfApplication}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <SelectField
            labelEn="Account Operation Capacity ID"
            labelMr="खाते ऑपरेशन क्षमता आयडी"
            editable={false}
            icon={UserCheck}
            value={data.accountOperationCapacityId}
            onChange={() => {}}
          />

          <SelectField
            labelEn="Min Balance ID"
            labelMr="किमान शिल्लक आयडी"
            editable={false}
            icon={DollarSign}
            value={data.minBalanceId}
            onChange={() => {}}
          />
        </div>
      </div>
    );
  };

  const DepositForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid3}>
          <FieldShell label="Account Type" labelHi="आकाउंट प्रकार" required>
            <TextInput
              icon={<User size={16} />}
              value={data.accountType || "TD"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell
            label="Account Open Date"
            labelHi="खाते उघडण्याची तारीख"
            required
          >
            <TextInput
              icon={<Calendar size={16} />}
              value={data.accountOpenDate || "23-May-2026"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <RadioDayMonth
            label="Unit Of Period"
            value={!!data.unitOfPeriodDay}
            onChange={() => {}}
            disabled
          />
        </div>

        <div className={`${grid3} mt-4`}>
          <FieldShell label="Period Deposit" labelHi="काळजी ठेव" required>
            <TextInput
              icon={<CalendarClock size={16} />}
              value={data.periodDeposit || "7"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Interest Rate" labelHi="व्याज दर" required>
            <TextInput
              icon={<Percent size={16} />}
              value={data.interestRate || "1.2"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Maturity Date" labelHi="परिपक्वता तारीख" required>
            <TextInput
              icon={<Calendar size={16} />}
              value={data.maturityDate || "23-May-2026"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>

        <div className={`${grid3} mt-4`}>
          <RadioDayMonth
            label="Interest Paid in Cash"
            value={!!data.interestPaidInCashDay}
            onChange={() => {}}
            disabled
          />

          <RadioDayMonth
            label="Rate Discounted"
            value={!!data.rateDiscountedDay}
            onChange={() => {}}
            disabled
          />

          <SelectField
            labelEn="Interest Payment Frequency"
            labelMr="व्याज भरण्याची वारंवारिता"
            editable={false}
            icon={Calendar}
            value={data.interestPaymentFrequency || "Monthly"}
            onChange={() => {}}
          />
        </div>

        <div className={`${grid3} mt-4`}>
          <FieldShell label="Deposit Amount" labelHi="ठेव रक्कम" required>
            <TextInput
              icon={<Coins size={16} />}
              value={data.depositAmount || "100"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell
            label="Deposit Amount in words"
            labelHi="ठेव रक्कम शब्दांमध्ये"
            required
            className="md:col-span-2"
          >
            <TextInput
              icon={<Coins size={16} />}
              value={data.depositAmountWords || "One Hundred"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>

        <div className={`${grid3} mt-4`}>
          <FieldShell label="Cash" labelHi="रोख" required>
            <TextInput
              icon={<CreditCard size={16} />}
              value={data.cash || "100"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Clearing" labelHi="क्लीअरिंग" required>
            <TextInput
              icon={<Wrench size={16} />}
              value={data.clearing || "0"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Transfer" labelHi="हस्तांतरण" required>
            <TextInput
              icon={<ArrowLeftRight size={16} />}
              value={data.transfer || "0"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>

        <div className={`${grid3} mt-4`}>
          <FieldShell
            label="Credit Account Code"
            labelHi="क्रेडिट अकाउंट कोड"
            required
          >
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<Hexagon size={16} />}
                  value={data.creditAccountCode || "2001"}
                  onChange={() => {}}
                  readOnly
                />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell
            label="Credit Account Name"
            labelHi="क्रेडिट खाते नाव"
            required
          >
            <TextInput
              icon={<User size={16} />}
              value={data.creditAccountName || "Akshay Om More"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell
            label="Maturity Amount"
            labelHi="परिपक्वतेची रक्कम"
            required
          >
            <TextInput
              icon={<Coins size={16} />}
              value={data.maturityAmount || "23,990"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>
      </div>
    );
  };

  const NomineeForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid4}>
          <div className="flex gap-4">
            <SrNoField value="1" />

            <SelectField
              labelEn="Salutation Code"
              labelMr="संबोधनी"
              editable={false}
              value={data.salutationCode || "MR"}
              onChange={() => {}}
            />
          </div>

          <FieldShell
            label="Nominee Customer ID"
            labelHi="नॉमिनी ग्राहक आयडी"
            required
          >
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<IdCard size={16} />}
                  value={data.nomineeCustomerId || data.customerId || "00012"}
                  onChange={() => {}}
                  readOnly
                  error={!!errors.customerId}
                />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell label="Nominee Name" labelHi="नॉमिनी नाव" required>
            <TextInput
              icon={<User size={16} />}
              value={data.nomineeName || data.customerName || "Akshay Om More"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <SelectField
            labelEn="Relation"
            labelMr="नाते"
            editable={false}
            icon={UserCheck}
            value={data.relation || "Father"}
            onChange={() => {}}
          />
        </div>

        <div className={`${grid4} mt-4`}>
          <FieldShell label="Address 1" labelHi="पत्ता १" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<HomeIcon size={16} />}
                  value={data.address1 || "Kolhapur"}
                  onChange={() => {}}
                  readOnly
                  error={!!errors.branchCode}
                />
              </div>
            </div>
          </FieldShell>

          <FieldShell label="Address 2" labelHi="पत्ता २" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.address2 || "Kolhapur"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Address 3" labelHi="पत्ता ३" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.address3 || "Kolhapur"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Zip" labelHi="पिन कोड" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.zip || "416005"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <SelectField
            labelEn="City"
            labelMr="शहरे"
            editable={false}
            icon={HomeIcon}
            value={data.city || "Kolhapur"}
            onChange={() => {}}
          />

          <FieldShell label="State" labelHi="राज्य" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.state || "Maharashtra"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Country" labelHi="देश" required>
            <TextInput
              icon={<FlagIcon size={16} />}
              value={data.country || "India"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>
      </div>
    );
  };

  const JointHolderForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid3}>
          <div className="flex gap-4">
            <SrNoField value="1" />

            <SelectField
              labelEn="Salutation Code"
              labelMr="संबोधनी"
              editable={false}
              value={data.salutationCode || "MR"}
              onChange={() => {}}
            />
          </div>

          <FieldShell
            label="J/T Holder Customer ID"
            labelHi="J/T धारक ग्राहक आयडी"
          >
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<IdCard size={16} />}
                  value={data.nomineeCustomerId || data.customerId || "00012"}
                  onChange={() => {}}
                  readOnly
                  error={!!errors.customerId}
                />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell
            label="J/T Holder Name"
            labelHi="J/T धारकाचे नाव"
            required
          >
            <TextInput
              icon={<User size={16} />}
              value={data.nomineeName || data.customerName || "Akshay Om More"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>

        <div className={`${grid3} mt-4`}>
          <FieldShell label="Address 1" labelHi="पत्ता १" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<HomeIcon size={16} />}
                  value={data.address1 || "Kolhapur"}
                  onChange={() => {}}
                  readOnly
                  error={!!errors.branchCode}
                />
              </div>
            </div>
          </FieldShell>

          <FieldShell label="Address 2" labelHi="पत्ता २" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.address2 || "Kolhapur"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Address 3" labelHi="पत्ता ३" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.address3 || "Kolhapur"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Zip" labelHi="पिन कोड" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.zip || "416005"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <SelectField
            labelEn="City"
            labelMr="शहरे"
            editable={false}
            icon={Building2}
            value={data.city || "Kolhapur"}
            onChange={() => {}}
          />

          <FieldShell label="State" labelHi="राज्य" required>
            <TextInput
              icon={<Building2 size={16} />}
              value={data.state || "Maharashtra"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Country" labelHi="देश" required>
            <TextInput
              icon={<FlagIcon size={16} />}
              value={data.country || "India"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>
      </div>
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
        tabs={[...TABS]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabKey)}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={<CustomFooterButton />}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image
              src={CONFIG.icon}
              alt={CONFIG.titleEn}
              width={50}
              height={50}
            />
          </div>
        }
      >
        {/* User Details */}
        {activeTab === "Details" ? (
          <DetailsForm />
        ) : activeTab === "Deposit" ? (
          <DepositForm />
        ) : activeTab === "Nominee" ? (
          <NomineeForm />
        ) : (
          <JointHolderForm />
        )}

        {showRejectReason && (
          <RejectReasonModal
            onClose={() => setShowRejectReason(false)}
            onConfirm={handleConfirmReject}
          />
        )}

        {actionModel === "authorize" && (
          <SuccessModal
            title="Authorized Successfully"
            subtitle="Your Account is Authorized Successfully."
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
            title="Account Authorization is Rejected"
            subtitle="Your Account authorization is rejected."
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

export default AuthorizeDepositAccountModal;
