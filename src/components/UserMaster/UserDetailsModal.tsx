import { IMAGES } from "@/assets";
import { useEffect, useState } from "react";
import CityPicklistField from "@/components/common/CityPicklistField";
import { User, IdCard, Building2, Phone, Mail, Home, Flag, Check, X, ChevronDown, MoreVertical, ShieldCheck, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "../shared/FormModal";
import { FieldShell, TextInput, RadioYesNo, SectionCard } from "../shared/FormFields";
import CustomerIdPickerModal, { type Customer } from "../common/CustomerPickListModal";
import BranchListPickerModal, { type Branch } from "../common/BranchPickListModal";
import { CountryPicklistField } from "../common";

/* ===================== Shared types ===================== */

type Mode = "edit" | "view" | "authorize";

export interface UserFormData {
  existingCustomer: boolean;
  userId: string;
  userName: string;
  customerId: string;
  employeeCode: string;
  branchCode: string;
  branchName: string;
  mobileNumber: string;
  emailId: string;
  currentAddress1: string;
  currentAddress2: string;
  currentAddress3: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  isTeller: boolean;
  isMainCashier: boolean;
  isSupportUser: boolean;
}

/* ===================== Mode config ===================== */

interface ModeConfig {
  icon: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
}

const MODE_CONFIG: Record<Mode, ModeConfig> = {
  edit: {
    icon: IMAGES.USER,
    titleEn: "Edit User Details",
    titleHi: "वापरकर्त्याचे तपशील संपादित",
    descEn: "Edit some basic information related to the Employee",
    descHi: "कर्मचाऱ्याची बेसिक माहिती एडिट करा.",
  },
  view: {
    icon: IMAGES.USER,
    titleEn: "View User Details",
    titleHi: "वापरकर्त्याचे तपशील पहा",
    descEn: "Only can view some basic information related to the Employee",
    descHi: "कर्मचाऱ्याची मूलभूत माहिती पहा.",
  },
  authorize: {
    icon: IMAGES.USER,
    titleEn: "Authorize User",
    titleHi: "वापरकर्त्याला अधिकृत करा",
    descEn: "Check information related to the Employee and Authorize them.",
    descHi: "कर्मचाऱ्याची माहिती तपासा आणि त्यांना अधिकृत करा.",
  },
};

const DEFAULT_DATA: UserFormData = {
  existingCustomer: true,
  userId: "",
  userName: "",
  customerId: "",
  employeeCode: "",
  branchCode: "",
  branchName: "",
  mobileNumber: "",
  emailId: "",
  currentAddress1: "",
  currentAddress2: "",
  currentAddress3: "",
  zip: "",
  city: "",
  state: "",
  country: "",
  isTeller: true,
  isMainCashier: false,
  isSupportUser: false,
};

/* ===================== UserDetailsModal ===================== */

export interface UserDetailsModalProps {
  open: boolean;
  mode?: Mode;
  initialData?: Partial<UserFormData>;
  onClose?: () => void;
  onSubmit?: (data: UserFormData) => void;
  onReject?: (data: UserFormData) => void;
}

export default function UserDetailsModal({
  open,
  mode = "edit",
  initialData,
  onClose,
  onSubmit,
  onReject,
}: UserDetailsModalProps) {
  const [data, setData] = useState<UserFormData>({ ...DEFAULT_DATA, ...initialData });
  const [customerPickerOpen, setCustomerPickerOpen] = useState<boolean>(false);
  const [branchPickerOpen, setBranchPickerOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (open) {
      setData({ ...DEFAULT_DATA, ...initialData });
      setErrors({});
      setIsValidated(false);
    }
  }, [open, initialData]);

  if (!open) return null;

  const isView = mode !== "edit";
  const isEdit = mode === "edit";
  const config = MODE_CONFIG[mode] || MODE_CONFIG.edit;

  const clearError = (key: string) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setIsValidated(false);
  };

  const set =
    <K extends keyof UserFormData>(key: K) =>
    (val: UserFormData[K]) => {
      setData((prev) => ({ ...prev, [key]: val }));
      clearError(key);
    };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!data.userId.trim()) nextErrors.userId = "User Id is required";
    if (!data.userName.trim()) nextErrors.userName = "User Name is required";
    if (!data.existingCustomer && !data.customerId.trim()) {
      nextErrors.customerId = "Customer Id is required";
    }
    if (!data.employeeCode.trim()) nextErrors.employeeCode = "Employee Code is required";
    if (!data.branchCode.trim()) nextErrors.branchCode = "Branch Code is required";
    if (!data.mobileNumber.trim()) {
      nextErrors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(data.mobileNumber.trim())) {
      nextErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    if (!data.emailId.trim()) {
      nextErrors.emailId = "Email ID is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailId.trim())) {
      nextErrors.emailId = "Enter a valid email address";
    }

    if (!data.currentAddress1.trim()) nextErrors.currentAddress1 = "Current Address 1 is required";
    if (!data.zip.trim()) {
      nextErrors.zip = "Pin code is required";
    } else if (!/^\d{6}$/.test(data.zip.trim())) {
      nextErrors.zip = "Enter a valid 6-digit pin code";
    }
    if (!data.city.trim()) nextErrors.city = "City is required";
    if (!data.state.trim()) nextErrors.state = "State is required";
    if (!data.country.trim()) nextErrors.country = "Country is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleValidate = () => {
    setIsValidated(validate());
  };

  const handleSave = () => {
    if (!isValidated) return;
    onSubmit?.(data);
    onClose?.();
  };

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const editFooter = (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
      <button
        type="button"
        onClick={handleValidate}
        disabled={isValidated}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Validate <Check size={16} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
      >
        Cancel <X size={16} />
      </button>
      <button
        type="button"
        onClick={handleSave}
        disabled={!isValidated}
        className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save <ChevronDown size={16} />
      </button>
    </div>
  );

  const viewFooter = (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
      >
        Cancel <X size={16} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        OK, Got it <Check size={16} />
      </button>
    </div>
  );

  const authorizeFooter = (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={() => onReject?.(data)}
        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
      >
        Reject <ThumbsDown size={16} />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-lg border border-primary-500 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-50"
      >
        Cancel <X size={16} />
      </button>
      <button
        type="button"
        onClick={() => onSubmit?.(data)}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        Authorize <ThumbsUp size={16} />
      </button>
    </div>
  );

  return (
    <>
      <FormModal
        onClose={() => onClose?.()}
        titleEn={config.titleEn}
        titleHi={config.titleHi}
        subtitleEn={config.descEn}
        subtitleHi={config.descHi}
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
        headerIcon={
          mode === "authorize" ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
              <ShieldCheck size={24} />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center">
              <Image src={config.icon} alt={config.titleEn} width={50} height={50} />
            </div>
          )
        }
      >
        {/* User Details */}
        <SectionCard
          titleEn="User Details"
          titleHi="वापरकर्ता तपशील"
          subtitleEn="Add some basic information related to the Employee"
          subtitleHi="कर्मचाऱ्याशी संबंधित काही मूलभूत माहिती जोडा"
          icon={IMAGES.USER}
        >
          <div className="mb-4">
            <RadioYesNo
              label="Are You an Existing Customer?"
              labelHi="तुम्ही विद्यमान ग्राहक आहात का?"
              value={data.existingCustomer}
              onChange={(v) => {
                set("existingCustomer")(v);
                set("customerId")("");
              }}
              disabled={isView}
            />
          </div>

          <div className={grid4}>
            <FieldShell label="User Id" labelHi="वापरकर्ता आयडी" required>
              <TextInput icon={<User size={16} />} value={data.userId} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="User Name" labelHi="वापरकर्त्याचे नाव" required>
              <TextInput
                icon={<User size={16} />}
                value={data.userName}
                onChange={set("userName")}
                placeholder="Enter User Name"
                readOnly={isView}
              />
            </FieldShell>

            <FieldShell label="Customer Id" labelHi="ग्राहक आयडी" required>
              {isEdit && data.existingCustomer ? (
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <TextInput
                      icon={<IdCard size={16} />}
                      value={data.customerId}
                      onChange={() => {}}
                      readOnly
                      error={!!errors.customerId}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomerPickerOpen(true)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary hover:bg-primary-100"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              ) : (
                <TextInput
                  icon={<IdCard size={16} />}
                  value={data.customerId}
                  onChange={set("customerId")}
                  placeholder="Enter Customer ID"
                  readOnly={isView}
                  error={!!errors.customerId}
                />
              )}
              {errors.customerId && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.customerId}</p>}
            </FieldShell>

            <FieldShell label="Employee Code" labelHi="कर्मचारी कोड" required>
              <TextInput icon={<IdCard size={16} />} value={data.employeeCode} onChange={() => {}}  />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Branch Code" labelHi="शाखा कोड" required>
              {isEdit ? (
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <TextInput
                      icon={<Building2 size={16} />}
                      value={data.branchCode}
                      onChange={() => {}}
                      readOnly
                      error={!!errors.branchCode}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setBranchPickerOpen(true)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary hover:bg-primary-100"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              ) : (
                <TextInput
                  icon={<Building2 size={16} />}
                  value={data.branchCode}
                  onChange={() => {}}
                  readOnly
                  error={!!errors.branchCode}
                />
              )}
              {errors.branchCode && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.branchCode}</p>}
            </FieldShell>

            <FieldShell label="Branch Name" labelHi="शाखेचे नाव" required>
              <TextInput icon={<Building2 size={16} />} value={data.branchName} onChange={() => {}} readOnly />
            </FieldShell>

            <FieldShell label="Mobile Number" labelHi="मोबाईल नंबर" required>
              <TextInput
                icon={<Phone size={16} />}
                value={data.mobileNumber}
                onChange={set("mobileNumber")}
                placeholder="Enter Mobile Number"
                readOnly={isView}
              />
            </FieldShell>

            <FieldShell label="Email ID" labelHi="ईमेल आयडी" required>
              <TextInput
                icon={<Mail size={16} />}
                value={data.emailId}
                onChange={set("emailId")}
                placeholder="Enter Email ID"
                readOnly={isView}
              />
            </FieldShell>
          </div>
        </SectionCard>

        {/* Address Details */}
        <SectionCard
          titleEn="Address Details"
          titleHi="पत्ता तपशील"
          subtitleEn="Add some basic information related to the Employee Address"
          subtitleHi="कर्मचाऱ्याच्या पत्त्याशी संबंधित काही मूलभूत माहिती जोडा."
          icon={IMAGES.ADDRESS}
        >
      
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FieldShell label="Current Address 1" labelHi="सध्याचा पत्ता १" required>
              <TextInput
                icon={<Home size={16} />}
                value={data.currentAddress1}
                onChange={set("currentAddress1")}
                placeholder="Enter Current Address 1"
                readOnly={isView}
              />
            </FieldShell>
            <FieldShell label="Current Address 2" labelHi="सध्याचा पत्ता २">
              <TextInput
                icon={<Home size={16} />}
                value={data.currentAddress2}
                onChange={set("currentAddress2")}
                placeholder="Enter Current Address 2"
                readOnly={isView}
              />
            </FieldShell>
            <FieldShell label="Current Address 3" labelHi="सध्याचा पत्ता ३">
              <TextInput
                icon={<Home size={16} />}
                value={data.currentAddress3}
                onChange={set("currentAddress3")}
                placeholder="Enter Current Address 3"
                readOnly={isView}
              />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Zip" labelHi="पिन कोड" required>
              <TextInput
                icon={<Home size={16} />}
                value={data.zip}
                onChange={set("zip")}
                placeholder="Enter Pin Code"
                readOnly={isView}
              />
            </FieldShell>
            <FieldShell label="City" labelHi="शहरे" required>
              <CityPicklistField label="" icon={<Building2 size={16} />} value={data.city} onSelect={(city) => set("city")(city.name)} readOnly={isView} />
            </FieldShell>
            <FieldShell label="State" labelHi="राज्य" required>
              <TextInput
                icon={<Building2 size={16} />}
                value={data.state}
                onChange={set("state")}
                placeholder="Select State"
                readOnly={isView}
              />
            </FieldShell>
            <CountryPicklistField
              label="Country"
              labelHi="देश"
              icon={<Flag size={16} />}
              value={data.country}
              onSelect={(c) => set("country")(c.name)}
              placeholder="Select Country"
              required
              readOnly={isView}
              error={errors.country}
            />
          </div>
        </SectionCard>

        {/* Roles */}
        <SectionCard
          titleEn="Roles"
          titleHi="भूमिका तपशील"
          subtitleEn="Configure employee access roles and operational responsibilities"
          subtitleHi="कर्मचाऱ्याच्या प्रवेश भूमिका आणि कार्यात्मक जबाबदाऱ्या कॉन्फिगर करा."
          icon={IMAGES.ROLES}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RadioYesNo
              label="Is Teller"
              labelHi="टेलर आहे का"
              value={data.isTeller}
              onChange={set("isTeller")}
              disabled={isView}
            />
            <RadioYesNo
              label="Is Main Cashier"
              labelHi="मुख्य कॅशियर आहे का"
              value={data.isMainCashier}
              onChange={set("isMainCashier")}
              disabled={isView}
            />
            <RadioYesNo
              label="Is Support User"
              labelHi="सपोर्ट वापरकर्ता आहे का"
              value={data.isSupportUser}
              onChange={set("isSupportUser")}
              disabled={isView}
            />
          </div>
        </SectionCard>

        {mode === "authorize" ? authorizeFooter : mode === "view" ? viewFooter : editFooter}
      </FormModal>

      {isEdit && (
        <>
          <CustomerIdPickerModal
            open={customerPickerOpen}
            onClose={() => setCustomerPickerOpen(false)}
            onSelect={(customer: Customer) => setData((prev) => ({ ...prev, customerId: customer.id }))}
          />
          <BranchListPickerModal
            open={branchPickerOpen}
            onClose={() => setBranchPickerOpen(false)}
            onSelect={(branch: Branch) =>
              setData((prev) => ({ ...prev, branchCode: branch.code, branchName: branch.name }))
            }
          />
        </>
      )}
    </>
  );
}
