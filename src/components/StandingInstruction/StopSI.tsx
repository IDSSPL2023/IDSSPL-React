import { useState } from "react";
import { User, CreditCard, Calendar, FileText, IndianRupee, Repeat, ListChecks, Hash, X, ChevronDown } from "lucide-react";
import FormModal from "@/components/shared/FormModal";
import { FieldShell, TextInput, SectionCard } from "@/components/shared/FormFields";

export interface StopSIData {
  debitAccountCode: string;
  debitName: string;
  creditAccountCode: string;
  creditName: string;
  startDate: string;
  endDate: string;
  nextDueDate: string;
  amount: string;
  frequency: string;
  status: string;
  executedCount: string;
}

export interface StopSIProps {
  onClose: () => void;
  onSave?: (stopReason: string) => void;
  data: StopSIData;
}

const StopSI = ({ onClose, onSave, data }: StopSIProps) => {
  const [stopReason, setStopReason] = useState("");

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const handleSave = () => {
    onSave?.(stopReason);
    onClose();
  };

  return (
    <FormModal
      onClose={onClose}
      titleEn="Stop Standing Instruction"
      titleHi="नियतकालिक सूचना थांबवणे"
      headerIcon={<ListChecks size={24} className="text-primary" />}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      hideFooter
    >
      <SectionCard titleEn="Account Details" titleHi="खात्याचा तपशील" icon={<User size={16} />}>
        <div className={`${grid4} mt-0`}>
          <FieldShell label="Debit Account Code" labelHi="नावे खाते संकेत" required>
            <TextInput icon={<CreditCard size={16} />} value={data.debitAccountCode} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Name" labelHi="नाव" required>
            <TextInput icon={<User size={16} />} value={data.debitName} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Credit Account Code" labelHi="जमा खात्याचा कोड" required>
            <TextInput icon={<CreditCard size={16} />} value={data.creditAccountCode} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Name" labelHi="नाव" required>
            <TextInput icon={<User size={16} />} value={data.creditName} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      <SectionCard titleEn="SI Details" titleHi="SI तपशील" icon={<Repeat size={16} />}>
        <div className={`${grid4} mt-0`}>
          <FieldShell label="Start Date" labelHi="सुरुवात तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.startDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="End Date" labelHi="समाप्तीची तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.endDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Next Due Date" labelHi="पुढील देय तारीख" required>
            <TextInput icon={<Calendar size={16} />} value={data.nextDueDate} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Stop Reason" labelHi="रोखण्याचे कारण" required>
            <TextInput
              icon={<FileText size={16} />}
              value={stopReason}
              onChange={setStopReason}
              placeholder="Enter Stop Reason"
            />
          </FieldShell>
          <FieldShell label="Amount" labelHi="रक्कम" required>
            <TextInput icon={<IndianRupee size={16} />} value={data.amount} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="SI Frequency" labelHi="SI वारंवारता" required>
            <TextInput icon={<Repeat size={16} />} value={data.frequency} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Status" labelHi="स्थिती" required>
            <TextInput icon={<ListChecks size={16} />} value={data.status} onChange={() => {}} readOnly />
          </FieldShell>
          <FieldShell label="Executed Count" labelHi="यशस्वी व्यवहारांची संख्या" required>
            <TextInput icon={<Hash size={16} />} value={data.executedCount} onChange={() => {}} readOnly />
          </FieldShell>
        </div>
      </SectionCard>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
        >
          Cancel <X size={16} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!stopReason.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
        >
          Save <ChevronDown size={16} />
        </button>
      </div>
    </FormModal>
  );
};

export default StopSI;
