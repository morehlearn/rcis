import { Field, inputCls } from '../Field';
import { COUNTIES, TOWNS, type FirmProfileData } from '../wizard-types';

interface FirmProfileStepProps {
  data: FirmProfileData;
  errors: Partial<Record<keyof FirmProfileData, string>>;
  onChange: (field: keyof FirmProfileData, value: string) => void;
}

export default function FirmProfileStep({ data, errors, onChange }: FirmProfileStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Firm Profile</h3>
        </div>


      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Incorporation Certificate / Business No." required error={errors.incorporationNo}>
          <div className="flex gap-2">
            <input
              className={inputCls(errors.incorporationNo)}
              value={data.incorporationNo}
              onChange={(e) => onChange('incorporationNo', e.target.value)}
            />
            <button
              type="button"
              className="px-3 rounded-md text-white text-xs font-medium shrink-0"
              style={{ backgroundColor: 'var(--rcis-accent)' }}
            >
              Verify
            </button>
          </div>
        </Field>

        <Field label="Firm Name" error={errors.firmName}>
          <input
            className={inputCls(errors.firmName)}
            value={data.firmName}
            onChange={(e) => onChange('firmName', e.target.value)}
          />
        </Field>

        <Field label="Head Office" required error={errors.headOffice}>
          <input
            className={inputCls(errors.headOffice)}
            value={data.headOffice}
            onChange={(e) => onChange('headOffice', e.target.value)}
          />
        </Field>

        <Field label="Postal Address" error={errors.postalAddress}>
          <input
            className={inputCls(errors.postalAddress)}
            value={data.postalAddress}
            onChange={(e) => onChange('postalAddress', e.target.value)}
          />
        </Field>

        <Field label="County" error={errors.county}>
          <select
            className={inputCls(errors.county)}
            value={data.county}
            onChange={(e) => onChange('county', e.target.value)}
          >
            <option value="">--Please Select--</option>
            {COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Town" required error={errors.town}>
          <select
            className={inputCls(errors.town)}
            value={data.town}
            onChange={(e) => onChange('town', e.target.value)}
          >
            <option value="">Please Select</option>
            {TOWNS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Local/Foreign:" required error={errors.localForeign}>
          <select
            className={inputCls(errors.localForeign)}
            value={data.localForeign}
            onChange={(e) => onChange('localForeign', e.target.value)}
          >
            <option value="Local">Local</option>
            <option value="Foreign">Foreign</option>
          </select>
        </Field>

        <Field label="website" error={errors.website}>
          <input
            className={inputCls(errors.website)}
            value={data.website}
            onChange={(e) => onChange('website', e.target.value)}
          />
        </Field>

        <Field label="Telephone" required error={errors.telephone}>
          <input
            className={inputCls(errors.telephone)}
            value={data.telephone}
            onChange={(e) => onChange('telephone', e.target.value)}
          />
        </Field>

        <Field label="Cell Phone" required error={errors.cellPhone}>
          <input
            className={inputCls(errors.cellPhone)}
            value={data.cellPhone}
            onChange={(e) => onChange('cellPhone', e.target.value)}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            className={inputCls(errors.email)}
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 items-end pt-1">
        <Field label="Set Location">
          <button
            type="button"
            className="px-3 py-2 rounded-md text-white text-xs font-medium"
            style={{ backgroundColor: 'var(--rcis-primary)' }}
          >
            📍 Set Location
          </button>
        </Field>
        <Field label="Latitude" error={errors.latitude}>
          <input
            className={inputCls(errors.latitude)}
            value={data.latitude}
            onChange={(e) => onChange('latitude', e.target.value)}
          />
        </Field>
        <Field label="Longitude" error={errors.longitude}>
          <input
            className={inputCls(errors.longitude)}
            value={data.longitude}
            onChange={(e) => onChange('longitude', e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}
