import { useState } from 'react';
import { Check } from 'lucide-react';
import { Field, inputCls } from '@/features/wizard/Field';

interface VerifyFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  verified: boolean;
  onVerified: () => void;
  error?: string;
  type?: string;
  placeholder?: string;
}

// Frontend-only mock: "Verify" reveals an OTP box, any non-empty code is
// accepted as correct. Real send/verify against phone or email happens once
// the backend has an OTP endpoint — this proves out the interaction for now.
export default function VerifyField({
  label, value, onChange, verified, onVerified, error, type = 'text', placeholder,
}: VerifyFieldProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleSendOtp = () => {
    if (!value.trim()) return;
    setOtpSent(true);
    setOtpError('');
  };

  const handleConfirm = () => {
    if (!otp.trim()) {
      setOtpError('Enter the code sent to you');
      return;
    }
    setOtpSent(false);
    setOtp('');
    onVerified();
  };

  return (
    <div>
      <Field label={label} required error={error}>
        <div className="flex gap-2">
          <input
            className={inputCls(error)}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={verified}
          />
          {verified ? (
            <span className="flex items-center gap-1 px-3 rounded-md text-xs font-medium text-white shrink-0 bg-emerald-600">
              <Check size={14} />
              Verified
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSendOtp}
              className="px-3 rounded-md text-white text-xs font-medium shrink-0"
              style={{ backgroundColor: 'var(--rcis-accent)' }}
            >
              Verify
            </button>
          )}
        </div>
      </Field>

      {otpSent && !verified && (
        <div className="mt-2 flex gap-2 items-start">
          <div className="flex-1">
            <input
              className={inputCls(otpError)}
              value={otp}
              onChange={(e) => { setOtp(e.target.value); setOtpError(''); }}
              placeholder="Enter verification code"
            />
            {otpError && <p className="text-[11px] text-red-600 mt-1">{otpError}</p>}
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-3 py-2 rounded-md text-white text-xs font-medium shrink-0"
            style={{ backgroundColor: 'var(--rcis-primary)' }}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}