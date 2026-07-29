import {useEffect, useRef, useState } from 'react';
import { Field, inputCls } from '../Field';
import {
  type ClassificationData, APPLICATION_TYPES, NCA_CATEGORIES,
  ELECTRICAL_SUBCLASSES, MECHANICAL_SUBCLASSES, type SubClassOption,
} from '../wizard-types';
import SubClassAttachmentModal from '../SubClassAttachmentModal';


interface ClassificationStepProps {
  data: ClassificationData;
  errors: Partial<Record<keyof ClassificationData, string>>;
  onChange: (field: keyof ClassificationData, value: string) => void;
  onElectricalSubClassesChange: (codes: string[]) => void;
  onMechanicalSubClassesChange: (codes: string[]) => void;
  onUploadDocument: (docType: string, file: File) => Promise<void>;
  documentsUploading: boolean;
}

interface PendingAttachment {
  subClassLabel: string;
  requiredAttachment: string;
}

function SubClassMultiSelect({
  label, options, selected, onToggle, onToggleAll,
}: {
  label: string;
  options: SubClassOption[];
  selected: string[];
  onToggle: (code: string) => void;
  onToggleAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const allSelected = selected.length === options.length;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputCls()} text-left flex items-center justify-between`}
      >
        <span className="truncate">
          {selected.length === 0 ? 'Select sub-classes' : allSelected ? 'All selected' : `${selected.length} selected`}
        </span>
        <span className="text-slate-400 ml-2">▾</span>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md p-2 space-y-1 max-h-64 overflow-y-auto">
          <label className="flex items-center gap-2 text-xs px-1 py-1 hover:bg-slate-50 rounded cursor-pointer font-medium">
            <input type="checkbox" checked={allSelected} onChange={onToggleAll} />
            [Select all] - {label}
          </label>
          {options.map((opt) => (
            <label
              key={opt.code}
              className="flex items-start gap-2 text-xs px-1 py-1 hover:bg-slate-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                className="mt-0.5"
                checked={selected.includes(opt.code)}
                onChange={() => onToggle(opt.code)}
              />
              <span>
                {opt.label}
                {opt.requiredAttachment && (
                  <span className="text-red-600"> (requires {opt.requiredAttachment})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClassificationStep({
  data, errors, onChange, onElectricalSubClassesChange, onMechanicalSubClassesChange,
  onUploadDocument, documentsUploading,
}: ClassificationStepProps) {
  const [pending, setPending] = useState<PendingAttachment | null>(null);

  const handleElectricalToggle = (code: string) => {
    const option = ELECTRICAL_SUBCLASSES.find((o) => o.code === code);
    const isSelecting = !data.electricalSubClasses.includes(code);
    const next = isSelecting
      ? [...data.electricalSubClasses, code]
      : data.electricalSubClasses.filter((c) => c !== code);
    onElectricalSubClassesChange(next);

    if (isSelecting && option?.requiredAttachment) {
      setPending({ subClassLabel: option.label, requiredAttachment: option.requiredAttachment });
    }
  };

  const handleMechanicalToggle = (code: string) => {
    const option = MECHANICAL_SUBCLASSES.find((o) => o.code === code);
    const isSelecting = !data.mechanicalSubClasses.includes(code);
    const next = isSelecting
      ? [...data.mechanicalSubClasses, code]
      : data.mechanicalSubClasses.filter((c) => c !== code);
    onMechanicalSubClassesChange(next);

    if (isSelecting && option?.requiredAttachment) {
      setPending({ subClassLabel: option.label, requiredAttachment: option.requiredAttachment });
    }
  };

  // Bulk "select all" skips the per-item modal prompt (would be noisy for
  // 15+ items at once) - those certs can still be added from the
  // Attachments step, or by unchecking/rechecking an individual item here.
  const handleElectricalToggleAll = () => {
    onElectricalSubClassesChange(
      data.electricalSubClasses.length === ELECTRICAL_SUBCLASSES.length
        ? []
        : ELECTRICAL_SUBCLASSES.map((o) => o.code),
    );
  };

  const handleMechanicalToggleAll = () => {
    onMechanicalSubClassesChange(
      data.mechanicalSubClasses.length === MECHANICAL_SUBCLASSES.length
        ? []
        : MECHANICAL_SUBCLASSES.map((o) => o.code),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>
          Class &amp; Category of registration Applied for
        </h3>
      </div>

      <Field label="Application Type" required error={errors.applicationType}>
  <select
    className={`${inputCls(errors.applicationType)} max-w-xs bg-slate-100 text-slate-500 cursor-not-allowed`}
    value={data.applicationType}
    disabled
  >
    {APPLICATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
  </select>
</Field>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 pt-2 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide pt-4">Class</div>
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide pt-4">Category</div>

        <Field label="Building Works">
          <div />
        </Field>
        <Field label="">
          <select className={inputCls()} value={data.buildingWorksCategory} onChange={(e) => onChange('buildingWorksCategory', e.target.value)}>
            {NCA_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Road Works">
          <div />
        </Field>
        <Field label="">
          <select className={inputCls()} value={data.roadWorksCategory} onChange={(e) => onChange('roadWorksCategory', e.target.value)}>
            {NCA_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Water Works">
          <div />
        </Field>
        <Field label="">
          <select className={inputCls()} value={data.waterWorksCategory} onChange={(e) => onChange('waterWorksCategory', e.target.value)}>
            {NCA_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Electrical Engineering Services (Select Sub-Class Below)">
          <SubClassMultiSelect
            label="Electrical Engineering Services"
            options={ELECTRICAL_SUBCLASSES}
            selected={data.electricalSubClasses}
            onToggle={handleElectricalToggle}
            onToggleAll={handleElectricalToggleAll}
          />
        </Field>
        <Field label="">
          <select className={inputCls()} value={data.electricalCategory} onChange={(e) => onChange('electricalCategory', e.target.value)}>
            {NCA_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Mechanical Engineering Services (Select Sub-Class Below)">
          <SubClassMultiSelect
            label="Mechanical Engineering Services"
            options={MECHANICAL_SUBCLASSES}
            selected={data.mechanicalSubClasses}
            onToggle={handleMechanicalToggle}
            onToggleAll={handleMechanicalToggleAll}
          />
        </Field>
        <Field label="">
          <select className={inputCls()} value={data.mechanicalCategory} onChange={(e) => onChange('mechanicalCategory', e.target.value)}>
            {NCA_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      {pending && (
        <SubClassAttachmentModal
          subClassLabel={pending.subClassLabel}
          requiredAttachment={pending.requiredAttachment}
          uploading={documentsUploading}
          onUpload={onUploadDocument}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  );
}