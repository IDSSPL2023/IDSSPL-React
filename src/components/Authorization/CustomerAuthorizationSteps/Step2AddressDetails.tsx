// components/Authorization/CustomerAuthorizationSteps/Step2AddressDetails.tsx

import { Flag, Home, Phone, Hash, Building2, MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SectionCard, RadioYesNo } from "@/components/shared/FormFields";
import ControlledField from "./ControlledField";
import {
  RESIDENCE_TYPE_OPTIONS,
  RESIDENCE_STATUS_OPTIONS,
  CITY_OPTIONS,
  STATE_OPTIONS,
  COUNTRY_OPTIONS,
  type CustomerAuthorizationFormValues,
} from "./formTypes";
import Image from "@/components/ui/Image";

export default function Step2AddressDetails() {
  const { control, watch, setValue } = useFormContext<CustomerAuthorizationFormValues>();
  
  // Watch for toggle states (you'll need to add these to your form types)
  const sameAsCurrent = watch("sameAsCurrent");
  const sameAsResidential = watch("sameAsResidential");

  return (
    <div className="space-y-4">
      {/* Current Address Section */}
      <SectionCard
        titleEn="Current Address Details"
        titleHi="सध्याचा पत्ता तपशील"
        subtitleEn="Manage residential address information."
        subtitleHi="ग्राहकाच्या निवास पत्त्याची माहिती व्यवस्थापित करा."
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
            name="nationality" 
            label="Nationality" 
            labelHi="राष्ट्रीयत्व" 
            icon={<Flag size={16} />} 
            placeholder="Enter Nationality" 
          />
          <ControlledField
            control={control}
            name="residenceType"
            kind="select"
            label="Residence Type"
            labelHi="निवासाचा प्रकार"
            icon={<Home size={16} />}
            options={[...RESIDENCE_TYPE_OPTIONS]}
            placeholder="Select Residence Type"
          />
          <ControlledField
            control={control}
            name="residenceStatus"
            kind="select"
            label="Residence Status"
            labelHi="निवास स्थिती"
            icon={<Home size={16} />}
            options={[...RESIDENCE_STATUS_OPTIONS]}
            placeholder="Select Residence Status"
          />
          <ControlledField 
            control={control} 
            name="residencePhone" 
            label="Residence Phone" 
            labelHi="निवासस्थानी दूरध्वनी क्रमांक" 
            icon={<Phone size={16} />} 
            placeholder="Enter Residence Phone" 
          />
          <ControlledField 
            control={control} 
            name="address1" 
            label="Address 1" 
            labelHi="पत्ता १" 
            icon={<Home size={16} />} 
            placeholder="Enter Address 1" 
            required
          />
          <ControlledField 
            control={control} 
            name="address2" 
            label="Address 2" 
            labelHi="पत्ता २" 
            icon={<Home size={16} />} 
            placeholder="Enter Address 2" 
            required
          />
          <ControlledField 
            control={control} 
            name="address3" 
            label="Address 3" 
            labelHi="पत्ता ३" 
            icon={<Home size={16} />} 
            placeholder="Enter Address 3" 
            required
          />
          <ControlledField 
            control={control} 
            name="zip" 
            label="Zip" 
            labelHi="पिन कोड" 
            icon={<Hash size={16} />} 
            placeholder="Enter Pin Code" 
            required
          />
          <ControlledField
            control={control}
            name="city"
            kind="select"
            label="City"
            labelHi="शहर"
            icon={<Building2 size={16} />}
            options={[...CITY_OPTIONS]}
            placeholder="Select City"
            required
          />
          <ControlledField
            control={control}
            name="state"
            kind="select"
            label="State"
            labelHi="राज्य"
            icon={<Building2 size={16} />}
            options={[...STATE_OPTIONS]}
            placeholder="Select State"
            required
          />
          <ControlledField
            control={control}
            name="country"
            kind="select"
            label="Country"
            labelHi="देश"
            icon={<Flag size={16} />}
            options={[...COUNTRY_OPTIONS]}
            placeholder="Select Country"
            required
          />
        </div>
      </SectionCard>

      {/* Permanent Address Section */}
      <SectionCard
        titleEn="Permanent Address Details"
        titleHi="कायमचा पत्ता तपशील"
        subtitleEn="Manage permanent address information."
        subtitleHi="ग्राहकाचा कायमचा पत्ता व्यवस्थापित करा."
        icon={
          <Image
            src="/Address.png" 
            alt="Permanent Address Icon" 
            width={50} 
            height={50} 
          />
        }
      >
        <div className="mt-2">
          <RadioYesNo
            label="Is Permanent Address Same as Current Address"
            labelHi="सध्याचा पत्ता आणि कायमचा पत्ता समान आहे का"
            value={sameAsCurrent}
            onChange={(v) => setValue("sameAsCurrent", v)}
          />
          
          {!sameAsCurrent && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ControlledField 
                control={control} 
                name="permanentAddress1" 
                label="Address 1" 
                labelHi="पत्ता १" 
                icon={<Home size={16} />} 
                placeholder="Enter Address 1" 
                required
              />
              <ControlledField 
                control={control} 
                name="permanentAddress2" 
                label="Address 2" 
                labelHi="पत्ता २" 
                icon={<Home size={16} />} 
                placeholder="Enter Address 2" 
                required
              />
              <ControlledField 
                control={control} 
                name="permanentAddress3" 
                label="Address 3" 
                labelHi="पत्ता ३" 
                icon={<Home size={16} />} 
                placeholder="Enter Address 3" 
                required
              />
              <ControlledField 
                control={control} 
                name="permanentZip" 
                label="Zip" 
                labelHi="पिन कोड" 
                icon={<Hash size={16} />} 
                placeholder="Enter Pin Code" 
                required
              />
              <ControlledField
                control={control}
                name="permanentCity"
                kind="select"
                label="City"
                labelHi="शहर"
                icon={<Building2 size={16} />}
                options={[...CITY_OPTIONS]}
                placeholder="Select City"
                required
              />
              <ControlledField
                control={control}
                name="permanentState"
                kind="select"
                label="State"
                labelHi="राज्य"
                icon={<Building2 size={16} />}
                options={[...STATE_OPTIONS]}
                placeholder="Select State"
                required
              />
              <ControlledField
                control={control}
                name="permanentCountry"
                kind="select"
                label="Country"
                labelHi="देश"
                icon={<Flag size={16} />}
                options={[...COUNTRY_OPTIONS]}
                placeholder="Select Country"
                required
              />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Office Address Section */}
      <SectionCard
        titleEn="Office Address Details"
        titleHi="कार्यालयाचा पत्ता तपशील"
        subtitleEn="Enter the customer's office address and workplace contact information."
        subtitleHi="ग्राहकाचा कार्यालयीन पत्ता आणि कार्यस्थळ संपर्क माहिती भरा."
        icon={
          <Image
            src="/Address.png" 
            alt="Office Address Icon" 
            width={50} 
            height={50} 
          />
        }
      >
        <div className="mt-2">
          <RadioYesNo
            label="Is Office Address Same as Residential Address"
            labelHi="कार्यालयाचा पत्ता आणि निवासी पत्ता समान आहे का"
            value={sameAsResidential}
            onChange={(v) => setValue("sameAsResidential", v)}
          />
          
          {!sameAsResidential && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ControlledField 
                control={control} 
                name="officeAddress1" 
                label="Address 1" 
                labelHi="पत्ता १" 
                icon={<MapPin size={16} />} 
                placeholder="Enter Address 1" 
                required
              />
              <ControlledField 
                control={control} 
                name="officeAddress2" 
                label="Address 2" 
                labelHi="पत्ता २" 
                icon={<MapPin size={16} />} 
                placeholder="Enter Address 2" 
                required
              />
              <ControlledField 
                control={control} 
                name="officeAddress3" 
                label="Address 3" 
                labelHi="पत्ता ३" 
                icon={<MapPin size={16} />} 
                placeholder="Enter Address 3" 
                required
              />
              <ControlledField 
                control={control} 
                name="officeZip" 
                label="Zip" 
                labelHi="पिन कोड" 
                icon={<Hash size={16} />} 
                placeholder="Enter Pin Code" 
                required
              />
              <ControlledField
                control={control}
                name="officeCity"
                kind="select"
                label="City"
                labelHi="शहर"
                icon={<Building2 size={16} />}
                options={[...CITY_OPTIONS]}
                placeholder="Select City"
                required
              />
              <ControlledField
                control={control}
                name="officeState"
                kind="select"
                label="State"
                labelHi="राज्य"
                icon={<Building2 size={16} />}
                options={[...STATE_OPTIONS]} 
                placeholder="Select State"
                required
              />
              <ControlledField
                control={control}
                name="officeCountry"
                kind="select"
                label="Country"
                labelHi="देश"
                icon={<Flag size={16} />}
                options={[...COUNTRY_OPTIONS]}
                placeholder="Select Country"
                required
              />
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}