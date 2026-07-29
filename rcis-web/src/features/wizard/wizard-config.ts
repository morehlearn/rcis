export const WIZARD_STEPS = [
  'Firm profile',
  'Firm registration',
  'Declarations',
  'Directors',
  'Offices',
  'Referees',
  'Fixed assets',
  'Staff',
  'Equipment & plant',
  'Project experience',
  'Litigation history',
  'Attachments',
  'Classification',
  'Review & submit',
] as const;

export type WizardMode = 'new' | 'renewal' | 'upgrade' | 'downgrade';

export const MODE_LABELS: Record<WizardMode, { title: string; subtitle: string }> = {
  new: {
    title: 'New contractor registration',
    subtitle: 'Register a new local contractor firm',
  },
  renewal: {
    title: 'Renewal of practising licence',
    subtitle: 'Renew an existing practising licence',
  },
  upgrade: {
    title: 'Certificate upgrade',
    subtitle: 'Apply to move up a registration category',
  },
  downgrade: {
    title: 'Certificate downgrade',
    subtitle: 'Apply to move down a registration category',
  },
};

export const MODE_TO_APPLICATION_TYPE: Record<WizardMode, string> = {
  new: 'New Application',
  renewal: 'Renewal',
  upgrade: 'Upgrade',
  downgrade: 'Downgrade',
};

export function resolveMode(param: string | null): WizardMode {
  if (param === 'renewal' || param === 'upgrade' || param === 'downgrade') return param;
  return 'new';
}