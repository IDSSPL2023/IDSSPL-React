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
  ShieldAlert,
  CodeIcon,
  UserCheck,
  DollarSign,
  PhoneIcon,
  Building,
  ShieldCheck,
  HeartPulse,
  ThumbsUp,
  ThumbsDown,
  Percent,
  Calculator,
  Users,
} from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "../../../shared/FormModal";
import {
  FieldShell,
  RadioDayMonth,
  SectionCard,
  SelectField,
  TextInput,
} from "../../../shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";

/* ===================== Shared types ===================== */

export interface AuthorizeLoanAccountData {
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

const CONFIG = {
  icon: "/shield-check.png",
  titleEn: "Authorize Loan Account",
  titleHi: "कर्ज खात्याला मंजुरी द्या",
  descEn: "Check information related to the Account and Authorize them.",
  descHi: "कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती",
};

const DEFAULT_DATA: AuthorizeLoanAccountData = {
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

export interface AuthorizeLoanAccountProps {
  open: boolean;
  initialData?: Partial<AuthorizeLoanAccountData>;
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
}: AuthorizeLoanAccountProps) {
  const [data, setData] = useState<AuthorizeLoanAccountData>({
    ...DEFAULT_DATA,
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
          icon="/User.png"
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
          icon="/User.png"
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
          icon="/User.png"
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
          icon="/User.png"
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
        titleEn={CONFIG.titleEn}
        titleHi={CONFIG.titleHi}
        subtitleEn={CONFIG.descEn}
        subtitleHi={CONFIG.descHi}
        tabs={[...TABS]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabKey)}
        hideFooter
        customFooter={<CustomFooterButton />}
        maxWidth="max-w-7/8"
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

export default AuthorizeLoanAccountModal;
