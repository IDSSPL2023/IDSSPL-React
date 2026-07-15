import Image from "@/components/ui/Image";
import { Search } from "lucide-react";

type AuthorizeHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

const AuthorizeHero = ({ query, onQueryChange }: AuthorizeHeroProps) => {
  return (
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
          Authorize Transaction
        </h1>

        <div className="flex w-full max-w-xl items-center rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-lg">
          <Search size={18} className="mr-2 shrink-0 text-gray-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search transactions, payees, statements..."
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
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
  );
};

export default AuthorizeHero;
