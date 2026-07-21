import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Field, inputCls } from '@/features/wizard/Field';
import VerifyField from '@/components/VerifyField';
import { registerUser } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

type AccountType = 'LOCAL_CONTRACTOR' | 'FOREIGN_CONTRACTOR' | 'SKILLED_WORKER' | 'SITE_SUPERVISOR';

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'LOCAL_CONTRACTOR', label: 'Local Contractor' },
  { value: 'FOREIGN_CONTRACTOR', label: 'Foreign Contractor' },
  { value: 'SKILLED_WORKER', label: 'Skilled Worker' },
  { value: 'SITE_SUPERVISOR', label: 'Site Supervisor' },
];

const CONTRACTOR_TYPES: AccountType[] = ['LOCAL_CONTRACTOR', 'FOREIGN_CONTRACTOR'];

interface FormState {
  nationalId: string;
  fullName: string;
  accountType: AccountType | '';
  companyName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emptyForm: FormState = {
  nationalId: '',
  fullName: '',
  accountType: '',
  companyName: '',
  mobileNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);   // ← add this
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const isContractor = form.accountType ? CONTRACTOR_TYPES.includes(form.accountType) : false;

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === 'mobileNumber' && phoneVerified) setPhoneVerified(false);
    if (field === 'email' && emailVerified) setEmailVerified(false);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

   if (!form.mobileNumber.trim()) next.mobileNumber = 'Required';
if (!form.email.trim()) next.email = 'Required';
if (!form.password) next.password = 'Required';
if (form.password && form.password.length < 8) next.password = 'Must be at least 8 characters';
if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
if (!form.mobileNumber.trim()) next.mobileNumber = 'Required';        // duplicate
    else if (!phoneVerified) next.mobileNumber = 'Please verify your mobile number';
if (!form.email.trim()) next.email = 'Required';                       // duplicate
    else if (!emailVerified) next.email = 'Please verify your email address';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setApiError('');
  if (!validate()) return;

  setSubmitting(true);
  try {
    const { accessToken, user } = await registerUser({
      nationalId: form.nationalId,
      fullName: form.fullName,
      accountType: form.accountType as string,
      companyName: isContractor ? form.companyName : undefined,
      mobileNumber: form.mobileNumber,
      email: form.email,
      password: form.password,
    });
    saveAuth(accessToken, user);
    setSubmitted(true);
    setTimeout(() => navigate('/'), 1200);
  } catch (err) {
    setApiError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
            Create an Account
          </h3>

          {submitted ? (
            <div className="text-center py-6">
              <p className="text-sm font-medium text-slate-800">Account created successfully</p>
              <p className="text-xs text-slate-500 mt-1">
                Taking you to your dashboard...
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <Field label="National ID/Passport No." required error={errors.nationalId}>
                <input
                  className={inputCls(errors.nationalId)}
                  value={form.nationalId}
                  onChange={(e) => handleChange('nationalId', e.target.value)}
                  placeholder="National ID/Passport No."
                />
              </Field>

              <Field label="Full Name" required error={errors.fullName}>
                <input
                  className={inputCls(errors.fullName)}
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Full Name"
                />
              </Field>

              <Field label="Account Type" required error={errors.accountType}>
                <select
                  className={inputCls(errors.accountType)}
                  value={form.accountType}
                  onChange={(e) => handleChange('accountType', e.target.value)}
                >
                  <option value="">--Please Select--</option>
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>

              {isContractor && (
                <Field label="Company Name" required error={errors.companyName}>
                  <input
                    className={inputCls(errors.companyName)}
                    value={form.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder="Company Name"
                  />
                </Field>
              )}

              <VerifyField
                    label="Mobile Number"
                    value={form.mobileNumber}
                    onChange={(v) => handleChange('mobileNumber', v)}
                    verified={phoneVerified}
                    onVerified={() => setPhoneVerified(true)}
                    error={errors.mobileNumber}
                    placeholder="+254700000000"
                />
              <VerifyField
                    label="Email Address"
                    value={form.email}
                    onChange={(v) => handleChange('email', v)}
                    verified={emailVerified}
                    onVerified={() => setEmailVerified(true)}
                    error={errors.email}
                    type="email"
                    placeholder="Email Address"
                />

              <Field label="Password" required error={errors.password}>
                <input
                  className={inputCls(errors.password)}
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter Password"
                />
              </Field>

              <Field label="Confirm Password" required error={errors.confirmPassword}>
                <input
                  className={inputCls(errors.confirmPassword)}
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Confirm Password"
                />
              </Field>

              <button
                type="submit"
                className="w-full py-2.5 rounded-md text-white text-sm font-semibold"
                style={{ backgroundColor: 'var(--rcis-accent)' }}
              >
                Register
              </button>

              <Link
                to="/login"
                className="block w-full py-2.5 rounded-md text-white text-sm font-semibold text-center"
                style={{ backgroundColor: 'var(--rcis-primary)' }}
              >
                Login
              </Link>
            </form>
          )}

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