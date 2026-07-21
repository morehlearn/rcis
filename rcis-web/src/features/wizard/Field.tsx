import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function Field({ label, required, error, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">
        {label} {required && <span style={{ color: 'var(--rcis-accent)' }}>*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export function inputCls(err?: string) {
  return `w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-white ${
    err
      ? 'border-red-300 focus:ring-red-100'
      : 'border-slate-300 focus:ring-[var(--rcis-primary)]/20 focus:border-[var(--rcis-primary)]'
  }`;
}
