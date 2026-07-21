import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '@/lib/auth';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    // Preserve where they were headed so we can send them back after login.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}