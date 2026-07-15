import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { clearAuthSession } from "@/lib/auth";
import { useBilingual } from "@/i18n/useBilingual";

type UserFooterProps = {
  user: {
    avatar: string;
    name: string;
    email: string;
    lastLogin: string;
    role: string;
  };
  collapsed?: boolean;
};

export default function UserFooter({ user, collapsed = false }: UserFooterProps) {
  const { tRaw } = useBilingual();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  if (collapsed) {
    return (
      <div className="mt-auto flex flex-col items-center gap-2 p-2">
        <img
          src={user.avatar}
          alt={user.name}
          title={user.name}
          className="h-9 w-9 flex-shrink-0 rounded-full border border-[#7255FF] object-cover"
        />
        <button
          type="button"
          onClick={handleLogout}
          title={tRaw("common.logout")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-auto p-2">
      <div className="rounded-lg border border-white/10 bg-[#1A0838] p-2.5">
        {/* User */}
        <div className="flex items-center gap-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-10 w-10 flex-shrink-0 rounded-full border border-[#7255FF] object-cover"
          />

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-semibold text-white">{user.name}</h3>
            <p className="truncate text-[10px] text-[#9EA6C6]">{user.email}</p>
          </div>
        </div>

        <div className="my-2 h-px bg-white/10" />

        {/* Last Login */}
        <div className="flex items-center gap-1.5 text-[10px] text-[#9EA6C6]">
          <Clock3 size={11} />
          <span>{tRaw("sidebar.lastLogin")}</span>
          <span className="ml-auto font-medium text-white">{user.lastLogin}</span>
        </div>

        {/* Role */}
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#9EA6C6]">
          <ShieldCheck size={11} className="text-[#7255FF]" />
          <span>{tRaw("sidebar.role")}</span>
          <span className="ml-auto rounded bg-[#7255FF]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#BCAEFF]">
            {user.role}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2.5 flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-white/10 text-[11px] font-medium text-[#D7D9E4] transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={13} />
          {tRaw("common.logout")}
        </button>
      </div>
    </div>
  );
}
