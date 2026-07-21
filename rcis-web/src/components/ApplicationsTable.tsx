import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ContractorCompany } from '@/lib/api';

// Real submission-status tracking (Under review, Approved, etc.) doesn't
// exist yet - there's no reviewer/admin workflow built. For now every
// application is either still being filled in (DRAFT) or has passed
// Declarations (anything else), shown simply as "In Progress" / "Submitted".
function statusLabel(status: string): { label: string; className: string } {
  if (status === 'DRAFT') {
    return { label: 'In Progress', className: 'bg-slate-100 text-slate-600' };
  }
  return { label: 'Submitted', className: 'bg-blue-50 text-blue-700' };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const COLUMNS = ['Tracking No', 'Date', 'Firm Name', 'Status', ''];

interface ApplicationsTableProps {
  applications: ContractorCompany[];
  loading: boolean;
  error: string;
}

export default function ApplicationsTable({ applications, loading, error }: ApplicationsTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">My applications</h2>
        <span className="text-xs text-slate-400">{applications.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              {COLUMNS.map((col) => (
                <th key={col} className="px-4 py-2.5 font-medium whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const status = statusLabel(app.status);
              return (
                <tr key={app.regno} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-[var(--rcis-primary)] whitespace-nowrap">
                    {app.regno}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(app.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-700">{app.firmName || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/apply?regno=${encodeURIComponent(app.regno)}`}
                      className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                      style={{ color: 'var(--rcis-accent)' }}
                    >
                      Continue
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!loading && !error && applications.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No applications yet.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-slate-400 text-sm">
                  Loading your applications...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-red-500 text-sm">
                  {error}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}