import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardChart } from "./types";
import { statusColorFor, STATUS_COLORS } from "./statusColors";
import { useTheme } from "@/components/theme/ThemeProvider";

const chrome = {
  light: { grid: "#e1e0d9", axis: "#898781", text: "#52514E", surface: "#fcfcfb" },
  dark: { grid: "#2c2c2a", axis: "#898781", text: "#C3C2B7", surface: "#1a1a19" },
};

function ChartTooltip({
  active,
  payload,
  label,
  isDarkMode,
}: {
  active?: boolean;
  payload?: { value: number; name?: string; payload?: { name: string } }[];
  label?: string;
  isDarkMode: boolean;
}) {
  if (!active || !payload?.length) return null;
  const c = isDarkMode ? chrome.dark : chrome.light;
  return (
    <div
      style={{ background: c.surface, borderColor: c.grid }}
      className="rounded-lg border px-3 py-2 text-xs shadow-md"
    >
      <p className="mb-1 font-medium" style={{ color: c.text }}>
        {label ?? payload[0]?.payload?.name}
      </p>
      <p className="font-semibold text-[#0B0B0B] dark:text-white">
        {new Intl.NumberFormat("en-IN").format(payload[0].value)}
      </p>
    </div>
  );
}

function BarChartCard({ chart, isDarkMode }: { chart: DashboardChart; isDarkMode: boolean }) {
  const c = isDarkMode ? chrome.dark : chrome.light;
  const barColor = isDarkMode ? STATUS_COLORS.neutral.dark : STATUS_COLORS.neutral.light;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-[#0B0B0B] dark:text-white">{chart.title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chart.data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barCategoryGap={12}>
          <CartesianGrid vertical={false} stroke={c.grid} />
          <XAxis
            dataKey="name"
            tick={{ fill: c.axis, fontSize: 11 }}
            axisLine={{ stroke: c.grid }}
            tickLine={false}
          />
          <YAxis tick={{ fill: c.axis, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTooltip isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? "#ffffff0d" : "#0000000a" }} />
          <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PieChartCard({ chart, isDarkMode }: { chart: DashboardChart; isDarkMode: boolean }) {
  const c = isDarkMode ? chrome.dark : chrome.light;
  const data = chart.data.filter((d) => d.value > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-[#0B0B0B] dark:text-white">{chart.title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            stroke={c.surface}
            strokeWidth={2}
            label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={isDarkMode ? statusColorFor(entry.name).dark : statusColorFor(entry.name).light} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip isDarkMode={isDarkMode} />} />
          <Legend
            formatter={(value) => <span style={{ color: c.text, fontSize: 12 }}>{value}</span>}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const DashboardCharts = ({ charts }: { charts: DashboardChart[] }) => {
  const { isDarkMode } = useTheme();
  if (!charts?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {charts.map((chart) => {
        if (chart.type === "pie") return <PieChartCard key={chart.title} chart={chart} isDarkMode={isDarkMode} />;
        return <BarChartCard key={chart.title} chart={chart} isDarkMode={isDarkMode} />;
      })}
    </div>
  );
};

export default DashboardCharts;
