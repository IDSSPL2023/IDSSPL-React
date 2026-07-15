import { useState } from "react";
import RoleAuthorizationList, {
  SAMPLE_ROLE_AUTH_ROWS,
  type RoleAuthorizationRow,
} from "./RoleAuthorizationList";
import AuthorizeAccountModal, { type RoleOption } from "./AuthorizeAccountModal";
import SuccessModal from "@/components/shared/SuccessModal";
import RejectReasonModal from "@/components/shared/RejectReasonModal";

const SAMPLE_ROLES: RoleOption[] = [
  { mainRole: 6, description: "Cashier" },
  { mainRole: 8, description: "Clerk" },
];

type Step = "list" | "authorize" | "rejectReason" | "success";

interface RoleAuthorizationFlowProps {
  onClose: () => void;
}

// Define success state type
type SuccessState = { 
  title: string; 
  subtitle: string; 
  variant: "success" | "critical" 
} | null;

export default function RoleAuthorizationFlow({ onClose }: RoleAuthorizationFlowProps) {
  const [step, setStep] = useState<Step>("list");
  const [activeRow, setActiveRow] = useState<RoleAuthorizationRow | null>(null);
  const [successState, setSuccessState] = useState<SuccessState>(null);

  // Three-dot click -> directly opens Authorize Account. No popup in between.
  const handleOpenAuthorize = (row: RoleAuthorizationRow) => {
    setActiveRow(row);
    setStep("authorize");
  };

  const handleBackToList = () => {
    setActiveRow(null);
    setStep("list");
  };

  const handleAuthorize = () => {
    // TODO: call the existing authorize API here — logic/endpoint unchanged.
    setSuccessState({
      title: "Role Has Been Authorized",
      subtitle: "Successfully",
      variant: "success"
    });
    setStep("success");
  };

  // Reject on the Authorize modal opens the reason-collection step first.
  const handleOpenRejectReason = () => {
    setStep("rejectReason");
  };

  const handleSubmitRejectReason = (reason: string) => {
    // TODO: call the existing reject API here, passing `reason` — logic/endpoint unchanged.
    console.log("Rejection reason:", reason);
    setSuccessState({
      title: "Role Has Been Rejected",
      subtitle: "Successfully",
      variant: "critical"
    });
    setStep("success");
  };

  const handleCloseSuccess = () => {
    setSuccessState(null);
    setStep("list");
  };

  return (
    <>
      <RoleAuthorizationList
        rows={SAMPLE_ROLE_AUTH_ROWS}
        onBack={onClose}
        onAuthorize={handleOpenAuthorize}
      />

      {step === "authorize" && activeRow && (
        <AuthorizeAccountModal
          userId={activeRow.userId}
          name={activeRow.name}
          roles={SAMPLE_ROLES}
          onClose={() => { setStep("list") }}
          onCancel={handleBackToList}
          onReject={handleOpenRejectReason}
          onAuthorize={handleAuthorize}
        />
      )}

      {/* Step 1 of reject flow: collect reason */}
      {step === "rejectReason" && activeRow && (
        <RejectReasonModal
          titleEn="User Authorize Rejected"
          titleHi="युझर खात्याची स्थिती"
          onClose={() => setStep("list")}
          onConfirm={handleSubmitRejectReason}
        />
      )}

      {/* Unified SuccessModal with variant support */}
      {step === "success" && successState && (
        <SuccessModal
          title={successState.title}
          subtitle={successState.subtitle}
          variant={successState.variant}
          onClose={handleCloseSuccess}
          onDone={handleCloseSuccess}
        />
      )}
    </>
  );
}