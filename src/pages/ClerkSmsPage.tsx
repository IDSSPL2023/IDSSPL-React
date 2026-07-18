import { type FC } from "react";
import Nav from "@/components/HeadOfficeMaster/Nav";
import { useBilingual } from "@/i18n/useBilingual";
import { useRouter } from "@/lib/navigation";

interface SmsRow {
  srNo: number;
  mobileNumber: string;
  customerName: string;
  message: string;
  type: string;
  status: "Sent" | "Failed" | "Pending";
  sentDate: string;
}

const SMS_ROWS: SmsRow[] = [
  { srNo: 1, mobileNumber: "9876543210", customerName: "Ramesh Patil", message: "Your account has been credited with Rs.5000.", type: "Transaction Alert", status: "Sent", sentDate: "15-Jul-2026 10:24" },
  { srNo: 2, mobileNumber: "9822011234", customerName: "Suresh Kulkarni", message: "OTP for your transaction is 482913.", type: "OTP", status: "Sent", sentDate: "15-Jul-2026 11:02" },
  { srNo: 3, mobileNumber: "9765432109", customerName: "Anita Deshmukh", message: "Your cheque book request has been processed.", type: "Service Alert", status: "Pending", sentDate: "16-Jul-2026 09:15" },
  { srNo: 4, mobileNumber: "9988776655", customerName: "Karan Patil", message: "Standing instruction execution failed due to insufficient balance.", type: "Alert", status: "Failed", sentDate: "16-Jul-2026 09:40" },
];

const STATUS_STYLE: Record<SmsRow["status"], string> = {
  Sent: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
};

const ClerkSmsPage: FC = () => {
  const { en, t, tRaw } = useBilingual();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#E7EAEF] dark:bg-slate-950">
      <Nav
        titleEn={en("clerkSms.title")}
        titleHi={t("clerkSms.title")}
        breadcrumbs={[
          { label: en("common.home"), href: "/" },
          { label: en("sidebar.clerk"), href: "#" },
          { label: en("clerkSms.title"), href: "#" },
        ]}
        onBack={() => router.back()}
      />

      <div className="p-4">
        <div className="w-full overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-primary">
                  {[
                    "srNo",
                    "mobileNumber",
                    "customerName",
                    "message",
                    "type",
                    "status",
                    "sentDate",
                  ].map((key) => (
                    <th key={key} className="whitespace-nowrap px-6 py-3 text-left text-[15px] font-semibold text-white">
                      {tRaw(`clerkSms.table.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SMS_ROWS.map((row, idx) => (
                  <tr
                    key={row.srNo}
                    className={`${idx !== SMS_ROWS.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800`}
                  >
                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-slate-300">{row.srNo}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-slate-100">{row.mobileNumber}</td>
                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-slate-300">{row.customerName}</td>
                    <td className="max-w-sm truncate px-6 py-3 text-sm text-gray-700 dark:text-slate-300" title={row.message}>
                      {row.message}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-slate-300">{row.type}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-sm text-gray-700 dark:text-slate-300">{row.sentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkSmsPage;
