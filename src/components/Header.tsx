import { IMAGES } from "@/assets";
import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import Image from "@/components/ui/Image";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LayoutToggle from "@/components/layout/LayoutToggle";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick: _onMenuClick }: HeaderProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  useEffect(() => {
    setNow(new Date());

    const clock = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeLeft]);

  const date = now
    ? now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const sessionTime = `${minutes}:${seconds}`;

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#ECECEC] bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
      {/* Left */}
      <div className="text-sm text-[#5D6B82] dark:text-slate-400">
        {date && date.replace(",", " |")}
      </div>

      {/* Center */}
      <div className="flex items-center gap-2">
        <Image
          src={IMAGES.IDSSPL}
          alt="Logo"
          width={36}
          height={36}
          priority
        />

        <h1 className="text-[15px] font-semibold text-[#30343B] dark:text-slate-100">
          CBS Banking Software
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <LayoutToggle />

        <ThemeSwitcher />

        <LanguageSwitcher />

        <div
          className="flex h-8 items-center gap-1 rounded-[10px] bg-primary px-3 text-xs text-white"
        >
          <Clock3 size={12} />
          <span>Session Time {sessionTime}</span>
        </div>
      </div>
    </header>
  );
}