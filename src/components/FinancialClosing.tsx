// src/components/FinancialClosing.tsx
import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "./GlobalMaster/GlobalNav";
import Image from "@/components/ui/Image";
import DepreciationCalculationProcess from "./futuremodels/DepreciationCalculationProcess";
import InterestPostingProcess from "./futuremodels/InterestPostingProcess";
// import SiInterestPostingProcess from "./futuremodels/SiInterestPostingProcess";
import ReportsParameterModal from "./futuremodels/Income&ExpClosing";
import ReportsParameterBranchModal from "./futuremodels/Income&ExpRegular";
import NpaModificationProcess from "./futuremodels/NpaModificationProcess";
import TdPostingConsistencyProcess from "./futuremodels/TdPostingConsistencyProcess";
import TlccInterestPostingProcess from "./futuremodels/TlccInterestPostingProcess";
import SiInterestPostingProcess from "./FinancialClosing/SiInterestPostingProcess";
import SetBranchParameterModal from "./FinancialClosing/SetBranchParameterModal";

type ClosingCategory = "parameter" | "calculation" | "reports" | "export";

type FinancialItem = {
    id: string;
    title: string;
    marathiTitle: string;
    icon: string;
    category: ClosingCategory;
    /** Overrides the default "Open" button label, e.g. a pending-record count. */
    actionLabel?: string;
};

const TABS: { id: ClosingCategory; label: string }[] = [
    { id: "parameter", label: "Set Closing Parameter" },
    { id: "calculation", label: "Closing Calculation" },
    { id: "reports", label: "Closing Reports" },
    { id: "export", label: "Export File" },
];

// Reports items that should open the SIMPLE modal (As on Date only, no Branch Code/Generate).
// All other "reports" items default to ReportsParameterBranchModal (Branch Code + As on Date + Generate).
const SIMPLE_REPORT_IDS = new Set<string>(["schedule-income-exp-regular"]);

const ITEMS: FinancialItem[] = [
    {
        id: "set-branch-parameters",
        title: "Set Branch Parameters",
        marathiTitle: "शाखेचे घटक निश्चित करा",
        icon: "/authorize transaction list icon.png",
        category: "parameter",
    },
    {
        id: "set-product-status",
        title: "Set Product Status",
        marathiTitle: "उत्पादनाची स्थिती सेट करा",
        icon: "/authorize transaction list icon.png",
        category: "parameter",
    },
    {
        id: "tlcc-interest-posting",
        title: "TLCC Insterest Posting",
        marathiTitle: "टीएलसीसी व्याज नोंदणी",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "td-posting-consistency",
        title: "TD Posting Consistency",
        marathiTitle: "टीडी पोस्टिंगमधील सातत्य",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "td-interest-posting",
        title: "TD Insterest Posting",
        marathiTitle: "मुदत ठेवीवरील व्याजाची नोंद",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "npa-generation",
        title: "NPA Generation",
        marathiTitle: "एनपीए निर्मिती",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "npa-modification",
        title: "NPA Modification",
        marathiTitle: "एनपीए सुधारणा",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "depreciation-calculation",
        title: "Depreciation Calculation",
        marathiTitle: "घसारा गणना",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "matured-td-interest-provision",
        title: "Matured TD Interest Provision",
        marathiTitle: "मुदतपूर्ती झालेल्या मुदत ठेवीवरील व्याजाची तरतूद",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "si-interest-posting",
        title: "SI Insterest Posting",
        marathiTitle: "एसआय व्याज नोंदणी",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "interest-not-applied",
        title: "Interest Not Applied",
        marathiTitle: "लागू न केलेले व्याज",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "pigmy-interest-provision",
        title: "Pigmy Interest Provision",
        marathiTitle: "पिग्मी व्याज तरतूद",
        icon: "/authorize transaction list icon.png",
        category: "calculation",
    },
    {
        id: "modify-deposit-diary",
        title: "Modify Deposit Diary",
        marathiTitle: "ठेव डायरी सुधारणा",
        icon: "/authorize transaction list icon.png",
        category: "export",
    },
    {
        id: "n-form-balancesheet",
        title: "N-Form Balancesheet",
        marathiTitle: "एन-फॉर्म ताळेबंद",
        icon: "/authorize transaction list icon.png",
        category: "reports",
    },
    {
        id: "schedule-income-exp-regular",
        title: "Schedule Of Income& Exp(Regular)",
        marathiTitle: "उत्पन्न आणि खर्चाचे वेळापत्रक (नियमित)",
        icon: "/authorize transaction list icon.png",
        category: "reports",
    },
    {
        id: "schedule-income-exp-closing",
        title: "Schedule Of Income& Exp(Closing)",
        marathiTitle: "उत्पन्न आणि खर्चाचे वेळापत्रक (क्लोजिंग)",
        icon: "/authorize transaction list icon.png",
        category: "reports",
    },
    {
        id: "detail-trial-balance",
        title: "Detail Trial Balance",
        marathiTitle: "तपशीलवार चाचणी ताळेबंद",
        icon: "/authorize transaction list icon.png",
        category: "reports",
    },
    {
        id: "ho-interest-report-branch",
        title: "HO Interest Report(On Branch A/c)",
        marathiTitle: "एचओ व्याज अहवाल (शाखा खात्यावर)",
        icon: "/authorize transaction list icon.png",
        category: "reports",
    },
    {
        id: "ho-interest-report-ho",
        title: "HO Interest Report (On Ho A/c)",
        marathiTitle: "एचओ व्याज अहवाल (एचओ खात्यावर)",
        icon: "/authorize transaction list icon.png",
        category: "reports",
    },
    {
        id: "exceed-cash-limit-report",
        title: "Exceed Cash Limit Report",
        marathiTitle: "रोख मर्यादा ओलांडल्याचा अहवाल",
        icon: "/authorize transaction list icon.png",
        category: "reports",
    },
    {
        id: "ho-interest-report-gl",
        title: "HO Interest Report(GL A/c)",
        marathiTitle: "एचओ व्याज अहवाल (जीएल खाते)",
        icon: "/authorize transaction list icon.png",
        category: "reports",
    },
];

const FinancialClosing = () => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ClosingCategory>("parameter");

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        const inTab = ITEMS.filter((item) => item.category === activeTab);

        if (!q) return inTab;

        return inTab.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.marathiTitle.toLowerCase().includes(q)
        );
    }, [query, activeTab]);

    const activeItem = useMemo(
        () => ITEMS.find((item) => item.id === activeModal) ?? null,
        [activeModal]
    );
    const isReportsItem = activeItem?.category === "reports";
    const isSimpleReport = isReportsItem && SIMPLE_REPORT_IDS.has(activeItem!.id);
    const isBranchReport = isReportsItem && !isSimpleReport;

    const handleOpen = (id: string) => {
        if (id === "set-product-status") {
            router.push("/financial-closing/set-product-status");
        } else {
            setActiveModal(id);
        }
    };

    const handleCloseModal = () => {
        setActiveModal(null);
    };

    return (
        <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
            <GlobalNav
                titleEn="Financial Closing"
                titleHi="आर्थिक समाप्ती"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "MIS Activity", href: "/misactivity" },
                    { label: "Financial Closing", href: "#" },
                ]}
                onBack={() => router.back()}
            />

            <div className="w-full bg-white px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
                {/* Hero Banner */}
                <div className="relative isolate overflow-hidden rounded-2xl">
                    <Image
                        src="/Background.jpg"
                        alt=""
                        fill
                        priority
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/25" />

                    <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center sm:py-16">
                        <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-[34px]">
                            Financial Closing
                        </h1>

                        <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg dark:bg-slate-900">
                            <Search size={18} className="mr-2 shrink-0 text-gray-400" />

                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search financial closing processes..."
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

                {/* Tabs */}
                <div className="mt-5 flex items-center gap-8 border-b border-gray-200 dark:border-slate-800">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`-mb-px whitespace-nowrap border-b-2 pb-2.5 text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleOpen(item.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                    handleOpen(item.id);
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
                                {item.actionLabel ?? "Open"}
                                <ChevronRight size={16} />
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

            {/* Modals */}
            <InterestPostingProcess
                open={activeModal === "matured-td-interest-provision"}
                onClose={handleCloseModal}
            />
            <TdPostingConsistencyProcess
                open={activeModal === "td-interest-posting"}
                onClose={handleCloseModal}
            />
            <NpaModificationProcess
                open={activeModal === "npa-modification"}
                onClose={handleCloseModal}
            />
            <DepreciationCalculationProcess
                open={activeModal === "depreciation-calculation"}
                onClose={handleCloseModal}
            />
            <SiInterestPostingProcess
                open={activeModal === "si-interest-posting"}
                onClose={handleCloseModal}
            />

          {activeItem && isSimpleReport && (
  <ReportsParameterModal
    open={isSimpleReport}
    onClose={handleCloseModal}
  />
)}

{activeItem && isBranchReport && (
  <ReportsParameterBranchModal
    open={isBranchReport}
    onClose={handleCloseModal}
  />

            )}
            <TlccInterestPostingProcess
                open={activeModal === "tlcc-interest-posting"}
                onClose={handleCloseModal}
            />

            {activeModal === "set-branch-parameters" && (
    <SetBranchParameterModal
        onClose={handleCloseModal}
    />
)}
        </div>
    );
};

export default FinancialClosing;
