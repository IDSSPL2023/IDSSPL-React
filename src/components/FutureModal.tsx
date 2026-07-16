import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddModifyLoanInterestRate from "@/components/futuremodels/AddModifyLoanInterestRate";
import InterestPostingProcess from "@/components/futuremodels/InterestPostingProcess";
import StopChequePayment from "@/components/futuremodels/StopChequePayment";

interface FutureModelAction {
    label: string;
    path: string;
}

const FUTURE_MODEL_ACTIONS: FutureModelAction[] = [
    {
        label: "MODIFY ACCOUNT BALANCE",
        path: "/futuremodels/modifyaccountbalance",
    },
    {
        label: "MODIFY BRANCH GL BALANCE",
        path: "/futuremodels/modifybranchglbalance",
    },
    {
        label: "MODIFY BRANCH GL HISTORY",
        path: "/futuremodels/modifybranchglhistory",
    },
    {
        label: "MODIFY CASHHANDLING RECORD",
        path: "/futuremodels/modifycashhandlingrecord",
    },
];

const FutureModalsPage = () => {
    const navigate = useNavigate();
    const [showStopChequePayment, setShowStopChequePayment] = useState(false);
    const [showLoanInterestRate, setShowLoanInterestRate] = useState(false);
    const [showInterestPosting, setShowInterestPosting] = useState(false);

    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-4">
                {FUTURE_MODEL_ACTIONS.map(({ label, path }) => (
                    <button
                        key={path}
                        type="button"
                        onClick={() => navigate(path)}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                    >
                        {label}
                    </button>
                ))}

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
            </div>

            {showStopChequePayment && (
                <StopChequePayment onClose={() => setShowStopChequePayment(false)} />
            )}

            {showLoanInterestRate && (
                <AddModifyLoanInterestRate onClose={() => setShowLoanInterestRate(false)} />
            )}

            {showInterestPosting && (
                <InterestPostingProcess onClose={() => setShowInterestPosting(false)} />
            )}
        </div>
    );
};

export default FutureModalsPage;
