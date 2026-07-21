export interface NavChild {
  label: string;
  to: string;
}

export interface NavSection {
  key: string;
  label: string;
  to?: string;
  children?: NavChild[];
}

export const SIDEBAR_SECTIONS: NavSection[] = [
  {
    key: 'local',
    label: 'Local contractor registration',
    children: [
      { label: 'Contractor registration', to: '/apply?mode=new' },
      { label: 'Renewal of practising licence', to: '/apply?mode=renewal' },
      { label: 'Certificate upgrade', to: '/apply?mode=upgrade' },
      { label: 'Certificate downgrade', to: '/apply?mode=downgrade' },
      { label: 'My licence(s) / certificate(s)', to: '/licences' },
      { label: 'Verify licence(s) / certificate(s)', to: '/verify' },
      { label: 'Submit change request', to: '/change-request' },
      { label: 'FAQs', to: '/faqs' },
    ],
  },
  { key: 'foreign', label: 'Foreign contractor registration', to: '/apply?mode=new&type=foreign' },
  { key: 'accreditation', label: 'Accreditation', to: '/accreditation' },
  { key: 'training', label: 'Training', to: '/training' },
];

export interface PanelLink {
  label: string;
  to: string;
  icon: 'plus' | 'file' | 'licence' | 'certificate' | 'refresh' | 'arrow-up' | 'arrow-down' | 'book';
  accent: 'primary' | 'accent';
}

export const SERVICE_CARDS = [
  {
    key: 'new',
    title: 'New applications',
    description: 'Register a new contractor firm',
    to: '/apply?mode=new',
    panelLinks: [
      { label: 'New Contractor Registration', to: '/apply?mode=new', icon: 'plus', accent: 'primary' },
      { label: 'Apply for a new Contractor Certificate/Licence', to: '/apply?mode=new&type=certificate', icon: 'file', accent: 'accent' },
      { label: 'My Licence(s)', to: '/licences', icon: 'licence', accent: 'accent' },
      { label: 'My Certificate(s)', to: '/certificates', icon: 'certificate', accent: 'accent' },
    ] as PanelLink[],
  },
  {
    key: 'renewals',
    title: 'Renewals',
    description: 'Renew a practising licence',
    to: '/apply?mode=renewal',
    panelLinks: [
      { label: 'Renewal of Practising Licence', to: '/apply?mode=renewal', icon: 'refresh', accent: 'primary' },
      { label: 'My Licence(s)', to: '/licences', icon: 'licence', accent: 'accent' },
      { label: 'My Certificate(s)', to: '/certificates', icon: 'certificate', accent: 'accent' },
    ] as PanelLink[],
  },
  {
    key: 'upgrade',
    title: 'Upgrade / downgrade',
    description: 'Change your registration category',
    to: '/apply?mode=upgrade',
    panelLinks: [
      { label: 'Apply for Category Upgrade', to: '/apply?mode=upgrade', icon: 'arrow-up', accent: 'primary' },
      { label: 'Apply for Category Downgrade', to: '/apply?mode=downgrade', icon: 'arrow-down', accent: 'accent' },
      { label: 'My Licence(s)', to: '/licences', icon: 'licence', accent: 'accent' },
      { label: 'My Certificate(s)', to: '/certificates', icon: 'certificate', accent: 'accent' },
    ] as PanelLink[],
  },
  {
    key: 'training',
    title: 'Training',
    description: 'Book accredited training sessions',
    to: '/training',
    panelLinks: [
      { label: 'Available Trainings', to: '/training?tab=available', icon: 'book', accent: 'primary' },
      { label: 'Registered Trainings', to: '/training?tab=registered', icon: 'book', accent: 'primary' },
      { label: 'Training Feedback', to: '/training?tab=feedback', icon: 'book', accent: 'primary' },
    ] as PanelLink[],
  },
];
