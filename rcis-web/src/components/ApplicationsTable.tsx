import { Link } from 'react-router-dom';
import type { ContractorApplicationRecord } from '@/lib/api';

function statusLabel(status: string): { label: string; className: string } {
  if (status === 'SUBMITTED') return { label: 'Submitted', className: 'bg-blue-50 text-blue-700' };
  return { label: status, className: 'bg-slate-100 text-slate-600' };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const COLUMNS = ['Tracking No', 'Date', 'Firm Name', 'Application Type', 'Status', ''];

interface ApplicationsTableProps {
  applications: ContractorApplicationRecord[];
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
                <tr key={app.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                    {app.trackNo}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(app.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-700">{app.companyName || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{app.applicationType}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/applications/${app.id}`}
                      className="text-xs font-medium hover:underline"
                      style={{ color: 'var(--rcis-primary)' }}
                    >
                      View full details
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!loading && !error && applications.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-slate-400 text-sm">
                  No applications submitted yet.
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