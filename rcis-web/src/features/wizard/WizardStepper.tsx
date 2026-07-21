import { Check } from 'lucide-react';

interface WizardStepperProps {
  steps: readonly string[];
  activeStep: number;
  visited: Set<number>;
  onStepClick: (index: number) => void;
}

export default function WizardStepper({ steps, activeStep, visited, onStepClick }: WizardStepperProps) {
  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-max">
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          const isClickable = visited.has(i);

          return (
            <li key={step} className="flex items-center">
              <button
                disabled={!isClickable}
                onClick={() => onStepClick(i)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap rounded ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"
                  style={{
                    backgroundColor: isActive || isDone ? 'var(--rcis-primary)' : '#e2e8f0',
                    color: isActive || isDone ? '#fff' : '#64748b',
                  }}
                >
                  {isDone ? <Check size={12} /> : i + 1}
                </span>
                <span className={isActive ? 'text-slate-800' : 'text-slate-500'}>{step}</span>
              </button>
              {i < steps.length - 1 && <span className="w-6 h-px bg-slate-200 shrink-0" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
