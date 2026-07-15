// components/Authorization/CustomerAuthorizationSteps/Step3Kyc.tsx

import React from "react";
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

// React component for icon instead of Next.js Image
const IconWrapper = ({ src, alt, width = 50, height = 50 }: { src: string; alt: string; width?: number; height?: number }) => (
  <div 
    className="flex items-center justify-center"
    style={{ width, height }}
  >
    <img 
      src={src} 
      alt={alt} 
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  </div>
);

export default function Step3Kyc() {
  const { watch, setValue } = useFormContext<CustomerAuthorizationFormValues>();
  
  // Watch all sections
  const idProof = watch("idProof") || {};
  const addressProof = watch("addressProof") || {};
  const partnershipDocs = watch("partnershipDocs") || {};
  const businessConcern1Docs = watch("businessConcern1Docs") || {};
  const businessConcern2Docs = watch("businessConcern2Docs") || {};
  const proprietaryDocs = watch("proprietaryDocs") || {};

  const updateDoc = (
    section: "idProof" | "addressProof" | "partnershipDocs" | "businessConcern1Docs" | "businessConcern2Docs" | "proprietaryDocs",
    key: string,
    patch: Partial<DocState>
  ) => {
    // Get current section data
    let currentSection;
    switch (section) {
      case "idProof":
        currentSection = idProof;
        break;
      case "addressProof":
        currentSection = addressProof;
        break;
      case "partnershipDocs":
        currentSection = partnershipDocs;
        break;
      case "businessConcern1Docs":
        currentSection = businessConcern1Docs;
        break;
      case "businessConcern2Docs":
        currentSection = businessConcern2Docs;
        break;
      case "proprietaryDocs":
        currentSection = proprietaryDocs;
        break;
      default:
        currentSection = {};
    }

    // Get current document data
    const currentDoc = currentSection[key] || { checked: false, expiryDate: "", documentNumber: "" };
    
    // Update the document
    const updatedDoc = { ...currentDoc, ...patch };
    
    // Set the value using the path string
    setValue(`${section}.${key}`, updatedDoc);
  };

  // Helper to safely get document state
  const getDocState = (section: any, key: string): DocState => {
    return section?.[key] || { checked: false, expiryDate: "", documentNumber: "" };
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* ID Proof Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Savings Account (ID Proof)"
          titleHi="बचत खाते (ओळख पुरावा)"
          icon={
            <IconWrapper
              src="/User.png"
              alt="ID Proof Icon"
              width={50}
              height={50}
            />
          }
        >
          {ID_PROOF_DOCS.map((doc) => {
            const docState = getDocState(idProof, doc.key);
            return (
              <DocumentRow
                key={doc.key}
                label={doc.label}
                checked={docState.checked}
                expiryDate={docState.expiryDate}
                documentNumber={docState.documentNumber}
                onCheck={(v) => updateDoc("idProof", doc.key, { checked: v })}
                onExpiryChange={(v) => updateDoc("idProof", doc.key, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc("idProof", doc.key, { documentNumber: v })}
                showDocNumber={true}
              />
            );
          })}
        </SectionCard>
      </div>

      {/* User Proof Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Savings Account (User Proof)"
          titleHi="बचत खाते (पत्ता पुरावा)"
          icon={
            <IconWrapper
              src="/User.png"
              alt="User Proof Icon"
              width={50}
              height={50}
            />
          }
        >
          {ADDRESS_PROOF_DOCS.map((doc) => {
            const docState = getDocState(addressProof, doc.key);
            return (
              <DocumentRow
                key={doc.key}
                label={doc.label}
                checked={docState.checked}
                expiryDate={docState.expiryDate}
                documentNumber={docState.documentNumber}
                onCheck={(v) => updateDoc("addressProof", doc.key, { checked: v })}
                onExpiryChange={(v) => updateDoc("addressProof", doc.key, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc("addressProof", doc.key, { documentNumber: v })}
                showDocNumber={true}
              />
            );
          })}
        </SectionCard>
      </div>

      {/* Accounts of Proprietary Concern Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Accounts of Proprietary Concern"
          titleHi="मालकीच्या चिंतेची खाती"
          icon={
            <IconWrapper
              src="/User.png"
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {PROPRIETARY_DOCS.map((doc) => {
            const docState = getDocState(proprietaryDocs, doc.key);
            return (
              <DocumentRow
                key={doc.key}
                label={doc.label}
                checked={docState.checked}
                expiryDate={docState.expiryDate}
                documentNumber={docState.documentNumber}
                onCheck={(v) => updateDoc("proprietaryDocs", doc.key, { checked: v })}
                onExpiryChange={(v) => updateDoc("proprietaryDocs", doc.key, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc("proprietaryDocs", doc.key, { documentNumber: v })}
                showDocNumber={false}
              />
            );
          })}
        </SectionCard>
      </div>

      {/* Business Concern Section 1 - Company/Corporate Documents */}
      <div className="h-full">
        <SectionCard
          titleEn="Business Concern - Company/Corporate"
          titleHi="व्यवसाय चिंता - कंपनी/कॉर्पोरेट"
          icon={
            <IconWrapper
              src="/User.png"
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {BUSINESS_CONCERN_1_DOCS.map((doc) => {
            const docState = getDocState(businessConcern1Docs, doc.key);
            return (
              <DocumentRow
                key={doc.key}
                label={doc.label}
                checked={docState.checked}
                expiryDate={docState.expiryDate}
                documentNumber={docState.documentNumber}
                onCheck={(v) => updateDoc("businessConcern1Docs", doc.key, { checked: v })}
                onExpiryChange={(v) => updateDoc("businessConcern1Docs", doc.key, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc("businessConcern1Docs", doc.key, { documentNumber: v })}
                showDocNumber={false}
              />
            );
          })}
        </SectionCard>
      </div>

      {/* Partnership Firms Section */}
      <div className="h-full">
        <SectionCard
          titleEn="Partnership Firms"
          titleHi="भागीदारी फर्म"
          icon={
            <IconWrapper
              src="/User.png"
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {PARTNERSHIP_DOCS.map((doc) => {
            const docState = getDocState(partnershipDocs, doc.key);
            return (
              <DocumentRow
                key={doc.key}
                label={doc.label}
                checked={docState.checked}
                expiryDate={docState.expiryDate}
                documentNumber={docState.documentNumber}
                onCheck={(v) => updateDoc("partnershipDocs", doc.key, { checked: v })}
                onExpiryChange={(v) => updateDoc("partnershipDocs", doc.key, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc("partnershipDocs", doc.key, { documentNumber: v })}
                showDocNumber={false}
              />
            );
          })}
        </SectionCard>
      </div>

      {/* Business Concern Section 2 - Other Business Documents */}
      <div className="h-full">
        <SectionCard
          titleEn="Business Concern - Other Entities"
          titleHi="व्यवसाय चिंता - इतर संस्था"
          icon={
            <IconWrapper
              src="/User.png"
              alt="User Icon"
              width={50}
              height={50}
            />
          }
        >
          {BUSINESS_CONCERN_2_DOCS.map((doc) => {
            const docState = getDocState(businessConcern2Docs, doc.key);
            return (
              <DocumentRow
                key={doc.key}
                label={doc.label}
                checked={docState.checked}
                expiryDate={docState.expiryDate}
                documentNumber={docState.documentNumber}
                onCheck={(v) => updateDoc("businessConcern2Docs", doc.key, { checked: v })}
                onExpiryChange={(v) => updateDoc("businessConcern2Docs", doc.key, { expiryDate: v })}
                onDocNumberChange={(v) => updateDoc("businessConcern2Docs", doc.key, { documentNumber: v })}
                showDocNumber={false}
              />
            );
          })}
        </SectionCard>
      </div>
    </div>
  );
}