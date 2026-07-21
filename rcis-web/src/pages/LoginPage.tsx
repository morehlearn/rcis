import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Field, inputCls } from '@/features/wizard/Field';
import { loginUser } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      const { accessToken, user } = await loginUser({ email, password });
      saveAuth(accessToken, user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--rcis-sand)] flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-4">
          <img src="/nca-logo.png" alt="National Construction Authority" className="w-3/4 h-auto" />
          <h2 className="mt-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Welcome to NCA Portal
          </h2>
          <div className="mt-2 h-1 w-24 rounded" style={{ backgroundColor: 'var(--rcis-primary)' }} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3
            className="text-center text-sm font-semibold uppercase tracking-wide mb-5"
            style={{ color: 'var(--rcis-primary)' }}
          >
            Login
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <Field label="Email Address" required>
              <input
                className={inputCls()}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
              />
            </Field>

            <Field label="Password" required>
              <input
                className={inputCls()}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-md text-white text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: 'var(--rcis-primary)' }}
            >
              {submitting ? 'Signing in...' : 'Login'}
            </button>

            <Link
              to="/register"
              className="block w-full py-2.5 rounded-md text-white text-sm font-semibold text-center"
              style={{ backgroundColor: 'var(--rcis-accent)' }}
            >
              Create an Account
            </Link>
          </form>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-xs hover:underline" style={{ color: 'var(--rcis-primary)' }}>
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}