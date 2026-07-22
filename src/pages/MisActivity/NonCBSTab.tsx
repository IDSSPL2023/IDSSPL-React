import React, { useState } from "react";
import {
  Calendar,
  Check,
  X,
  ChevronDown,
  ChevronsDown,
} from "lucide-react";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import TextInput from "@/components/shared/Inputs/TextInput";
import DateInput from "@/components/shared/Inputs/DateInput";
import RadioInput from "@/components/shared/Inputs/RadioInput";
import { ICONS, IMAGES } from "@/assets";

interface BranchField {
  id: string;
  type: string;
  labelEn: string;
  labelHi: string;
  icon: string;
  placeholder: string;
  key: string;
  readOnly?: boolean;
  options?: string[];
}

interface ToggleField {
  id: string;
  label: string;
  labelHi: string;
  key: string;
}

interface DateField {
  id: string;
  labelEn: string;
  labelHi: string;
  key: string;
  required?: boolean;
}

export const NonCBSTab: React.FC = () => {
  const [branchDetails, setBranchDetails] = useState<Record<string, string>>({
    bankCode: "00021010000008",
    bankName: "Swami Vivekanand Printing Pres",
    branchCode: "010",
    branchName: "",
    address1: "",
    address2: "",
    address3: "",
    zipCode: "",
    cityCode: "",
    state: "",
    country: "",
    emailId: "",
  });

  const [toggleStates, setToggleStates] = useState<Record<string, string>>({
    isDayBeginExecuted: "Yes",
    isDayEndExecuted: "Yes",
    isDenominationRequired: "No",
    isYearAutoRenewal: "Yes",
    isSBInterestPost: "No",
    isCAInterestPost: "No",
    isTDInterestPost: "No",
    isTLInterestPost: "No",
    isCCInterestPost: "No",
    isImplemented: "No",
  });

  const [dateStates, setDateStates] = useState<Record<string, string>>({
    sbNextInterestPostingDate: "",
    caNextInterestPostingDate: "",
    ccNextInterestPostingDate: "",
    tlNextInterestPostingDate: "",
    tdNextInterestPostingDate: "",
    sbInterestCalculateFromDate: "",
    sbInterestCalculateToDate: "",
    tdNextInterestPayUptoDate: "",
    tlNextInterestPayUptoDate: "",
    ccNextInterestPayUptoDate: "",
    yearBeginDate: "",
    yearEndDate: "",
  });

  const [validated, setValidated] = useState<boolean>(false);

  const branchFields: BranchField[] = [
    {
      id: "bankCode",
      type: "text",
      labelEn: "Bank Code",
      labelHi: "बॅक कोड",
      icon: ICONS.BANK,
      placeholder: "Enter Bank Code",
      key: "bankCode",
      readOnly: false,
    },
    {
      id: "bankName",
      type: "text",
      labelEn: "Bank Name",
      labelHi: "बॅकेचे नाव",
      icon: ICONS.BANK,
      placeholder: "Enter Bank Name",
      key: "bankName",
      readOnly: false,
    },
    {
      id: "branchCode",
      type: "text",
      labelEn: "Branch Code",
      labelHi: "शाखा कोड",
      icon: ICONS.BANK,
      placeholder: "Enter Branch Code",
      key: "branchCode",
      readOnly: false,
    },
    {
      id: "branchName",
      type: "text",
      labelEn: "Branch Name",
      labelHi: "शाखेचे नाव",
      icon: ICONS.BANK,
      placeholder: "Enter Branch Name",
      key: "branchName",
    },
  ];

  const toggleFields: ToggleField[] = [
    {
      id: "isDayBeginExecuted",
      label: "Is Day Begin Executed",
      labelHi: "दिवस प्रारंभ",
      key: "isDayBeginExecuted",
    },
    {
      id: "isDayEndExecuted",
      label: "Is Day End Executed",
      labelHi: "दिवस समाप्त",
      key: "isDayEndExecuted",
    },
    {
      id: "isDenominationRequired",
      label: "Is Denomination Required",
      labelHi: "चलन तपशील",
      key: "isDenominationRequired",
    },
    {
      id: "isYearAutoRenewal",
      label: "Is Year Auto Renewal At Day Begin",
      labelHi: "वर्ष नूतनीकरण",
      key: "isYearAutoRenewal",
    },
    {
      id: "isSBInterestPost",
      label: "Is SB Interest Post At Day End",
      labelHi: "एसबी व्याज पोस्ट",
      key: "isSBInterestPost",
    },
    {
      id: "isCAInterestPost",
      label: "Is CA Interest Post At Day End",
      labelHi: "सीए व्याज पोस्ट",
      key: "isCAInterestPost",
    },
    {
      id: "isTDInterestPost",
      label: "Is TD Interest Post At Day End",
      labelHi: "TD व्याज पोस्ट",
      key: "isTDInterestPost",
    },
    {
      id: "isTLInterestPost",
      label: "Is TL Interest Post At Day End",
      labelHi: "TL व्याज पोस्ट",
      key: "isTLInterestPost",
    },
    {
      id: "isCCInterestPost",
      label: "Is CC Interest Post At Day End",
      labelHi: "CC व्याज पोस्ट",
      key: "isCCInterestPost",
    },
  ];

  const dateFields: DateField[] = [
    {
      id: "sbNextInterestPostingDate",
      labelEn: "SB Next Interest Posting Date",
      labelHi: "SB पुढील व्याज तारीख",
      key: "sbNextInterestPostingDate",
      required: true,
    },
    {
      id: "caNextInterestPostingDate",
      labelEn: "CA Next Interest Posting Date",
      labelHi: "CA पुढील व्याज तारीख",
      key: "caNextInterestPostingDate",
      required: true,
    },
    {
      id: "ccNextInterestPostingDate",
      labelEn: "CC Next Interest Posting Date",
      labelHi: "CC पुढील व्याज तारीख",
      key: "ccNextInterestPostingDate",
      required: true,
    },
    {
      id: "tlNextInterestPostingDate",
      labelEn: "TL Next Interest Posting Date",
      labelHi: "TL पुढील व्याज तारीख",
      key: "tlNextInterestPostingDate",
      required: true,
    },
    {
      id: "tdNextInterestPostingDate",
      labelEn: "TD Next Interest Posting Date",
      labelHi: "TD पुढील व्याज तारीख",
      key: "tdNextInterestPostingDate",
      required: true,
    },
    {
      id: "sbInterestCalculateFromDate",
      labelEn: "SB Interest Calculate From Date",
      labelHi: "SB व्याज प्रारंभ",
      key: "sbInterestCalculateFromDate",
      required: true,
    },
    {
      id: "sbInterestCalculateToDate",
      labelEn: "SB Interest Calculate To Date",
      labelHi: "SB व्याज समाप्त",
      key: "sbInterestCalculateToDate",
      required: true,
    },
    {
      id: "tdNextInterestPayUptoDate",
      labelEn: "TD Next Interest Pay Upto Date",
      labelHi: "TD व्याज देय तारीख",
      key: "tdNextInterestPayUptoDate",
      required: true,
    },
    {
      id: "tlNextInterestPayUptoDate",
      labelEn: "TL Next Interest Pay Upto Date",
      labelHi: "TL व्याज देय तारीख",
      key: "tlNextInterestPayUptoDate",
      required: true,
    },
    {
      id: "ccNextInterestPayUptoDate",
      labelEn: "CC Next Interest Pay Upto Date",
      labelHi: "CC व्याज देय तारीख",
      key: "ccNextInterestPayUptoDate",
      required: true,
    },
    {
      id: "yearBeginDate",
      labelEn: "Year Begin Date",
      labelHi: "वर्ष प्रारंभ तारीख",
      key: "yearBeginDate",
      required: true,
    },
    {
      id: "yearEndDate",
      labelEn: "Year End Date",
      labelHi: "वर्ष समाप्त तारीख",
      key: "yearEndDate",
      required: true,
    },
  ];

  const handleToggleChange = (key: string, value: string) => {
    setToggleStates((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (key: string, value: string) => {
    setDateStates((prev) => ({ ...prev, [key]: value }));
  };

  const handleValidate = () => {
    // Add your validation logic here
    console.log("Validating...");
    setValidated(true);
    // You can also add toast notifications here
  };

  const handleSave = () => {
    if (validated) {
      console.log("Saving data...", {
        branchDetails,
        toggleStates,
        dateStates,
      });
      // Add your save logic here
    }
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    setValidated(false);
    // Reset form logic here
  };

  const renderField = (field: BranchField) => {
    if (field.type === "text") {
      return (
        <TextInput
          key={field.id}
          labelEn={field.labelEn}
          labelHi={field.labelHi}
          icon={field.icon}
          placeholder={field.placeholder}
          value={branchDetails[field.key] || ""}
          onChange={(value: string) =>
            setBranchDetails((prev) => ({ ...prev, [field.key]: value }))
          }
          readOnly={field.readOnly || false}
        />
      );
    }
    return null;
  };

  const renderToggleField = (field: ToggleField) => {
    return (
      <div key={field.id} className="p-4 rounded-xl">
        <RadioInput
          label={field.label}
          labelHi={field.labelHi}
          value={toggleStates[field.key] || "Yes"}
          onChange={(value: string) => handleToggleChange(field.key, value)}
          options={[{ value: "Yes" }, { value: "No" }]}
          orientation="horizontal"
        />
      </div>
    );
  };

  const renderDateField = (field: DateField) => {
    return (
      <DateInput
        key={field.id}
        labelEn={field.labelEn}
        labelHi={field.labelHi}
        icon={Calendar}
        placeholder="Select Date"
        value={dateStates[field.key] || ""}
        onChange={(value: string) => handleDateChange(field.key, value)}
        required={field.required || false}
      />
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <SectionWrapper>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <img 
                src={IMAGES.USER} 
                alt="Bank" 
                className="object-contain"
              />
              Branch Details / शाखेचा तपशील
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {branchFields.map((field) => renderField(field))}
          </div>
        </div>
      </SectionWrapper>

      <div className="border-t border-gray-200 my-6"></div>

      <SectionWrapper>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <img 
              src={IMAGES.ADDRESS} 
              alt="Settings" 
              className="object-contain"
            />
            Details / तपशील
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {toggleFields.slice(0, 3).map((field) => renderToggleField(field))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {toggleFields.slice(3, 6).map((field) => renderToggleField(field))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {toggleFields.slice(6, 9).map((field) => renderToggleField(field))}
          </div>
        </div>
      </SectionWrapper>

      <div className="border-t border-gray-200 my-6"></div>

      <SectionWrapper>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <img 
              src={IMAGES.ADDRESS} 
              alt="Calendar" 
              className="object-contain"
            />
            Interest Posting Details / व्याज पोस्टिंग तपशील
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {dateFields.slice(0, 3).map((field) => renderDateField(field))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {dateFields.slice(3, 6).map((field) => renderDateField(field))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {dateFields.slice(6, 9).map((field) => renderDateField(field))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dateFields.slice(9, 12).map((field) => renderDateField(field))}
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
          onClick={handleCancel}
          className="flex items-center gap-1.5 px-5 py-2 bg-white border border-[#0b66c2] text-[#0b66c2] hover:bg-slate-50 text-xs font-semibold rounded-md shadow-sm transition-all duration-200"
        >
          Cancel <X size={14} />
        </button>
        <button
          type="button"
          disabled={!validated}
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
            validated 
              ? "bg-[#1F67F4] text-white hover:bg-[#0E57EA] shadow-sm" 
              : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
          }`}
        >
          Modify <ChevronsDown size={14} />
        </button>
      </div>
    </div>
  );
};