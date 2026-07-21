import { Link, useNavigate } from 'react-router-dom';
import { Home, Grid2x2, FileBadge, User, LogOut, Menu } from 'lucide-react';
import { clearAuth } from '@/lib/auth';


interface TopNavProps {
  onMenuClick?: () => void;
}

const LINKS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Services', to: '/services', icon: Grid2x2 },
  { label: 'My licences/certificates', to: '/licences', icon: FileBadge },
  { label: 'My profile', to: '/profile', icon: User },
];

export default function TopNav({ onMenuClick
  
 }: TopNavProps) {
    const navigate = useNavigate();

    const handleSignOut = () => {
      clearAuth();
      navigate('/login');
    };
  return (
    <header className="sticky top-0 z-30 bg-[var(--rcis-primary)] text-white shadow-md">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-[var(--rcis-accent)] flex items-center justify-center font-bold text-sm">
              <div className="bg-white rounded px-1.5 py-1">
              <img src="/nca-logo.png" alt="National Construction Authority" className="h-6 w-auto" />
            </div>
            </div>
            <div className="leading-tight text-left">
              <div className="font-semibold text-sm tracking-wide">RCIS</div>
              <div className="text-[11px] text-white/70 hidden sm:block">
                Contractor Registration &amp; Information System
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 px-3 py-2 rounded text-sm text-white/90 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-sm text-white/90 hover:bg-white/10 hover:text-white transition-colors ml-2 border-l border-white/20"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
