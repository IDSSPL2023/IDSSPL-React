import Link from "@/components/ui/Link";
import { useRouter } from "@/lib/navigation";
import {
  ArrowLeft,
  Filter,
  Plus,
  Home,
  ChevronRight,
} from "lucide-react";

type BreadcrumbItem = {
  label: string;
  active?: boolean;
};

type PageHeaderProps = {
  title: string;
  subTitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  addHref?: string;
  onFilter?: () => void;
};

export default function PageHeader({
  title,
  subTitle,
  breadcrumbs = [],
  addHref = "#",
  onFilter = () => {},
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full border-b border-[#ECECEC] bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">

        {/* Left */}
        <div className="flex gap-3">

          <button
            onClick={() => router.back()}
            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-700"
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
          </button>

          <div>

            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-primary">
                {title}
              </h1>

              <span className="text-[15px] font-semibold text-[#333] dark:text-slate-100">
                {subTitle}
              </span>
            </div>

            <div className="mt-[2px] flex items-center text-[12px]">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">

                  {index === 0 && (
                    <Home
                      size={12}
                      className="mr-1 text-[#A3A3A3] dark:text-slate-500"
                    />
                  )}

                  <span
                    className={
                      item.active
                        ? "text-primary"
                        : "text-[#9C9C9C] dark:text-slate-400"
                    }
                  >
                    {item.label}
                  </span>

                  {index !== breadcrumbs.length - 1 && (
                    <ChevronRight
                      size={13}
                      className="mx-1 text-[#B7B7B7] dark:text-slate-600"
                    />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          <button
            onClick={onFilter}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-primary text-primary"
          >
            <Filter size={15} />
          </button>

          <Link
            href={addHref}
            className="flex h-8 overflow-hidden rounded-md border border-primary"
          >
            <div className="flex w-9 items-center justify-center bg-white text-primary dark:bg-slate-900">
              <Plus size={15} strokeWidth={2.8} />
            </div>

            <div className="flex items-center bg-primary px-3 text-[13px] font-medium text-white">
              Add
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}