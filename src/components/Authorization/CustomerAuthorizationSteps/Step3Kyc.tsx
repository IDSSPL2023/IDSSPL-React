// components/Authorization/CustomerAuthorizationSteps/Step3Kyc.tsx

import { useFormContext } from "react-hook-form";
import { SectionCard, DocumentRow } from "@/components/shared/FormFields";
import {
  ID_PROOF_DOCS,
  ADDRESS_PROOF_DOCS,
  PARTNERSHIP_DOCS,
  BUSINESS_CONCERN_1_DOCS,
  BUSINESS_CONCERN_2_DOCS,
  PROPRIETARY_DOCS,
  type CustomerAuthorizationFormValues,
  type DocState,
} from "./formTypes";
import Image from "@/components/ui/Image";

export default function Step3Kyc() {
  const { watch, setValue } = useFormContext<CustomerAuthorizationFormValues>();
  const idProof = watch("idProof");
  const addressProof = watch("addressProof");
  const partnershipDocs = watch("partnershipDocs");
  const businessConcern1Docs = watch("businessConcern1Docs");
  const businessConcern2Docs = watch("businessConcern2Docs");
  const proprietaryDocs = watch("proprietaryDocs");

  const updateDoc = (
    section: "idProof" | "addressProof" | "partnershipDocs" | "businessConcern1Docs" | "businessConcern2Docs" | "proprietaryDocs",
    key: string,
    patch: Partial<DocState>
  ) => {
    let current;
    switch (section) {
      case "idProof":
        current = idProof[key];
        break;
      case "addressProof":
        current = addressProof[key];
        break;
      case "partnershipDocs":
        current = partnershipDocs[key];
        break;
      case "businessConcern1Docs":
        current = businessConcern1Docs[key];
        break;
      case "businessConcern2Docs":
        current = businessConcern2Docs[key];
        break;
      case "proprietaryDocs":
        current = proprietaryDocs[key];
        break;
    }
    (setValue as (name: string, value: DocState) => void)(`${section}.${key}`, { ...current, ...patch });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* ID Proof Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Savings Account (ID Proof)"
          titleHi="बचत खाते (ओळख पुरावा)"
          icon={
            <Image
              src="/User.png"
              alt="ID Proof Icon"
              width={50}
              height={50}
            />
          }
        >
          {ID_PROOF_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={idProof[doc.key]?.checked || false}
              expiryDate={idProof[doc.key]?.expiryDate || ""}
              documentNumber={idProof[doc.key]?.documentNumber || ""}
              onCheck={(v) => updateDoc("idProof", doc.key, { checked: v })}
              onExpiryChange={(v) => updateDoc("idProof", doc.key, { expiryDate: v })}
              onDocNumberChange={(v) => updateDoc("idProof", doc.key, { documentNumber: v })}
            />
          ))}
        </SectionCard>
      </div>

      {/* User Proof Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Savings Account (User Proof)"
          titleHi="बचत खाते (पत्ता पुरावा)"
          icon={
            <Image
              src="/User.png"
              alt="User Proof Icon"
              width={50}
              height={50}
            />
          }
        >
          {ADDRESS_PROOF_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={addressProof[doc.key]?.checked || false}
              expiryDate={addressProof[doc.key]?.expiryDate || ""}
              documentNumber={addressProof[doc.key]?.documentNumber || ""}
              onCheck={(v) => updateDoc("addressProof", doc.key, { checked: v })}
              onExpiryChange={(v) => updateDoc("addressProof", doc.key, { expiryDate: v })}
              onDocNumberChange={(v) => updateDoc("addressProof", doc.key, { documentNumber: v })}
            />
          ))}
        </SectionCard>
      </div>

      {/* Accounts of Proprietary Concern Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Accounts of Proprietary Concern"
          titleHi="मालकीच्या चिंतेची खाती"
          icon={
            <Image
              src="/User.png"
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {PROPRIETARY_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={proprietaryDocs[doc.key]?.checked || false}
              expiryDate={proprietaryDocs[doc.key]?.expiryDate || ""}
              documentNumber={proprietaryDocs[doc.key]?.documentNumber || ""}
              onCheck={(v) => updateDoc("proprietaryDocs", doc.key, { checked: v })}
              onExpiryChange={(v) => updateDoc("proprietaryDocs", doc.key, { expiryDate: v })}
              onDocNumberChange={(v) => updateDoc("proprietaryDocs", doc.key, { documentNumber: v })}
              showDocNumber={false}
            />
          ))}
        </SectionCard>
      </div>

      {/* Business Concern Section 1 - Company/Corporate Documents */}
      <div className="h-full">
        <SectionCard
          titleEn="Business Concern - Company/Corporate"
          titleHi="व्यवसाय चिंता - कंपनी/कॉर्पोरेट"
          icon={
            <Image
              src="/User.png"
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {/* Business Concern 1 Documents - Only Expiry Date */}
          {BUSINESS_CONCERN_1_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={false}
              expiryDate={businessConcern1Docs[doc.key]?.expiryDate || ""}
              documentNumber=""
              onCheck={() => {}}
              onExpiryChange={(v) => updateDoc("businessConcern1Docs", doc.key, { expiryDate: v })}
              onDocNumberChange={() => {}}
              showDocNumber={false}
              // showExpiryDate={}
              // showCheckbox={false}
            />
          ))}
        </SectionCard>
      </div>

      {/* Partnership Firms Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Partnership Firms"
          titleHi="भागीदारी फर्म"
          icon={
            <Image
              src="/User.png"
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {PARTNERSHIP_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={partnershipDocs[doc.key]?.checked || false}
              expiryDate={partnershipDocs[doc.key]?.expiryDate || ""}
              documentNumber={partnershipDocs[doc.key]?.documentNumber || ""}
              onCheck={(v) => updateDoc("partnershipDocs", doc.key, { checked: v })}
              onExpiryChange={(v) => updateDoc("partnershipDocs", doc.key, { expiryDate: v })}
              onDocNumberChange={(v) => updateDoc("partnershipDocs", doc.key, { documentNumber: v })}
              showDocNumber={false}
            />
          ))}
        </SectionCard>
      </div>

      {/* Business Concern Section 2 - Other Business Documents */}
      <div className="h-full">
        <SectionCard
          titleEn="Business Concern - Other Entities"
          titleHi="व्यवसाय चिंता - इतर संस्था"
          icon={
            <Image
              src="/User.png"
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {/* Business Concern 2 Documents - Only Expiry Date */}
          {BUSINESS_CONCERN_2_DOCS.map((doc) => (
            <DocumentRow
              key={doc.key}
              label={doc.label}
              checked={false}
              expiryDate={businessConcern2Docs[doc.key]?.expiryDate || ""}
              documentNumber=""
              onCheck={() => {}}
              onExpiryChange={(v) => updateDoc("businessConcern2Docs", doc.key, { expiryDate: v })}
              onDocNumberChange={() => {}}
              showDocNumber={false}
              // showExpiryDate={true}
              // showCheckbox={false}
            />
          ))}
        </SectionCard>
      </div>
    </div>
  );
}