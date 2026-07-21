import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';

export default function ComingSoonPage({ title }: { title: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--rcis-sand)]">
      <TopNav onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        <main className="flex-1 min-w-0 p-6 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-full bg-[var(--rcis-primary)]/10 text-[var(--rcis-primary)] flex items-center justify-center mx-auto">
              <Construction size={24} />
            </div>
            <h1 className="mt-4 font-semibold text-slate-800">{title}</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              This page hasn't been built yet — we're working through the dashboard links one at a time.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-1.5 text-sm text-[var(--rcis-primary)] font-medium hover:underline"
            >
              <ArrowLeft size={15} />
              Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
