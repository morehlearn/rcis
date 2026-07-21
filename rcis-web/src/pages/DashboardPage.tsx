import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ServiceCard from '@/components/ServiceCard';
import ServicePanel from '@/components/ServicePanel';
import ApplicationsTable from '@/components/ApplicationsTable';
import { SERVICE_CARDS } from '@/lib/nav-config';
import { listMyApplications, type ContractorCompany } from '@/lib/api';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const [applications, setApplications] = useState<ContractorCompany[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appsError, setAppsError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoadingApps(true);
    listMyApplications()
      .then((data) => {
        if (!cancelled) setApplications(data);
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

  // Most recently updated DRAFT application, if any - the one "Continue
  // with your application" resumes.
  const inProgress = applications.find((a) => a.status === 'DRAFT');

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
            <ApplicationsTable applications={applications} loading={loadingApps} error={appsError} />
          </section>
        </main>
      </div>
    </div>
  );
}