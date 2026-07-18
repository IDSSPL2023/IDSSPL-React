import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { Search, ChevronRight } from "lucide-react";
import Image from "@/components/ui/Image";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import CustomerTDSFlagModal from "@/components/MisActivity/Tds/Modals/FlagUpdation";
import TDSReportAllModal from "@/components/MisActivity/Tds/Modals/ReportAll";
import TDSAppliedReportModal from "@/components/MisActivity/Tds/Modals/AppliedReport";
import ProvisonAndVlcc from "@/components/MisActivity/Tds/Modals/ProvisonAndVlcc";

// Modal imports

type TDSReportItem = {
  id: string;
  title: string;
  marathiTitle: string;
  icon: string;
  description: string;
  marathiDescription: string;
};

const TDS_REPORT_ITEMS: TDSReportItem[] = [
  {
    id: "customer-tds-flag",
    title: "Customer TDS Flag Updation",
    marathiTitle: "ग्राहक TDS फ्लॅग अद्यतनित करणे",
    description: "Update TDS flags for customers",
    marathiDescription: "ग्राहकांसाठी TDS फ्लॅग अद्यतनित करा",
    icon: "/authorize transaction list icon.png",
  },
  {
    id: "tds-report-all",
    title: "TDS Report All",
    marathiTitle: "सर्व TDS अहवाल",
    description: "View all TDS reports",
    marathiDescription: "सर्व TDS अहवाल पहा",
    icon: "/authorize transaction list icon.png",
  },
  {
    id: "tds-applied-report",
    title: "TDS Applied Report",
    marathiTitle: "ठेव व्याज नोंदणी",
    description: "Process interest posting for eligible deposit accounts",
    marathiDescription: "पात्र ठेव खात्यांसाठी व्याज नोंदणी प्रक्रिया करा",
    icon: "/authorize transaction list icon.png",
  },
  {
    id: "provision-vlcc",
    title: "Provision & VLCC",
    marathiTitle: "प्रावधान आणि VLCC",
    description: "Apply provision and VLCC for TDS reports",
    marathiDescription: "TDS अहवालांसाठी प्रावधान आणि VLCC लागू करा",
    icon: "/authorize transaction list icon.png",
  },
];

function TDSReportsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TDS_REPORT_ITEMS;
    return TDS_REPORT_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.marathiTitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [query]);

  const handleOpen = (id: string) => {
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="TDS Reports"
        titleHi="TDS अहवाल"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "TDS Reports", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        {/* Hero Section */}
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
              TDS Reports
            </h1>
            <p className="text-sm text-white/90 sm:text-base">
              Manage TDS reports, flags, provisions and VLCC
            </p>

            <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg dark:bg-slate-900">
              <Search size={18} className="mr-2 shrink-0 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search TDS reports, modules..."
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

        {/* Cards Grid */}
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
                <p className="truncate text-sm text-[#64748B] dark:text-slate-400">
                  {item.marathiTitle}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#94A3B8] dark:text-slate-500">
                  {item.description}
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
              No TDS reports found.
            </p>
          )}
        </div>
      </div>

      {/* Modals rendering based on active state */}
      <CustomerTDSFlagModal
        open={activeModal === "customer-tds-flag"}
        onClose={handleCloseModal}
        mode="add"
        onApply={(data) => {
          console.log("Customer TDS Flag Data:", data);
          handleCloseModal();
        }}
      />

      <TDSReportAllModal
        open={activeModal === "tds-report-all"}
        onClose={handleCloseModal}
        mode="add"
        onApply={(data) => {
          console.log("TDS Report All Data:", data);
          handleCloseModal();
        }}
      />

      <TDSAppliedReportModal
        open={activeModal === "tds-applied-report"}
        onClose={handleCloseModal}
        mode="add"
        onApply={(data) => {
          console.log("TDS Applied Report Data:", data);
          handleCloseModal();
        }}
      />

      <ProvisonAndVlcc
        open={activeModal === "provision-vlcc"}
        onClose={handleCloseModal}
        mode="add"
        onApply={(data) => {
          console.log("Provision & VLCC Data:", data);
          handleCloseModal();
        }}
      />
    </div>
  );
}

export default TDSReportsPage;
