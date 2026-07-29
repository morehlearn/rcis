import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import { ELECTRICAL_SUBCLASSES, MECHANICAL_SUBCLASSES } from '@/features/wizard/wizard-types';
import {
  getSubmission, listMyApplications, listDirectors, listOffices, listReferees,
  listAssets, listStaff, listEquipment, listProjectExperience, listLitigation, listDocuments,
  type ContractorApplicationRecord, type ContractorCompany, type ContractorDirectorRecord,
  type ContractorOfficeRecord, type ContractorRefereeRecord, type ContractorAssetRecord,
  type ContractorStaffRecord, type ContractorEquipmentRecord, type ContractorProjectExperienceRecord,
  type ContractorLitigationRecord, type ContractorDocumentRecord, getDocumentUrl,
} from '@/lib/api';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{title}</h4>
      </div>
      <div className="p-4 text-sm">{children}</div>
    </div>
  );
}

function KeyValueGrid({ rows }: { rows: [string, string | undefined | null][] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <div className="text-[11px] text-slate-400 uppercase tracking-wide">{label}</div>
          <div className="text-slate-700">{value || '—'}</div>
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
          <tr className="text-slate-500 uppercase tracking-wide">
            {headers.map((h) => <th key={h} className="pr-4 py-1 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-100">
              {row.map((cell, j) => <td key={j} className="pr-4 py-1.5 text-slate-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function subclassLabel(code: string): string {
  const match = [...ELECTRICAL_SUBCLASSES, ...MECHANICAL_SUBCLASSES].find((o) => o.code === code);
  return match ? match.label : code;
}

export default function ViewApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [submission, setSubmission] = useState<ContractorApplicationRecord | null>(null);
  const [company, setCompany] = useState<ContractorCompany | null>(null);
  const [directors, setDirectors] = useState<ContractorDirectorRecord[]>([]);
  const [offices, setOffices] = useState<ContractorOfficeRecord[]>([]);
  const [referees, setReferees] = useState<ContractorRefereeRecord[]>([]);
  const [assets, setAssets] = useState<ContractorAssetRecord[]>([]);
  const [staff, setStaff] = useState<ContractorStaffRecord[]>([]);
  const [equipment, setEquipment] = useState<ContractorEquipmentRecord[]>([]);
  const [projects, setProjects] = useState<ContractorProjectExperienceRecord[]>([]);
  const [litigation, setLitigation] = useState<ContractorLitigationRecord[]>([]);
  const [documents, setDocuments] = useState<ContractorDocumentRecord[]>([]);
  const [openingId, setOpeningId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getSubmission(id)
      .then(async (record) => {
        if (cancelled) return;
        setSubmission(record);

        const [companies, directorRecords, officeRecords, refereeRecords, assetRecords, staffRecords, equipmentRecords, projectRecords, litigationRecords, documentRecords] = await Promise.all([
          listMyApplications(),
          listDirectors(record.regno),
          listOffices(record.regno),
          listReferees(record.regno),
          listAssets(record.regno),
          listStaff(record.regno),
          listEquipment(record.regno),
          listProjectExperience(record.regno),
          listLitigation(record.regno),
          listDocuments(record.regno),
        ]);

        if (cancelled) return;
        setCompany(companies.find((c) => c.regno === record.regno) ?? null);
        setDirectors(directorRecords);
        setOffices(officeRecords);
        setReferees(refereeRecords);
        setAssets(assetRecords);
        setStaff(staffRecords);
        setEquipment(equipmentRecords);
        setProjects(projectRecords);
        setLitigation(litigationRecords);
        setDocuments(documentRecords);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load this application.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const handleView = async (documentId: string) => {
    setOpeningId(documentId);
    try {
      const { url } = await getDocumentUrl(documentId);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // ignore - view is best-effort here
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--rcis-sand)]">
      <TopNav onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          {loading && <p className="text-sm text-slate-500">Loading application...</p>}
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {submission && company && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-800">
                  {submission.trackNo}
                  <span className="ml-2 text-sm font-normal text-slate-500">· {submission.status}</span>
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {submission.companyName || company.firmName} — submitted {new Date(submission.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <Section title="Firm Profile">
                <KeyValueGrid rows={[
                  ['Firm Name', company.firmName],
                  ['Incorporation No.', company.incorporationNo],
                  ['Head Office', company.headOffice],
                  ['Town', company.town],
                  ['County', company.county],
                  ['Local/Foreign', submission.localForeign],
                  ['Telephone', company.telephone],
                  ['Cell Phone', company.cellPhone],
                  ['Email', company.email],
                ]} />
              </Section>

              <Section title="Firm Registration">
                <KeyValueGrid rows={[
                  ['Firm Type', company.firmType],
                  ['KRA PIN', company.kraPin],
                  ['Bank Name', company.bankName],
                  ['Bank Branch', company.bankBranch],
                  ['Association Membership No.', company.associationMembershipNo],
                  ['AGPO Certificate', company.hasAgpoCertificate],
                ]} />
              </Section>

              <Section title="Directors">
                <MiniTable
                  headers={['Full Names', 'ID No', 'Nationality', 'Qualification', '% Share']}
                  rows={directors.map((d) => [d.fullNames, d.idNo, d.nationality, d.highestQualification, d.percentageShare])}
                />
              </Section>

              <Section title="Offices">
                <MiniTable
                  headers={['Town', 'Address', 'Location']}
                  rows={offices.map((o) => [o.town, o.address, o.location])}
                />
              </Section>

              <Section title="Referees">
                <MiniTable
                  headers={['Name', 'Telephone', 'Profession']}
                  rows={referees.map((r) => [r.name, r.telephone, r.profession])}
                />
              </Section>

              <Section title="Assets">
                <MiniTable
                  headers={['Description', 'Registration No']}
                  rows={assets.map((a) => [a.description, a.registrationNo])}
                />
              </Section>

              <Section title="Staff">
                <MiniTable
                  headers={['Full Names', 'Nationality', 'Qualification', 'Yrs Exp.']}
                  rows={staff.map((s) => [s.fullNames, s.nationality, s.highestQualification, s.yearsOfExperience])}
                />
              </Section>

              <Section title="Equipment & Plant">
                <MiniTable
                  headers={['Name', 'Owned/Leased', 'Category']}
                  rows={equipment.map((e) => [e.name, e.ownedOrLeased, e.category])}
                />
              </Section>

              <Section title="Project Experience">
                <MiniTable
                  headers={['Project', 'Contract Sum', 'Period']}
                  rows={projects.map((p) => [p.project, p.contractSum, p.contractPeriod])}
                />
              </Section>

              <Section title="Litigation History">
                <MiniTable
                  headers={['Ref No', 'Parties Involved', 'Status']}
                  rows={litigation.map((l) => [l.refNo, l.partiesInvolved, l.statusOfMatter])}
                />
              </Section>

              <Section title="Attachments">
                    {documents.length === 0 ? (
                        <p className="text-xs text-slate-400">No documents uploaded.</p>
                    ) : (
                        <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[400px]">
                            <thead>
                            <tr className="text-slate-500 uppercase tracking-wide">
                                <th className="pr-4 py-1 font-medium">File Name</th>
                                <th className="pr-4 py-1 font-medium">Document Type</th>
                                <th className="pr-4 py-1 font-medium">Uploaded</th>
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
                                    className="font-medium hover:underline disabled:opacity-50"
                                    style={{ color: 'var(--rcis-primary)' }}
                                    >
                                    {openingId === doc.id ? 'Opening...' : doc.fileName}
                                    </button>
                                </td>
                                <td className="pr-4 py-1.5 text-slate-700">{doc.docType}</td>
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

              <Section title="Classification (as submitted)">
                <div className="space-y-3 text-xs text-slate-700">
                    <p><span className="text-slate-400 uppercase tracking-wide text-[11px]">Application Type: </span>{submission.applicationType}</p>
                    {submission.classesApplied.split(' | ').map((line) => {
                    const [label, codesRaw] = line.split(': ');
                    if (!codesRaw) {
                        return <p key={line}>{line}</p>;
                    }
                    const codes = codesRaw.split(', ').map((c) => c.trim());
                    return (
                        <div key={line}>
                        <p className="font-medium text-slate-800">{label}</p>
                        <ul className="list-disc list-outside pl-4 mt-1 space-y-0.5">
                            {codes.map((code) => (
                            <li key={code}>{subclassLabel(code)}</li>
                            ))}
                        </ul>
                        </div>
                    );
                    })}
                </div>
                </Section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}