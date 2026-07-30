export const WIZARD_STEPS = [
  'Company details',
  'People',
  'Resources',
  'Track record',
  'Classification & documents',
  'Review & submit',
] as const;

export type WizardMode = 'new' | 'renewal' | 'upgrade' | 'downgrade' | 'certificate';

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
  certificate: {
    title: 'Apply for a new certificate/licence',
    subtitle: 'Add a class or licence to an existing registration',
  },
};

export const MODE_TO_APPLICATION_TYPE: Record<WizardMode, string> = {
  new: 'New Application',
  renewal: 'Renewal',
  upgrade: 'Upgrade',
  downgrade: 'Downgrade',
  certificate: 'Additional Certificate',
};

export function resolveMode(param: string | null): WizardMode {
  if (param === 'renewal' || param === 'upgrade' || param === 'downgrade' || param === 'certificate') return param;
  return 'new';
}