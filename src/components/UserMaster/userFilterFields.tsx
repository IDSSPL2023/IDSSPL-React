import { ShieldCheck, Hash, UserRound, CalendarDays } from "lucide-react";
import type { FilterFieldDef } from "@/components/common";
import { USER_ROLE_OPTIONS } from "./FilterModal";

/**
 * Field config for the common `FilterModal` — matches the "Filter" reference
 * screenshot (User ID / User Role / Created Date / Status) exactly. First
 * consumer: `pages/UserMasterPage.tsx`.
 */
export const userFilterFields: FilterFieldDef[] = [
  {
    id: "userId",
    label: "User ID",
    type: "text",
    placeholder: "User ID",
    icon: <Hash size={18} className="text-primary" />,
  },
  {
    id: "role",
    label: "User Role",
    type: "select",
    placeholder: "User Role",
    icon: <UserRound size={18} className="text-primary" />,
    options: USER_ROLE_OPTIONS.map((role) => ({ value: role, label: role })),
  },
  {
    id: "createdDate",
    label: "Created Date",
    type: "date",
    placeholder: "Created Date",
    icon: <CalendarDays size={18} className="text-primary" />,
  },
  {
    id: "status",
    label: "Status",
    type: "status",
    icon: <ShieldCheck size={18} className="text-primary" />,
    options: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
  },
];
