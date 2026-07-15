// components/Authorization/CustomerAuthorizationSteps/Step1CustomerDetails.tsx

import { User, IdCard, Heart, Baby, Car, AlertTriangle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SectionCard, RadioYesNo } from "@/components/shared/FormFields";
import ControlledField from "./ControlledField";
import type { CustomerAuthorizationFormValues } from "./formTypes";
import Image from "@/components/ui/Image";

const SALUTATIONS = ["MR", "MRS", "MS", "DR"] as const;
const GENDERS = ["Male", "Female", "Other"] as const;
const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"] as const;
const GUARDIAN_RELATIONS = ["Father", "Mother", "Uncle", "Aunt", "Other"] as const;
const VEHICLE_OPTIONS = ["Yes", "No"] as const;
const RISK_CATEGORIES = ["Low", "Medium", "High"] as const;
const CATEGORY_CODES = ["Public", "Private", "Staff"] as const;

export default function Step1CustomerDetails() {
  const { control, setValue, watch } = useFormContext<CustomerAuthorizationFormValues>();
  const isMinor = watch("isMinor");

  return (
    <div className="space-y-4">
      <SectionCard
        titleEn="Personal Details"
        titleHi="वैयक्तिक तपशील"
        subtitleEn="Manage customer's personal and identity information."
        subtitleHi="ग्राहकाची वैयक्तिक व ओळख संबंधित माहिती व्यवस्थापित करा."
        icon={
          <Image
            src="/User.png"
            alt="User Icon"
            width={50}
            height={50}
          />
        }
      >
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ControlledField
            control={control}
            name="salutation"
            kind="select"
            label="Salutation Code"
            labelHi="संबोधन कोड"
            icon={<User size={16} />}
            options={[...SALUTATIONS]}
            placeholder="Select Salutation Code"
            required
          />
          <ControlledField
            control={control}
            name="firstName"
            label="First Name"
            labelHi="पहिले नाव"
            icon={<User size={16} />}
            placeholder="Enter First Name"
            required
          />
          <ControlledField
            control={control}
            name="middleName"
            label="Middle Name"
            labelHi="मधले नाव"
            icon={<User size={16} />}
            placeholder="Enter Middle Name"
          />
          <ControlledField
            control={control}
            name="surname"
            label="Surname"
            labelHi="आडनाव"
            icon={<User size={16} />}
            placeholder="Enter Surname"
            required
          />
          <ControlledField
            control={control}
            name="fullName"
            label="Full Name"
            labelHi="पूर्ण नाव"
            icon={<User size={16} />}
            placeholder="Enter Full Name"
            required
          />
          <ControlledField
            control={control}
            name="gender"
            kind="select"
            label="Gender"
            labelHi="लिंग"
            icon={<User size={16} />}
            options={[...GENDERS]}
            placeholder="Enter Gender"
            required
          />
          <ControlledField
            control={control}
            name="dob"
            label="Date of Birth"
            labelHi="जन्मतारीख"
            placeholder="YYYY-MM-DD"
            required
          />
          <ControlledField
            control={control}
            name="regDate"
            label="Registration Date"
            labelHi="नोंदणी दिनांक"
            placeholder="YYYY-MM-DD"
            required
          />
          <ControlledField
            control={control}
            name="motherName"
            label="Mother Name"
            labelHi="आईचे नाव"
            icon={<User size={16} />}
            placeholder="Enter Mother Name"
            required
          />
          <ControlledField
            control={control}
            name="fatherName"
            label="Father Name"
            labelHi="वडिलांचे नाव"
            icon={<User size={16} />}
            placeholder="Enter Father Name"
            required
          />
          <ControlledField
            control={control}
            name="maritalStatus"
            kind="select"
            label="Marital Status"
            labelHi="वैवाहिक स्थिती"
            icon={<Heart size={16} />}
            options={[...MARITAL_STATUS]}
            placeholder="Select Marital Status"
            required
          />
          <ControlledField
            control={control}
            name="noOfChildren"
            label="No. of Children"
            labelHi="मुलांची संख्या"
            icon={<Baby size={16} />}
            placeholder="Enter Number of Children"
          />
          
          <div className="col-span-1">
            <RadioYesNo
              label="Is Minor"
              labelHi="अल्पवयीन आहे का"
              value={isMinor}
              onChange={(v) => {
                setValue("isMinor", v);
              }}
            />
          </div>
          
          {isMinor && (
            <>
              <ControlledField
                control={control}
                name="guardianName"
                label="Guardian Name"
                labelHi="पालकाचे नाव"
                icon={<User size={16} />}
                placeholder="Enter Guardian Name"
                required
              />
              <ControlledField
                control={control}
                name="guardianRelation"
                kind="select"
                label="Relation with Guardian"
                labelHi="पालकाशी नाते"
                icon={<User size={16} />}
                options={[...GUARDIAN_RELATIONS]}
                placeholder="Select Relation with Guardian"
                required
              />
            </>
          )}
        </div>
      </SectionCard>

      <SectionCard
        titleEn="KYC & Compliance Details"
        titleHi="केवायसी व अनुपालन तपशील"
        subtitleEn="Manage customer's KYC and compliance information."
        subtitleHi="ग्राहकाची केवायसी व अनुपालन संबंधित माहिती व्यवस्थापित करा."
        icon={
          <Image
            src="/Address.png"
            alt="Address Icon"
            width={50}
            height={50}
          />
        }
      >
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ControlledField
            control={control}
            name="panNumber"
            label="PAN Number"
            labelHi="PAN क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter PAN Number"
            required
          />
          <ControlledField
            control={control}
            name="aadhaarNumber"
            label="Aadhaar Number"
            labelHi="आधार क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter Aadhar Number"
            required
          />
          <ControlledField
            control={control}
            name="passportNumber"
            label="Passport Number"
            labelHi="पासपोर्ट क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter Passport Number"
          />
          <ControlledField
            control={control}
            name="ckycNumber"
            label="CKYC Number"
            labelHi="CKYC क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter CKYC Number"
          />
          <ControlledField
            control={control}
            name="gstinNumber"
            label="GSTIN Number"
            labelHi="GSTIN क्रमांक"
            icon={<IdCard size={16} />}
            placeholder="Enter GSTIN Number"
          />
          <ControlledField
            control={control}
            name="religionCode"
            label="Religion Code"
            labelHi="धर्म कोड"
            icon={<IdCard size={16} />}
            placeholder="Enter Religion Code"
          />
          <ControlledField
            control={control}
            name="casteCode"
            label="Caste Code"
            labelHi="जात कोड"
            icon={<IdCard size={16} />}
            placeholder="Enter Caste Code"
          />
        </div>
        
        {/* Radio buttons for Form 60, 61, 15G, 15H */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <RadioYesNo
            label="Form 60"
            labelHi="फॉर्म ६०"
            value={watch("form60")}
            onChange={(v) => setValue("form60", v)}
          />
          <RadioYesNo
            label="Form 61"
            labelHi="फॉर्म ६१"
            value={watch("form61")}
            onChange={(v) => setValue("form61", v)}
          />
          <RadioYesNo
            label="Form 15 G"
            labelHi="फॉर्म १५G"
            value={watch("form15G")}
            onChange={(v) => setValue("form15G", v)}
          />
          <RadioYesNo
            label="Form 15 H"
            labelHi="फॉर्म १५H"
            value={watch("form15H")}
            onChange={(v) => setValue("form15H", v)}
          />
        </div>
      </SectionCard>

      <SectionCard
        titleEn="Customer Classification & Profile"
        titleHi="ग्राहक वर्गीकरण व प्रोफाइल"
        subtitleEn="Manage customer's classification and profile information."
        subtitleHi="ग्राहकाचे वर्गीकरण व प्रोफाइल संबंधित माहिती व्यवस्थापित करा."
        icon={
          <Image
            src="/Address.png"
            alt="Address Icon"
            width={50}
            height={50}
          />
        }
      >
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ControlledField
            control={control}
            name="categoryCode"
            kind="select"
            label="Category Code"
            labelHi="वर्ग कोड"
            icon={<IdCard size={16} />}
            options={[...CATEGORY_CODES]}
            placeholder="Enter Category Code"
            required
          />
          <ControlledField
            control={control}
            name="subCategoryCode"
            label="Sub Category Code"
            labelHi="उपवर्ग कोड"
            icon={<User size={16} />}
            placeholder="Enter Sub Category Code"
            required
          />
          <ControlledField
            control={control}
            name="occupationCode"
            label="Occupation Code"
            labelHi="व्यवसाय कोड"
            icon={<IdCard size={16} />}
            placeholder="Enter Occupation Code"
            required
          />
          <ControlledField
            control={control}
            name="constitutionCode"
            label="Constitution Code"
            labelHi="संविधान प्रकार"
            icon={<IdCard size={16} />}
            placeholder="Enter Constitution Code"
            required
          />
          <ControlledField
            control={control}
            name="customerGroupCode"
            label="Customer Group Code"
            labelHi="ग्राहक गट कोड"
            icon={<IdCard size={16} />}
            placeholder="Enter Customer Group Code"
            required
          />
          <ControlledField
            control={control}
            name="memberType"
            label="Member Type"
            labelHi="सदस्य प्रकार"
            icon={<User size={16} />}
            placeholder="Enter Member Type"
            required
          />
          <ControlledField
            control={control}
            name="vehicleOwned"
            kind="select"
            label="Vehicle Owned"
            labelHi="वाहन मालकी"
            icon={<Car size={16} />}
            options={[...VEHICLE_OPTIONS]}
            placeholder="Select Vehicle Owned"
            required
          />
          <ControlledField
            control={control}
            name="riskCategory"
            kind="select"
            label="Risk Category"
            labelHi="जोखीम श्रेणी"
            icon={<AlertTriangle size={16} />}
            options={[...RISK_CATEGORIES]}
            placeholder="Select Risk Category"
            required
          />
        </div>
      </SectionCard>
    </div>
  );
}