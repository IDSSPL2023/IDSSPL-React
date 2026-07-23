import { useState } from "react";
import CityPicklistField from "@/components/common/CityPicklistField";
import { useRouter } from "@/lib/navigation";
import GlobalNav from "@/components/GlobalMaster/GlobalNav";
import { Printer, Save, X, CheckCircle, Building2, Landmark, Hash, FileText, CreditCard, Banknote, MapPin, Users, DollarSign } from "lucide-react";
import TextInput from "@/components/shared/Inputs/TextInput";
import PickerInput from "@/components/shared/Inputs/PickerInput";
import ListModal, { type ListModalItem } from "@/components/shared/Modals/ListModal";
import SectionWrapper from "@/components/shared/Wrappers/SectionWrapper";

export default function DDMaintenancePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    branchCode: "",
    txnNo: "",
    issueDate: "",
    draftNo: "",
    bankCode: "",
    bankName: "",
    branchCode2: "",
    branchName: "",
    drawnOn: "",
    accountCode: "",
    accountName: "",
    city: "",
    amount: "",
    commissionAmount: "",
    inWords: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [openList, setOpenList] = useState(false);
  const [listType, setListType] = useState<string>("");

  // Mock data for pickers
  const BRANCH_DATA: ListModalItem[] = [
    { id: "1", code: "BR001", name: "Main Branch - Mumbai" },
    { id: "2", code: "BR002", name: "Corporate Branch - Delhi" },
    { id: "3", code: "BR003", name: "Regional Branch - Bangalore" },
    { id: "4", code: "BR004", name: "City Branch - Pune" },
    { id: "5", code: "BR005", name: "Town Branch - Nagpur" },
  ];

  const BANK_DATA: ListModalItem[] = [
    { id: "1", code: "SBI", name: "State Bank of India" },
    { id: "2", code: "HDFC", name: "HDFC Bank" },
    { id: "3", code: "ICICI", name: "ICICI Bank" },
    { id: "4", code: "AXIS", name: "Axis Bank" },
    { id: "5", code: "KOTAK", name: "Kotak Mahindra Bank" },
  ];

  const DRAWN_ON_DATA: ListModalItem[] = [
    { id: "1", code: "SBI", name: "State Bank of India" },
    { id: "2", code: "HDFC", name: "HDFC Bank" },
    { id: "3", code: "ICICI", name: "ICICI Bank" },
  ];

  const ACCOUNT_DATA: ListModalItem[] = [
    { id: "1", code: "ACC001", name: "Current Account - ABC Corp" },
    { id: "2", code: "ACC002", name: "Savings Account - XYZ Ltd" },
    { id: "3", code: "ACC003", name: "Current Account - PQR Pvt" },
  ];

  const CITY_DATA: ListModalItem[] = [
    { id: "1", code: "MUM", name: "Mumbai" },
    { id: "2", code: "DEL", name: "Delhi" },
    { id: "3", code: "BLR", name: "Bangalore" },
    { id: "4", code: "PUN", name: "Pune" },
    { id: "5", code: "NAG", name: "Nagpur" },
  ];

  const DRAFT_DATA: ListModalItem[] = [
    { id: "1", code: "DR001", name: "Draft 001" },
    { id: "2", code: "DR002", name: "Draft 002" },
    { id: "3", code: "DR003", name: "Draft 003" },
  ];

  const getListData = () => {
    switch (listType) {
      case "branchName":
        return {
          title: "Branch List",
          rows: BRANCH_DATA,
          codeLabel: "Branch Code",
          nameLabel: "Branch Name",
        };
      case "bankName":
        return {
          title: "Bank List",
          rows: BANK_DATA,
          codeLabel: "Bank Code",
          nameLabel: "Bank Name",
        };
      case "drawnOn":
        return {
          title: "Drawn On List",
          rows: DRAWN_ON_DATA,
          codeLabel: "Bank Code",
          nameLabel: "Bank Name",
        };
      case "accountName":
        return {
          title: "Account List",
          rows: ACCOUNT_DATA,
          codeLabel: "Account Code",
          nameLabel: "Account Name",
        };
      case "city":
        return {
          title: "City List",
          rows: CITY_DATA,
          codeLabel: "City Code",
          nameLabel: "City Name",
        };
      case "draftNo":
        return {
          title: "Draft List",
          rows: DRAFT_DATA,
          codeLabel: "Draft No",
          nameLabel: "Description",
        };
      default:
        return {
          title: "List",
          rows: [],
          codeLabel: "Code",
          nameLabel: "Name",
        };
    }
  };

  const listData = getListData();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handlePickerOpen = (field: string) => {
    setListType(field);
    setOpenList(true);
  };

  const handleSelectItem = (row: ListModalItem) => {
    switch (listType) {
      case "branchName":
        handleChange("branchName", row.name);
        handleChange("branchCode", row.code);
        break;
      case "bankName":
        handleChange("bankName", row.name);
        handleChange("bankCode", row.code);
        break;
      case "drawnOn":
        handleChange("drawnOn", row.name);
        break;
      case "accountName":
        handleChange("accountName", row.name);
        handleChange("accountCode", row.code);
        break;
      case "city":
        handleChange("city", row.name);
        break;
      case "draftNo":
        handleChange("draftNo", row.code);
        break;
      default:
        break;
    }
    setOpenList(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]?.trim()) {
        newErrors[key] = true;
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleValidate = () => {
    const isValid = validateForm();
    if (isValid) {
      console.log("Validation successful!");
    } else {
      console.log("Validation failed!");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePrint = () => {
    console.log("Printing...");
  };

  const handleSave = () => {
    const isValid = validateForm();
    if (isValid) {
      console.log("Saving...", formData);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#E7EAEF] no-scrollbar dark:bg-slate-950">
        <GlobalNav
          titleEn="DD Maintenance"
          titleHi="डिमांड ड्राफ्ट देखभाल"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "DD", href: "/dd" },
            { label: "DD Printing", href: "/dd/printing" },
            { label: "DD Maintenance", href: "#" },
          ]}
          onBack={() => router.back()}
        />

        <div className="w-full bg-white p-4">
          <SectionWrapper>
            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-900 sm:p-8">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {/* Row 1: Branch Code | Txn No | Issue Date | Draft No */}
                <PickerInput
                  labelEn="Branch Code"
                  labelHi="शाखा कोड"
                  icon={Hash}
                  placeholder="Enter Branch Code"
                  value={formData.branchCode}
                  onChange={(value) => handleChange("branchCode", value)}
                  hasError={errors.branchCode}
                  required={true}
                  handleOpenList={() => handlePickerOpen("branchName")}
                />

                <TextInput
                  labelEn="TxN No"
                  labelHi="व्यवहार क्रमांक"
                  icon={CreditCard}
                  placeholder="Enter Transaction No"
                  value={formData.txnNo}
                  onChange={(value) => handleChange("txnNo", value)}
                  hasError={errors.txnNo}
                  required={true}
                />

                <TextInput
                  labelEn="Issue Date"
                  labelHi="जारी दिनांक"
                  icon={FileText}
                  placeholder="Select Date"
                  value={formData.issueDate}
                  onChange={(value) => handleChange("issueDate", value)}
                  hasError={errors.issueDate}
                  required={true}
                />

                <PickerInput
                  labelEn="Draft No"
                  labelHi="डिमांड ड्राफ्ट क्रमांक"
                  icon={FileText}
                  placeholder="Enter Draft No"
                  value={formData.draftNo}
                  onChange={(value) => handleChange("draftNo", value)}
                  hasError={errors.draftNo}
                  required={true}
                  handleOpenList={() => handlePickerOpen("draftNo")}
                />

                {/* Row 2: Bank Code | Bank Name | Branch Code | Branch Name */}
                <PickerInput
                  labelEn="Bank Code"
                  labelHi="बैंक कोड"
                  icon={Building2}
                  placeholder="Enter Bank Code"
                  value={formData.bankCode}
                  onChange={(value) => handleChange("bankCode", value)}
                  hasError={errors.bankCode}
                  required={true}
                  handleOpenList={() => handlePickerOpen("bankName")}
                />

                <TextInput
                  labelEn="Bank Name"
                  labelHi="बैंक चे नाव"
                  icon={Landmark}
                  placeholder="Select Bank"
                  value={formData.bankName}
                  onChange={(value) => handleChange("bankName", value)}
                  hasError={errors.bankName}
                  required={true}
                  readOnly={true}
                />

                <PickerInput
                  labelEn="Branch Code"
                  labelHi="शाखा कोड"
                  icon={Hash}
                  placeholder="Enter Branch Code"
                  value={formData.branchCode2}
                  onChange={(value) => handleChange("branchCode2", value)}
                  hasError={errors.branchCode2}
                  required={true}
                  handleOpenList={() => handlePickerOpen("branchName")}
                />

                 <TextInput
                  labelEn="Branch Name"
                  labelHi="शाखेचे नाव"
                  icon={Building2}
                  placeholder="Select Branch"
                  value={formData.branchName}
                  onChange={(value) => handleChange("branchName", value)}
                  hasError={errors.branchName}
                  required={true}
                  readOnly={true}
                />


                {/* Row 3: Drawn On | Account Code | Account Name | City */}
                <PickerInput
                  labelEn="Drawn On"
                  labelHi="ज्या बैंकचे ड्राफ्ट काढला आहे"
                  icon={Banknote}
                  placeholder="Select Bank"
                  value={formData.drawnOn}
                  onChange={(value) => handleChange("drawnOn", value)}
                  hasError={errors.drawnOn}
                  required={true}
                  handleOpenList={() => handlePickerOpen("drawnOn")}
                />

                <PickerInput
                  labelEn="Account Code"
                  labelHi="खाते कोड"
                  icon={Hash}
                  placeholder="Enter Account Code"
                  value={formData.accountCode}
                  onChange={(value) => handleChange("accountCode", value)}
                  hasError={errors.accountCode}
                  required={true}
                  handleOpenList={() => handlePickerOpen("accountName")}
                />

                <TextInput
                  labelEn="Account Name"
                  labelHi="खातेदाराचे नाव"
                  icon={Users}
                  placeholder="Select Account"
                  value={formData.accountName}
                  onChange={(value) => handleChange("accountName", value)}
                  hasError={errors.accountName}
                  required={true}
                  readOnly={true}
                />

                 <CityPicklistField
                  label="City"
                  labelHi="शहर"
                  icon={<MapPin size={16} />}
                  placeholder="Select City"
                  value={formData.city}
                  onSelect={(city) => handleChange("city", city.name)}
                  error={errors.city ? "This field is required" : undefined}
                  required={true}
                />

                {/* Row 4: Amount | Commission Amount | In Words (full width) */}
                <TextInput
                  labelEn="Amount"
                  labelHi="रक्कम"
                  icon={DollarSign}
                  placeholder="Enter Amount"
                  value={formData.amount}
                  onChange={(value) => handleChange("amount", value)}
                  hasError={errors.amount}
                  required={true}
                />

                <TextInput
                  labelEn="Commission Amount"
                  labelHi="कमिशन रक्कम"
                  icon={DollarSign}
                  placeholder="Enter Commission"
                  value={formData.commissionAmount}
                  onChange={(value) => handleChange("commissionAmount", value)}
                  hasError={errors.commissionAmount}
                  required={true}
                />

                <div className="md:col-span-2">
                  <TextInput
                    labelEn="In Words"
                    labelHi="अक्षरी रक्कम"
                    icon={FileText}
                    placeholder="Amount in words"
                    value={formData.inWords}
                    onChange={(value) => handleChange("inWords", value)}
                    hasError={errors.inWords}
                    required={true}
                    readOnly={true}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleValidate}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-2.5 text-sm font-medium text-white transition-colors hover:secondary"
                >
                  <CheckCircle size={16} />
                  Validate
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary bg-white px-7 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-gray-50"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary bg-white px-7 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-gray-50"
                >
                  <Printer size={16} />
                  Print
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#EDF1FA] px-7 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </div>

      {/* List Modal */}
      {openList && listData && (
        <ListModal
          title={listData.title}
          rows={listData.rows}
          codeLabel={listData.codeLabel}
          nameLabel={listData.nameLabel}
          onSelect={handleSelectItem}
          onClose={() => setOpenList(false)}
        />
      )}
    </>
  );
}
