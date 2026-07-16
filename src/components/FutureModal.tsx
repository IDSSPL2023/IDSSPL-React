import { useNavigate } from "react-router-dom";

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
            </div>
        </div>
    );
};

export default FutureModalsPage;