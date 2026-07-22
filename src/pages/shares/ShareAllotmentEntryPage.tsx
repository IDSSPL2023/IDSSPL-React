import { useState } from "react";
import NavbarCM from "@/components/CustomerMaster/NavbarCM";
import { useRouter } from "@/lib/navigation";
import ShareAllotmentTable, { type ShareAllotmentRow } from "@/components/Shares/ShareAllotmentTable";
import AddShareAllotment, { type ShareAllotmentFormData } from "@/components/Shares/AddShareAllotment";

const initialRows: ShareAllotmentRow[] = [];

export default function ShareAllotmentEntryPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ShareAllotmentRow[]>(initialRows);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSaved = (data: ShareAllotmentFormData) => {
    setRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        accountCode: data.accountInfo.accountCode,
        accountName: data.accountInfo.accountName,
        noOfShares: data.transactionDetails.noOfShares,
        amount: data.transactionDetails.amount,
        meetingDate: data.transactionDetails.meetingDate,
        status: "Pending",
      },
    ]);
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] dark:bg-slate-950">
      <NavbarCM
        titleEn="Shares Allotment Entry"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Shares", href: "#" },
          { label: "Shares Allotment Entry", href: "/shares/allotment-entry" },
        ]}
        onBack={() => router.back()}
        onAdd={() => setIsAddOpen(true)}
      />

      <main className="p-4 sm:p-6">
        <ShareAllotmentTable rows={rows} />
      </main>

      {isAddOpen && (
        <AddShareAllotment
          onClose={() => setIsAddOpen(false)}
          onSave={handleSaved}
        />
      )}
    </div>
  );
}
