import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import { listMyApplications, listMySubmissions, type ContractorCompany } from '@/lib/api';

// Applying for an additional certificate/licence only makes sense for a
// company that's already fully registered (has at least one submitted
// application) - it reuses that company's existing regno directly rather
// than creating a new registration, so the documents/directors/etc it
// already has on file carry over automatically.
export default function SelectCertificateCompanyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companies, setCompanies] = useState<ContractorCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([listMyApplications(), listMySubmissions()])
      .then(([companyRecords, submissions]) => {
        if (cancelled) return;
        const submittedRegnos = new Set(submissions.map((s) => s.regno));
        setCompanies(companyRecords.filter((c) => submittedRegnos.has(c.regno)));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load your companies.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--rcis-sand)]">
      <TopNav onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="mb-4">
            <Link to="/" className="text-xs text-slate-500 hover:text-[var(--rcis-primary)]">
              ← Back to dashboard
            </Link>
            <h1 className="text-xl font-semibold text-slate-800 mt-1">Apply for a new Contractor Certificate/Licence</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Choose the registered company you want to add a class or licence to. Your existing details will carry over — you'll just confirm them and add the new class.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            {loading && <p className="text-sm text-slate-500">Loading your companies...</p>}
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{error}</div>
            )}
            {!loading && !error && companies.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-500">
                <Building2 size={28} className="mx-auto mb-2 text-slate-300" />
                You don't have any fully registered companies yet. Complete a New Contractor Registration first.
              </div>
            )}
            {!loading && companies.length > 0 && (
              <ul className="divide-y divide-slate-100">
                {companies.map((company) => (
                  <li key={company.regno}>
                    <Link
                      to={`/apply?mode=certificate&regno=${encodeURIComponent(company.regno)}`}
                      className="flex items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">{company.firmName || company.regno}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{company.regno}</p>
                      </div>
                      <ArrowRight size={16} className="text-slate-400 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
