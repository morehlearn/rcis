import { Check } from 'lucide-react';

interface WizardStepperProps {
  steps: readonly string[];
  activeStep: number;
  visited: Set<number>;
  onStepClick: (index: number) => void;
}

export default function WizardStepper({ steps, activeStep, visited, onStepClick }: WizardStepperProps) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {steps.map((step, i) => {
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        const isClickable = visited.has(i);
        const isLast = i === steps.length - 1;

        return (
          <li key={step} className="flex items-center">
            <button
              disabled={!isClickable}
              onClick={() => onStepClick(i)}
              title={step}
              aria-label={step}
              className={`flex items-center gap-1.5 px-1.5 py-1 text-xs font-medium whitespace-nowrap rounded ${
                isClickable ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
              }`}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0"
                style={{
                  backgroundColor: isActive || isDone ? 'var(--rcis-primary)' : '#e2e8f0',
                  color: isActive || isDone ? '#fff' : '#64748b',
                }}
              >
                {isDone ? <Check size={13} /> : i + 1}
              </span>
              <span className={isActive ? 'text-slate-800' : 'text-slate-500'}>{step}</span>
            </button>
            {!isLast && <span className="mx-1 h-px w-4 bg-slate-200 hidden sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}