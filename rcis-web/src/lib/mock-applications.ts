export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under review'
  | 'Approved'
  | 'Needs revision'
  | 'Rejected';

export interface ApplicationRow {
  trackingNo: string;
  date: string;
  firmName: string;
  applicationFee: string;
  registrationFee: string;
  status: ApplicationStatus;
  comments: string;
}

export const MOCK_APPLICATIONS: ApplicationRow[] = [
  {
    trackingNo: 'RCIS/2026/00417',
    date: '2026-07-02',
    firmName: 'Baraka Civil Works Ltd',
    applicationFee: 'KES 1,000',
    registrationFee: 'KES 15,000',
    status: 'Under review',
    comments: 'Awaiting document verification',
  },
  {
    trackingNo: 'RCIS/2026/00398',
    date: '2026-06-21',
    firmName: 'Meridian Construction Co.',
    applicationFee: 'KES 1,000',
    registrationFee: 'KES 15,000',
    status: 'Needs revision',
    comments: 'Director ID copy illegible',
  },
  {
    trackingNo: 'RCIS/2026/00355',
    date: '2026-05-30',
    firmName: 'Baraka Civil Works Ltd',
    applicationFee: 'KES 1,000',
    registrationFee: 'KES 15,000',
    status: 'Approved',
    comments: 'Certificate issued',
  },
  {
    trackingNo: 'RCIS/2026/00312',
    date: '2026-05-11',
    firmName: 'Highland Roads Contractors',
    applicationFee: 'KES 1,000',
    registrationFee: '—',
    status: 'Draft',
    comments: 'Not yet submitted',
  },
];
