import React, { useState } from "react";
import {
  Users,
  Code,
  Building2,
  User,
  Check,
  X,
  Eye,
  SquarePen,
  UserRoundCog,
  ChevronsDown,
} from "lucide-react";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import ReusableTable, { TableColumn } from "./components/ReusableTable";
import ReusableForm, { FormField } from "./components/ReusableForm";
import ToggleButtons, { ToggleOption } from "./components/ToggleButtons";
import PageHeader from "./components/PageHeader";
import RowActionMenuItem from "@/components/shared/RowActionMenu";
import StatusPill, { StatusPillTone } from "@/components/shared/StatusPill";
import { ICONS, IMAGES } from "@/assets";

interface AgentRow {
  srNo: number;
  agentId: string;
  agentType: string;
  agentName: string;
  branchCode: string;
  branchName: string;
  status: string;
}

export const AgentTab: React.FC = () => {
  const [agentView, setAgentView] = useState<"list" | "add">("list");
  const [sortKey, setSortKey] = useState<keyof AgentRow | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [validated, setValidated] = useState(false);

  const [agentRows, setAgentRows] = useState<AgentRow[]>([
    {
      srNo: 1,
      agentId: "AGT001",
      agentType: "1-Pigmy Agent",
      agentName: "Balaganvi Ramanna Rajappa",
      branchCode: "0002",
      branchName: "Main Branch, Bilagi",
      status: "Active",
    },
    {
      srNo: 2,
      agentId: "AGT002",
      agentType: "2-Pigmy Agent",
      agentName: "Shivappa Mallappa",
      branchCode: "0002",
      branchName: "Main Branch, Bilagi",
      status: "Active",
    },
    {
      srNo: 3,
      agentId: "AGT003",
      agentType: "3-Pigmy Agent",
      agentName: "Basavaraj Patil",
      branchCode: "0003",
      branchName: "City Branch, Belgaum",
      status: "Inactive",
    },
  ]);

  const [agentForm, setAgentForm] = useState<Record<string, string>>({
    branchCode: "0002",
    branchName: "Main Branch, Bilagi",
    agentId: "",
    agentType: "",
    agentName: "",
  });

  const toggleOptions: ToggleOption[] = [
    { key: "list", label: "Agent List" },
    { key: "add", label: "Add Agent" },
  ];

  const columns: TableColumn<AgentRow>[] = [
    { key: "srNo", label: "Sr No.", sortable: false, width: "80px" },
    { key: "branchCode", label: "Branch Code", sortable: true, width: "120px" },
    { key: "branchName", label: "Branch Name", sortable: true, width: "180px" },
    { key: "agentId", label: "Agent ID", sortable: true, width: "120px" },
    { key: "agentType", label: "Agent Type", sortable: true, width: "160px" },
    { key: "agentName", label: "Agent Name", sortable: true, width: "200px", emphasize: true },
    { key: "status", label: "Status", sortable: true, width: "120px" },
  ];

  const branchFields: FormField[] = [
    {
      id: "branchCode",
      type: "text",
      labelEn: "Branch Code",
      labelHi: "शाखा कोड",
      icon: Code,
      placeholder: "Enter Branch Code",
      key: "branchCode",
      readOnly: true,
      required: true,
    },
    {
      id: "branchName",
      type: "text",
      labelEn: "Branch Name",
      labelHi: "शाखेचे नाव",
      icon: Building2,
      placeholder: "Enter Branch Name",
      key: "branchName",
      readOnly: true,
      required: true,
    },
  ];

  const agentFields: FormField[] = [
    {
      id: "agentId",
      type: "text",
      labelEn: "Agent ID",
      labelHi: "एजंट आयडी",
      icon: User,
      placeholder: "Enter Agent ID",
      key: "agentId",
      required: true,
    },
    {
      id: "agentType",
      type: "text",
      labelEn: "Agent Type",
      labelHi: "एजंट प्रकार",
      icon: Users,
      placeholder: "Enter Agent Type",
      key: "agentType",
      required: true,
    },
    {
      id: "agentName",
      type: "text",
      labelEn: "Agent Name",
      labelHi: "एजंटचे नाव",
      icon: User,
      placeholder: "Enter Agent Name",
      key: "agentName",
      required: true,
    },
  ];

  const handleSort = (key: keyof AgentRow) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleAgentFormChange = (key: string, value: string) => {
    setAgentForm((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
  };

  // const getAgentMenuItems = (row: AgentRow): RowActionMenuItem[] => [
  //   {
  //     key: "view",
  //     label: "View",
  //     icon: Eye,
  //     onClick: () => console.log("View:", row),
  //   },
  //   {
  //     key: "edit",
  //     label: "Edit",
  //     icon: SquarePen,
  //     onClick: () => console.log("Edit:", row),
  //   },
  //   {
  //     key: "status",
  //     label: "Update Status",
  //     icon: UserRoundCog,
  //     onClick: () => console.log("Update Status:", row),
  //   },
  // ];

  const getStatusTone = (row: AgentRow): StatusPillTone => {
    return row.status === "Active" ? "success" : "rejected";
  };

  const handleValidate = () => {
    const requiredFields = ["agentId", "agentType", "agentName"];
    const isValid = requiredFields.every(field => agentForm[field]?.trim());
    
    if (isValid) {
      setValidated(true);
      alert("Validation successful!");
    } else {
      setValidated(false);
      alert("Please fill all required fields!");
    }
  };

  const handleCancel = () => {
    setAgentView("list");
    setValidated(false);
    setAgentForm({
      branchCode: "0002",
      branchName: "Main Branch, Bilagi",
      agentId: "",
      agentType: "",
      agentName: "",
    });
  };

  const handleAddAgent = () => {
    if (!validated) return;
    
    const newAgent: AgentRow = {
      srNo: agentRows.length + 1,
      agentId: agentForm.agentId || `AGT${String(agentRows.length + 1).padStart(3, "0")}`,
      agentType: agentForm.agentType || "1-Pigmy Agent",
      agentName: agentForm.agentName || "New Agent",
      branchCode: agentForm.branchCode || "0002",
      branchName: agentForm.branchName || "Main Branch, Bilagi",
      status: "Active",
    };
    setAgentRows([...agentRows, newAgent]);
    handleCancel();
  };

  const sortedRows = [...agentRows].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA == null || valB == null) return 0;
    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleToggleChange = (key: string) => {
    setAgentView(key as "list" | "add");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          icon={ICONS.FRAME}
          iconAlt="Agent"
          titleEn="Agent Management"
          titleHi="प्रतिनिधी व्यवस्थापन"
          subtitleEn={agentView === "list" ? "Agent List" : "Add Agent"}
          subtitleHi={agentView === "list" ? "प्रतिनिधी सूची" : "नवीन प्रतिनिधी नोंदवा"}
        />
        <ToggleButtons
          options={toggleOptions}
          activeKey={agentView}
          onChange={handleToggleChange}
        />
      </div>

      {agentView === "list" ? (
        <ReusableTable
          columns={columns}
          data={sortedRows}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSort={handleSort}
          // getMenuItems={getAgentMenuItems}
          getStatusTone={getStatusTone}
          statusKey="status"
          emptyMessage="No agents found"
        />
      ) : (
        <div>
          <SectionWrapper>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <img src={IMAGES.USER} alt="Branch" className="object-contain" />
                Branch Details / शाखेचा तपशील
              </h3>
              <ReusableForm
                fields={branchFields}
                values={agentForm}
                onChange={handleAgentFormChange}
                columns={2}
              />
            </div>
          </SectionWrapper>

          <div className="border-t border-gray-200 my-6"></div>

          <SectionWrapper>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <img src={IMAGES.ADDRESS} alt="Agent" className="object-contain" />
                Agent Details / एजंट तपशील
              </h3>
              <ReusableForm
                fields={agentFields}
                values={agentForm}
                onChange={handleAgentFormChange}
                columns={3}
              />
            </div>
          </SectionWrapper>

          <div className="flex items-center justify-end gap-3 mt-6 pb-1 flex-wrap">
            <button
              type="button"
              onClick={handleValidate}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#0b66c2] hover:bg-[#0a58a8] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Validate <Check size={14} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              Cancel <X size={14} />
            </button>
            <button
              type="button"
              disabled={!validated}
              onClick={handleAddAgent}
              className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                validated 
                  ? "bg-[#1F67F4] text-white hover:bg-[#0E57EA] shadow-sm" 
                  : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
              }`}
            >
              Save <ChevronsDown size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};