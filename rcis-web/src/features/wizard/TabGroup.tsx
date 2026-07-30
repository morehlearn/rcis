import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

export interface TabGroupTab {
  key: string;
  label: string;
  complete: boolean;
  content: ReactNode;
}

interface TabGroupProps {
  tabs: TabGroupTab[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

// Shared tab shell for the grouped wizard steps (People, Resources, Track
// record) - each of those steps combines 2-3 of the old repeatable-entity
// steps (Directors/Referees/Staff, etc.) which already share an identical
// prop shape, so this just switches which one is mounted.
//
// Controlled from the parent wizard page: "Save and continue" steps through
// tabs one at a time rather than jumping straight to the next wizard step,
// so nobody's Referees or Staff tab gets skipped just because Directors was
// filled in first. Clicking a tab directly still jumps straight there.
export default function TabGroup({ tabs, activeIndex, onActiveIndexChange }: TabGroupProps) {
  const active = tabs[activeIndex] ?? tabs[0];

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-5 border-b border-slate-100 pb-3">
        {tabs.map((tab, i) => {
          const isActive = tab.key === active?.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onActiveIndexChange(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md"
              style={{
                backgroundColor: isActive ? 'var(--rcis-primary)' : 'transparent',
                color: isActive ? '#fff' : '#64748b',
              }}
            >
              {tab.label}
              {tab.complete && (
                <Check size={12} className={isActive ? 'text-white' : 'text-emerald-500'} />
              )}
            </button>
          );
        })}
      </div>
      {active?.content}
    </div>
  );
}
