import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Home } from 'lucide-react';
import { SIDEBAR_SECTIONS } from '@/lib/nav-config';

interface SidebarProps {
  open: boolean;
}

// Sidebar items render as solid color buttons stacked with a small gap,
// matching the reference screenshots. Dashboard uses the darker shade;
// every other top-level item uses the brand blue. Expanding a section
// reveals its children on a white background beneath the button.
export default function Sidebar({ open }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ local: true });

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside
      className={`${
        open ? 'block' : 'hidden'
      } lg:block w-72 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-3`}
    >
      <nav className="flex flex-col gap-[2px]">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-white rounded-sm"
          style={{ backgroundColor: 'var(--rcis-primary-dark)' }}
        >
          <Home size={16} />
          DASHBOARD
        </Link>

        {SIDEBAR_SECTIONS.map((section) => {
          if (section.children) {
            const isOpen = !!expanded[section.key];
            return (
              <div key={section.key}>
                <button
                  onClick={() => toggle(section.key)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-semibold text-white text-left rounded-sm"
                  style={{ backgroundColor: 'var(--rcis-primary)' }}
                >
                  <span>{section.label}</span>
                  {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </button>
                {isOpen && (
                  <div className="py-1">
                    {section.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block px-4 py-2 pl-8 text-[13px] text-slate-600 hover:text-[var(--rcis-primary)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={section.key}
              to={section.to!}
              className="block px-4 py-2.5 text-sm font-semibold text-white rounded-sm"
              style={{ backgroundColor: 'var(--rcis-primary)' }}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
