import { IMAGES } from "@/assets";
import { useMemo, useState } from "react";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import Image from "@/components/ui/Image";
import { Search, ChevronRight, FileText, Printer } from "lucide-react";

type DDItem = {
  id: string;
  title: string;
  marathiTitle: string;
  icon: "maintenance" | "printing";
};

const DD_ITEMS: DDItem[] = [
  {
    id: "dd-maintenance",
    title: "DD Maintenance",
    marathiTitle: "डीडी देखभाल",
    icon: "maintenance",
  },
  {
    id: "dd-printing",
    title: "DD Printing",
    marathiTitle: "डीडी छपाई",
    icon: "printing",
  },
];

export default function DDPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DD_ITEMS;
    return DD_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.marathiTitle.toLowerCase().includes(q)
    );
  }, [query]);

  const handleOpen = (id: string) => {
    // Handle navigation based on id
    if (id === "dd-maintenance") {
      router.push("/dd/maintenance");
    } else if (id === "dd-printing") {
      router.push("/dd/printing");
    }
  };

  return (
    <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
      <GlobalNav
        titleEn="DD"
        titleHi="डीडी"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "DD", href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        {/* DD Hero Section - Exact same as DayBeginEnd */}
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
              DD
            </h1>

            <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg dark:bg-slate-900">
              <Search size={18} className="mr-2 shrink-0 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search DD options..."
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

        {/* DD Cards Grid - Exact same as DayBeginEnd */}
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
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-white">
                {item.icon === "maintenance" ? <FileText size={24} /> : <Printer size={24} />}
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
              No options found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}