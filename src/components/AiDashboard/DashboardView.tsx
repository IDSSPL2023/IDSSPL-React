import { AlertTriangle, Lightbulb, ListChecks } from "lucide-react";
import type { DashboardResponse } from "./types";
import StatCards from "./StatCards";
import DashboardCharts from "./DashboardCharts";
import DashboardTables from "./DashboardTables";

const NoteList = ({
  title,
  icon,
  items,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  tone: "info" | "warning";
}) => {
  if (!items?.length) return null;
  const toneClass =
    tone === "warning"
      ? "border-[#fab219]/30 bg-[#fab219]/10 text-[#7a4e00] dark:text-[#fab219]"
      : "border-[#2a78d6]/30 bg-[#2a78d6]/10 text-[#184f95] dark:text-[#9ec5f4]";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <ul className="list-inside list-disc space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const DashboardView = ({ data }: { data: DashboardResponse }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-[#0B0B0B] dark:text-white">{data.title}</h2>
        {data.subtitle ? (
          <p className="text-sm text-[#52514E] dark:text-[#C3C2B7]">{data.subtitle}</p>
        ) : null}
      </div>

      {data.cards?.length ? <StatCards cards={data.cards} /> : null}
      <DashboardCharts charts={data.charts} />
      <DashboardTables tables={data.tables} />

      {data.insights?.length ? (
        <NoteList title="Insights" icon={<Lightbulb size={16} />} items={data.insights} tone="info" />
      ) : null}
      {data.alerts?.length ? (
        <NoteList title="Alerts" icon={<AlertTriangle size={16} />} items={data.alerts} tone="warning" />
      ) : null}
      {data.actions?.length ? (
        <NoteList title="Suggested actions" icon={<ListChecks size={16} />} items={data.actions} tone="info" />
      ) : null}
    </div>
  );
};

export default DashboardView;
