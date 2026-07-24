import { IMAGES } from "@/assets";
import { useState, useMemo } from "react";
import { User, Calendar, X, Check, ChevronsDown } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SectionCard } from "@/components/shared/FormFields";
import SuccessModal from "@/components/shared/SuccessModal";
import { useRouter } from "@/lib/navigation";
import { AppNavbar, WelcomeScreen } from "@/components/common";
import type { WelcomeScreenItem } from "@/components/common";

/* ===== from BackendProfitModal.tsx ===== */
export interface BackendProfitModal_BackendProfitModalProps {
  open: boolean;
  onClose: () => void;
}

function BackendProfitModal({ open, onClose }: BackendProfitModal_BackendProfitModalProps) {
  const [branchName] = useState("Main Branch, Bilagi");
  const [userId] = useState("Admin");
  const [date, setDate] = useState("13-Jul-2026");

  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleSave = () => {
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Backdated Profile And Loss Transfer To BS"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Backdated Profile And Loss Transfer" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Transfer To IO
              <ChevronsDown className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="p-1">
            <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-5">
              <FieldShell label="Branch Name" labelHi="स्क्रोल क्रमांक" required>
                <TextInput
                  icon={<User size={16} />}
                  value={branchName}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>

              <FieldShell label="User ID" labelHi="व्यवहाराचा प्रकार" required>
                <TextInput
                  icon={<User size={16} />}
                  value={userId}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>

              <FieldShell label="Date" labelHi="व्यवहाराची पद्धत" required>
                <TextInput
                  icon={<Calendar size={16} />}
                  value={date}
                  onChange={setDate}
                />
              </FieldShell>
            </div>
          </div>
        </div>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Backdated Profit Loss Transferred Successfully"
          subtitle="Backdated Profit Loss has been transferred to IO."
        />
      )}
    </>
  );
}


/* ===== from GlobalDayBeginModal.tsx ===== */
export interface GlobalDayBeginModal_GlobalDayBeginModalProps {
  open: boolean;
  onClose: () => void;
}

function GlobalDayBeginModal({ open, onClose }: GlobalDayBeginModal_GlobalDayBeginModalProps) {
  const [workingDay, setWorkingDay] = useState("13-Jul-2026");
  const [userId] = useState("Admin");
  const [previousDay] = useState("0100");
  const [systemDate] = useState("Bilagi Pattan Sahakari Bank");
  const [newWorkingDay, setNewWorkingDay] = useState("0100");

  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleDayBegin = () => {
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Global Day Begin"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Global Day Begin" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>

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
        <div className="p-1">
            <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FieldShell label="Working Day" labelHi="व्यवहाराची पद्धत" required>
                <TextInput
                  icon={<Calendar size={16} />}
                  value={workingDay}
                  onChange={setWorkingDay}
                />
              </FieldShell>

              <FieldShell label="User ID" labelHi="व्यवहाराचा प्रकार" required>
                <TextInput
                  icon={<User size={16} />}
                  value={userId}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>

              <FieldShell label="Previous Day" labelHi="स्क्रोल क्रमांक" required>
                <TextInput
                  icon={<User size={16} />}
                  value={previousDay}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>

              <FieldShell label="System Date" labelHi="स्क्रोल क्रमांक" required>
                <TextInput
                  icon={<User size={16} />}
                  value={systemDate}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>

              <FieldShell label="New Working Day" labelHi="स्क्रोल क्रमांक" required>
                <TextInput
                  icon={<User size={16} />}
                  value={newWorkingDay}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>
            </div>
          </div>
        </div>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Global Day Begun Successfully"
          subtitle="New working day has been initialized."
        />
      )}
    </>
  );
}


/* ===== from GlobalDayEndModal.tsx ===== */
export interface GlobalDayEndModal_GlobalDayEndModalProps {
  open: boolean;
  onClose: () => void;
}

function GlobalDayEndModal({ open, onClose }: GlobalDayEndModal_GlobalDayEndModalProps) {
  const [workingDay, setWorkingDay] = useState("13-Jul-2026");
  const [userId] = useState("Admin");

  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleDayClose = () => {
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  const tableData = [
    { code: "0002", name: "Bilagi", status: "Still Transacting" },
    { code: "0002", name: "Bilagi", status: "Still Transacting" },
  ];

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Global Day End"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Global Day End" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleDayClose}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Day Close
              <ChevronsDown className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="p-1">
            <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FieldShell label="Working Day" labelHi="व्यवहाराची पद्धत" required>
                <TextInput
                  icon={<Calendar size={16} />}
                  value={workingDay}
                  onChange={setWorkingDay}
                />
              </FieldShell>

              <FieldShell label="User ID" labelHi="व्यवहाराचा प्रकार" required>
                <TextInput
                  icon={<User size={16} />}
                  value={userId}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>
            </div>

            {/* Branch Status Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1B2143] text-white">
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Branch Code</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Branch Name</th>
                    <th className="px-6 py-3.5 text-left font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-200 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800"
                    >
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.code}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.name}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Global Day Ended Successfully"
          subtitle="Working day has been closed."
        />
      )}
    </>
  );
}


/* ===== from ProfitLossTransferModal.tsx ===== */
export interface ProfitLossTransferModal_ProfitLossTransferModalProps {
  open: boolean;
  onClose: () => void;
}

function ProfitLossTransferModal({ open, onClose }: ProfitLossTransferModal_ProfitLossTransferModalProps) {
  const [branchName] = useState("Main Branch, Bilagi");
  const [userId] = useState("Admin");
  const [date, setDate] = useState("13-Jul-2026");

  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => {
    setIsValidated(true);
  };

  const handleTransfer = () => {
    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Profile And Loss Transfer To BS"
        titleHi="खाते तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src={IMAGES.USER} alt="Profile And Loss Transfer" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleTransfer}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Transfer To IO
              <ChevronsDown className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="p-1">
            <div className="bg-white rounded-[20px] border-x border-b border-t-4 border-[#0A66D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-5">
              <FieldShell label="Branch Name" labelHi="स्क्रोल क्रमांक" required>
                <TextInput
                  icon={<User size={16} />}
                  value={branchName}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>

              <FieldShell label="User ID" labelHi="व्यवहाराचा प्रकार" required>
                <TextInput
                  icon={<User size={16} />}
                  value={userId}
                  onChange={() => {}}
                  readOnly
                />
              </FieldShell>

              <FieldShell label="Date" labelHi="व्यवहाराची पद्धत" required>
                <TextInput
                  icon={<Calendar size={16} />}
                  value={date}
                  onChange={setDate}
                />
              </FieldShell>
            </div>
          </div>
        </div>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Profit Loss Transferred Successfully"
          subtitle="Profit Loss has been transferred to IO."
        />
      )}
    </>
  );
}


/* ===== from DayBeginEndPage.tsx ===== */
type DayBeginEndItem = {
  id: string;
  title: string;
  marathiTitle: string;
  icon: string;
};

const DAY_BEGIN_END_ITEMS: DayBeginEndItem[] = [
  {
    id: "backend-profit",
    title: "Backend Profit",
    marathiTitle: "खाते तपशील",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "global-day-start",
    title: "Global Day Start",
    marathiTitle: "खाते तपशील",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "global-day-end",
    title: "Global Day End",
    marathiTitle: "खाते तपशील",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
  {
    id: "profit-loss-transfer",
    title: "Profit Loss Transfer To BS",
    marathiTitle: "खाते तपशील",
    icon: IMAGES.AUTHORIZE_TRANSACTION_LIST_ICON,
  },
];

export default function DayBeginEndPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DAY_BEGIN_END_ITEMS;
    return DAY_BEGIN_END_ITEMS.filter(
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

  const welcomeItems: WelcomeScreenItem[] = filteredItems.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.marathiTitle,
    icon: <Image src={item.icon} alt="" width={56} height={56} className="h-full w-full object-contain" />,
    onOpen: () => handleOpen(item.id),
  }));

  return (
    <div className="min-h-screen app-page-bg no-scrollbar dark:bg-slate-950">
      <AppNavbar
        titleEn="Day Begin / End"
        titleHi="दिवस सुरू / संपवणे"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "#" },
          { label: "Day Begin / End", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <WelcomeScreen
        title="Day Begin / End"
        searchPlaceholder="Search day begin/end processes, modules..."
        query={query}
        onQueryChange={setQuery}
        items={welcomeItems}
        emptyMessage="No modules found."
      />

      {/* Modals rendering based on active state */}
      <BackendProfitModal
        open={activeModal === "backend-profit"}
        onClose={handleCloseModal}
      />

      <GlobalDayBeginModal
        open={activeModal === "global-day-start"}
        onClose={handleCloseModal}
      />

      <GlobalDayEndModal
        open={activeModal === "global-day-end"}
        onClose={handleCloseModal}
      />

      <ProfitLossTransferModal
        open={activeModal === "profit-loss-transfer"}
        onClose={handleCloseModal}
      />
    </div>
  );
}
