import React from "react";
import { useBilingual } from "@/i18n/useBilingual";
import ProvisonAndVlcc from "@/components/StashModal/Tds/ProvisonAndVlcc";
import BranchAreaSubAreaModal from "@/components/StashModal/BranchAreaSubArea";

const DashboardPage = () => {
  const { t, en } = useBilingual();
  return (
    <div>
      {en("dashboard.title")}{" "}
      {t("dashboard.title") ? (
        <span className="text-gray-500 dark:text-slate-400">
          / {t("dashboard.title")}
        </span>
      ) : null}
      <ProvisonAndVlcc open onClose={() => {}} />
    </div>
  );
};

export default DashboardPage;
