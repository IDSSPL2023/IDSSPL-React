import React, { useState } from "react";
import {
  User,
  Landmark,
  Banknote,
  Check,
  X,
  ChevronsDown,
  Printer,
} from "lucide-react";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import TextInput from "@/components/shared/Inputs/TextInput";
import ListModal, { ListModalItem } from "@/components/shared/Modals/ListModal";
import { IMAGES } from "@/assets";

const USER_LIST_DATA: ListModalItem[] = [
  { id: "1", code: "CTS-001", name: "Main Branch, Bilagi" },
  { id: "2", code: "CTS-002", name: "Regional Branch, Pune" },
  { id: "3", code: "CTS-003", name: "Corporate Branch, Mumbai" },
];

export const UserDenominationTab: React.FC = () => {
  const [userId, setUserId] = useState("CTS");
  const [userName, setUserName] = useState("Main Branch, Bilagi");
  const [userListOpen, setUserListOpen] = useState(false);
  const [validated, setValidated] = useState(false);

  const [cashData, setCashData] = useState<
    Record<string, { count: number | string; checked: boolean }>
  >({
    "500": { count: 50, checked: true },
    "200": { count: 49, checked: true },
    "100": { count: 22, checked: true },
    "50": { count: 100, checked: true },
    "20": { count: 80, checked: true },
    "10": { count: 200, checked: true },
  });

  const [coinData, setCoinData] = useState<
    Record<string, { count: number | string; checked: boolean }>
  >({
    "20": { count: "To Chequebook Charg...", checked: true },
    "10": { count: "To Chequebook Charg...", checked: true },
    "5": { count: "To Chequebook Charg...", checked: true },
    "2": { count: "To Chequebook Charg...", checked: true },
    "1": { count: "To Chequebook Charg...", checked: true },
  });

  const [allCashChecked, setAllCashChecked] = useState(true);
  const [allCoinsChecked, setAllCoinsChecked] = useState(true);

  const cashDenominations = ["500", "200", "100", "50", "20", "10"];
  const coinDenominations = ["20", "10", "5", "2", "1"];

  const handleCashCountChange = (key: string, value: string) => {
    setCashData((prev) => ({
      ...prev,
      [key]: { ...prev[key], count: value },
    }));
    setValidated(false);
  };

  const handleCashCheckboxChange = (key: string) => {
    setCashData((prev) => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key].checked },
    }));
    setValidated(false);
  };

  const handleCoinCheckboxChange = (key: string) => {
    setCoinData((prev) => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key].checked },
    }));
    setValidated(false);
  };

  const toggleAllCash = () => {
    const nextState = !allCashChecked;
    setAllCashChecked(nextState);
    setCashData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => (updated[k].checked = nextState));
      return updated;
    });
    setValidated(false);
  };

  const toggleAllCoins = () => {
    const nextState = !allCoinsChecked;
    setAllCoinsChecked(nextState);
    setCoinData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => (updated[k].checked = nextState));
      return updated;
    });
    setValidated(false);
  };

  const handleOpenUserList = () => setUserListOpen(true);
  const handleUserSelect = (row: ListModalItem) => {
    setUserId(row.code);
    setUserName(row.name);
    setUserListOpen(false);
  };

  const handleValidate = () => {
    // Add validation logic here
    console.log("Validating denomination form...");
    
    // Check if userId is selected
    if (!userId || !userName) {
      alert("Please select a user!");
      setValidated(false);
      return;
    }
    
    setValidated(true);
    alert("Validation successful!");
  };

  const handleCancel = () => {
    setUserId("CTS");
    setUserName("Main Branch, Bilagi");
    setValidated(false);
    setCashData({
      "500": { count: 50, checked: true },
      "200": { count: 49, checked: true },
      "100": { count: 22, checked: true },
      "50": { count: 100, checked: true },
      "20": { count: 80, checked: true },
      "10": { count: 200, checked: true },
    });
    setCoinData({
      "20": { count: "To Chequebook Charg...", checked: true },
      "10": { count: "To Chequebook Charg...", checked: true },
      "5": { count: "To Chequebook Charg...", checked: true },
      "2": { count: "To Chequebook Charg...", checked: true },
      "1": { count: "To Chequebook Charg...", checked: true },
    });
    setAllCashChecked(true);
    setAllCoinsChecked(true);
  };

  const handleSave = () => {
    if (!validated) return;
    console.log("Saving denomination data...", {
      userId,
      userName,
      cashData,
      coinData,
    });
    alert("Data saved successfully!");
  };

  const handlePrintVoucher = () => {
    if (!validated) return;
    console.log("Printing voucher...");
    alert("Printing voucher...");
  };

  const calculateCashTotal = () => {
    let total = 0;
    Object.entries(cashData).forEach(([key, data]) => {
      if (data.checked) {
        const cnt = typeof data.count === "number" ? data.count : parseInt(data.count) || 0;
        total += parseInt(key) * cnt;
      }
    });
    return total;
  };

  const calculateCoinTotal = () => {
    let total = 0;
    Object.entries(coinData).forEach(([key, data]) => {
      if (data.checked) {
        const cnt = typeof data.count === "number" ? data.count : parseInt(data.count) || 0;
        total += parseInt(key) * cnt;
      }
    });
    return total;
  };

  const grandTotal = calculateCashTotal() + calculateCoinTotal();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="space-y-4">
        <SectionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <PickerInput
                labelEn="User Id"
                labelHi="चेक प्रकार"
                icon={User}
                placeholder="Select or enter User ID"
                value={userId}
                onChange={setUserId}
                required={true}
                handleOpenList={handleOpenUserList}
              />
            </div>
            <div>
              <TextInput
                labelEn="User Name"
                labelHi="शाखेचे नाव"
                icon={Landmark}
                placeholder="Enter User Name"
                value={userName}
                onChange={setUserName}
                readOnly={true}
                required={true}
              />
            </div>
          </div>
        </SectionWrapper>

        {userListOpen && (
          <ListModal
            title="User List"
            codeLabel="User ID"
            nameLabel="User Name"
            rows={USER_LIST_DATA}
            onSelect={handleUserSelect}
            onClose={() => setUserListOpen(false)}
          />
        )}

        {/* <SectionWrapper> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-[#1e1b4b] text-white px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <input
                    type="checkbox"
                    checked={allCashChecked}
                    onChange={toggleAllCash}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm font-semibold tracking-wide">Cash</span>
                </div>
                <span className="text-sm font-semibold tracking-wide pr-16">
                  Counts
                </span>
              </div>
              <div className="divide-y divide-slate-100 bg-[#f8fafc]/50">
                {cashDenominations.map((key) => {
                  const item = cashData[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between px-4 py-2 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-8">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleCashCheckboxChange(key)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-600 w-12">
                          {key}
                        </span>
                      </div>
                      <div className="relative w-48">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                          ₹
                        </span>
                        <input
                          type="text"
                          value={item.count}
                          disabled={!item.checked}
                          onChange={(e) => handleCashCountChange(key, e.target.value)}
                          className="w-full text-right pl-7 pr-3 py-1 text-sm border border-[#3b82f6] rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800 bg-white disabled:bg-slate-100 disabled:border-slate-200"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div className="bg-[#1e1b4b] text-white px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <input
                      type="checkbox"
                      checked={allCoinsChecked}
                      onChange={toggleAllCoins}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm font-semibold tracking-wide">Coins</span>
                  </div>
                  <span className="text-sm font-semibold tracking-wide pr-16">
                    Counts
                  </span>
                </div>
                <div className="divide-y divide-slate-100 bg-[#f8fafc]/50">
                  {coinDenominations.map((key) => {
                    const item = coinData[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between px-4 py-2 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-8">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleCoinCheckboxChange(key)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-slate-600 w-12">
                            {key}
                          </span>
                        </div>
                        <div className="relative w-48">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
                            ₹
                          </span>
                          <input
                            type="text"
                            value={item.count}
                            disabled={!item.checked}
                            className="w-full text-right pl-7 pr-3 py-1 text-xs border border-[#3b82f6] rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-600 truncate bg-white disabled:bg-slate-100 disabled:border-slate-200"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        {/* </SectionWrapper> */}

        {/* <SectionWrapper> */}
          <div className="bg-[#EEF2FF] rounded-xl px-6 py-3 flex items-center justify-between border border-blue-100">
            <span className="text-blue-600 font-bold text-sm">
              Denomination Amount
            </span>
            <div className="text-right">
              <span className="text-blue-500 text-xs block font-semibold mb-0.5">
                Amount
              </span>
              <span className="text-blue-700 text-2xl font-black tracking-tight">
                ₹ {grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        {/* </SectionWrapper> */}

        <SectionWrapper>
          {/* <div className="bg-white rounded-2xl border-2 border-[#2563eb] p-4 shadow-sm"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <TextInput
                labelEn="Cash Opening"
                labelHi="प्रारंभिक रोकड"
                icon={Banknote}
                placeholder="Enter Cash Opening"
                value="0"
                onChange={() => {}}
                readOnly={true}
                required={true}
              />
              <TextInput
                labelEn="Current Cash"
                labelHi="सध्याची रोकड"
                icon={Banknote}
                placeholder="Enter Current Cash"
                value="0"
                onChange={() => {}}
                readOnly={true}
                required={true}
              />
              <TextInput
                labelEn="Cash Deposit"
                labelHi="रोकड जमा"
                icon={Banknote}
                placeholder="Enter Cash Deposit"
                value="0"
                onChange={() => {}}
                readOnly={true}
                required={true}
              />
              <TextInput
                labelEn="Cash Withdrawal"
                labelHi="रोकड काढणे"
                icon={Banknote}
                placeholder="Enter Cash Withdrawal"
                value="0"
                onChange={() => {}}
                readOnly={true}
                required={true}
              />
            </div>
          {/* </div> */}
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
            Save <ChevronsDown size={14} />
          </button>
          <button
            type="button"
            disabled={!validated}
            onClick={handlePrintVoucher}
            className={`flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
              validated 
                ? "bg-[#10b981] text-white hover:bg-[#059669] shadow-sm" 
                : "bg-[#e2e8f0] text-slate-400 cursor-not-allowed"
            }`}
          >
            Print Voucher <Printer size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};