import Image from "@/components/ui/Image";
import { IdCard, User, X, ThumbsDown, ShieldCheck } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface RoleOption {
  mainRole: string | number;
  description: string;
}

interface AuthorizeAccountModalProps {
  userId: string;
  name: string;
  roles: RoleOption[];
  onClose: () => void;
  onCancel: () => void;
  onReject: () => void;
  onAuthorize: () => void;
}
function ReadOnlyField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof IdCard;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        <span className="ml-0.5 text-rose-500">*</span>
      </label>
      <div
        className="flex h-11 items-center gap-2 border bg-white px-3.5"
        style={{
          borderColor: "#6A7282",
          borderRadius: "12px",
          boxShadow: "0px 1px 0.5px 0.05px rgba(29, 41, 61, 0.02)",
        }}
      >
        <Icon size={16} className="shrink-0 text-slate-400" />
        <span className="truncate text-sm text-slate-600">{value}</span>
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/*  Main                                                                */
/* ------------------------------------------------------------------ */

export default function AuthorizeAccountModal({
  userId,
  name,
  roles,
  onClose,
  onCancel,
  onReject,
  onAuthorize,
}: AuthorizeAccountModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 ">
      <div className="relative w-full max-w-[580px] overflow-hidden rounded-[24px]  bg-white p-8 shadow-2xl">
        {/* Decorative corner circles */}
        <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-[#E7EFFD]" />
        <div className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-[#E7EFFD]" />

        {/* Header */}
        
<div className="relative z-10 mb-6 flex items-start justify-between">
  <div className="flex items-center gap-3">
    <Image
      src="/role-authorization.png"
      alt="Role Authorization"
      width={44}
      height={44}
      className="shrink-0"
    />
    <h2 className="text-lg font-bold text-slate-800">
      Authorize Account
      <span className="text-slate-400"> / </span>
      <span className="text-slate-500">खाते अधिकृत करा</span>
    </h2>
  </div>
  
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Fields */}
        <div className="relative z-10 mb-6 flex gap-5">
          <ReadOnlyField icon={IdCard} label="User ID" value={userId} />
          <ReadOnlyField icon={User} label="Name" value={name} />
        </div>

        {/* Role table */}
        <div
          className="relative z-10 overflow-hidden rounded-xl border bg-white shadow-sm"
          style={{ borderColor: "#6A7282" }}
        >
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#1F67F4] text-white">
                <th className="px-6 py-4 font-semibold">Main Role</th>
                <th className="px-6 py-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, idx) => (
                <tr
                  key={idx}
                  className={idx !== roles.length - 1 ? "border-b" : ""}
                  style={idx !== roles.length - 1 ? { borderColor: "#E2E4E9" } : undefined}
                >
                  <td className="px-6 py-4 text-slate-700">{role.mainRole}</td>
                  <td className="px-6 py-4 text-slate-700">{role.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-7 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReject}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-5 text-[14px] font-medium text-rose-600 transition hover:bg-rose-100"
          >
            Reject
            <ThumbsDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#1F67F4] bg-white px-5 text-[14px] font-medium text-[#1F67F4] transition hover:bg-[#E7EFFD]"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onAuthorize}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#1F67F4] px-5 text-[14px] font-medium text-white transition hover:bg-[#0E57EA]"
          >
            Authorize
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}