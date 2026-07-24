import { IMAGES } from "@/assets";
import { useState, useMemo } from "react";
import { Calendar, User, X, Check, Play, ChevronsDown, Search, ChevronRight } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";
import TextInput from "@/components/shared/Inputs/TextInput";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";

/* ===== from BranchConsistencyCheckModal.tsx ===== */
export interface BranchConsistencyCheckModal_BranchConsistencyCheckModalProps {
  open: boolean;
  onClose: () => void;
}

function BranchConsistencyCheckModal({ open, onClose }: BranchConsistencyCheckModal_BranchConsistencyCheckModalProps) {
  const [workingDay, setWorkingDay] = useState("13-Jul-2026");
  const [userId, setUserId] = useState("Admin");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleConsistencyCheck = () => setShowSuccess(true);
  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Branch Consistency Check"
        titleHi="शाखा सुसंगतता तपासणी"
        subtitleEn="Verify branch consistency and data integrity."
        subtitleHi="शाखा सुसंगतता आणि डेटा अखंडता तपासा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Branch Consistency Check" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            {/* Validate Button - First */}
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>
            
            {/* Cancel Button - Second */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-[#1565D8] bg-white px-5 py-2.5 text-sm font-semibold text-[#1565D8] transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>
            
            {/* Consistency Check Button - Third */}
            <button
              type="button"
              onClick={handleConsistencyCheck}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Check Consistency
              <Play className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <SectionWrapper>
          
          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-5">
            {/* Working Day */}
            <TextInput
              labelEn="Working Day"
              labelHi="व्यवहाराची पद्धत"
              icon={Calendar}
              placeholder="Select Working Day"
              value={workingDay}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
            
            {/* User ID */}
            <TextInput
              labelEn="User ID"
              labelHi="व्यवहाराचा प्रकार"
              icon={User}
              placeholder="Enter User ID"
              value={userId}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
          </div>
        </SectionWrapper>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Branch Consistency Check Completed"
          subtitle="The branch consistency check has been completed successfully."
        />
      )}
    </>
  );
}


/* ===== from BranchDayBeginModal.tsx ===== */
export interface BranchDayBeginModal_BranchDayBeginModalProps {
  open: boolean;
  onClose: () => void;
}

function BranchDayBeginModal({ open, onClose }: BranchDayBeginModal_BranchDayBeginModalProps) {
  const [workingDay, setWorkingDay] = useState("13-Jul-2026");
  const [previousDay, setPreviousDay] = useState("0100");
  const [userId, setUserId] = useState("Admin");
  const [systemDate, setSystemDate] = useState("Bilagi Pattan Sahakari Bank");
  const [newWorkingDay, setNewWorkingDay] = useState("0100");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleDayBegin = () => setShowSuccess(true);
  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Branch Day Begin"
        titleHi="शाखा दिन प्रारंभ"
        subtitleEn="Start the branch working day for the selected branch."
        subtitleHi="निवडलेल्या शाखेसाठी शाखा कार्य दिवस प्रारंभ करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Branch Day Begin" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            {/* Validate Button - First */}
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>
            
            {/* Cancel Button - Second */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-[#1565D8] bg-white px-5 py-2.5 text-sm font-semibold text-[#1565D8] transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>
            
            {/* Day Begin Button - Third (as shown in image) */}
            <button
              type="button"
              onClick={handleDayBegin}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Day Begin
              <ChevronsDown className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Working Day */}
            <TextInput
              labelEn="Working Day"
              labelHi="व्यवहाराची पद्धत"
              icon={Calendar}
              placeholder="Select Working Day"
              value={workingDay}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
            
            {/* User ID */}
            <TextInput
              labelEn="User ID"
              labelHi="व्यवहाराचा प्रकार"
              icon={User}
              placeholder="Enter User ID"
              value={userId}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />

            {/* Previous Day */}
            <TextInput
              labelEn="Previous Day"
              labelHi="स्कोल क्रमांक"
              icon={User}
              placeholder="Enter Previous Day"
              value={previousDay}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
            
            {/* System Date */}
            <TextInput
              labelEn="System Date"
              labelHi="स्कोल क्रमांक"
              icon={User}
              placeholder="Enter System Date"
              value={systemDate}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
            
            {/* New Working Day - Full Width */}
            {/* <div className="md:col-span-2"> */}
              <TextInput
                labelEn="New Working Day"
                labelHi="स्कोल क्रमांक"
                icon={User}
                placeholder="Enter New Working Day"
                value={newWorkingDay}
                onChange={() => {}}
                required={true}
                readOnly={true}
              />
            {/* </div> */}
          </div>
        </div>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Branch Day Begin Completed"
          subtitle="The branch working day has been started successfully."
        />
      )}
    </>
  );
}


/* ===== from BranchDayEndModal.tsx ===== */
export interface BranchDayEndModal_BranchDayEndModalProps {
  open: boolean;
  onClose: () => void;
}

function BranchDayEndModal({ open, onClose }: BranchDayEndModal_BranchDayEndModalProps) {
  const [workingDay, setWorkingDay] = useState("13-Jul-2026");
  const [userId, setUserId] = useState("Admin");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleDayEnd = () => setShowSuccess(true);
  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Branch Day End"
        titleHi="शाखा दिन समाप्त"
        subtitleEn="End the branch working day for the selected branch."
        subtitleHi="निवडलेल्या शाखेसाठी शाखा कार्य दिवस समाप्त करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Branch Day End" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            {/* Validate Button - First */}
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>
            
            {/* Cancel Button - Second */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-[#1565D8] bg-white px-5 py-2.5 text-sm font-semibold text-[#1565D8] transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>
            
            {/* Day End Button - Third */}
            <button
              type="button"
              onClick={handleDayEnd}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Day End
              <Play className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <SectionWrapper>
          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-1">
            {/* Working Day */}
            <TextInput
              labelEn="Working Day"
              labelHi="व्यवहाराची पद्धत"
              icon={Calendar}
              placeholder="Select Working Day"
              value={workingDay}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
            
            {/* User ID */}
            <TextInput
              labelEn="User ID"
              labelHi="व्यवहाराचा प्रकार"
              icon={User}
              placeholder="Enter User ID"
              value={userId}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
          </div>
        </SectionWrapper>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Branch Day End Completed"
          subtitle="The branch working day has been ended successfully."
        />
      )}
    </>
  );
}


/* ===== from BranchActivity.tsx ===== */
type BranchActivityItem = {
  id: string;
  title: string;
  marathiTitle: string;
  icon: string;
};

const BRANCH_ACTIVITY_ITEMS: BranchActivityItem[] = [
  {
    id: "branch-day-begin",
    title: "Branch Day Begin",
    marathiTitle: "शाखा दिन प्रारंभ",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "branch-day-end",
    title: "Branch Day End",
    marathiTitle: "शाखा दिन समाप्त",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "branch-consistency-check",
    title: "Branch Consistency Check",
    marathiTitle: "शाखा सुसंगतता तपास",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
];

export default function BranchActivityPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BRANCH_ACTIVITY_ITEMS;
    return BRANCH_ACTIVITY_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.marathiTitle.toLowerCase().includes(q)
    );
  }, [query]);

  const handleOpen = (id: string) => {
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="Branch Activity"
        titleHi="शाखा गतिविधी"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Branch Activity", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        {/* BranchActivityHero */}
        <div className="relative isolate overflow-hidden rounded-2xl">
          <Image
            src={IMAGES.BACKGROUND_DARK}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />

          <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center sm:py-16">
            <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-[34px]">
              Branch Activity
            </h1>

            <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg dark:bg-slate-900">
              <Search size={18} className="mr-2 shrink-0 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search branch activities, modules..."
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100"
              />
              <button
                type="button"
                className="ml-2 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Show
              </button>
            </div>
          </div>
        </div>

        {/* BranchActivityCards Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleOpen(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleOpen(item.id);
              }}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <Image
                  src={item.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-0.5 truncate text-sm text-[#64748B] dark:text-slate-400">
                  {item.marathiTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(item.id);
                }}
                className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
              >
                Open <ChevronRight size={16} />
              </button>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">
              No modules found.
            </p>
          )}
        </div>
      </div>

      {/* Modals rendering based on active state */}
      <BranchDayBeginModal
        open={activeModal === "branch-day-begin"}
        onClose={handleCloseModal}
      />

      <BranchDayEndModal
        open={activeModal === "branch-day-end"}
        onClose={handleCloseModal}
      />

      <BranchConsistencyCheckModal
        open={activeModal === "branch-consistency-check"}
        onClose={handleCloseModal}
      />
    </div>
  );
}
