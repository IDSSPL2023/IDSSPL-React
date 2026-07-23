import { IMAGES } from "@/assets";
import { useState } from "react";
import CityPicklistField from "@/components/common/CityPicklistField";
import {
  User,
  IdCard,
  Building2,
  Phone,
  Mail,
  Home,
  Flag,
  Check,
  X,
  ChevronDown,
  MoreVertical,
  UserRound,
} from "lucide-react";
import Image from "@/components/ui/Image";
import FormModal from "@/components/shared/FormModal";
import {
  FieldShell,
  TextInput,
  RadioYesNo,
  SectionCard,
} from "@/components/shared/FormFields";
import BranchListPickerModal from "@/components/common/BranchPickListModal";
import SuccessModal from "@/components/shared/SuccessModal";
import { fetchPincodeDetails } from "@/lib/pincode";
import UserMasterTable from "@/components/UserMaster/UserMasterTable";
import { AppNavbar, FilterModal, CountryPicklistField } from "@/components/common";
import {
  type UserFilters,
  defaultValues,
} from "@/components/UserMaster/FilterModal";
import { userFilterFields } from "@/components/UserMaster/userFilterFields";
import { useBilingual } from "@/i18n/useBilingual";
import {
  hasActiveFilters,
  getActiveFilterSummary,
} from "@/components/shared/filterSummary";
import CustomerIdPicklistField, { type CustomerOption } from "@/components/common/CustomerIdPicklistField";

/* ===== from AddUserMaster.tsx ===== */
/* ===================== AddUserMaster_AddUserForm ===================== */

interface AddUserMaster_AddUserFormProps {
  onClose?: () => void;
}

function AddUserMaster_AddUserForm({
  onClose,
}: AddUserMaster_AddUserFormProps) {
  const [existingCustomer, setExistingCustomer] = useState<boolean>(true);
  const [isTeller, setIsTeller] = useState<boolean>(true);
  const [isMainCashier, setIsMainCashier] = useState<boolean>(false);
  const [isSupportUser, setIsSupportUser] = useState<boolean>(false);

  // Customer related state
  const [customerId, setCustomerId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerAddress1, setCustomerAddress1] = useState<string>("");
  const [customerAddress2, setCustomerAddress2] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  const [branchCode, setBranchCode] = useState<string>("0002");
  const [branchName, setBranchName] = useState<string>("Main Branch, Bilagi");
  const [branchPickerOpen, setBranchPickerOpen] = useState<boolean>(false);
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [currentAddress1, setCurrentAddress1] = useState("");
  const [currentAddress2, setCurrentAddress2] = useState("");
  const [currentAddress3, setCurrentAddress3] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const clearError = (key: string) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setIsValidated(false);
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!userId.trim()) nextErrors.userId = "User Id is required";
    if (!userName.trim()) nextErrors.userName = "User Name is required";
    if (existingCustomer && !customerId.trim()) {
      nextErrors.customerId = "Customer Id is required";
    }
    if (!employeeCode.trim())
      nextErrors.employeeCode = "Employee Code is required";
    if (!branchCode.trim()) nextErrors.branchCode = "Branch Code is required";
    if (!mobileNumber.trim()) {
      nextErrors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
      nextErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    if (!emailId.trim()) {
      nextErrors.emailId = "Email ID is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId.trim())) {
      nextErrors.emailId = "Enter a valid email address";
    }

    if (!currentAddress1.trim())
      nextErrors.currentAddress1 = "Current Address 1 is required";
    if (!zip.trim()) {
      nextErrors.zip = "Pin code is required";
    } else if (!/^\d{6}$/.test(zip.trim())) {
      nextErrors.zip = "Enter a valid 6-digit pin code";
    }
    if (!city.trim()) nextErrors.city = "City is required";
    if (!state.trim()) nextErrors.state = "State is required";
    if (!country.trim()) nextErrors.country = "Country is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const fetchPincode = async (pin: string) => {
    if (pin.length !== 6) return;

    try {
      setLoading(true);
      const details = await fetchPincodeDetails(pin);

      if (details) {
        setCity(details.city);
        setState(details.state);
        setCountry(details.country);
        setErrors((prev) => ({ ...prev, city: "", state: "", country: "" }));
      } else {
        setCity("");
        setState("");
        setCountry("");
        alert("Invalid Pincode");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer: CustomerOption) => {
    setCustomerId(customer.customerId);
    setCustomerName(customer.customerName);
    setCustomerAddress1(customer.address1);
    setCustomerAddress2(customer.address2);
    setCustomerPhone(customer.phoneMobile);

    // Auto-fill address fields if customer is selected and addresses are empty
    if (customer.address1 && !currentAddress1) {
      setCurrentAddress1(customer.address1);
    }
    if (customer.address2 && !currentAddress2) {
      setCurrentAddress2(customer.address2);
    }

    clearError("customerId");
  };

  const handleValidate = () => {
    const isValid = validate();

    if (isValid) {
      setIsValidated(true);
    } else {
      setIsValidated(false);
    }
  };

  const handleSave = () => {
    if (!isValidated) return;
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    onClose?.();
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title="User Created Successfully"
        subtitle=""
        onClose={handleSuccessDone}
        onDone={handleSuccessDone}
      />
    );
  }

  const grid4 = "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4";

  const footer = (
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

  return (
    <>
      <FormModal
        onClose={() => onClose?.()}
        titleEn="Add User"
        titleHi="वापरकर्ता तपशील"
        subtitleEn="Add some basic information related to the Employee"
        subtitleHi="कर्मचाऱ्याची बेसिक माहिती ॲड करा"
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        hideFooter
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
              value={existingCustomer}
              onChange={setExistingCustomer}
            />
          </div>

          <div className={grid4}>
            <FieldShell label="User Id" labelHi="वापरकर्ता आयडी" required>
              <TextInput
                icon={<User size={16} />}
                value={userId}
                onChange={(v) => {
                  setUserId(v);
                  clearError("userId");
                }}
                placeholder="Enter User ID"
                error={!!errors.userId}
              />
              {errors.userId && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.userId}
                </p>
              )}
            </FieldShell>

            <FieldShell label="User Name" labelHi="वापरकर्त्याचे नाव" required>
              <TextInput
                icon={<User size={16} />}
                value={userName}
                onChange={(v) => {
                  setUserName(v);
                  clearError("userName");
                }}
                placeholder="Enter User Name"
                error={!!errors.userName}
              />
              {errors.userName && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.userName}
                </p>
              )}
            </FieldShell>

            {/* Customer ID Field with Picklist */}
            <FieldShell label="Customer" labelHi="ग्राहक" required>
              {existingCustomer ? (
                <CustomerIdPicklistField
                  label=""
                  labelHi=""
                  icon={<UserRound size={18} />}
                  value={customerId}
                  onSelect={handleCustomerSelect}
                  preFetch={true}
                  error={
                    errors.customerId ? "This field is required" : undefined
                  }
                  placeholder="Search and select customer"
                  pageSize={3}
                />
              ) : (
                <TextInput
                  icon={<IdCard size={16} />}
                  value={customerId}
                  onChange={(v) => {
                    setCustomerId(v);
                    clearError("customerId");
                  }}
                  placeholder="Enter Customer ID"
                  error={!!errors.customerId}
                />
              )}
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.customerId}
                </p>
              )}
            </FieldShell>

            <FieldShell label="Employee Code" labelHi="कर्मचारी कोड" required>
              <TextInput
                icon={<IdCard size={16} />}
                value={employeeCode}
                onChange={(v) => {
                  setEmployeeCode(v);
                  clearError("employeeCode");
                }}
                placeholder="Enter Employee Code"
                error={!!errors.employeeCode}
              />
              {errors.employeeCode && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.employeeCode}
                </p>
              )}
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Branch Code" labelHi="शाखा कोड" required>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <TextInput
                    icon={<Building2 size={16} />}
                    value={branchCode}
                    onChange={() => {}}
                    readOnly
                    placeholder="Enter Branch Code"
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
              {errors.branchCode && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.branchCode}
                </p>
              )}
            </FieldShell>

            <FieldShell label="Branch Name" labelHi="शाखेचे नाव" required>
              <TextInput
                icon={<Building2 size={16} />}
                value={branchName}
                onChange={() => {}}
                readOnly
                placeholder="Main Branch, Bilagi"
              />
            </FieldShell>

            <FieldShell label="Mobile Number" labelHi="मोबाईल नंबर" required>
              <TextInput
                icon={<Phone size={16} />}
                value={mobileNumber}
                onChange={(v) => {
                  setMobileNumber(v);
                  clearError("mobileNumber");
                }}
                placeholder="Enter Mobile Number"
                error={!!errors.mobileNumber}
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.mobileNumber}
                </p>
              )}
            </FieldShell>

            <FieldShell label="Email ID" labelHi="ईमेल आयडी" required>
              <TextInput
                icon={<Mail size={16} />}
                value={emailId}
                onChange={(v) => {
                  setEmailId(v);
                  clearError("emailId");
                }}
                placeholder="Enter Email ID"
                error={!!errors.emailId}
              />
              {errors.emailId && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.emailId}
                </p>
              )}
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
            <FieldShell
              label="Current Address 1"
              labelHi="सध्याचा पत्ता १"
              required
            >
              <TextInput
                icon={<Home size={16} />}
                value={currentAddress1}
                onChange={(v) => {
                  setCurrentAddress1(v);
                  clearError("currentAddress1");
                }}
                placeholder="Enter Current Address 1"
                error={!!errors.currentAddress1}
              />
              {errors.currentAddress1 && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.currentAddress1}
                </p>
              )}
            </FieldShell>
            <FieldShell label="Current Address 2" labelHi="सध्याचा पत्ता २">
              <TextInput
                icon={<Home size={16} />}
                value={currentAddress2}
                onChange={setCurrentAddress2}
                placeholder="Enter Current Address 2"
              />
            </FieldShell>
            <FieldShell label="Current Address 3" labelHi="सध्याचा पत्ता ३">
              <TextInput
                icon={<Home size={16} />}
                value={currentAddress3}
                onChange={setCurrentAddress3}
                placeholder="Enter Current Address 3"
              />
            </FieldShell>
          </div>

          <div className={`${grid4} mt-4`}>
            <FieldShell label="Zip" labelHi="पिन कोड" required>
              <TextInput
                icon={<Home size={16} />}
                value={zip}
                onChange={(value: string) => {
                  const pin = value.replace(/\D/g, "");
                  setZip(pin);
                  clearError("zip");
                  if (pin.length === 6) fetchPincode(pin);
                }}
                placeholder="Enter Pin Code"
                error={!!errors.zip}
              />
              {errors.zip && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.zip}
                </p>
              )}
            </FieldShell>
            <FieldShell label="City" labelHi="शहरे" required>
              <CityPicklistField label="" icon={<Building2 size={16} />} value={city} onSelect={(selectedCity) => setCity(selectedCity.name)} error={errors.city} />
              {errors.city && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.city}</p>}
            </FieldShell>
            <FieldShell label="State" labelHi="राज्य" required>
              <TextInput
                icon={<Building2 size={16} />}
                value={state}
                onChange={() => {}}
                readOnly
                placeholder="Select State"
                error={!!errors.state}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {errors.state}
                </p>
              )}
            </FieldShell>
            <CountryPicklistField
              label="Country"
              labelHi="देश"
              icon={<Flag size={16} />}
              value={country}
              onSelect={(c) => {
                setCountry(c.name);
                clearError("country");
              }}
              placeholder="Select Country"
              required
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
              value={isTeller}
              onChange={setIsTeller}
            />
            <RadioYesNo
              label="Is Main Cashier"
              labelHi="मुख्य कॅशियर आहे का"
              value={isMainCashier}
              onChange={setIsMainCashier}
            />
            <RadioYesNo
              label="Is Support User"
              labelHi="सपोर्ट वापरकर्ता आहे का"
              value={isSupportUser}
              onChange={setIsSupportUser}
            />
          </div>
        </SectionCard>

        {footer}
      </FormModal>

      <BranchListPickerModal
        open={branchPickerOpen}
        onClose={() => setBranchPickerOpen(false)}
        onSelect={(branch) => {
          setBranchCode(branch.code);
          setBranchName(branch.name);
          clearError("branchCode");
        }}
      />
    </>
  );
}

/* ===================== AddUserModal ===================== */

export interface AddUserMaster_AddUserModalProps {
  open: boolean;
  onClose?: () => void;
}

function AddUserModal({ open, onClose }: AddUserMaster_AddUserModalProps) {
  if (!open) return null;

  return <AddUserMaster_AddUserForm onClose={onClose} />;
}

/* ===== from UserMasterPage.tsx ===== */
interface Breadcrumb {
  label: string;
  href: string;
}

const UserMasterPage = () => {
  const { t, en } = useBilingual();
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(defaultValues);

  const breadcrumbs: Breadcrumb[] = [
    { label: en("common.home"), href: "/" },
    { label: en("common.misActivity"), href: "#" },
    { label: en("userMaster.breadcrumb"), href: "/" },
  ];

  const handleResetFilters = () => {
    setFilters(defaultValues);
  };

  return (
    <div className="min-h-screen app-page-bg relative dark:bg-slate-950">
      <AppNavbar
        titleEn={en("userMaster.title")}
        titleHi={t("userMaster.title")}
        breadcrumbs={breadcrumbs}
        onBack={() => window.history.back()}
        onAdd={() => setOpenAddModal(true)}
        onFilter={() => setIsFilterOpen(true)}
        showActions
        hasActiveFilters={hasActiveFilters(filters)}
        activeFilterSummary={getActiveFilterSummary(filters)}
        onResetFilters={handleResetFilters}
      />

      <div className="px-3 py-2">
        <UserMasterTable filters={filters} />
      </div>

      {isFilterOpen && (
        <FilterModal
          fields={userFilterFields}
          initialValues={filters}
          onClose={() => setIsFilterOpen(false)}
          onApply={(newFilters) => setFilters(newFilters as UserFilters)}
        />
      )}

      {openAddModal && (
        <AddUserModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      )}
    </div>
  );
};

export default UserMasterPage;