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

// --- Step 6: Referees ---

export interface Referee {
  id: string;
  name: string;
  postalAddress: string;
  telephone: string;
  profession: string;
}

export const emptyRefereeDraft: Omit<Referee, 'id'> = {
  name: '',
  postalAddress: '',
  telephone: '',
  profession: '',
};

export interface Asset {
  id: string;
  description: string;
  registrationNo: string;
}

export const emptyAssetDraft: Omit<Asset, 'id'> = {
  description: '',
  registrationNo: '',
};

// --- Step 8: Staff ---

export interface Staff {
  id: string;
  fullNames: string;
  idNo: string;
  nationality: string;
  highestQualification: string;
  yearsOfExperience: string;
}

export const emptyStaffDraft: Omit<Staff, 'id'> = {
  fullNames: '',
  idNo: '',
  nationality: 'Kenyan',
  highestQualification: '',
  yearsOfExperience: '',
};

// --- Step 9: Equipment & Plant ---

export interface Equipment {
  id: string;
  name: string;
  ownedOrLeased: string;
  typeMakeModel: string;
  category: string;
  registrationNo: string;
}

export const emptyEquipmentDraft: Omit<Equipment, 'id'> = {
  name: '',
  ownedOrLeased: '',
  typeMakeModel: '',
  category: '',
  registrationNo: '',
};

export const OWNED_OR_LEASED = ['Owned', 'Leased'];

export const EQUIPMENT_CATEGORIES = [
  'Earthmoving Equipment', 'Lifting Equipment', 'Concrete Equipment',
  'Transport Vehicles', 'Compaction Equipment', 'Other',
];

// --- Step 10: Project Experience ---

export interface ProjectExperience {
  id: string;
  project: string;
  ncaProjectRegNo: string;
  contractSum: string;
  contractPeriod: string;
}

export const emptyProjectExperienceDraft: Omit<ProjectExperience, 'id'> = {
  project: '',
  ncaProjectRegNo: '',
  contractSum: '',
  contractPeriod: '',
};

// --- Step 11: Litigation History ---

export interface Litigation {
  id: string;
  refNo: string;
  date: string;
  partiesInvolved: string;
  particularOfLitigation: string;
  statusOfMatter: string;
}

export const emptyLitigationDraft: Omit<Litigation, 'id'> = {
  refNo: '',
  date: '',
  partiesInvolved: '',
  particularOfLitigation: '',
  statusOfMatter: '',
};


// --- Step 13: Classification ---

export const APPLICATION_TYPES = ['New Application', 'Renewal', 'Upgrade', 'Downgrade'];

export const NCA_CATEGORIES = ['NCA1', 'NCA2', 'NCA3', 'NCA4', 'NCA5', 'NCA6', 'NCA7', 'NCA8'];

export interface SubClassOption {
  code: string;
  label: string;
  requiredAttachment?: string;
}

export const ELECTRICAL_SUBCLASSES: SubClassOption[] = [
  { code: 'EES1', label: 'Electrical Installation', requiredAttachment: 'EPRA Certificate (Min C2)' },
  { code: 'EES2', label: 'Electronic', requiredAttachment: 'EPRA Certificate (Min A2)' },
  { code: 'EES3', label: 'Lift hoists, escalators, mechanical ramps, travolators, conveyors and belt installation', requiredAttachment: 'EPRA Certificate (C2)' },
  { code: 'EES4', label: 'Generating plants and Control Panels', requiredAttachment: 'EPRA Certificate (C2)' },
  { code: 'EES5', label: 'Solar Power Generation and Photovoltaic cells installations', requiredAttachment: 'EPRA Certificate (V2)' },
  { code: 'EES6', label: 'Water Tanks, Treatment Plant and Pumping Plant' },
  { code: 'EES7', label: 'Compressed Air, Hydraulic, Lp and Mechanical Gas installation' },
  { code: 'EES8', label: 'Installation of Uninterrupted Power supply Systems (UPS), Automatic Voltage Regulators (AVR) and Surge Protectors' },
  { code: 'EES9', label: 'Retrofitting for Improving Energy Efficiency' },
  { code: 'EES10', label: 'Construction of Power Transmission Lines and Installation of Power Distributors Equipment', requiredAttachment: 'EPRA Certificate (C2)' },
  { code: 'EES11', label: 'Electronic communications (public address systems and conferences systems)' },
  { code: 'EES12', label: 'Radio Communications', requiredAttachment: 'CAK License' },
  { code: 'EES13', label: 'Structured Cabling and computer networking Installations', requiredAttachment: 'CAK License' },
  { code: 'EES14', label: 'Security Surveillance Systems (CCTV) intruder Alarm and access control systems' },
  { code: 'EES15', label: 'Telecommunications PABX, intercoms and telephone wiring', requiredAttachment: 'CAK License' },
];

export const MECHANICAL_SUBCLASSES: SubClassOption[] = [
  { code: 'MES1', label: 'Plumbing, Drainage and Sanitary Fittings', requiredAttachment: 'Plumbers & Drain Layers License' },
  { code: 'MES2', label: 'Refrigeration, cold rooms, Air-Conditioning and Ventilation' },
  { code: 'MES3', label: 'Kitchen and Laundry Equipment and Refuse Disposal Systems' },
  { code: 'MES4', label: 'Boilers, Incinerators and Pressure Vessels', requiredAttachment: 'Boilers/Fabricator Inspector Certificate' },
  { code: 'MES5', label: 'Solar Heating Systems' },
  { code: 'MES6', label: 'Water Tanks, Treatment Plant and Pumping Plant' },
  { code: 'MES7', label: 'Compressed Air, Hydraulic, Lp and Mechanical Gas installation' },
  { code: 'MES8', label: 'Cranes and Hoists' },
  { code: 'MES9', label: 'Fire Engineering Services' },
  { code: 'MES10', label: 'Health club facilities' },
  { code: 'MES11', label: 'Borehole equipment' },
  { code: 'MES12', label: 'Hospital Equipment' },
  { code: 'MES13', label: 'Mobile Shelving' },
  { code: 'MES14', label: 'Roof rain-water harvesting' },
  { code: 'MES15', label: 'Laboratory installations and Fume cupboards' },
  { code: 'MES16', label: 'Swimming pool installation' },
  { code: 'MES17', label: 'Oil storage, Pumping Reticulation' },
];

export interface ClassificationData {
  applicationType: string;
  buildingWorksCategory: string;
  roadWorksCategory: string;
  waterWorksCategory: string;
  electricalSubClasses: string[];
  electricalCategory: string;
  mechanicalSubClasses: string[];
  mechanicalCategory: string;
}

export const emptyClassification: ClassificationData = {
  applicationType: 'New Application',
  buildingWorksCategory: 'NCA1',
  roadWorksCategory: 'NCA1',
  waterWorksCategory: 'NCA1',
  electricalSubClasses: [],
  electricalCategory: 'NCA1',
  mechanicalSubClasses: [],
  mechanicalCategory: 'NCA1',
};

