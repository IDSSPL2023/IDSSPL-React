import React, { useState } from "react";
import {
  Clock,
  Code,
  Building2,
  Calendar,
  Check,
  X,
  FileText,
  Play,
  ChevronsDown,
} from "lucide-react";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import TextInput from "@/components/shared/Inputs/TextInput";
import DateInput from "@/components/shared/Inputs/DateInput";
import { ICONS, IMAGES } from "@/assets";

export const SIExecutionTab: React.FC = () => {
  const [validated, setValidated] = useState(false);

  const [siForm, setSiForm] = useState<Record<string, string>>({
    branchCode: "0002",
    branchName: "Main Branch, Bilagi",
    systemDate: "2026-07-20",
  });

  const handleSiFormChange = (key: string, value: string) => {
    setSiForm((prev) => ({ ...prev, [key]: value }));
    setValidated(false);
  };

  const handleValidate = () => {
    console.log("Validating SI form...", siForm);
    
    // Check if required fields are filled
    if (!siForm.branchCode || !siForm.branchName || !siForm.systemDate) {
      alert("Please fill all required fields!");
      setValidated(false);
      return;
    }
    
    setValidated(true);
    alert("Validation successful!");
  };

  const handleReport = () => {
    if (!validated) return;
    console.log("Generating report...", siForm);
    alert("Report generated successfully!");
  };

  const handleCancel = () => {
    setValidated(false);
    setSiForm({
      branchCode: "0002",
      branchName: "Main Branch, Bilagi",
      systemDate: "2026-07-20",
    });
  };

  const handleExecuteSI = () => {
    if (!validated) return;
    console.log("Executing SI...", siForm);
    alert("SI executed successfully!");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <img 
          src={ICONS.FRAME} 
          alt="SI Execution" 
          className="object-contain"
        />
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            SI Execution / स्वयंचलित व्यवहार अंमलबजावणी
          </h2>
          <p className="text-sm text-gray-500">
            Manage and execute standing instructions / स्वयंचलित व्यवहार व्यवस्थापित करा
          </p>
        </div>
      </div>

      <SectionWrapper>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <img 
              src={IMAGES.USER} 
              alt="System" 
              className="object-contain"
            />
            System Details / प्रणाली तपशील
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              labelEn="Branch Code"
              labelHi="शाखा कोड"
              icon={ICONS.BANK}
              placeholder="Enter Branch Code"
              value={siForm.branchCode || ""}
              onChange={(v) => handleSiFormChange("branchCode", v)}
              readOnly={false}
              required={true}
            />
            <TextInput
              labelEn="Branch Name"
              labelHi="शाखेचे नाव"
              icon={ICONS.BANK}
              placeholder="Enter Branch Name"
              value={siForm.branchName || ""}
              onChange={(v) => handleSiFormChange("branchName", v)}
              readOnly={true}
              required={true}
            />
            <DateInput
              labelEn="System Date"
              labelHi="संगणकीय तारीख"
              icon={Calendar}
              placeholder="Select System Date"
              value={siForm.systemDate || ""}
              onChange={(v) => handleSiFormChange("systemDate", v)}
              required={true}
              readOnly={true}
            />
          </div>
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
          disabled={!validated}
          onClick={handleReport}
          className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-md shadow-sm transition-all duration-200 ${
            validated 
              ? "bg-[#0b66c2] hover:bg-[#0a58a8] text-white" 
              : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
          }`}
        >
          Report <FileText size={14} />
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
          onClick={handleExecuteSI}
          className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
            validated 
              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" 
              : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
          }`}
        >
          Execute SI <Play size={14} />
        </button>
      </div>
    </div>
  );
};

export default SIExecutionTab;