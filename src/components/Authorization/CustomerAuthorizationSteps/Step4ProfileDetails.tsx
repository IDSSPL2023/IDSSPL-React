import { Coins, Building2, User, Calendar, IndianRupee } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SectionCard } from "@/components/shared/FormFields";
import ControlledField from "./ControlledField";
import type { CustomerAuthorizationFormValues } from "./formTypes";
import Image from "@/components/ui/Image";

export default function Step4ProfileDetails() {
  const { control } = useFormContext<CustomerAuthorizationFormValues>();

  return (
    <SectionCard
      titleEn="Profile Details"
      titleHi="प्रोफाइल तपशील"
      subtitleEn="Enter the customer's occupation, income, and account profile information."
      subtitleHi="ग्राहकाची व्यवसाय, उत्पन्न आणि खाते प्रोफाइल संबंधित माहिती भरा."
       icon={
                    <Image
                      src="/User.png" 
                      alt="User Icon" 
                      width={50} 
                      height={50} 
                    />
                  }
          >
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ControlledField control={control} name="purposeOfAccOpening" label="Purpose Of Acc. Opening" labelHi="खाते उघडण्याचा उद्देश" icon={<Coins size={16} />} placeholder="Enter Purpose of Acc. Opening" />
        <ControlledField control={control} name="workingInstName" label="Name Of the Working Inst./Comp." labelHi="कार्यरत संस्था / कंपनीचे नाव" icon={<Building2 size={16} />} placeholder="Name Of the Working Inst./Comp." />
        <ControlledField control={control} name="incomeSource" label="Income Source" labelHi="उत्पन्नाचा स्रोत" icon={<User size={16} />} placeholder="Enter Income Source" />
        <ControlledField control={control} name="openingYearSelfBusi" label="Opening Year Of the Self Busi." labelHi="स्वयं व्यवसाय सुरू केल्याचे वर्ष" icon={<Calendar size={16} />} placeholder="Enter Opening Year Of the Self Busi." />
        <ControlledField control={control} name="fixedYearlyIncome" label="Fixed Yearly Income" labelHi="वार्षिक निश्चित उत्पन्न" icon={<IndianRupee size={16} />} placeholder="Enter Yearly Income" />
        <ControlledField control={control} name="sixthMonthFixAmount" label="6th month Fix Amount" labelHi="मागील ६ महिन्यांतील सरासरी शिल्लक रक्कम" icon={<IndianRupee size={16} />} placeholder="Enter 6th month Fix Amount" />
      </div>
    </SectionCard>
  );
}
