import { useState } from 'react';
import { Pencil, ExternalLink, CheckCircle2 } from 'lucide-react';
import type {
  FirmProfileData, FirmRegistrationData, DeclarationsData, Director, Office, Referee,
  Asset, Staff, Equipment, ProjectExperience, Litigation, ClassificationData,
} from '../wizard-types';
import { ELECTRICAL_SUBCLASSES, MECHANICAL_SUBCLASSES, DECLARATION_ITEMS } from '../wizard-types';
import type { ContractorDocumentRecord } from '@/lib/api';

interface SummaryStepProps {
  regno: string | null;
  justSubmittedTrackNo: string | null;
  firmProfile: FirmProfileData;
  firmRegistration: FirmRegistrationData;
  declarations: DeclarationsData;
  declarationsErrors: Partial<Record<keyof DeclarationsData, string>>;
  onDeclarationsChange: (field: keyof DeclarationsData, value: boolean) => void;
  validateDeclarations: () => boolean;
  directors: Director[];
  offices: Office[];
  referees: Referee[];
  assets: Asset[];
  staff: Staff[];
  equipment: Equipment[];
  projects: ProjectExperience[];
  litigation: Litigation[];
  classification: ClassificationData;
  documents: ContractorDocumentRecord[];
  onEditStep: (stepIndex: number) => void;
  onViewDocument: (documentId: string) => Promise<void>;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  submitError?: string;
}

function Section({
  title, stepIndex, onEditStep, children,
}: {
  title: string;
  stepIndex: number;
  onEditStep: (i: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-200">
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: 'rgba(243, 156, 18, 0.05)', borderBottom: '1px solid rgba(243, 156, 18, 0.18)' }}
      >
        <h4 className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--rcis-accent-dark)' }}>
          {title}
        </h4>
        <button
          type="button"
          onClick={() => onEditStep(stepIndex)}
          className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: 'var(--rcis-primary-dark)' }}
        >
          <Pencil size={11} />
          Edit
        </button>
      </div>
      <div className="p-4 text-sm bg-white">{children}</div>
    </div>
  );
}

function KeyValueGrid({ rows }: { rows: [string, string | undefined | null][] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
      {rows.map(([label, value]) => (
        <div key={label}>
          <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--rcis-primary-dark)' }}>
            {label}
          </div>
          <div className="text-slate-800">{value || '—'}</div>
        </div>
      ))}
    </div>
  );
}

function MiniTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (rows.length === 0) return <p className="text-xs text-slate-400">None added.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs min-w-[400px]">
        <thead>
          <tr style={{ backgroundColor: 'rgba(51, 181, 229, 0.08)' }}>
            {headers.map((h) => (
              <th
                key={h}
                className="pr-4 py-1.5 font-semibold uppercase tracking-wide"
                style={{ color: 'var(--rcis-primary-dark)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-100">
              {row.map((cell, j) => <td key={j} className="pr-4 py-1.5 text-slate-800">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SummaryStep({
  justSubmittedTrackNo, firmProfile, firmRegistration,
  declarations, declarationsErrors, onDeclarationsChange, validateDeclarations,
  directors, offices, referees, assets, staff, equipment, projects, litigation,
  classification, documents, onEditStep, onViewDocument, onSubmit, submitting, submitError,
}: SummaryStepProps) {
  const [confirming, setConfirming] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);

  const handleView = async (id: string) => {
    setOpeningId(id);
    await onViewDocument(id);
    setOpeningId(null);
  };

  const handleProceedToConfirm = () => {
    if (!validateDeclarations()) return;
    setConfirming(true);
  };

  if (justSubmittedTrackNo) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
        <p className="text-sm font-semibold text-slate-800">Application Submitted</p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Your application has been submitted with tracking number <span className="font-medium">{justSubmittedTrackNo}</span>.
          You can track its progress from your dashboard, or start another application for this company anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Review &amp; Submit</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Check everything below before submitting. Click "Edit" on any section to go back and make changes.
        </p>
      </div>

      <Section title="Company Details" stepIndex={0} onEditStep={onEditStep}>
        <KeyValueGrid rows={[
          ['Firm Name', firmProfile.firmName],
          ['Incorporation No.', firmProfile.incorporationNo],
          ['Head Office', firmProfile.headOffice],
          ['Town', firmProfile.town],
          ['County', firmProfile.county],
          ['Local/Foreign', firmProfile.localForeign],
          ['Telephone', firmProfile.telephone],
          ['Cell Phone', firmProfile.cellPhone],
          ['Email', firmProfile.email],
          ['Firm Type', firmRegistration.firmType],
          ['KRA PIN', firmRegistration.kraPin],
          ['Bank Name', firmRegistration.bankName],
          ['Bank Branch', firmRegistration.bankBranch],
          ['Association Membership No.', firmRegistration.associationMembershipNo],
          ['AGPO Certificate', firmRegistration.hasAgpoCertificate],
        ]} />
      </Section>

      <Section title="Directors" stepIndex={1} onEditStep={onEditStep}>
        <MiniTable
          headers={['Full Names', 'ID No', 'Nationality', 'Qualification', '% Share']}
          rows={directors.map((d) => [d.fullNames, d.idNo, d.nationality, d.highestQualification, d.percentageShare])}
        />
      </Section>

      <Section title="Referees" stepIndex={1} onEditStep={onEditStep}>
        <MiniTable
          headers={['Name', 'Telephone', 'Profession']}
          rows={referees.map((r) => [r.name, r.telephone, r.profession])}
        />
      </Section>

      <Section title="Staff" stepIndex={1} onEditStep={onEditStep}>
        <MiniTable
          headers={['Full Names', 'Nationality', 'Qualification', 'Yrs Exp.']}
          rows={staff.map((s) => [s.fullNames, s.nationality, s.highestQualification, s.yearsOfExperience])}
        />
      </Section>

      <Section title="Offices" stepIndex={2} onEditStep={onEditStep}>
        <MiniTable
          headers={['Town', 'Address', 'Location']}
          rows={offices.map((o) => [o.town, o.address, o.location])}
        />
      </Section>

      <Section title="Fixed Assets" stepIndex={2} onEditStep={onEditStep}>
        <MiniTable
          headers={['Description', 'Registration No']}
          rows={assets.map((a) => [a.description, a.registrationNo])}
        />
      </Section>

      <Section title="Equipment & Plant" stepIndex={2} onEditStep={onEditStep}>
        <MiniTable
          headers={['Name', 'Owned/Leased', 'Category']}
          rows={equipment.map((e) => [e.name, e.ownedOrLeased, e.category])}
        />
      </Section>

      <Section title="Project Experience" stepIndex={3} onEditStep={onEditStep}>
        <MiniTable
          headers={['Project', 'Contract Sum', 'Period']}
          rows={projects.map((p) => [p.project, p.contractSum, p.contractPeriod])}
        />
      </Section>

      <Section title="Litigation History" stepIndex={3} onEditStep={onEditStep}>
        <MiniTable
          headers={['Ref No', 'Parties Involved', 'Status']}
          rows={litigation.map((l) => [l.refNo, l.partiesInvolved, l.statusOfMatter])}
        />
      </Section>

      <Section title="Attachments" stepIndex={4} onEditStep={onEditStep}>
        {documents.length === 0 ? (
          <p className="text-xs text-slate-400">No documents uploaded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[400px]">
              <thead>
                <tr style={{ backgroundColor: 'rgba(51, 181, 229, 0.08)' }}>
                  <th className="pr-4 py-1.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--rcis-primary-dark)' }}>File Name</th>
                  <th className="pr-4 py-1.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--rcis-primary-dark)' }}>Document Type</th>
                  <th className="pr-4 py-1.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--rcis-primary-dark)' }}>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-t border-slate-100">
                    <td className="pr-4 py-1.5">
                      <button
                        type="button"
                        onClick={() => handleView(doc.id)}
                        disabled={openingId === doc.id}
                        className="inline-flex items-center gap-1 font-medium hover:underline disabled:opacity-50"
                        style={{ color: 'var(--rcis-primary)' }}
                      >
                        {openingId === doc.id ? 'Opening...' : doc.fileName}
                        <ExternalLink size={10} />
                      </button>
                    </td>
                    <td className="pr-4 py-1.5 text-slate-800">{doc.docType}</td>
                    <td className="pr-4 py-1.5 text-slate-600">
                      {new Date(doc.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Classification" stepIndex={4} onEditStep={onEditStep}>
        <KeyValueGrid rows={[
          ['Application Type', classification.applicationType],
          ['Building Works Category', classification.buildingWorksCategory],
          ['Road Works Category', classification.roadWorksCategory],
          ['Water Works Category', classification.waterWorksCategory],
          ['Electrical Category', classification.electricalCategory],
          ['Mechanical Category', classification.mechanicalCategory],
        ]} />

        <div className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--rcis-primary-dark)' }}>Electrical Sub-Classes</div>
            {classification.electricalSubClasses.length === 0 ? (
              <p className="text-slate-500 text-xs">None selected</p>
            ) : (
              <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700">
                {classification.electricalSubClasses.map((code) => (
                  <li key={code}>{ELECTRICAL_SUBCLASSES.find((o) => o.code === code)?.label ?? code}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--rcis-primary-dark)' }}>Mechanical Sub-Classes</div>
            {classification.mechanicalSubClasses.length === 0 ? (
              <p className="text-slate-500 text-xs">None selected</p>
            ) : (
              <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700">
                {classification.mechanicalSubClasses.map((code) => (
                  <li key={code}>{MECHANICAL_SUBCLASSES.find((o) => o.code === code)?.label ?? code}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      {submitError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {submitError}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 p-4 space-y-5">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>
            Declarations
          </h3>
          <label className="flex items-start gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={declarations.acceptCodeOfConduct}
              onChange={(e) => onDeclarationsChange('acceptCodeOfConduct', e.target.checked)}
            />
            <span className="text-sm text-slate-700">
              <span className="font-medium text-red-600">Accept Code of Conduct</span>
              <br />
              I confirm to have downloaded and read this Code of Conduct for the Construction Industry
            </span>
          </label>
          {declarationsErrors.acceptCodeOfConduct && (
            <p className="text-[11px] text-red-600">{declarationsErrors.acceptCodeOfConduct}</p>
          )}

          <div className="border-t border-slate-100 pt-3">
            <ol className="list-decimal list-outside pl-5 space-y-1.5 text-xs text-slate-600">
              {DECLARATION_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <label className="flex items-start gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={declarations.acceptTerms}
              onChange={(e) => onDeclarationsChange('acceptTerms', e.target.checked)}
            />
            <span className="text-sm font-medium text-red-600">Accept Terms and Conditions</span>
          </label>
          {declarationsErrors.acceptTerms && (
            <p className="text-[11px] text-red-600">{declarationsErrors.acceptTerms}</p>
          )}
        </div>

        {!confirming ? (
          <button
            type="button"
            onClick={handleProceedToConfirm}
            className="px-5 py-2.5 rounded-md text-white text-sm font-semibold"
            style={{ backgroundColor: 'var(--rcis-accent)' }}
          >
            Submit Application
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-800">
              Are you sure you want to submit this application?
            </p>
            <p className="text-xs text-slate-500">
              This will create a new tracking record for review. You can still return later to start another application for this company.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="px-5 py-2.5 rounded-md text-white text-sm font-semibold disabled:opacity-60"
                style={{ backgroundColor: 'var(--rcis-accent)' }}
              >
                {submitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={submitting}
                className="px-5 py-2.5 rounded-md border border-slate-300 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}