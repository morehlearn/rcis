import { DECLARATION_ITEMS, type DeclarationsData } from '../wizard-types';

interface DeclarationsStepProps {
  data: DeclarationsData;
  errors: Partial<Record<keyof DeclarationsData, string>>;
  onChange: (field: keyof DeclarationsData, value: boolean) => void;
}

export default function DeclarationsStep({ data, errors, onChange }: DeclarationsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>
          1. Code Of Conduct For The Construction Industry
        </h3>
        <p className="text-sm text-slate-600">
          Please click{' '}
          <a href="#" className="hover:underline" style={{ color: 'var(--rcis-primary)' }}>
            here
          </a>{' '}
          to read and understand the Code Of Conduct For The Construction Industry
        </p>

        <label className="flex items-start gap-2 pt-1 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={data.acceptCodeOfConduct}
            onChange={(e) => onChange('acceptCodeOfConduct', e.target.checked)}
          />
          <span className="text-sm text-slate-700">
            <span className="font-medium text-red-600">Accept Code of Conduct</span>
            <br />
            I confirm to have downloaded and read{' '}
            <a href="#" className="hover:underline" style={{ color: 'var(--rcis-primary)' }}>
              this Code of Conduct for the Construction Industry
            </a>
          </span>
        </label>
        {errors.acceptCodeOfConduct && (
          <p className="text-[11px] text-red-600">{errors.acceptCodeOfConduct}</p>
        )}
      </div>

      <div className="border-t border-slate-100 pt-5 space-y-3">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>
          2. Terms and Conditions
        </h3>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Declaration</p>
          <ol className="list-decimal list-outside pl-5 space-y-1.5 text-sm text-slate-600">
            {DECLARATION_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>

        <label className="flex items-start gap-2 pt-3 cursor-pointer border-t border-slate-100">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={data.acceptTerms}
            onChange={(e) => onChange('acceptTerms', e.target.checked)}
          />
          <span className="text-sm font-medium text-red-600">Accept Terms and Conditions</span>
        </label>
        {errors.acceptTerms && <p className="text-[11px] text-red-600">{errors.acceptTerms}</p>}
      </div>
    </div>
  );
}
