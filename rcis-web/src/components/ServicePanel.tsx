import { Link } from 'react-router-dom';
import { X, Plus, FileText, CreditCard, Award, RefreshCw, ArrowUp, ArrowDown, BookOpen } from 'lucide-react';
import type { PanelLink } from '@/lib/nav-config';

const PANEL_ICONS: Record<PanelLink['icon'], typeof Plus> = {
  plus: Plus,
  file: FileText,
  licence: CreditCard,
  certificate: Award,
  refresh: RefreshCw,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  book: BookOpen,
};

interface ServicePanelProps {
  links: PanelLink[];
  onClose: () => void;
}

export default function ServicePanel({ links, onClose }: ServicePanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white relative">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-red-600 hover:bg-red-50 shadow-sm"
      >
        <X size={14} />
      </button>
      {links.map((link, i) => {
        const Icon = PANEL_ICONS[link.icon];
        const color = link.accent === 'primary' ? 'var(--rcis-primary)' : 'var(--rcis-accent)';
        return (
          <Link
            key={link.to + link.label}
            to={link.to}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-medium hover:bg-slate-50 ${
              i < links.length - 1 ? 'border-b border-slate-100' : ''
            }`}
            style={{ color }}
          >
            <Icon size={16} className="shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
