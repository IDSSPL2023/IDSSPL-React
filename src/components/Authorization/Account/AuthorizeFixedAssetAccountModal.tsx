import { MouseEventHandler, useEffect, useState } from "react";
import {
  IdCard,
  User,
  FileText,
  CalendarDays,
  Package,
  Users,
  IndianRupee,
  Receipt,
  X,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "../../shared/FormModal";
import { FieldShell, RadioDayMonth, SelectField, TextInput } from "../../shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";

/* ===================== Shared types (mirrors FixedAssetPage's Add form) ===================== */

export interface AuthorizeFixedAssetAccountData {
  applicationNumber: string;
  customerId: string;
  customerName: string;
  dateOfApplication: string;
  itemName: string;
  minBalanceId: string;
  purchaseDate: string;
  purchaseAmount: string;
  deprecationRate: string;
  description: string;
  billNumber: string;
  deprecationMethod: "Day" | "Month";
  deprecationCalculateOn: "Opening Balance" | "Current Balance";
}

/* ===================== Config ===================== */

const CONFIG = {
  icon: "/shield-check.png",
  titleEn: "Authorize Fixed Asset Account",
  titleHi: "स्थिर मालमत्ता खात्याला मंजुरी द्या",
  descEn: "Check information related to the Fixed Asset Account and Authorize them.",
  descHi: "स्थिर मालमत्ता खात्याशी संबंधित माहिती तपासा आणि अधिकृत करा",
};

const DEFAULT_DATA: AuthorizeFixedAssetAccountData = {
  applicationNumber: "New",
  customerId: "00022",
  customerName: "Karan Mangesh Patil",
  dateOfApplication: "27-Feb-2026",
  itemName: "Self",
  minBalanceId: "200",
  purchaseDate: "27-Feb-2026",
  purchaseAmount: "2,50,0000",
  deprecationRate: "0",
  description: "Office Equipment",
  billNumber: "0",
  deprecationMethod: "Day",
  deprecationCalculateOn: "Opening Balance",
};

/* ===================== Modal ===================== */

export interface AuthorizeFixedAssetAccountProps {
  open: boolean;
  initialData?: Partial<AuthorizeFixedAssetAccountData>;
  onClose?: () => void;
  onAuthorize?: () => void;
  onReject?: (reason: string) => void;
  /** "modal" (default) renders as a centered overlay dialog. "page" renders inline, for routes that host the form directly. */
  variant?: "modal" | "page";
}

function AuthorizeFixedAssetAccountModal({
  open,
  initialData,
  onClose,
  onAuthorize,
  onReject,
  variant = "modal",
}: AuthorizeFixedAssetAccountProps) {
  const [data, setData] = useState<AuthorizeFixedAssetAccountData>({
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
      <div className="bg-white rounded-[20px] border border-t-4 border-primary p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] no-scrollbar">
        <div className={grid4}>
          <FieldShell label="Application Number" labelHi="अर्ज क्रमांक" required>
            <TextInput icon={<FileText size={16} />} value={data.applicationNumber} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Customer ID" labelHi="ग्राहक आयडी" required>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <TextInput icon={<IdCard size={16} />} value={data.customerId} onChange={() => {}} readOnly />
              </div>
              <ToolPick onClick={() => {}} />
            </div>
          </FieldShell>

          <FieldShell label="Customer Name" labelHi="ग्राहकाचे नाव" required>
            <TextInput icon={<User size={16} />} value={data.customerName} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Date of Application" labelHi="अर्जाची तारीख" required>
            <TextInput icon={<CalendarDays size={16} />} value={data.dateOfApplication} onChange={() => {}} readOnly />
          </FieldShell>
        </div>

        <div className={`${grid4} mt-4`}>
          <FieldShell label="Item Name" labelHi="वस्तूचे नाव" required>
            <TextInput icon={<Package size={16} />} value={data.itemName} onChange={() => {}} readOnly />
          </FieldShell>

          <SelectField
            labelEn="Min Balance ID"
            labelMr="किमान शिल्लक आयडी"
            editable={false}
            icon={Users}
            value={data.minBalanceId}
            onChange={() => {}}
          />

          <FieldShell label="Purchase Date" labelHi="खरेदीची तारीख" required>
            <TextInput icon={<CalendarDays size={16} />} value={data.purchaseDate} onChange={() => {}} readOnly />
          </FieldShell>

          <FieldShell label="Purchase Amount" labelHi="खरेदीची रक्कम">
            <TextInput icon={<IndianRupee size={16} />} value={data.purchaseAmount} onChange={() => {}} readOnly />
          </FieldShell>
        </div>

        <div className={`${grid4} mt-4`}>
          <FieldShell label="Deprecation Rate" labelHi="जुना होण्याचा दर" required>
            <TextInput value={data.deprecationRate} onChange={() => {}} readOnly />
          </FieldShell>

          <SelectField
            labelEn="Description"
            labelMr="वर्णन"
            editable={false}
            icon={FileText}
            value={data.description}
            onChange={() => {}}
          />

          <FieldShell label="Bill Number" labelHi="बिल नंबर" required>
            <TextInput icon={<Receipt size={16} />} value={data.billNumber} onChange={() => {}} readOnly />
          </FieldShell>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RadioDayMonth
            label="Method of Deprecation Calculation"
            value={data.deprecationMethod === "Day"}
            onChange={() => {}}
            disabled
          />

          <RadioDayMonth
            label="Deprecation Calculate On"
            value={data.deprecationCalculateOn === "Opening Balance"}
            onChange={() => {}}
            disabled
            options={["Opening Balance", "Current Balance"]}
          />
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
        tabs={["Details"]}
        activeTab="Details"
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-7/8"
        variant={variant}
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
            subtitle="Your Fixed Asset Account is Authorized Successfully."
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
            subtitle="Your Fixed Asset account authorization is rejected."
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

export default AuthorizeFixedAssetAccountModal;