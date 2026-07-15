export interface StepperStep {
  key: string;
  label: string;
}

interface StepperProps {
  steps: StepperStep[];
  activeIndex: number;
  maxVisitedIndex: number;
  onStepClick: (index: number) => void;
}

export default function Stepper({ steps, activeIndex, maxVisitedIndex, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center gap-8 border-b border-slate-200 bg-white">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isDisabled = index > maxVisitedIndex;

        return (
          <button
            key={step.key}
            type="button"
            disabled={false}
            aria-current={isActive ? "step" : undefined}
            onClick={() => !isDisabled && onStepClick(index)}
            className={`relative -mb-px pb-3 pt-2 text-[14px] font-medium transition ${
              isActive
                ? "text-primary"
                : isDisabled
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {step.label}
            {isActive &&
             <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-primary" />}
          </button>
        );
      })}
    </div>
  );
}
