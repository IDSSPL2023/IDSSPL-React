import { useState } from "react";
import { Calendar, User, X, Check, Play } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import SuccessModal from "@/components/shared/SuccessModal";
import TextInput from "../shared/Inputs/TextInput";
import SectionWrapper from "../shared/Wrappers/SectionWrapper";

export interface BranchConsistencyCheckModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BranchConsistencyCheckModal({ open, onClose }: BranchConsistencyCheckModalProps) {
  const [workingDay, setWorkingDay] = useState("13-Jul-2026");
  const [userId, setUserId] = useState("Admin");
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleValidate = () => setIsValidated(true);
  const handleConsistencyCheck = () => setShowSuccess(true);
  const handleDone = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <FormModal
        onClose={onClose}
        titleEn="Branch Consistency Check"
        titleHi="शाखा सुसंगतता तपासणी"
        subtitleEn="Verify branch consistency and data integrity."
        subtitleHi="शाखा सुसंगतता आणि डेटा अखंडता तपासा."
        headerIcon={
          <div className="flex h-12 w-12 items-center justify-center">
            <Image src="/User.png" alt="Branch Consistency Check" width={48} height={48} />
          </div>
        }
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        maxWidth="max-w-4xl"
        customFooter={
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            {/* Validate Button - First */}
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 rounded-lg bg-[#1565D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Validate
              <Check className="h-4 w-4" />
            </button>
            
            {/* Cancel Button - Second */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg border border-[#1565D8] bg-white px-5 py-2.5 text-sm font-semibold text-[#1565D8] transition hover:bg-slate-50"
            >
              Cancel
              <X className="h-4 w-4" />
            </button>
            
            {/* Consistency Check Button - Third */}
            <button
              type="button"
              onClick={handleConsistencyCheck}
              disabled={!isValidated}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                isValidated
                  ? "bg-[#1565D8] text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Check Consistency
              <Play className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <SectionWrapper>
          
          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-5">
            {/* Working Day */}
            <TextInput
              labelEn="Working Day"
              labelHi="व्यवहाराची पद्धत"
              icon={Calendar}
              placeholder="Select Working Day"
              value={workingDay}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
            
            {/* User ID */}
            <TextInput
              labelEn="User ID"
              labelHi="व्यवहाराचा प्रकार"
              icon={User}
              placeholder="Enter User ID"
              value={userId}
              onChange={() => {}}
              required={true}
              readOnly={true}
            />
          </div>
        </SectionWrapper>
      </FormModal>

      {showSuccess && (
        <SuccessModal
          onClose={handleDone}
          onDone={handleDone}
          title="Branch Consistency Check Completed"
          subtitle="The branch consistency check has been completed successfully."
        />
      )}
    </>
  );
}