import { Check, X as XIcon } from "lucide-react";

export type SuccessModalVariant = "success" | "rejection" | "critical";

export interface SuccessModalProps {
  onClose: () => void;
  onDone: () => void;
  title?: string;
  subtitle?: string;
  variant?: SuccessModalVariant;
  /** Optional key/value rows (e.g. a created record's fields) shown below the subtitle. */
  details?: { label: string; value: string }[];
}

const VARIANT_STYLES: Record<
  "success" | "rejection",
  { bg: string; circle: string; dotBorder: string; dotFill: string; button: string; buttonHover: string }
> = {
  success: {
    bg: "bg-[#DCEBFF]",
    circle: "bg-[#416EF4] shadow-[0_10px_20px_rgba(65,110,244,0.35)]",
    dotBorder: "border-[#3F73F5]/20",
    dotFill: "bg-[#3F73F5]",
    button: "bg-[#1F67F4]",
    buttonHover: "hover:bg-[#0E57EA]",
  },
  rejection: {
    bg: "bg-[#FCE0E0]",
    circle: "bg-[#E23B3B] shadow-[0_10px_20px_rgba(226,59,59,0.35)]",
    dotBorder: "border-[#E23B3B]/20",
    dotFill: "bg-[#E23B3B]",
    button: "bg-[#DC2626]",
    buttonHover: "hover:bg-[#B91C1C]",
  },
};

const normalizeVariant = (variant: SuccessModalVariant): "success" | "rejection" =>
  variant === "success" ? "success" : "rejection";

/**
 * Target 573x422, 24px radius. Supports success and rejection variants through
 * props rather than duplicated layouts (`RejectModal` wraps this with the
 * rejection variant preset). `"critical"` is accepted as a legacy alias for
 * `"rejection"` during migration.
 */
export default function SuccessModal({
  onClose,
  onDone,
  title = "Account Added Successfully",
  subtitle = "Please Authorize",
  variant = "success",
  details,
}: SuccessModalProps) {
  const key = normalizeVariant(variant);
  const styles = VARIANT_STYLES[key];
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex w-full max-w-[573px] min-h-[422px] flex-col items-center justify-center overflow-hidden rounded-[24px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.18)]"
      >
        <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-90 blur-[1px] ${styles.bg}`} />
        <div className={`absolute -left-14 -bottom-14 h-44 w-44 rounded-full opacity-90 blur-[1px] ${styles.bg}`} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-7 top-7 text-[#6F7785] transition hover:scale-105"
        >
          <XIcon size={32} strokeWidth={2.2} />
        </button>

        <div className="flex flex-col items-center px-12 py-14">
          <SuccessIcon variantKey={key} />

          <h2 className="mt-10 text-center text-[28px] font-[700] leading-[34px] text-black">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-slate-500">{subtitle}</p>
          )}

          {details && details.length > 0 && (
            <div className="mt-6 w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-4">
              {details.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-1 text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onDone}
            className={`mt-9 h-[45px] w-[88px] rounded-lg text-[22px] font-semibold text-white shadow-md transition ${styles.button} ${styles.buttonHover}`}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessIcon({ variantKey }: { variantKey: "success" | "rejection" }) {
  const styles = VARIANT_STYLES[variantKey];

  return (
    <div className="relative flex items-center justify-center">
      <span className={`absolute h-[105px] w-[105px] rounded-full border border-dashed ${styles.dotBorder}`} />
      {[
        "top-0 left-1/2",
        "top-4 left-3",
        "top-6 right-3",
        "left-0 top-1/2",
        "right-0 top-1/2",
        "bottom-5 left-3",
        "bottom-4 right-4",
        "bottom-0 left-1/2",
        "top-2 right-10",
        "top-8 left-8",
        "bottom-7 right-10",
        "bottom-8 left-9",
      ].map((cls, i) => (
        <span key={i} className={`absolute ${cls} h-[4px] w-[4px] rounded-full ${styles.dotFill}`} />
      ))}
      <div className={`flex h-[96px] w-[96px] items-center justify-center rounded-full ${styles.circle}`}>
        {variantKey === "rejection" ? (
          <XIcon size={44} strokeWidth={3.5} color="white" />
        ) : (
          <Check size={44} strokeWidth={3.5} color="white" />
        )}
      </div>
    </div>
  );
}
