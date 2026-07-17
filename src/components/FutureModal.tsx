import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddModifyLoanInterestRate from "@/components/futuremodels/AddModifyLoanInterestRate";
import InterestPostingProcess from "@/components/futuremodels/InterestPostingProcess";
import StopChequePayment from "@/components/futuremodels/StopChequePayment";
import SetBranchParameterModal from "@/components/FinancialClosing/SetBranchParameterModal";
import InwardClearingEntryModal from "./futuremodels/InwardClearingEntryModal";
import OutwardClearingBounceModal from "./futuremodels/OutwardClearingBounceModal";
import OutwardClearingEntryModal from "./futuremodels/OutwardClearingEntryModal";

interface FutureModelAction {
    label: string;
    path: string;
}

const FutureModalsPage = () => {
    const navigate = useNavigate();
    const [showStopChequePayment, setShowStopChequePayment] = useState(false);
    const [showLoanInterestRate, setShowLoanInterestRate] = useState(false);
    const [showInterestPosting, setShowInterestPosting] = useState(false);
    const [showSiPosting, setShowSiPosting] = useState(false);
    const [showSetBranchParameter, setShowSetBranchParameter] = useState(false);
    const [showInwardClearing, setShowInwardClearing] = useState(false);
    const [showOutwardBounce, setShowOutwardBounce] = useState(false);
    const [showOutwardClearing, setShowOutwardClearing] = useState(false);

    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-4">
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

                <button
                    type="button"
                    onClick={() => setShowSetBranchParameter(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                >
                    SET BRANCH PARAMETER
                </button>

                <button
                    type="button"
                    onClick={() => setShowInwardClearing(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
                >
                    INWARD CLEARING ENTRY
                </button>

                <button
                    type="button"
                    onClick={() => setShowOutwardBounce(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-orange-700"
                >
                    OUTWARD CLEARING BOUNCE
                </button>

                <button
                    type="button"
                    onClick={() => setShowOutwardClearing(true)}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-purple-700"
                >
                    OUTWARD CLEARING ENTRY
                </button>
            </div>

            {showStopChequePayment && (
                <StopChequePayment onClose={() => setShowStopChequePayment(false)} />
            )}

            {showLoanInterestRate && (
                <AddModifyLoanInterestRate onClose={() => setShowLoanInterestRate(false)} />
            )}

            {showSetBranchParameter && (
                <SetBranchParameterModal onClose={() => setShowSetBranchParameter(false)} />
            )}

            {showInwardClearing && (
                <InwardClearingEntryModal
                    open={showInwardClearing}
                    onClose={() => setShowInwardClearing(false)}
                />
            )}

            {showOutwardBounce && (
                <OutwardClearingBounceModal
                    open={showOutwardBounce}
                    onClose={() => setShowOutwardBounce(false)}
                />
            )}

            {showOutwardClearing && (
                <OutwardClearingEntryModal
                    open={showOutwardClearing}
                    onClose={() => setShowOutwardClearing(false)}
                />
            )}
        </div>
    );
};

export default FutureModalsPage;