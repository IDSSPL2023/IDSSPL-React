export type DashboardCard = {
  title: string;
  value: number | string;
  description?: string;
};

export type DashboardChart = {
  type: "bar" | "pie" | "line" | string;
  title: string;
  data: { name: string; value: number }[];
};

export type DashboardTable = {
  title: string;
  columns: string[];
  rows: (string | number)[][];
};

export type DashboardResponse = {
  title: string;
  subtitle?: string;
  cards: DashboardCard[];
  charts: DashboardChart[];
  tables: DashboardTable[];
  insights?: string[];
  alerts?: string[];
  actions?: string[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  dashboard?: DashboardResponse;
};
