import type { ReactNode } from "react";
import { ChevronRight, Search } from "lucide-react";
import Image from "@/components/ui/Image";
import { IMAGES } from "@/assets";

export interface WelcomeScreenItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  onOpen: () => void;
}

export interface WelcomeScreenProps {
  title: string;
  titleHi?: string;
  backgroundImageSrc?: string;
  /** Set false to opt out of the dark title/overlay treatment — e.g. when passing a light `backgroundImageSrc`. Defaults to true, tuned for the default `IMAGES.BACKGROUND_DARK` hero. */
  dark?: boolean;
  searchPlaceholder?: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch?: () => void;
  items: WelcomeScreenItem[];
  emptyMessage?: string;
}

/**
 * Reusable "menu landing screen": hero banner (background image + title +
 * search + Show button) + a card list below. First reference: `/day-begin-end`.
 * Defaults to the shared `background-dark` hero image (white title/overlay)
 * so the banner reads clearly against the page's own `welcome-hero.png` backdrop.
 */
export default function WelcomeScreen({
  title,
  titleHi,
  backgroundImageSrc = IMAGES.BACKGROUND_DARK,
  dark = true,
  searchPlaceholder = "Search…",
  query,
  onQueryChange,
  onSearch,
  items,
  emptyMessage = "No modules found.",
}: WelcomeScreenProps) {
  return (
    <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
      <div className="relative isolate overflow-hidden rounded-2xl border border-primary-100 bg-[#F5F9FF] dark:border-slate-800 dark:bg-slate-900">
        <Image src={backgroundImageSrc} alt="" fill priority className="object-cover" />
        {dark && <div className="absolute inset-0 bg-black/25" />}

        <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center sm:py-16">
          <h1
            className={
              dark
                ? "text-2xl font-bold text-white sm:text-3xl md:text-[34px]"
                : "text-2xl font-bold text-[#1C398E] sm:text-3xl md:text-[34px] dark:text-slate-100"
            }
          >
            {title}
            {titleHi && (
              <span className={dark ? "ml-2 font-normal text-white/70" : "ml-2 font-normal text-[#1C398E]/70 dark:text-slate-400"}>
                / {titleHi}
              </span>
            )}
          </h1>

          <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg dark:bg-slate-900">
            <Search size={18} className="mr-2 shrink-0 text-gray-400" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-slate-100"
            />
            <button
              type="button"
              onClick={onSearch}
              className="ml-2 shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Show
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={item.onOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                item.onOpen();
              }
            }}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-primary-300 hover:shadow-[0_4px_20px_rgba(11,99,193,0.15)] dark:border-slate-800 dark:bg-slate-900 sm:p-5"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full">{item.icon}</div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold text-[#111827] dark:text-slate-100">{item.title}</h3>
              {item.subtitle && (
                <p className="mt-0.5 truncate text-sm text-[#64748B] dark:text-slate-400">{item.subtitle}</p>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                item.onOpen();
              }}
              className="flex shrink-0 items-center gap-1 rounded-full border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
            >
              Open <ChevronRight size={16} />
            </button>
          </div>
        ))}

        {items.length === 0 && <p className="col-span-full py-10 text-center text-gray-400 dark:text-slate-500">{emptyMessage}</p>}
      </div>
    </div>
  );
}
