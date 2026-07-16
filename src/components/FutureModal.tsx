import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddModifyLoanInterestRate from "@/components/futuremodels/AddModifyLoanInterestRate";
import InterestPostingProcess from "@/components/futuremodels/InterestPostingProcess";
import StopChequePayment from "@/components/futuremodels/StopChequePayment";
import SetBranchParameterModal from "@/components/FinancialClosing/SetBranchParameterModal";
import GeneratedInwardScheduleModal from "./Clerk/Modals/GenerateInwardSchedule";
import GenerateOutwardScheduleModal from "./Clerk/Modals/GenerateOutwordSchedule";
import ClearingTallyModal from "./Clerk/Modals/ClearingTallyAndHouse";

interface FutureModelAction {
  label: string;
  path: string;
}

// const FUTURE_MODEL_ACTIONS: FutureModelAction[] = [
//     {
//         label: "MODIFY ACCOUNT BALANCE",
//         path: "/futuremodels/modifyaccountbalance",
//     },
//     {
//         label: "MODIFY BRANCH GL BALANCE",
//         path: "/futuremodels/modifybranchglbalance",
//     },
//     {
//         label: "MODIFY BRANCH GL HISTORY",
//         path: "/futuremodels/modifybranchglhistory",
//     },
//     {
//         label: "MODIFY CASHHANDLING RECORD",
//         path: "/futuremodels/modifycashhandlingrecord",
//     },
// ];

const FutureModalsPage = () => {
  const navigate = useNavigate();
  const [showStopChequePayment, setShowStopChequePayment] = useState(false);
  const [showLoanInterestRate, setShowLoanInterestRate] = useState(false);
  const [showInterestPosting, setShowInterestPosting] = useState(false);
  const [showSiPosting, setShowSiPosting] = useState(false);
  const [showSetBranchParameter, setShowSetBranchParameter] = useState(false);
  const [clerkModal, setClerkModal] = useState<"tally"|"inward"|"outward"|"">("tally");

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4">
        {/* {FUTURE_MODEL_ACTIONS.map(({ label, path }) => (
                    <button
                        key={path}
                        type="button"
                        onClick={() => navigate(path)}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                    >
                        {label}
                    </button>
                ))} */}

        <button
          type="button"
          onClick={() => setShowStopChequePayment(true)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          STOP CHEQUE PAYMENT
        </button>

        <button
          type="button"
          onClick={() => setShowLoanInterestRate(true)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          ADD/MODIFY LOAN INTEREST RATE
        </button>

        <button
          type="button"
          onClick={() => setShowInterestPosting(true)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          MATURED TD
        </button>
        {/* <button
                    type="button"
                    onClick={() => setShowSiPosting(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                    SI INTREST POSTING
                </button> */}
        <button
          type="button"
          onClick={() => setShowSetBranchParameter(true)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          SET BRANCH PARAMETER
        </button>

        <div className="flex gap-3 p-4 bg-white rounded-lg shadow border border-gray-200">
          <button
            onClick={() => setClerkModal("inward")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Generate Inward
          </button>

          <button
            onClick={() => setClerkModal("outward")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            Generate Outward
          </button>

          <button
            onClick={() => setClerkModal("tally")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            Clearing Tally
          </button>
        </div>
      </div>

      {showStopChequePayment && (
        <StopChequePayment onClose={() => setShowStopChequePayment(false)} />
      )}

      {showLoanInterestRate && (
        <AddModifyLoanInterestRate
          onClose={() => setShowLoanInterestRate(false)}
        />
      )}

      {/* {showInterestPosting && (
                <InterestPostingProcess onClose={() => setShowInterestPosting(false)} />
            )}
            {showSiPosting && (
                <SiIntrest/>
            )} */}

      {showSetBranchParameter && (
        <SetBranchParameterModal
          onClose={() => setShowSetBranchParameter(false)}
        />
      )}


        <GeneratedInwardScheduleModal open={clerkModal === "inward"}
            onClose={() => setClerkModal("")}
        />

       <GenerateOutwardScheduleModal open={clerkModal === "outward"}
            onClose={() => setClerkModal("")}

        />

        <ClearingTallyModal open={clerkModal === "tally"}
            onClose={() => setClerkModal("")}
        />
    </div>
  );
};

export default FutureModalsPage;
