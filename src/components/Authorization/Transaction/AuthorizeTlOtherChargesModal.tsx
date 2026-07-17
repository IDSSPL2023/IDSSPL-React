import { useState } from "react";
import { ShieldCheck, X, Hash, IndianRupee } from "lucide-react";

export type AuthorizeTlOtherChargesInitialData = {
  scrollNumber: string;
  accountCode: string;
  accountName?: string;
  amount: string;
};

type AuthorizeTlOtherChargesModalProps = {
  open: boolean;
  initialData: AuthorizeTlOtherChargesInitialData;
  onClose: () => void;
  onApprove?: (data: AuthorizeTlOtherChargesInitialData, remarks: string) => void;
  onReject?: (data: AuthorizeTlOtherChargesInitialData, remarks: string) => void;
};

export default function AuthorizeTlOtherChargesModal({
  open,
  initialData,
  onClose,
  onApprove,
  onReject,
}: AuthorizeTlOtherChargesModalProps) {
  const [remarks, setRemarks] = useState("");

  if (!open) return null;

  const handleApprove = () => {
    onApprove?.(initialData, remarks);
    onClose();
  };

  const handleReject = () => {
    onReject?.(initialData, remarks);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-primary bg-white p-8 dark:bg-slate-900"
      >
        <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#DCEBFC] dark:bg-slate-800" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-8 top-8 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black text-black hover:bg-gray-100 dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary">
            <ShieldCheck size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
              Authorize TL Other Charges
            </h2>
            <p className="text-gray-400 dark:text-slate-400">
              Review the transaction before authorizing
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-5 border-b border-gray-200 dark:border-slate-800" />

        <div className="relative z-10 mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
            <Hash size={18} className="text-primary" />
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500">Scroll No</p>
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {initialData.scrollNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
            <Hash size={18} className="text-primary" />
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500">Account Code</p>
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {initialData.accountCode}
              </p>
            </div>
          </div>

          {initialData.accountName && (
            <div className="col-span-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
              <div>
                <p className="text-xs text-gray-400 dark:text-slate-500">Account Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                  {initialData.accountName}
                </p>
              </div>
            </div>
          )}

          <div className="col-span-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
            <IndianRupee size={18} className="text-primary" />
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500">Amount</p>
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {initialData.amount}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
            Remarks
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            placeholder="Enter remarks (optional for approve, recommended for reject)"
            className="w-full rounded-xl border border-primary bg-white px-4 py-3 text-gray-700 placeholder-gray-400 outline-none dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>

        <div className="relative z-10 mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={handleReject}
            className="rounded-full border border-red-500 px-8 py-3 font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-slate-800"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="rounded-full bg-primary px-10 py-3 font-semibold text-white hover:bg-[#0a56aa]"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}