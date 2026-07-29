import {useEffect, useRef, useState } from 'react';
import { Field, inputCls } from '../Field';
import {
  FIRM_TYPES, BANKS, AGENCIES, ASSOCIATIONS, AGPO_CATEGORIES, type FirmRegistrationData,
} from '../wizard-types';

interface FirmRegistrationStepProps {
  data: FirmRegistrationData;
  errors: Partial<Record<keyof FirmRegistrationData, string>>;
  onChange: (field: keyof FirmRegistrationData, value: string) => void;
  onCategoriesChange: (categories: string[]) => void;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>
      {children}
    </h3>
  );
}

export default function FirmRegistrationStep({ data, errors, onChange, onCategoriesChange }: FirmRegistrationStepProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoriesOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoriesOpen]);

  const toggleCategory = (category: string) => {
    const next = data.agpoCategories.includes(category)
      ? data.agpoCategories.filter((c) => c !== category)
      : [...data.agpoCategories, category];
    onCategoriesChange(next);
  };

  const toggleSelectAll = () => {
    onCategoriesChange(data.agpoCategories.length === AGPO_CATEGORIES.length ? [] : [...AGPO_CATEGORIES]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionHeading>Firm Registration</SectionHeading>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Firm Type:" required error={errors.firmType}>
            <select
              className={inputCls(errors.firmType)}
              value={data.firmType}
              onChange={(e) => onChange('firmType', e.target.value)}
            >
              {FIRM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Incorporation Certificate / Business No." required error={errors.incorporationNo}>
            <input
              className={inputCls(errors.incorporationNo)}
              value={data.incorporationNo}
              onChange={(e) => onChange('incorporationNo', e.target.value)}
            />
          </Field>

          <Field label="Company KRA PIN Number." required error={errors.kraPin}>
            <input
              className={inputCls(errors.kraPin)}
              value={data.kraPin}
              onChange={(e) => onChange('kraPin', e.target.value)}
            />
          </Field>

          <Field label="Registered Capital" error={errors.registeredCapital}>
            <input
              className={inputCls(errors.registeredCapital)}
              value={data.registeredCapital}
              onChange={(e) => onChange('registeredCapital', e.target.value)}
              inputMode="numeric"
            />
          </Field>

          <Field label="Paid Up Capital" error={errors.paidUpCapital}>
            <input
              className={inputCls(errors.paidUpCapital)}
              value={data.paidUpCapital}
              onChange={(e) => onChange('paidUpCapital', e.target.value)}
              inputMode="numeric"
            />
          </Field>

          <Field label="Tax Compliance Certificate Number" error={errors.taxComplianceNo}>
            <input
              className={inputCls(errors.taxComplianceNo)}
              value={data.taxComplianceNo}
              onChange={(e) => onChange('taxComplianceNo', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading>Bank Details</SectionHeading>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Bank Name" required error={errors.bankName}>
            <select
              className={inputCls(errors.bankName)}
              value={data.bankName}
              onChange={(e) => onChange('bankName', e.target.value)}
            >
              <option value="">--Please Select--</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </Field>

          <Field label="Bank Branch" required error={errors.bankBranch}>
            <input
              className={inputCls(errors.bankBranch)}
              value={data.bankBranch}
              onChange={(e) => onChange('bankBranch', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading>Registration with Other agencies</SectionHeading>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Name of Agency" error={errors.agencyName}>
            <select
              className={inputCls(errors.agencyName)}
              value={data.agencyName}
              onChange={(e) => onChange('agencyName', e.target.value)}
            >
              <option value="">--Please Select--</option>
              {AGENCIES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>

          <Field label="Agency Registration Number" error={errors.agencyRegistrationNo}>
            <input
              className={inputCls(errors.agencyRegistrationNo)}
              value={data.agencyRegistrationNo}
              onChange={(e) => onChange('agencyRegistrationNo', e.target.value)}
            />
          </Field>

          <Field label="Agency Year of registration" error={errors.agencyYear}>
            <input
              className={inputCls(errors.agencyYear)}
              value={data.agencyYear}
              onChange={(e) => onChange('agencyYear', e.target.value)}
              inputMode="numeric"
            />
          </Field>

          <Field label="Association Name:" error={errors.associationName}>
            <select
              className={inputCls(errors.associationName)}
              value={data.associationName}
              onChange={(e) => onChange('associationName', e.target.value)}
            >
              <option value="">--Please Select--</option>
              {ASSOCIATIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>

          {data.associationName === 'Other' && (
            <Field label="Association Name (Other)" error={errors.associationNameOther}>
              <input
                className={inputCls(errors.associationNameOther)}
                value={data.associationNameOther}
                onChange={(e) => onChange('associationNameOther', e.target.value)}
              />
            </Field>
          )}

          <Field label="Association Membership Number" required error={errors.associationMembershipNo}>
            <input
              className={inputCls(errors.associationMembershipNo)}
              value={data.associationMembershipNo}
              onChange={(e) => onChange('associationMembershipNo', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading>Partnerships of foreign firms and joint ventures</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Joint Venture Projects" error={errors.jointVentureProjects}>
            <textarea
              className={inputCls(errors.jointVentureProjects)}
              rows={2}
              value={data.jointVentureProjects}
              onChange={(e) => onChange('jointVentureProjects', e.target.value)}
            />
          </Field>
          <Field label="Joint Venture Firms" error={errors.jointVentureFirms}>
            <textarea
              className={inputCls(errors.jointVentureFirms)}
              rows={2}
              value={data.jointVentureFirms}
              onChange={(e) => onChange('jointVentureFirms', e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading>Registration with AGPO</SectionHeading>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Do you have AGPO Certificate" error={errors.hasAgpoCertificate}>
            <select
              className={inputCls(errors.hasAgpoCertificate)}
              value={data.hasAgpoCertificate}
              onChange={(e) => onChange('hasAgpoCertificate', e.target.value)}
            >
              <option value="">--Please Select--</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </Field>

          {data.hasAgpoCertificate === 'Yes' && (
            <>
              <Field label="AGPO Category">
                  <div className="relative" ref={categoriesRef}>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((o) => !o)}
                    className={`${inputCls()} text-left flex items-center justify-between`}
                  >
                    <span className="truncate">
                      {data.agpoCategories.length > 0 ? data.agpoCategories.join(', ') : 'Select categories'}
                    </span>
                    <span className="text-slate-400 ml-2">▾</span>
                  </button>

                  {categoriesOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md p-2 space-y-1">
                      <label className="flex items-center gap-2 text-xs px-1 py-1 hover:bg-slate-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.agpoCategories.length === AGPO_CATEGORIES.length}
                          onChange={toggleSelectAll}
                        />
                        [Select all]
                      </label>
                      {AGPO_CATEGORIES.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-2 text-xs px-1 py-1 hover:bg-slate-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={data.agpoCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <Field label="Expiry Date">
                <input
                  type="date"
                  className={inputCls()}
                  value={data.agpoExpiryDate}
                  onChange={(e) => onChange('agpoExpiryDate', e.target.value)}
                />
              </Field>
            </>
          )}
        </div>
      </div>
    </div>
  );
}