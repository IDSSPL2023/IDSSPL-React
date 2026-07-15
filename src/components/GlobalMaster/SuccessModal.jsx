import { Check, X } from "lucide-react";

const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
    <div className="relative w-full max-w-[480px] overflow-hidden rounded-[30px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)] dark:bg-slate-900">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#DCEBFF] opacity-90 dark:bg-primary-950/40" />
      <div className="absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-[#DCEBFF] opacity-90 dark:bg-primary-950/40" />

      <button type="button" onClick={onClose} className="absolute right-7 top-7 text-[#6F7785] hover:scale-105 transition dark:text-slate-400">
        <X size={28} strokeWidth={2.2} />
      </button>

      <div className="px-12 py-14 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-[105px] w-[105px] rounded-full border border-dashed border-[#3F73F5]/20" />
          {["top-0 left-1/2", "top-4 left-3", "top-6 right-3", "left-0 top-1/2", "right-0 top-1/2", "bottom-5 left-3", "bottom-4 right-4", "bottom-0 left-1/2"].map((cls, i) => (
            <span key={i} className={`absolute ${cls} h-[4px] w-[4px] rounded-full bg-[#3F73F5]`} />
          ))}
          <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#416EF4] shadow-[0_10px_20px_rgba(65,110,244,0.35)]">
            <Check size={44} strokeWidth={3.5} color="white" />
          </div>
        </div>

        <h2 className="mt-10 text-center text-[26px] font-bold leading-[34px] text-black dark:text-slate-100">
          Parameter Added Successfully
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-slate-400">
          Your Parameter is Added Successfully
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-9 h-[45px] min-w-[88px] rounded-lg bg-[#1F67F4] px-6 text-lg font-semibold text-white shadow-md transition hover:bg-[#0E57EA]"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

export default SuccessModal;
