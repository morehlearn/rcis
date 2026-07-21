import { Link } from 'react-router-dom';
import { FileText, RefreshCw, ArrowUpDown, BookOpen } from 'lucide-react';

const ICONS: Record<string, typeof FileText> = {
  new: FileText,
  renewals: RefreshCw,
  upgrade: ArrowUpDown,
  training: BookOpen,
};

// New/Renewals/Upgrade-Downgrade use the blue brand color; only Training
// uses the orange accent, matching the reference screenshots.
const ICON_COLOR: Record<string, string> = {
  new: 'var(--rcis-primary)',
  renewals: 'var(--rcis-primary)',
  upgrade: 'var(--rcis-primary)',
  training: 'var(--rcis-accent)',
};

interface ServiceCardProps {
  cardKey: string;
  title: string;
  description: string;
  to?: string;
  onClick?: () => void;
}

function CardBody({ cardKey, title, description }: Pick<ServiceCardProps, 'cardKey' | 'title' | 'description'>) {
  const Icon = ICONS[cardKey] ?? FileText;
  const color = ICON_COLOR[cardKey] ?? 'var(--rcis-primary)';

  return (
    <>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        <Icon size={22} />
      </div>
      <div className="mt-3 font-semibold text-slate-800 text-xs uppercase tracking-wide">{title}</div>
      <div className="mt-1 text-xs text-slate-500 leading-relaxed">{description}</div>
    </>
  );
}

export default function ServiceCard({ cardKey, title, description, to, onClick }: ServiceCardProps) {
  const className = 'rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow block text-left w-full';

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        <CardBody cardKey={cardKey} title={title} description={description} />
      </button>
    );
  }

  return (
    <Link to={to!} className={className}>
      <CardBody cardKey={cardKey} title={title} description={description} />
    </Link>
  );
}
