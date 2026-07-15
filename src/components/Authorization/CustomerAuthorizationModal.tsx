// components/Authorization/CustomerAuthorizationModal.tsx

import { useState } from "react";
import Image from "@/components/ui/Image";
import { FormProvider, useForm } from "react-hook-form";
import { X, ShieldCheck, ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import Stepper, { type StepperStep } from "./Stepper";
import Step1CustomerDetails from "./CustomerAuthorizationSteps/Step1CustomerDetails";
import Step2AddressDetails from "./CustomerAuthorizationSteps/Step2AddressDetails";
import Step3Kyc from "./CustomerAuthorizationSteps/Step3Kyc";
import Step4ProfileDetails from "./CustomerAuthorizationSteps/Step4ProfileDetails";
import { buildDefaultValues, STEP_FIELD_NAMES, type CustomerAuthorizationFormValues } from "./CustomerAuthorizationSteps/formTypes";
import type { RowData } from "./CustomerAuthorizationTable";

const STEPS: StepperStep[] = [
  { key: "customer", label: "Customer Details" },
  { key: "address", label: "Address Details" },
  { key: "kyc", label: "KYC" },
  { key: "profile", label: "Profile Details" },
];

interface CustomerAuthorizationModalProps {
  row: RowData;
  onClose: () => void;
  onAuthorized: (row: RowData, values: CustomerAuthorizationFormValues) => void;
  onRejected: (row: RowData) => void;
}

function CustomerSummaryBar({ row }: { row: RowData }) {
  const username = `${row.name.split(" ")[0]}@${row.customerId.slice(-5)}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-primary-50">
          <Image src="/profile.png" alt="Customer Profile" width={64} height={64} className="h-full w-full object-cover" />
        </div>
        <div>
          <h3 className="text-base font-bold text-primary-700">{row.name.toUpperCase()}</h3>
          <p className="mt-0.5 text-sm text-slate-600">
            Customer ID: <span className="font-semibold text-slate-700">{row.customerId}</span>
            <span className="ml-4">
              Username: <span className="font-semibold text-slate-700">{username}</span>
            </span>
          </p>
        </div>
      </div>

      <div className="flex h-16 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Image src="/sign.png" alt="Customer Signature" width={140} height={56} className="h-full w-full object-contain p-2" />
      </div>
    </div>
  );
}

export default function CustomerAuthorizationModal({ 
  row, 
  onClose, 
  onAuthorized, 
  onRejected 
}: CustomerAuthorizationModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0);

  const methods = useForm<CustomerAuthorizationFormValues>({
    defaultValues: buildDefaultValues(row),
    mode: "onChange",
  });
  const { trigger, handleSubmit } = methods;

  const isLastStep = stepIndex === STEPS.length - 1;

  const goToStep = (index: number) => {
    if (index > maxVisitedIndex) return;
    setStepIndex(index);
  };

  const handleNext = async () => {
    // const fieldsToValidate = STEP_FIELD_NAMES[stepIndex];
    // const valid = fieldsToValidate.length === 0 ? true : await trigger(fieldsToValidate);
    // if (!valid || isLastStep) return;
    const next = stepIndex + 1;
    setStepIndex(next);
    setMaxVisitedIndex((prev) => Math.max(prev, next));
  };

  const handleAuthorize = handleSubmit((values) => {
    onAuthorized(row, values);
  });

  const handleReject = () => {
    if (window.confirm(`Are you sure you want to reject customer ${row.name}?`)) {
      onRejected(row);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-[95vw] max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-primary-50 text-primary">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-[20px] font-semibold leading-6 tracking-[0.0025em] text-slate-800">
                Authorize Customer
                <span className="text-slate-400"> / </span>
                <span className="text-[#64748B]">ग्राहकास मंजुरी द्या</span>
              </h2>
              <p className="mt-1 text-sm font-normal leading-5 tracking-[0.0025em] text-slate-500">
                Review and authorize customer information for processing. / ग्राहकाच्या माहितीचे पुनरावलोकन करून मंजुरी द्या.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Customer summary bar */}
        <div className="px-6 pt-5">
          <CustomerSummaryBar row={row} />
        </div>

        {/* Stepper */}
        <div className="px-6 pt-4">
          <Stepper steps={STEPS} activeIndex={stepIndex} maxVisitedIndex={maxVisitedIndex} onStepClick={goToStep} />
        </div>

        {/* Body */}
        <FormProvider {...methods}>
          <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
            {stepIndex === 0 && <Step1CustomerDetails />}
            {stepIndex === 1 && <Step2AddressDetails />}
            {stepIndex === 2 && <Step3Kyc />}
            {stepIndex === 3 && <Step4ProfileDetails />}
          </div>
        </FormProvider>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          {isLastStep && (
            <button
              type="button"
              onClick={handleReject}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-[14px] font-medium text-red-600 transition hover:bg-red-100"
            >
              Reject
              <ThumbsDown className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-5 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
            <X className="h-4 w-4" />
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleAuthorize}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[14px] font-medium text-white transition hover:bg-primary-700"
            >
              Authorize
              <ThumbsUp className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-[14px] font-medium text-white transition hover:bg-primary-700"
            >
              Next
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}