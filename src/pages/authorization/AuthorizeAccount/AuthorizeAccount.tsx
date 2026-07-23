import { IMAGES, ICONS } from "@/assets";
import { MouseEventHandler, useEffect, useState, useMemo } from "react";
import { User, IdCard, Building2, HomeIcon, FlagIcon, X, ChevronDown, MoreVertical, FileText, Wallet, Calendar, ShieldAlert, CodeIcon, UserCheck, DollarSign, ThumbsUp, ThumbsDown, PhoneIcon, Building, ShieldCheck, HeartPulse, Percent, Calculator, Users, CalendarClock, Coins, CreditCard, Wrench, ArrowLeftRight, Hexagon, Ban, BookOpen, Link, Clock, AlertCircle, CircleX, Search, ArrowUpRight, UserX, Share2, Power, BarChart3, CircleDollarSign, PiggyBank, ShieldOff, type LucideIcon } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, SelectField, TextInput, RadioDayMonth, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import { useBilingual } from "@/i18n/useBilingual";
import FilterModal, { type AccountFilters } from "@/components/shared/FilterModal";
import AuthorizationTabs, { type AuthorizationTabKey } from "@/components/Authorization/AuthorizationTabs";
import ModalWrapper from "@/components/shared/Wrappers/ModalWrapper";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import RowActionMenu, { type RowActionMenuItem } from "@/components/shared/RowActionMenu";
import SrNoBadge from "@/components/shared/SrNoBadge";
import SortableHeaderLabel from "@/components/shared/SortableHeaderLabel";
import FixedAssetPage from "@/pages/futuremodels/FixedAsset/FixedAsset";
import { hasActiveFilters, getActiveFilterSummary } from "@/components/shared/filterSummary";

/* ===== from AuthorizeSavingAccountModal.tsx ===== */
/* ===================== Shared types ===================== */

export interface AuthorizeSavingAccountModal_AuthorizeSavingAccountData {
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

const AuthorizeSavingAccountModal_CONFIG = {
  icon: IMAGES.SHIELD_CHECK,
  titleEn: "Authorize Saving Account",
  titleHi: "सेव्हिंग अकाउंटसाठी परवाना द्या",
  descEn: "Check information related to the Account and Authorize them.",
  descHi: "कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती",
};

const AuthorizeSavingAccountModal_DEFAULT_DATA: AuthorizeSavingAccountModal_AuthorizeSavingAccountData = {
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

export interface AuthorizeSavingAccountModal_AuthorizeSavingAccountProps {
  open: boolean;
  initialData?: Partial<AuthorizeSavingAccountModal_AuthorizeSavingAccountData>;
  onClose?: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

function AuthorizeSavingAccountModal({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeSavingAccountModal_AuthorizeSavingAccountProps) {
  const [data, setData] = useState<AuthorizeSavingAccountModal_AuthorizeSavingAccountData>({
    ...AuthorizeSavingAccountModal_DEFAULT_DATA,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionModel, setActionModel] = useState<
    "authorize" | "rejected" | null
  >(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Details");
  const TABS = ["Details", "Nominee", "Joint Holder"] as const;

  useEffect(() => {
    if (open) {
      setData({ ...AuthorizeSavingAccountModal_DEFAULT_DATA, ...initialData });
      setErrors({});
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleNext = () => {
    const idx = TABS.indexOf(activeTab);
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1]);
  };

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

  type TabKey = (typeof TABS)[number];

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";
  const grid3 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

  const isLastStep = activeTab === "Joint Holder";

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
        titleEn={AuthorizeSavingAccountModal_CONFIG.titleEn}
        titleHi={AuthorizeSavingAccountModal_CONFIG.titleHi}
        subtitleEn={AuthorizeSavingAccountModal_CONFIG.descEn}
        subtitleHi={AuthorizeSavingAccountModal_CONFIG.descHi}
        tabs={[...TABS]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabKey)}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={<CustomFooterButton />}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image
              src={AuthorizeSavingAccountModal_CONFIG.icon}
              alt={AuthorizeSavingAccountModal_CONFIG.titleEn}
              width={50}
              height={50}
            />
          </div>
        }
      >
        {/* User Details */}
        {activeTab === "Details" ? (
          <DetailsForm />
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


/* ===== from AuthorizeLoanAccountModal.tsx ===== */
/* ===================== Shared types ===================== */

export interface AuthorizeLoanAccountModal_AuthorizeLoanAccountData {
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
  // Guarantor specific fields
  guarantorSalutationCode?: string;
  guarantorCustomerId?: string;
  guarantorName?: string;
  employeeId?: string;
  memberNo?: string;
  mobileNumber?: string;
  birthDate?: string;
  emailId?: string;
  guarantorAddress1?: string;
  guarantorAddress2?: string;
  guarantorAddress3?: string;
  guarantorZip?: string;
  guarantorCity?: string;
  guarantorState?: string;
  guarantorCountry?: string;
  // Salary specific fields
  employeeName?: string;
  department?: string;
  securityTypeCode?: string;
  grossSalary?: string;
  netSalary?: string;
  isIncomeTaxPayee?: string;
  panNumber?: string;
  pfAccountNumber?: string;
  salaryMobileNumber?: string;
  salaryAddress1?: string;
  salaryAddress2?: string;
  salaryAddress3?: string;
  salaryZip?: string;
  salaryCity?: string;
  salaryState?: string;
  salaryCountry?: string;
  // Loan specific fields
  submissionDate?: string;
  registrationDate?: string;
  resolutionNo?: string;
  sanctionDate?: string;
  installmentStartDate?: string;
  periodOfLoan?: string;
  accountReviewDate?: string;
  repaymentFrequency?: string;
  registerAmount?: string;
  limitAmount?: string;
  drawingPower?: string;
  sanctionAmount?: string;
  sanctionAmountInWords?: string;
  // Interest & Repayment fields
  intCalculationMethod?: string;
  interestRate?: string;
  penalInterestRate?: string;
  installationTypeId?: string;
  installationType?: string;
  installmentAmount?: string;
  morInterestRate?: string;
  morPeriodMonth?: string;
  overdueInterestRate?: string;
  // Area & Classification fields
  areaCode?: string;
  areaName?: string;
  subAreaCode?: string;
  subAreaName?: string;
  socialSectorId?: string;
  socialSectorDescription?: string;
  socialSubSectorId?: string;
  socialSubSectorDescription?: string;
  // Business & Purpose fields
  consentLoan?: string;
  isDirectorReference?: string;
  purposeId?: string;
  classificationId?: string;
  modeOfSanctionId?: string;
  directorId?: string;
  industryId?: string;
  socialSectionId?: string;
  sanctionAuthorityId?: string;
  directorName?: string;
  lbrCode?: string;
}

/* ===================== Config ===================== */

const AuthorizeLoanAccountModal_CONFIG = {
  icon: IMAGES.SHIELD_CHECK,
  titleEn: "Authorize Loan Account",
  titleHi: "कर्ज खात्याला मंजुरी द्या",
  descEn: "Check information related to the Account and Authorize them.",
  descHi: "कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती",
};

const AuthorizeLoanAccountModal_DEFAULT_DATA: AuthorizeLoanAccountModal_AuthorizeLoanAccountData = {
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
  // Guarantor defaults (from image)
  guarantorSalutationCode: "MR",
  guarantorCustomerId: "21897",
  guarantorName: "Karan Mangesh Patil",
  employeeId: "0001",
  memberNo: "21897",
  mobileNumber: "9876545678",
  birthDate: "12-Jun-2001",
  emailId: "Akshay12@gmail.com",
  guarantorAddress1: "Kolhapur",
  guarantorAddress2: "Kolhapur",
  guarantorAddress3: "Kolhapur",
  guarantorZip: "416005",
  guarantorCity: "Kolhapur",
  guarantorState: "Maharashtra",
  guarantorCountry: "India",
  // Salary specific fields
  employeeName: "Akshay Om More",
  department: "IT",
  securityTypeCode: "SEC001",
  grossSalary: "50000",
  netSalary: "45000",
  isIncomeTaxPayee: "No",
  panNumber: "ABCDE1234F",
  pfAccountNumber: "PF123456789",
  salaryMobileNumber: "9876543210",
  salaryAddress1: "Kolhapur",
  salaryAddress2: "Kolhapur",
  salaryAddress3: "Kolhapur",
  salaryZip: "416005",
  salaryCity: "Kolhapur",
  salaryState: "Maharashtra",
  salaryCountry: "India",
  // Loan specific defaults
  submissionDate: "27-Feb-2026",
  registrationDate: "20-Feb-2026",
  resolutionNo: "BRN/2026/0458",
  sanctionDate: "20-May-2026",
  installmentStartDate: "22-Feb-2026",
  periodOfLoan: "60 Months",
  accountReviewDate: "17-Aug-2026",
  repaymentFrequency: "Monthly",
  registerAmount: "2,50,0000",
  limitAmount: "2,50,0000",
  drawingPower: "45,466",
  sanctionAmount: "2,50,0000",
  sanctionAmountInWords: "Twenty Five Thousand",
  // Interest & Repayment defaults
  intCalculationMethod: "Reducing",
  interestRate: "0%",
  penalInterestRate: "0%",
  installationTypeId: "201",
  installationType: "Reducing Installment",
  installmentAmount: "53,743",
  morInterestRate: "0%",
  morPeriodMonth: "03",
  overdueInterestRate: "0%",
  // Area & Classification defaults
  areaCode: "AR001",
  areaName: "Pune Urban Area",
  subAreaCode: "AR001",
  subAreaName: "Pune Urban Area",
  socialSectorId: "AR001",
  socialSectorDescription: "Pune Urban Area",
  socialSubSectorId: "AR001",
  socialSubSectorDescription: "Pune Urban Area",
  // Business & Purpose defaults
  consentLoan: "Yes",
  isDirectorReference: "No",
  purposeId: "Whole Sale Traders",
  classificationId: "CLASS717",
  modeOfSanctionId: "CR007",
  directorId: "DIR01",
  industryId: "IND@17",
  socialSectionId: "SOC01",
  sanctionAuthorityId: "CR008",
  directorName: "Nishant Malhar Mohite",
  lbrCode: "MIS",
};

/* ===================== UserDetailsModal ===================== */

export interface AuthorizeLoanAccountModal_AuthorizeLoanAccountProps {
  open: boolean;
  initialData?: Partial<AuthorizeLoanAccountModal_AuthorizeLoanAccountData>;
  onClose?: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
}

function AuthorizeLoanAccountModal({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
}: AuthorizeLoanAccountModal_AuthorizeLoanAccountProps) {
  const [data, setData] = useState<AuthorizeLoanAccountModal_AuthorizeLoanAccountData>({
    ...AuthorizeLoanAccountModal_DEFAULT_DATA,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actionModel, setActionModel] = useState<
    "authorize" | "rejected" | null
  >(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Details");
  const TABS = ["Details", "Loan", "Nominee", "Guarantor", "Salary"] as const;

  useEffect(() => {
    if (open) {
      setData({ ...AuthorizeLoanAccountModal_DEFAULT_DATA, ...initialData });
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
  const grid2 = "grid grid-cols-2 gap-4";

  const isLastStep = activeTab === "Salary";

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

  const LoanForm = () => {
    return (
      <>
        {/* Loan Registration */}
        <SectionCard
          titleEn="Loan Registration"
          titleHi="कर्ज नोंदणी"
          subtitleEn="Add your loan details"
          subtitleHi=" तुमचे कर्जाचे तपशील जोडा"
          icon={IMAGES.USER}
        >
          <div className={grid4}>
            <FieldShell
              label="Submission Date"
              labelHi="अर्ज सादर दिनांक"
              required
            >
              <TextInput
                icon={<Calendar size={16} />}
                value={data.submissionDate || "27-Feb-2026"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Registration Date"
              labelHi="नोंदणी दिनांक"
              required
            >
              <TextInput
                icon={<Calendar size={16} />}
                value={data.registrationDate || "20-Feb-2026"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Resolution No" labelHi="ठराव क्रमांक" required>
              <TextInput
                icon={<FileText size={16} />}
                value={data.resolutionNo || "BRN/2026/0458"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Sanction Date" labelHi="मंजूरी दिनांक" required>
              <TextInput
                icon={<Calendar size={16} />}
                value={data.sanctionDate || "20-May-2026"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell
              label="Installment Start Date"
              labelHi="हप्ता प्रारंभ दिनांक"
              required
            >
              <TextInput
                icon={<Calendar size={16} />}
                value={data.installmentStartDate || "22-Feb-2026"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Period of Loan" labelHi="कर्ज कालावधी" required>
              <TextInput
                icon={<Calendar size={16} />}
                value={data.periodOfLoan || "60 Months"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="A/c Review Date"
              labelHi="खाते पुनरावलोकन दिनांक"
              required
            >
              <TextInput
                icon={<Calendar size={16} />}
                value={data.accountReviewDate || "17-Aug-2026"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <SelectField
              labelEn="Repayment Frequency"
              labelMr="परतफेड वारंवारिता"
              editable={false}
              icon={HeartPulse}
              value={data.repaymentFrequency || "Monthly"}
              onChange={() => {}}
            />
          </div>

          <div className={`${grid3} mt-4`}>
            <FieldShell label="Register Amount" labelHi="नोंदणी रक्कम" required>
              <TextInput
                icon={<DollarSign size={16} />}
                value={data.registerAmount || "2,50,0000"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Limit Amount" labelHi="ठराव क्रमांक" required>
              <TextInput
                icon={<DollarSign size={16} />}
                value={data.limitAmount || "2,50,0000"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Drawing Power"
              labelHi="उपसच्याची मर्यादा"
              required
            >
              <TextInput
                icon={<DollarSign size={16} />}
                value={data.drawingPower || "45,466"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Sanction Amount" labelHi="मंजूर रक्कम" required>
              <TextInput
                icon={<DollarSign size={16} />}
                value={data.sanctionAmount || "2,50,0000"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>
            <FieldShell
              label="Sanction Amount in Words"
              labelHi="रक्कम शब्दात"
              required
              className="col-span-3"
            >
              <TextInput
                icon={<FileText size={16} />}
                value={data.sanctionAmountInWords || "तुमचे फिन शब्दांत"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Interest & Repayment */}
        <SectionCard
          titleEn="Interest & Repayment"
          titleHi="व्याज आणि परतफेड"
          subtitleEn="Add your loan details"
          subtitleHi=" तुमचे कर्जाचे तपशील जोडा"
          icon={IMAGES.USER}
        >
          <div className={grid3}>
            <SelectField
              labelEn="Int.Calculation Method"
              labelMr="आंतर, गणना पद्धती"
              editable={false}
              icon={Calculator}
              value={data.intCalculationMethod || "Reducing"}
              onChange={() => {}}
            />

            <FieldShell label="Interest Rate" labelHi="व्याजदर" required>
              <TextInput
                icon={<Percent size={16} />}
                value={data.interestRate || "0%"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Penal Interest Rate"
              labelHi="दंडात्मक व्याजदर"
              required
            >
              <TextInput
                icon={<Percent size={16} />}
                value={data.penalInterestRate || "0%"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Installation Type ID"
              labelHi="हप्ता प्रकार आयडी"
              required
            >
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    icon={<IdCard size={16} />}
                    value={data.installationTypeId || "201"}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
                <ToolPick onClick={() => {}} />
              </div>
            </FieldShell>

            <FieldShell label="Installation Type" labelHi="हप्ता प्रकार">
              <TextInput
                icon={<Calendar size={16} />}
                value={data.installationType || "Reducing Installment"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Installment Amount"
              labelHi="हप्ता रक्कम"
              required
            >
              <TextInput
                icon={<DollarSign size={16} />}
                value={data.installmentAmount || "53,743"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Mor.Interest Rate"
              labelHi="स्थिती कालावधीतील व्याजदर"
              required
            >
              <TextInput
                icon={<Percent size={16} />}
                value={data.morInterestRate || "0%"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Mor.Period Month"
              labelHi="स्थिती कालावधी (महिने)"
              required
            >
              <TextInput
                icon={<Calendar size={16} />}
                value={data.morPeriodMonth || "03"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Overdue Interest Rate"
              labelHi="थकीत व्याजदर"
              required
            >
              <TextInput
                icon={<Percent size={16} />}
                value={data.overdueInterestRate || "0%"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Area & Classification */}
        <SectionCard
          titleEn="Area & Classification"
          titleHi="क्षेत्र आणि वर्गीकरण"
          subtitleEn="Add your loan details"
          subtitleHi="तुमचे कर्जाचे तपशील जोडा"
          icon={IMAGES.USER}
        >
          <div className={grid2}>
            <FieldShell label="Area Code" labelHi="क्षेत्र कोड" required>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    icon={<CodeIcon size={16} />}
                    value={data.areaCode || "AR001"}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
                <ToolPick onClick={() => {}} />
              </div>
            </FieldShell>

            <FieldShell label="Area Name" labelHi="क्षेत्र नाव" required>
              <TextInput
                icon={<Building2 size={16} />}
                value={data.areaName || "Pune Urban Area"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell label="Sub Area Code" labelHi="उपक्षेत्र कोड" required>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    icon={<CodeIcon size={16} />}
                    value={data.subAreaCode || "AR001"}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
                <ToolPick onClick={() => {}} />
              </div>
            </FieldShell>

            <FieldShell label="Sub Area Name" labelHi="उपक्षेत्र नाव" required>
              <TextInput
                icon={<Building2 size={16} />}
                value={data.subAreaName || "Pune Urban Area"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Social Sector ID"
              labelHi="सामाजिक क्षेत्र आयडी"
              required
            >
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    icon={<CodeIcon size={16} />}
                    value={data.socialSectorId || "AR001"}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
                <ToolPick onClick={() => {}} />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput
                icon={<FileText size={16} />}
                value={data.socialSectorDescription || "Pune Urban Area"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>

            <FieldShell
              label="Social Sub Sector ID"
              labelHi="सामाजिक उपक्षेत्र आयडी"
              required
            >
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    icon={<IdCard size={16} />}
                    value={data.socialSubSectorId || "AR001"}
                    onChange={() => {}}
                    readOnly
                  />
                </div>
                <ToolPick onClick={() => {}} />
              </div>
            </FieldShell>

            <FieldShell label="Description" labelHi="वर्णन" required>
              <TextInput
                icon={<FileText size={16} />}
                value={data.socialSubSectorDescription || "Pune Urban Area"}
                onChange={() => {}}
                readOnly
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Business & Purpose */}
        <SectionCard
          titleEn="Business & Purpose"
          titleHi="व्यवसाय आणि उद्देश"
          subtitleEn="Add your loan details"
          subtitleHi="तुमचे कार्याचे तपशील जोडा"
          icon={IMAGES.USER}
        >
          <div className={grid3}>
            <RadioDayMonth
              label="Consortium Loan"
              value={!!data.consentLoan}
              onChange={() => {}}
              disabled
              options={["Yes", "No"]}
            />

            <SelectField
              labelEn="Mode of Sanction ID"
              labelMr="मंजूरी मोड आयडी"
              editable={false}
              icon={FileText}
              value={data.modeOfSanctionId || "CR007"}
              onChange={() => {}}
            />

            <SelectField
              labelEn="Sanction Authority ID"
              labelMr="मनाही अधिकार आयडी"
              editable={false}
              icon={ShieldAlert}
              value={data.sanctionAuthorityId || "CR008"}
              onChange={() => {}}
            />

            <RadioDayMonth
              label="Is Director Reference?"
              value={!!data.isDirectorReference}
              onChange={() => {}}
              disabled
              options={["Yes", "No"]}
            />

            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <SelectField
                  labelEn="Director ID"
                  labelMr="डायरेक्टर आयडी"
                  editable={false}
                  icon={User}
                  value={data.directorId || "DIR01"}
                  onChange={() => {}}
                />
              </div>
              <ToolPick onClick={() => {}} />
            </div>

            <SelectField
              labelEn="Director Name"
              labelMr="दिवसिकाचे नाव"
              editable={false}
              icon={User}
              value={data.directorName || "Nishant Malhar Mohite"}
              onChange={() => {}}
            />

            <SelectField
              labelEn="Purpose ID"
              labelMr="कार्याचा उद्देश"
              editable={false}
              icon={FileText}
              value={data.purposeId || "Whole Sale Traders"}
              onChange={() => {}}
            />

            <SelectField
              labelEn="Industry ID"
              labelMr="उद्योग आयडी"
              editable={false}
              icon={Building2}
              value={data.industryId || "IND@17"}
              onChange={() => {}}
            />

            <SelectField
              labelEn="LBR Code"
              labelMr="एलबीआर कोड"
              editable={false}
              icon={CodeIcon}
              value={data.lbrCode || "MIS"}
              onChange={() => {}}
            />

            <SelectField
              labelEn="Classification ID"
              labelMr="वर्गीकरण आयडी"
              editable={false}
              icon={IdCard}
              value={data.classificationId || "CLASS717"}
              onChange={() => {}}
            />

            <SelectField
              labelEn="Social Section ID"
              labelMr="सोशल सेक्शन आयडी"
              editable={false}
              icon={Users}
              value={data.socialSectionId || "SOC01"}
              onChange={() => {}}
            />
          </div>
        </SectionCard>
      </>
    );
  };

  const GuarantorForm = () => {
    return (
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid4}>
          <div className="flex gap-4">
            <SrNoField value="1" />

            <SelectField
              labelEn="Salutation Code"
              labelMr="संबोधनी"
              editable={false}
              value={data.guarantorSalutationCode || "MR"}
              onChange={() => {}}
            />
          </div>

          <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<IdCard size={16} />}
                  value={data.guarantorCustomerId || "21897"}
                  onChange={() => {}}
                  readOnly
                  error={!!errors.customerId}
                />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell
            label="Guarantor Name"
            labelHi="खात्रीपत्र देणाऱ्याचं नाव"
            required
          >
            <TextInput
              icon={<User size={16} />}
              value={data.guarantorName || "Karan Mangesh Patil"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Employee ID" labelHi="कर्मचारी आयडी" required>
            <TextInput
              icon={<IdCard size={16} />}
              value={data.employeeId || "0001"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>

        <div className={`${grid4} mt-4`}>
          <FieldShell label="Member No." labelHi="सदस्य क्र." required>
            <TextInput
              icon={<IdCard size={16} />}
              value={data.memberNo || "21897"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <SelectField
            labelEn="Mobile Number"
            labelMr="मोबाईल नंबर"
            editable={false}
            icon={User}
            value={data.mobileNumber || "9876545678"}
            onChange={() => {}}
          />

          <FieldShell label="Birth Date" labelHi="जन्म तारीख">
            <TextInput
              icon={<Calendar size={16} />}
              value={data.birthDate || "12-Jun-2001"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Email ID" labelHi="ईमेल आयडी" required>
            <TextInput
              icon={<User size={16} />}
              value={data.emailId || "Akshay12@gmail.com"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>

        <div className={`${grid4} mt-4`}>
          <FieldShell label="Address 1" labelHi="पत्ता १" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput
                  icon={<HomeIcon size={16} />}
                  value={data.guarantorAddress1 || "Kolhapur"}
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
              value={data.guarantorAddress2 || "Kolhapur"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Address 3" labelHi="पत्ता ३">
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.guarantorAddress3 || "Kolhapur"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Zip" labelHi="पिन कोड" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.guarantorZip || "416005"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>

        <div className={`${grid4} mt-4`}>
          <SelectField
            labelEn="City"
            labelMr="शहर"
            editable={false}
            icon={HomeIcon}
            value={data.guarantorCity || "Kolhapur"}
            onChange={() => {}}
          />

          <FieldShell label="State" labelHi="राज्य" required>
            <TextInput
              icon={<HomeIcon size={16} />}
              value={data.guarantorState || "Maharashtra"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>

          <FieldShell label="Country" labelHi="देश" required>
            <TextInput
              icon={<FlagIcon size={16} />}
              value={data.guarantorCountry || "India"}
              onChange={() => {}}
              readOnly
            />
          </FieldShell>
        </div>
      </div>
    );
  };

  const SalaryForm = () => {
    return (
      <div
        className={`${grid3} bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar`}
      >
        <FieldShell label="Employee Name" labelHi="कर्मचारी नाव" required>
          <TextInput
            icon={<IdCard size={16} />}
            value={data.employeeName || "Akshay Om More"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell label="Department" labelHi="विभाग" required>
          <TextInput
            icon={<Building size={16} />}
            value={data.department || "IT"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell
          label="Security Type Code"
          labelHi="सुरक्षा प्रकार कोड"
          required
        >
          <TextInput
            icon={<ShieldCheck size={16} />}
            value={data.securityTypeCode || "SEC001"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell label="Gross Salary" labelHi="एकूण पगार" required>
          <TextInput
            icon={<DollarSign size={16} />}
            value={data.grossSalary || "50000"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell label="Net Salary" labelHi="किंमत मिळालेली पगार" required>
          <TextInput
            icon={<DollarSign size={16} />}
            value={data.netSalary || "45000"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <RadioDayMonth
          label="Is Income Tax Payee"
          value={data.isIncomeTaxPayee === "Yes"}
          onChange={() => {}}
          disabled
          options={["Yes", "No"]}
        />

        <FieldShell label="PAN Number" labelHi="PAN नंबर" required>
          <TextInput
            icon={<IdCard size={16} />}
            value={data.panNumber || "ABCDE1234F"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell
          label="PF Account Number"
          labelHi="पीएफ खात्याचा क्रमांकरर"
          required
        >
          <TextInput
            icon={<IdCard size={16} />}
            value={data.pfAccountNumber || "PF123456789"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell label="Mobile Number" labelHi=" मोबाईल नंबर" required>
          <TextInput
            icon={<PhoneIcon size={16} />}
            value={data.salaryMobileNumber || "9876543210"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell label="Address 1" labelHi="पत्ता १" required>
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <TextInput
                icon={<HomeIcon size={16} />}
                value={data.salaryAddress1 || "Kolhapur"}
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
            value={data.salaryAddress2 || "Kolhapur"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell label="Address 3" labelHi="पत्ता ३" required>
          <TextInput
            icon={<HomeIcon size={16} />}
            value={data.salaryAddress3 || "Kolhapur"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell label="Zip" labelHi="पिन कोड" required>
          <TextInput
            icon={<HomeIcon size={16} />}
            value={data.salaryZip || "416005"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <SelectField
          labelEn="City"
          labelMr="शहरे"
          editable={false}
          icon={Building2}
          value={data.salaryCity || "Kolhapur"}
          onChange={() => {}}
        />

        <FieldShell label="State" labelHi="राज्य" required>
          <TextInput
            icon={<Building2 size={16} />}
            value={data.salaryState || "Maharashtra"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>

        <FieldShell label="Country" labelHi="देश" required>
          <TextInput
            icon={<FlagIcon size={16} />}
            value={data.salaryCountry || "India"}
            onChange={() => {}}
            readOnly
          />
        </FieldShell>
      </div>
    );
  };

  return (
    <>
      <FormModal
        onClose={() => onClose?.()}
        titleEn={AuthorizeLoanAccountModal_CONFIG.titleEn}
        titleHi={AuthorizeLoanAccountModal_CONFIG.titleHi}
        subtitleEn={AuthorizeLoanAccountModal_CONFIG.descEn}
        subtitleHi={AuthorizeLoanAccountModal_CONFIG.descHi}
        tabs={[...TABS]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabKey)}
        hideFooter
        customFooter={<CustomFooterButton />}
        maxWidth="max-w-7/8"
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image
              src={AuthorizeLoanAccountModal_CONFIG.icon}
              alt={AuthorizeLoanAccountModal_CONFIG.titleEn}
              width={50}
              height={50}
            />
          </div>
        }
      >
        {/* User Details */}
        {activeTab === "Details" ? (
          <DetailsForm />
        ) : activeTab === "Nominee" ? (
          <NomineeForm />
        ) : activeTab === "Guarantor" ? (
          <GuarantorForm />
        ) : activeTab === "Salary" ? (
          <SalaryForm />
        ) : (
          <LoanForm />
        )}

        {showRejectReason && (
          <RejectReasonModal
            onClose={() => setShowRejectReason(false)}
            onConfirm={handleConfirmReject}
          />
        )}

        {actionModel === "authorize" && (
          <SuccessModal
            title="Account Authorization is Rejected"
            subtitle="Your Account authorization is rejected."
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


/* ===== from AuthorizeDepositAccountModal.tsx ===== */
/* ===================== Shared types ===================== */

export interface AuthorizeDepositAccountModal_AuthorizeDepositAccountData {
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

const AuthorizeDepositAccountModal_CONFIG = {
  icon: IMAGES.SHIELD_CHECK,
  titleEn: "Authorize Deposit Account",
  titleHi: "ठेवीचे खाते अधिकृत करा",
  descEn: "Check information related to the Account and Authorize them.",
  descHi: "कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती",
};

const AuthorizeDepositAccountModal_DEFAULT_DATA: AuthorizeDepositAccountModal_AuthorizeDepositAccountData = {
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

export interface AuthorizeDepositAccountModal_AuthorizeDepositAccountProps {
  open: boolean;
  initialData?: Partial<AuthorizeDepositAccountModal_AuthorizeDepositAccountData>;
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
}: AuthorizeDepositAccountModal_AuthorizeDepositAccountProps) {
  const [data, setData] = useState<AuthorizeDepositAccountModal_AuthorizeDepositAccountData>({
    ...AuthorizeDepositAccountModal_DEFAULT_DATA,
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
      setData({ ...AuthorizeDepositAccountModal_DEFAULT_DATA, ...initialData });
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
        titleEn={AuthorizeDepositAccountModal_CONFIG.titleEn}
        titleHi={AuthorizeDepositAccountModal_CONFIG.titleHi}
        subtitleEn={AuthorizeDepositAccountModal_CONFIG.descEn}
        subtitleHi={AuthorizeDepositAccountModal_CONFIG.descHi}
        tabs={[...TABS]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabKey)}
        hideFooter
        maxWidth="max-w-7/8"
        customFooter={<CustomFooterButton />}
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image
              src={AuthorizeDepositAccountModal_CONFIG.icon}
              alt={AuthorizeDepositAccountModal_CONFIG.titleEn}
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


/* ===== from AuthorizeAccountPage.tsx ===== */
const AuthorizeAccountPage_authorizeColumns = [
  {
    key: "srNo",
    labelKey: "accountMaster.table.srNo",
    sortable: false,
    width: "60px",
  },
  {
    key: "action",
    labelKey: "accountMaster.table.action",
    sortable: false,
    width: "70px",
  },
  {
    key: "accountId",
    labelKey: "accountMaster.table.accountId",
    sortable: true,
    width: "150px",
    emphasize: true,
  },
  {
    key: "status",
    labelKey: "accountMaster.table.status",
    sortable: true,
    width: "240px",
  },
  {
    key: "customerId",
    labelKey: "accountMaster.table.customerId",
    sortable: true,
    width: "120px",
  },
  {
    key: "accountName",
    labelKey: "fields.accountName",
    sortable: true,
    width: "180px",
  },
  {
    key: "accountType",
    labelKey: "fields.accountType",
    sortable: true,
    width: "140px",
  },
  {
    key: "createdBy",
    labelKey: "accountMaster.table.createdBy",
    sortable: true,
    width: "120px",
  },
  {
    key: "applicationNo",
    labelKey: "accountMaster.table.applicationNo",
    sortable: false,
    width: "140px",
  },
];

type AuthorizeAccountPage_AuthorizeRow = {
  srNo: number;
  accountId: string;
  status: string;
  customerId: string;
  accountName: string;
  accountType: string;
  createdBy: string;
  applicationNo: string;
  queue: AuthorizationTabKey;
};

// Status types with proper capitalization
type AuthorizeAccountPage_AuthorizationStatus =
  | "Freeze/Unfreeze Account"
  | "Standing Instruction Account"
  | "Memo Account"
  | "Stop Cheque Account"
  | "Lien Account";

// Account type to statuses mapping
const AuthorizeAccountPage_ACCOUNT_TYPE_STATUSES: Record<string, AuthorizeAccountPage_AuthorizationStatus[]> = {
  casa: [
    "Freeze/Unfreeze Account",
    "Standing Instruction Account",
    "Memo Account",
    "Stop Cheque Account",
  ],
  deposite: ["Freeze/Unfreeze Account", "Lien Account", "Memo Account"],
  loan: ["Freeze/Unfreeze Account", "Memo Account"],
  fixed: ["Freeze/Unfreeze Account"],
  investment: ["Freeze/Unfreeze Account"],
};

// Status colors configuration
const AuthorizeAccountPage_STATUS_CONFIG: Record<
  AuthorizeAccountPage_AuthorizationStatus,
  {
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  "Freeze/Unfreeze Account": {
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  "Standing Instruction Account": {
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  "Memo Account": {
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  "Stop Cheque Account": {
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  "Lien Account": {
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
};

// Queue status display labels
const AuthorizeAccountPage_QUEUE_STATUS_LABEL: Record<AuthorizationTabKey, string> = {
  new: "Authorization Pending",
  modify: "Modified",
  rejected: "Authorization Rejected",
};

// Generate rows with statuses based on account type
const AuthorizeAccountPage_generateRows = (accountType: string): AuthorizeAccountPage_AuthorizeRow[] => {
  const statuses =
    AuthorizeAccountPage_ACCOUNT_TYPE_STATUSES[accountType] || AuthorizeAccountPage_ACCOUNT_TYPE_STATUSES.casa;
  const accountTypeNames: Record<string, string> = {
    casa: "CASA",
    deposite: "Deposit",
    loan: "Loan",
    fixed: "Fixed Asset",
    investment: "Investment",
  };

  const typeName = accountTypeNames[accountType] || accountType;

  // Generate more data - 3 entries per status for better distribution
  const allRows: AuthorizeAccountPage_AuthorizeRow[] = [];

  statuses.forEach((status, statusIndex) => {
    // Create 3 entries per status to distribute across tabs
    for (let i = 0; i < 3; i++) {
      const queue: AuthorizationTabKey =
        i === 0 ? "new" : i === 1 ? "modify" : "rejected";

      allRows.push({
        srNo: allRows.length + 1,
        accountId: `720807681${String(allRows.length + 1).padStart(3, "0")}`,
        status: status,
        customerId: `000${String(allRows.length + 1).padStart(3, "0")}`,
        accountName: `${typeName} Account ${allRows.length + 1}`,
        accountType: typeName,
        createdBy: ["Admin", "Manager", "Supervisor"][i % 3],
        applicationNo: String(100000 + allRows.length + 1),
        queue: queue,
      });
    }
  });

  return allRows;
};

interface AuthorizeAccountPage_AuthorizeAccountPageProps {
  accountType: "casa" | "deposite" | "loan" | "fixed" | "investment";
}

// Status Badge Component for table
const AuthorizeAccountPage_StatusBadge = ({
  status,
  queue,
}: {
  status: string;
  queue?: AuthorizationTabKey;
}) => {
  // If it's a queue status (for modify/rejected tabs), show the queue status
  if (queue === "modify") {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700">
        Modified
      </span>
    );
  }
  if (queue === "rejected") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-medium text-red-700">
        Authorization Rejected
      </span>
    );
  }

  const config = AuthorizeAccountPage_STATUS_CONFIG[status as AuthorizeAccountPage_AuthorizationStatus];

  if (!config) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {status}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${config.bgColor} ${config.color} ${config.borderColor}`}
    >
      {status}
    </span>
  );
};

// Placeholder Authorization Modal
const AuthorizeAccountPage_PlaceholderAuthorizeModal = ({
  open,
  onClose,
  status,
  accountType,
}: {
  open: boolean;
  onClose: () => void;
  status: string;
  accountType: string;
}) => {
  if (!open) return null;

  const accountTypeNames: Record<string, string> = {
    casa: "CASA",
    deposite: "Deposit",
    loan: "Loan",
    fixed: "Fixed Asset",
    investment: "Investment",
  };
  const typeName = accountTypeNames[accountType] || accountType;

  const getStatusIcon = () => {
    const icons: Record<string, React.ReactNode> = {
      "Freeze/Unfreeze Account": <Ban className="h-12 w-12 text-red-500" />,
      "Standing Instruction Account": (
        <BookOpen className="h-12 w-12 text-blue-500" />
      ),
      "Memo Account": <FileText className="h-12 w-12 text-amber-500" />,
      "Stop Cheque Account": <CircleX className="h-12 w-12 text-rose-500" />,
      "Lien Account": <Link className="h-12 w-12 text-purple-500" />,
    };
    return (
      icons[status] || <ShieldCheck className="h-12 w-12 text-green-500" />
    );
  };

  const getStatusColor = () => {
    const colors: Record<string, string> = {
      "Freeze/Unfreeze Account": "text-red-600",
      "Standing Instruction Account": "text-blue-600",
      "Memo Account": "text-amber-600",
      "Stop Cheque Account": "text-rose-600",
      "Lien Account": "text-purple-600",
    };
    return colors[status] || "text-green-600";
  };

  const getStatusIconBg = () => {
    const colors: Record<string, string> = {
      "Freeze/Unfreeze Account": "bg-red-100",
      "Standing Instruction Account": "bg-blue-100",
      "Memo Account": "bg-amber-100",
      "Stop Cheque Account": "bg-rose-100",
      "Lien Account": "bg-purple-100",
    };
    return colors[status] || "bg-green-100";
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      header={{
        icon: ICONS.PERSON,
        title: `Authorize ${status}`,
        titleHi: `प्राधिकृत करा ${status}`,
        subtitle: `Please review and authorize the ${status.toLowerCase()} for ${typeName} account.`,
        subtitleHi: `कृपया ${typeName} खात्यासाठी ${status.toLowerCase()} चे पुनरावलोकन करा आणि प्राधिकृत करा.`,
        onClose: onClose,
        showCloseButton: true,
      }}
      footerButtons={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outline" as const,
          icon: <X size={16} />,
        },
        {
          label: "Authorize",
          onClick: () => {
            console.log(`Authorized: ${status}`);
            onClose();
          },
          variant: "primary" as const,
          icon: <ShieldCheck size={16} />,
        },
      ]}
      footerAlign="right"
      showDefaultClose={false}
      maxWidth="lg"
    >
      <SectionWrapper>
        <div className="flex flex-col items-center py-4">
          {/* Icon with background circle */}
          <div
            className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${getStatusIconBg()}`}
          >
            {getStatusIcon()}
          </div>

          {/* Status Label */}
          <h3 className={`text-2xl font-bold ${getStatusColor()}`}>{status}</h3>

          <p className="mt-2 text-center text-gray-600 max-w-md">
            Are you sure you want to authorize this action for the {typeName}{" "}
            account?
          </p>

          {/* Details Card */}
          <div className="mt-6 w-full max-w-lg rounded-xl border border-gray-200 bg-gray-50/50 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500">
                  Account Type
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {typeName}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500">Action</p>
                <p className={`mt-1 text-sm font-semibold ${getStatusColor()}`}>
                  {status}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusIconBg()} ${getStatusColor()}`}
                >
                  {status}
                </span>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-gray-500">
                  Authorization
                </p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                  <Clock className="h-3.5 w-3.5" />
                  Pending
                </span>
              </div>
            </div>
          </div>

          {/* Warning Note */}
          <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-amber-50 p-3.5 max-w-lg border border-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              This action cannot be undone. Please verify all details before
              authorizing.
            </p>
          </div>
        </div>
      </SectionWrapper>
    </ModalWrapper>
  );
};

export const AuthorizeAccountPage = ({ accountType }: AuthorizeAccountPage_AuthorizeAccountPageProps) => {
  const { t, en, tRaw } = useBilingual();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthorizationTabKey>("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const defaultAccountFilters: AccountFilters = {
    accountName: "",
    accountNumber: "",
    accountType: "",
  };
  const [filters, setFilters] = useState<AccountFilters>(defaultAccountFilters);
  const handleResetFilters = () => setFilters(defaultAccountFilters);
  const [selectedRow, setSelectedRow] = useState<AuthorizeAccountPage_AuthorizeRow | null>(null);
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => AuthorizeAccountPage_generateRows(accountType), [accountType]);

  // Filter and sort rows
  const visibleRows = useMemo(() => {
    let filtered = rows.filter((row) => row.queue === activeTab);

    // Apply filters
    if (filters.accountName) {
      filtered = filtered.filter((r) =>
        r.accountName
          .toLowerCase()
          .includes(filters.accountName!.toLowerCase()),
      );
    }
    if (filters.accountNumber) {
      filtered = filtered.filter((r) =>
        r.accountId
          .toLowerCase()
          .includes(filters.accountNumber!.toLowerCase()),
      );
    }
    if (filters.accountType) {
      filtered = filtered.filter((r) =>
        r.accountType
          .toLowerCase()
          .includes(filters.accountType!.toLowerCase()),
      );
    }

    // Apply sorting
    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = (a as Record<string, unknown>)[sortKey];
        const valB = (b as Record<string, unknown>)[sortKey];
        if (valA == null || valB == null) return 0;
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return filtered.map((row, idx) => ({
      ...row,
      srNo: idx + 1,
    }));
  }, [rows, activeTab, filters, sortKey, sortAsc]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleAuthorize = (row: AuthorizeAccountPage_AuthorizeRow) => {
    setSelectedRow(row);
    setIsAuthorizeModalOpen(true);
  };

  const getMenuItems = (row: AuthorizeAccountPage_AuthorizeRow): RowActionMenuItem[] => {
    return [
      {
        key: "authorize",
        label: tRaw("common.authorize"),
        icon: ShieldCheck,
        onClick: () => handleAuthorize(row),
      },
    ];
  };

  const renderAuthorizeModal = () => {
    if (!selectedRow) return null;

    if (accountType === "casa") {
      return (
        <AuthorizeSavingAccountModal
          open={isAuthorizeModalOpen}
          onClose={() => {
            setIsAuthorizeModalOpen(false);
            setSelectedRow(null);
          }}
        />
      );
    }

    if (accountType === "deposite") {
      return (
        <AuthorizeDepositAccountModal
          open={isAuthorizeModalOpen}
          onClose={() => {
            setIsAuthorizeModalOpen(false);
            setSelectedRow(null);
          }}
        />
      );
    }

    if (accountType === "loan") {
      return (
        <AuthorizeLoanAccountModal
          open={isAuthorizeModalOpen}
          onClose={() => {
            setIsAuthorizeModalOpen(false);
            setSelectedRow(null);
          }}
        />
      );
    }

    return (
      <AuthorizeAccountPage_PlaceholderAuthorizeModal
        open={isAuthorizeModalOpen}
        onClose={() => {
          setIsAuthorizeModalOpen(false);
          setSelectedRow(null);
        }}
        status={selectedRow.status}
        accountType={accountType}
      />
    );
  };

  return (
    <div className="min-h-screen app-page-bg">
      <GlobalNav
        titleEn={en("authorization.title")}
        titleHi={t("authorization.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          {
            label: en("authorization.breadcrumb"),
            onClick: () => router.push("/authorization"),
          },
          { label: en("authorizeAccount.breadcrumb"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="flex flex-col gap-3 px-3 py-3">
        <AuthorizationTabs
          active={activeTab}
          onChange={setActiveTab}
          onOpenFilter={() => setIsFilterOpen(true)}
          isSearchVisible={isSearchVisible}
          onToggleSearch={() => setIsSearchVisible((v) => !v)}
          hasActiveFilters={hasActiveFilters(filters)}
          activeFilterSummary={getActiveFilterSummary(filters)}
          onResetFilters={handleResetFilters}
        />

        {/* Custom Table */}
        <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm dark:bg-slate-900">
          <div className="table-container relative overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse min-w-[1200px] table-fixed">
              <thead>
                <tr className="bg-primary rounded-t-xl">
                  {AuthorizeAccountPage_authorizeColumns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`text-left text-[16px] font-semibold text-white px-6 py-3 whitespace-nowrap ${
                        col.sortable ? "cursor-pointer select-none" : ""
                      }`}
                      style={{ width: col.width }}
                    >
                      <SortableHeaderLabel
                        label={tRaw(col.labelKey)}
                        sortable={col.sortable}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={AuthorizeAccountPage_authorizeColumns.length}
                      className="px-6 py-10 text-center text-sm text-gray-400 dark:text-slate-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row, idx) => (
                    <tr
                      key={`${row.accountId}-${row.srNo}`}
                      className={`${
                        idx !== visibleRows.length - 1
                          ? "border-b border-gray-100 dark:border-slate-800"
                          : ""
                      } hover:bg-gray-50 dark:hover:bg-slate-800 relative`}
                    >
                      {AuthorizeAccountPage_authorizeColumns.map((col) => {
                        if (col.key === "srNo") {
                          return (
                            <td
                              key={col.key}
                              className="px-6 py-3"
                              style={{ width: col.width }}
                            >
                              <SrNoBadge value={row.srNo} />
                            </td>
                          );
                        }
                        if (col.key === "action") {
                          return (
                            <td
                              key={col.key}
                              className="px-6 py-3 relative"
                              style={{ width: col.width }}
                            >
                              <RowActionMenu items={getMenuItems(row)} />
                            </td>
                          );
                        }
                        if (col.key === "status") {
                          return (
                            <td
                              key={col.key}
                              className="px-6 py-3"
                              style={{ width: col.width }}
                            >
                              <AuthorizeAccountPage_StatusBadge
                                status={row.status}
                                queue={row.queue}
                              />
                            </td>
                          );
                        }
                        const value = (row as Record<string, unknown>)[col.key];
                        return (
                          <td
                            key={col.key}
                            className={`px-6 py-3 truncate ${
                              col.emphasize
                                ? "text-sm font-medium text-gray-900 dark:text-slate-100"
                                : "text-[16px] text-gray-700 dark:text-slate-400"
                            }`}
                            style={{ width: col.width }}
                          >
                            {value != null ? String(value) : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsFilterOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FilterModal
              initialValues={filters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(vals) => setFilters(vals)}
            />
          </div>
        </div>
      )}

      {renderAuthorizeModal()}
    </div>
  );
};


/* ===== from authorizationaccountmain.tsx ===== */
type AuthorizeMasterItem = {
  key: string;
  icon: LucideIcon;
  cardKey: string;
  href?: string;
  isModal?: boolean; // Flag to identify items that should open as modals
};

const ITEMS: AuthorizeMasterItem[] = [
  {
    key: "casaAuthorization",
    icon: Users,
    cardKey: "casaAuthorization",
    href: "/authorization/authorizeaccountmain/casa",
  },
  {
    key: "casaAuthorizationClosing",
    icon: UserX,
    cardKey: "casaAuthorizationClosing",
    href: "/authorization/authorizeaccountmain/casa-closing",
  },
  {
    key: "depositAuthorization",
    icon: ShieldCheck,
    cardKey: "depositAuthorization",
    href: "/authorization/authorizeaccountmain/deposite",
  },
  {
    key: "depositAuthorizationClosing",
    icon: Share2,
    cardKey: "depositAuthorizationClosing",
    href: "/authorization/authorizeaccountmain/td-close",
  },
  {
    key: "loanAuthorization",
    icon: Power,
    cardKey: "loanAuthorization",
    href: "/authorization/authorizeaccountmain/loan",
  },
  {
    key: "loanClosing",
    icon: BarChart3,
    cardKey: "loanClosing",
    href: "/authorization/authorizeaccountmain/tl-close"
  },
  {
    key: "fixedAssetAuthorization",
    icon: Building2,
    cardKey: "fixedAssetAuthorization",
    href: "/authorization/authorizeaccountmain/fixed",
    isModal: true, // Mark this as a modal item
    // href is not needed for modal items
  },
  {
    key: "fixedAssetClosing",
    icon: ShieldAlert,
    cardKey: "fixedAssetClosing",
    href: "/authorization/authorizeaccountmain/fixed-close",
  },
  {
    key: "investmentAuthorization",
    icon: CreditCard,
    cardKey: "investmentAuthorization",
    href: "/authorization/authorizeaccountmain/investment",
  },
  {
    key: "investmentClosing",
    icon: CircleDollarSign,
    cardKey: "investmentClosing",
    href: "/authorization/authorizeaccountmain/investment-account-close",
  },
  {
    key: "pigmyAuthorization",
    icon: PiggyBank,
    cardKey: "pigmyAuthorization",
    href: "/authorization/pigmy/open",
  },
  {
    key: "pigmyClosing",
    icon: ShieldOff,
    cardKey: "pigmyClosing",
    href: "/authorization/pigmy/close",
  },
];

type AuthorizeMasterCardProps = {
  item: AuthorizeMasterItem;
  titleEn: string;
  titleSecondary: string;
  onOpen: () => void;
};

const AuthorizeMasterCard = ({
  item,
  titleEn,
  titleSecondary,
  onOpen,
}: AuthorizeMasterCardProps) => {
  const Icon = item.icon;

  return (
    <div className="group flex items-center justify-between rounded-md border border-[#E5E7EB] bg-white px-5 py-3 transition-all duration-200 hover:border-[#D7E3FF] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#052F5B]">
          <Icon size={22} strokeWidth={2} className="text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold leading-5 text-[#111827] dark:text-slate-100">
            {titleEn}
          </h3>
          {titleSecondary && (
            <p className="mt-1 truncate text-[13px] leading-4 text-[#9CA3AF] dark:text-slate-400">
              {titleSecondary}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="ml-4 flex shrink-0 items-center gap-1 rounded-full border border-[#2563EB] bg-[#EEF4FF] px-5 py-2 text-[15px] font-medium text-[#2563EB] transition-all duration-200 hover:bg-[#E2ECFF] active:scale-95 dark:bg-primary-950/40 dark:hover:bg-primary-900/40"
      >
        <span>Open</span>
        <ArrowUpRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};

const AuthorizeAccountMainPage = () => {
  const { t, en, tRaw } = useBilingual();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFixedAssetModalOpen, setIsFixedAssetModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((item) => {
      const titleEn = en(`accountAuthorizeMaster.cards.${item.cardKey}`);
      const titleSecondary = tRaw(
        `accountAuthorizeMaster.cards.${item.cardKey}`,
      );
      return (
        titleEn.toLowerCase().includes(q) ||
        titleSecondary.toLowerCase().includes(q)
      );
    });
  }, [query, en, tRaw]);

  const handleCardOpen = (item: AuthorizeMasterItem) => {
    if (item.isModal) {
      // Open modal for items marked as modal
      if (item.key === "fixedAssetAuthorization") {
        setIsFixedAssetModalOpen(true);
      }
    } else if (item.href) {
      // Navigate to route for items with href
      router.push(item.href);
    }
  };

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn={en("accountAuthorizeMaster.navTitle")}
        titleHi={t("accountAuthorizeMaster.navTitle")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("common.misActivity"), href: "/" },
          { label: en("accountAuthorizeMaster.navTitle"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="min-w-7xl mx-auto p-4">
        <div className="rounded-xl bg-white p-5 dark:bg-slate-900">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-primary-950 to-primary-900 px-6 py-10 text-center">
            <h1 className="text-[38px] font-bold text-white">
              {en("accountAuthorizeMaster.title")}
            </h1>

            <div className="mx-auto mt-6 flex max-w-xl items-center rounded-full bg-white px-4 py-2 shadow-lg">
              <Search size={18} className="mr-2 shrink-0 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={en("accountAuthorizeMaster.searchPlaceholder")}
                className="min-w-0 flex-1 text-sm text-gray-700 outline-none placeholder-gray-400"
              />
              <button
                type="button"
                className="ml-2 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                {en("accountAuthorizeMaster.show")}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredItems.length === 0 ? (
              <p className="col-span-2 py-8 text-center text-gray-400 dark:text-slate-500">
                {en("common.noResultsFound")}
              </p>
            ) : (
              filteredItems.map((item) => (
                <AuthorizeMasterCard
                  key={item.key}
                  item={item}
                  titleEn={en(`accountAuthorizeMaster.cards.${item.cardKey}`)}
                  titleSecondary={tRaw(
                    `accountAuthorizeMaster.cards.${item.cardKey}`,
                  )}
                  onOpen={() => handleCardOpen(item)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fixed Asset Authorization Modal */}
      {isFixedAssetModalOpen && (
        <FixedAssetPage
          onClose={() => setIsFixedAssetModalOpen(false)}
          onValidate={() => {
            // Handle validate action
            console.log("Validate clicked");
          }}
          onSave={() => {
            // Handle save action
            console.log("Save clicked");
          }}
        />
      )}
    </div>
  );
};

export default AuthorizeAccountMainPage;
