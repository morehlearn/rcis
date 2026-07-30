import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ServiceCard from '@/components/ServiceCard';
import ServicePanel from '@/components/ServicePanel';
import ApplicationsTable from '@/components/ApplicationsTable';
import { SERVICE_CARDS } from '@/lib/nav-config';
import { listMyApplications, listMySubmissions, type ContractorCompany, type ContractorApplicationRecord } from '@/lib/api';

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // The wizard redirects here after a submit (or when someone tries to
  // re-open an already-submitted application) with a one-off message in
  // route state. Read it once, then clear it from history so a refresh or
  // back-navigation doesn't show it again.
  const [notice, setNotice] = useState<string | null>(
    (location.state as { notice?: string } | null)?.notice ?? null,
  );

  useEffect(() => {
    if (!notice) return;
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [companies, setCompanies] = useState<ContractorCompany[]>([]);
  const [submissions, setSubmissions] = useState<ContractorApplicationRecord[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appsError, setAppsError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoadingApps(true);
    Promise.all([listMyApplications(), listMySubmissions()])
      .then(([companyRecords, submissionRecords]) => {
        if (cancelled) return;
        setCompanies(companyRecords);
        setSubmissions(submissionRecords);
      })
      .catch((err) => {
        if (!cancelled) setAppsError(err instanceof Error ? err.message : 'Could not load your applications.');
      })
      .finally(() => {
        if (!cancelled) setLoadingApps(false);
      });
    return () => { cancelled = true; };
  }, []);

  const active = SERVICE_CARDS.find((c) => c.key === activeCard && c.panelLinks);

  // A company counts as "in progress" only if it has never actually
  // completed a submission yet - once at least one ContractorApplication
  // exists for it, it's an established company, not an unfinished draft.
  const submittedRegnos = new Set(submissions.map((s) => s.regno));
  const inProgress = companies.find((c) => !submittedRegnos.has(c.regno));

  return (
    <div className="min-h-screen bg-[var(--rcis-sand)]">
      <TopNav onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your contractor registration, renewals, and certificates.
            </p>
          </div>

          {notice && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>{notice}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotice(null)}
                aria-label="Dismiss"
                className="shrink-0 text-emerald-600 hover:text-emerald-800"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {inProgress && (
            <Link
              to={`/apply?regno=${encodeURIComponent(inProgress.regno)}`}
              className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium hover:shadow-sm transition-shadow"
              style={{ borderColor: 'var(--rcis-primary)', backgroundColor: 'color-mix(in srgb, var(--rcis-primary) 6%, white)' }}
            >
              <span style={{ color: 'var(--rcis-primary)' }}>
                Continue with your application — {inProgress.firmName || inProgress.regno}
              </span>
              <ArrowRight size={16} style={{ color: 'var(--rcis-primary)' }} />
            </Link>
          )}

          <section>
            <h2 className="text-lg font-bold text-[var(--rcis-accent)] uppercase tracking-wide pb-2 border-b-2 border-[var(--rcis-accent)] mb-4">
              Services
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {active ? (
                <>
                  <ServiceCard
                    cardKey={active.key}
                    title={active.title}
                    description={active.description}
                    onClick={() => setActiveCard(null)}
                  />
                  <div className="col-span-2 lg:col-span-3">
                    <ServicePanel links={active.panelLinks!} onClose={() => setActiveCard(null)} />
                  </div>
                </>
              ) : (
                SERVICE_CARDS.map((card) => (
                  <ServiceCard
                    key={card.key}
                    cardKey={card.key}
                    title={card.title}
                    description={card.description}
                    to={card.panelLinks ? undefined : card.to}
                    onClick={card.panelLinks ? () => setActiveCard(card.key) : undefined}
                  />
                ))
              )}
            </div>
          </section>

          <section>
            <ApplicationsTable applications={submissions} loading={loadingApps} error={appsError} />
          </section>
        </main>
      </div>
    </div>
  );
}