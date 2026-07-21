// --- Step 1: Firm profile ---

export interface FirmProfileData {
  incorporationNo: string;
  firmName: string;
  headOffice: string;
  postalAddress: string;
  county: string;
  town: string;
  localForeign: 'Local' | 'Foreign';
  website: string;
  telephone: string;
  cellPhone: string;
  email: string;
  latitude: string;
  longitude: string;
}

export const emptyFirmProfile: FirmProfileData = {
  incorporationNo: '',
  firmName: '',
  headOffice: '',
  postalAddress: '',
  county: '',
  town: '',
  localForeign: 'Local',
  website: '',
  telephone: '',
  cellPhone: '',
  email: '',
  latitude: '',
  longitude: '',
};

export const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu',
  'Machakos', 'Kajiado', 'Kilifi', 'Nyeri',
];

export const TOWNS = [
  'Nairobi West', 'Nairobi Central', 'Mombasa Island', 'Kisumu Central',
  'Nakuru Town East', 'Eldoret', 'Thika', 'Nyeri Town',
];

// --- Step 2: Firm registration ---

export interface FirmRegistrationData {
  firmType: string;
  incorporationNo: string;
  kraPin: string;
  registeredCapital: string;
  paidUpCapital: string;
  taxComplianceNo: string;
  bankName: string;
  bankBranch: string;
  agencyName: string;
  agencyRegistrationNo: string;
  agencyYear: string;
  associationName: string;
  associationNameOther: string;
  associationMembershipNo: string;
  jointVentureProjects: string;
  jointVentureFirms: string;
  hasAgpoCertificate: string;
  agpoCategories: string[];
  agpoExpiryDate: string;
}

export const emptyFirmRegistration: FirmRegistrationData = {
  firmType: 'Company',
  incorporationNo: '',
  kraPin: '',
  registeredCapital: '',
  paidUpCapital: '',
  taxComplianceNo: '',
  bankName: '',
  bankBranch: '',
  agencyName: '',
  agencyRegistrationNo: '',
  agencyYear: '',
  associationName: '',
  associationNameOther: '',
  associationMembershipNo: '',
  jointVentureProjects: '',
  jointVentureFirms: '',
  hasAgpoCertificate: '',
  agpoCategories: [],
  agpoExpiryDate: '',
};

export const AGPO_CATEGORIES = ['Women', 'Youth', 'Persons with Disability'];

export const FIRM_TYPES = ['Company', 'Partnership', 'Sole proprietor', 'Joint venture'];

export const BANKS = ['Equity Bank', 'KCB', 'Cooperative Bank', 'Absa', 'Stanbic', 'NCBA'];

export const AGENCIES = [
  'Ministry of Water', 'Ministry of Transport', 'Ministry of Energy',
  'NEMA', 'PPRA', 'Kenya Revenue Authority',
];

export const ASSOCIATIONS = [
  'The Kenya Federation of Master Builders',
  'Association of Consulting Engineers of Kenya',
  'Kenya Institute of Architects',
  'Other',
];

// --- Step 3: Declarations ---

export interface DeclarationsData {
  acceptCodeOfConduct: boolean;
  acceptTerms: boolean;
}

export const emptyDeclarations: DeclarationsData = {
  acceptCodeOfConduct: false,
  acceptTerms: false,
};

export const DECLARATION_ITEMS = [
  'My/our signing of this application form implies acceptance of responsibility for the veracity and accuracy of all information submitted therein or therewith.',
  'The information given will be used by the National Construction Authority for the purpose for evaluating this application for registration. Such registration will be approved at the sole discretion of the Authority.',
  'An employer, consultant or banker, past or present is hereby authorized and requested to provided information on the competence and general reputation of this firm if so requested by the Authority.',
  'The Authority may visit and physically inspect my /our establishment and authenticity of the information given herein, or by our referees or obtained from any other source regarding our firm.',
  'Failure to complete any part of this application form may result to not being registered.',
  'My/Our firm shall not be engaged in any acts of corruption in whatever form.',
  'I undertake to comply with the provisions of the code of conduct issued by the National Construction Authority as issued and any revisions from time to time.',
  'I understand that non-disclosure of any material information may lead to automatic disqualification of this application.',
];

// --- Application requirements popup ---

export interface RequirementItem {
  text: string;
  mandatory?: boolean;
  link?: boolean;
}

export const GENERAL_REQUIREMENTS: RequirementItem[] = [
  { text: 'Copies of Share/academic certificates and testimonials for the technically qualified directors' },
  { text: 'Certified copy of current business license' },
  { text: 'Copy of Company registration certificate' },
  { text: '3 Years audited accounts and other relevant financial information' },
  { text: 'Certified copies proving ownership of assets' },
  { text: 'KRA Tax compliance certificate', mandatory: true },
  { text: 'Contractors association membership certificate', mandatory: true },
];

export const SPECIALIST_REQUIREMENTS: RequirementItem[] = [
  { text: 'Electrical Installations (Minimum EPRA C2)', link: true },
  { text: 'Generating Plants, Lifts and Escalators. (EPRA C2)' },
  { text: 'Electronics (EPRA A2 Minimum)' },
  { text: 'Solar Power Generation and installation SOLAR PHOTOVOLTIAC (PV) (EPRA V2)' },
  { text: 'Construction of Power Transmission Lines and Installation of Power Distribution Equipment (EPRA C2)' },
  { text: 'Radio Communication (Licensed by CAK)' },
  { text: 'Structure of Cabling. (Licensed by CAK)' },
  { text: 'Telecommunication (PABX, Intercoms and Telephone Wiring) (Licensed by CAK)' },
  { text: 'Plumbing and Drainage. (Plumbers & Drain Layers)' },
  { text: 'Boilers, Incinerators and Pressure Vessels.(Boilers, Fabricator Inspectors)' },
];

// --- Step 4: Directors ---

export interface Director {
  id: string;
  idNo: string;
  fullNames: string;
  nationality: string;
  highestQualification: string;
  profession: string;
  yearsOfExperience: string;
  percentageShare: string;
  cvFileName: string;
  academicCertFileName: string;
}

export const emptyDirectorDraft: Omit<Director, 'id'> = {
  idNo: '',
  fullNames: '',
  nationality: 'Kenyan',
  highestQualification: '',
  profession: '',
  yearsOfExperience: '',
  percentageShare: '',
  cvFileName: '',
  academicCertFileName: '',
};

export const NATIONALITIES = ['Kenyan', 'Ugandan', 'Tanzanian', 'Rwandan', 'Other'];

export const QUALIFICATIONS = ['Certificate', 'Diploma', 'Degree', 'Masters', 'PhD'];

export const PROFESSIONS = [
  'Civil Engineer', 'Architect', 'Quantity Surveyor', 'Electrical Engineer',
  'Mechanical Engineer', 'Project Manager', 'Business Administrator', 'Other',
];

// --- Step 5: Offices ---

export interface Office {
  id: string;
  town: string;
  address: string;
  location: string;
}

export const emptyOfficeDraft: Omit<Office, 'id'> = {
  town: '',
  address: '',
  location: '',
};

// --- Shared document pool (used from Offices onward - Lease Agreements,
// Title Deeds, and later Assets/Equipment/Litigation supporting docs all
// live in one pool per application, tagged by type). ---

export const DOCUMENT_TYPES = [
  'CR12',
  'Tax Certificate',
  'Tax Compliance',
  'Audited Accounts',
  "Directors' Academic Qualifications",
  'Lease Agreement',
  'Title Deed',
  'Ownership Documents',
  'Other',
];