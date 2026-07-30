import FirmProfileStep from './FirmProfileStep';
import FirmRegistrationStep from './FirmRegistrationStep';
import type { FirmProfileData, FirmRegistrationData } from '../wizard-types';

interface CompanyDetailsStepProps {
  profileData: FirmProfileData;
  profileErrors: Partial<Record<keyof FirmProfileData, string>>;
  onProfileChange: (field: keyof FirmProfileData, value: string) => void;
  onVerify: () => void;
  verifying: boolean;
  verifyMessage?: { type: 'error' | 'warning' | 'info'; text: string };

  registrationData: FirmRegistrationData;
  registrationErrors: Partial<Record<keyof FirmRegistrationData, string>>;
  onRegistrationChange: (field: keyof FirmRegistrationData, value: string) => void;
  onCategoriesChange: (categories: string[]) => void;
}

// Merges the old "Firm Profile" and "Firm Registration" steps into a single
// wizard step - both are plain field grids about the firm with no
// intervening action, so there's no reason to force a page break between
// them. Each half keeps its own heading so the sections stay scannable.
export default function CompanyDetailsStep({
  profileData, profileErrors, onProfileChange, onVerify, verifying, verifyMessage,
  registrationData, registrationErrors, onRegistrationChange, onCategoriesChange,
}: CompanyDetailsStepProps) {
  return (
    <div className="space-y-8">
      <FirmProfileStep
        data={profileData}
        errors={profileErrors}
        onChange={onProfileChange}
        onVerify={onVerify}
        verifying={verifying}
        verifyMessage={verifyMessage}
      />
      <div className="border-t border-slate-100 pt-6">
        <FirmRegistrationStep
          data={registrationData}
          errors={registrationErrors}
          onChange={onRegistrationChange}
          onCategoriesChange={onCategoriesChange}
        />
      </div>
    </div>
  );
}
