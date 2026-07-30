import { getToken } from './auth';

const API_BASE_URL = 'http://localhost:3000';

export interface AuthUser {
  id: string;
  nationalId: string;
  fullName: string;
  accountType: string;
  companyName: string | null;
  mobileNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  nationalId: string;
  fullName: string;
  accountType: string;
  companyName?: string;
  mobileNumber: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface FirmProfilePayload {
  incorporationNo: string;
  firmName?: string;
  headOffice: string;
  postalAddress?: string;
  county?: string;
  town: string;
  localForeign: string;
  website?: string;
  telephone: string;
  cellPhone: string;
  email?: string;
  latitude?: string;
  longitude?: string;
}

export interface ContractorCompany extends FirmProfilePayload {
  regno: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Firm registration fields - only populated once Step 2 has been saved.
  firmType?: string | null;
  kraPin?: string | null;
  registeredCapital?: string | null;
  paidUpCapital?: string | null;
  taxComplianceNo?: string | null;
  bankName?: string | null;
  bankBranch?: string | null;
  agencyName?: string | null;
  agencyRegistrationNo?: string | null;
  agencyYear?: string | null;
  associationName?: string | null;
  associationNameOther?: string | null;
  associationMembershipNo?: string | null;
  jointVentureProjects?: string | null;
  jointVentureFirms?: string | null;
  hasAgpoCertificate?: string | null;
  agpoCategories?: string[];
  agpoExpiryDate?: string | null;
  // Declarations - only meaningfully true once Step 3 has been saved.
  acceptCodeOfConduct?: boolean;
  acceptTerms?: boolean;
}

export interface FirmRegistrationPayload {
  regno: string;
  firmType?: string;
  kraPin?: string;
  registeredCapital?: string;
  paidUpCapital?: string;
  taxComplianceNo?: string;
  bankName?: string;
  bankBranch?: string;
  agencyName?: string;
  agencyRegistrationNo?: string;
  agencyYear?: string;
  associationName?: string;
  associationNameOther?: string;
  associationMembershipNo?: string;
  jointVentureProjects?: string;
  jointVentureFirms?: string;
  hasAgpoCertificate?: string;
  agpoCategories?: string[];
  agpoExpiryDate?: string;
}

export interface DeclarationsPayload {
  regno: string;
  acceptCodeOfConduct: boolean;
  acceptTerms: boolean;
}

export interface ContractorDirectorRecord {
  id: string;
  regno: string;
  idNo: string;
  fullNames: string;
  nationality: string;
  highestQualification: string;
  profession: string;
  yearsOfExperience: string;
  percentageShare: string;
  cvFileName: string | null;
  academicCertFileName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDirectorPayload {
  regno: string;
  idNo: string;
  fullNames: string;
  nationality: string;
  highestQualification: string;
  profession: string;
  yearsOfExperience: string;
  percentageShare: string;
  cvFileName?: string;
  academicCertFileName?: string;
}

export type UpdateDirectorPayload = Partial<Omit<CreateDirectorPayload, 'regno'>>;

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit, auth = false): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, Array.isArray(message) ? message.join(', ') : message);
  }

  return data as T;
}

export function registerUser(payload: RegisterPayload) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: LoginPayload) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createFirmProfile(payload: FirmProfilePayload) {
  return request<ContractorCompany>('/contractor-applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export interface UpdateFirmProfilePayload extends Partial<FirmProfilePayload> {
  regno: string;
}

export function updateFirmProfile(payload: UpdateFirmProfilePayload) {
  return request<ContractorCompany>('/contractor-applications/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function updateFirmRegistration(payload: FirmRegistrationPayload) {
  return request<ContractorCompany>('/contractor-applications/registration', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function updateDeclarations(payload: DeclarationsPayload) {
  return request<ContractorCompany>('/contractor-applications/declarations', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function listMyApplications() {
  return request<ContractorCompany[]>('/contractor-applications', {
    method: 'GET',
  }, true);
}

export function listDirectors(regno: string) {
  return request<ContractorDirectorRecord[]>(`/contractor-applications/directors?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function createDirector(payload: CreateDirectorPayload) {
  return request<ContractorDirectorRecord>('/contractor-applications/directors', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export function updateDirector(id: string, payload: UpdateDirectorPayload) {
  return request<ContractorDirectorRecord>(`/contractor-applications/directors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function deleteDirector(id: string) {
  return request<{ success: boolean }>(`/contractor-applications/directors/${id}`, {
    method: 'DELETE',
  }, true);
}

export type DirectorFileField = 'cv' | 'academicCert';

function directorFileUploadPath(directorId: string, field: DirectorFileField) {
  const segment = field === 'cv' ? 'cv' : 'academic-certificate';
  return `/contractor-applications/directors/${directorId}/${segment}`;
}

function directorFileUrlPath(directorId: string, field: DirectorFileField) {
  const segment = field === 'cv' ? 'cv-url' : 'academic-certificate-url';
  return `/contractor-applications/directors/${directorId}/${segment}`;
}

// File uploads use FormData, which needs its own multipart boundary header
// set automatically by the browser - so this bypasses the JSON-only
// `request` helper rather than fighting it.
export async function uploadDirectorFile(
  directorId: string,
  field: DirectorFileField,
  file: File,
): Promise<ContractorDirectorRecord> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${directorFileUploadPath(directorId, field)}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message ?? `Upload failed with status ${res.status}`;
    throw new ApiError(res.status, Array.isArray(message) ? message.join(', ') : message);
  }
  return data as ContractorDirectorRecord;
}

export function getDirectorFileUrl(directorId: string, field: DirectorFileField) {
  return request<{ url: string }>(directorFileUrlPath(directorId, field), {
    method: 'GET',
  }, true);
}

export interface ContractorOfficeRecord {
  id: string;
  regno: string;
  town: string;
  address: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfficePayload {
  regno: string;
  town: string;
  address: string;
  location: string;
}

export type UpdateOfficePayload = Partial<Omit<CreateOfficePayload, 'regno'>>;

export function listOffices(regno: string) {
  return request<ContractorOfficeRecord[]>(`/contractor-applications/offices?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function createOffice(payload: CreateOfficePayload) {
  return request<ContractorOfficeRecord>('/contractor-applications/offices', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export function updateOffice(id: string, payload: UpdateOfficePayload) {
  return request<ContractorOfficeRecord>(`/contractor-applications/offices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function deleteOffice(id: string) {
  return request<{ success: boolean }>(`/contractor-applications/offices/${id}`, {
    method: 'DELETE',
  }, true);
}

export interface ContractorDocumentRecord {
  id: string;
  regno: string;
  docType: string;
  fileName: string;
  fileKey: string;
  uploadedAt: string;
}

export function listDocuments(regno: string) {
  return request<ContractorDocumentRecord[]>(`/contractor-applications/documents?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

// Same FormData reasoning as uploadDirectorFile - bypasses the JSON-only
// `request` helper.
export async function uploadDocument(regno: string, docType: string, file: File): Promise<ContractorDocumentRecord> {
  const formData = new FormData();
  formData.append('regno', regno);
  formData.append('docType', docType);
  formData.append('file', file);

  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/contractor-applications/documents`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message ?? `Upload failed with status ${res.status}`;
    throw new ApiError(res.status, Array.isArray(message) ? message.join(', ') : message);
  }
  return data as ContractorDocumentRecord;
}

export function getDocumentUrl(documentId: string) {
  return request<{ url: string }>(`/contractor-applications/documents/${documentId}/url`, {
    method: 'GET',
  }, true);
}

export function deleteDocument(documentId: string) {
  return request<{ success: boolean }>(`/contractor-applications/documents/${documentId}`, {
    method: 'DELETE',
  }, true);
}

export interface ContractorRefereeRecord {
  id: string;
  regno: string;
  name: string;
  postalAddress: string;
  telephone: string;
  profession: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRefereePayload {
  regno: string;
  name: string;
  postalAddress: string;
  telephone: string;
  profession: string;
}

export type UpdateRefereePayload = Partial<Omit<CreateRefereePayload, 'regno'>>;

export function listReferees(regno: string) {
  return request<ContractorRefereeRecord[]>(`/contractor-applications/referees?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function createReferee(payload: CreateRefereePayload) {
  return request<ContractorRefereeRecord>('/contractor-applications/referees', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export function updateReferee(id: string, payload: UpdateRefereePayload) {
  return request<ContractorRefereeRecord>(`/contractor-applications/referees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function deleteReferee(id: string) {
  return request<{ success: boolean }>(`/contractor-applications/referees/${id}`, {
    method: 'DELETE',
  }, true);
}

export interface ContractorAssetRecord {
  id: string;
  regno: string;
  description: string;
  registrationNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetPayload {
  regno: string;
  description: string;
  registrationNo: string;
}

export type UpdateAssetPayload = Partial<Omit<CreateAssetPayload, 'regno'>>;

export function listAssets(regno: string) {
  return request<ContractorAssetRecord[]>(`/contractor-applications/assets?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function createAsset(payload: CreateAssetPayload) {
  return request<ContractorAssetRecord>('/contractor-applications/assets', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export function updateAsset(id: string, payload: UpdateAssetPayload) {
  return request<ContractorAssetRecord>(`/contractor-applications/assets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function deleteAsset(id: string) {
  return request<{ success: boolean }>(`/contractor-applications/assets/${id}`, {
    method: 'DELETE',
  }, true);
}

export interface ContractorStaffRecord {
  id: string;
  regno: string;
  fullNames: string;
  idNo: string;
  nationality: string;
  highestQualification: string;
  yearsOfExperience: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  regno: string;
  fullNames: string;
  idNo: string;
  nationality: string;
  highestQualification: string;
  yearsOfExperience: string;
}

export type UpdateStaffPayload = Partial<Omit<CreateStaffPayload, 'regno'>>;

export function listStaff(regno: string) {
  return request<ContractorStaffRecord[]>(`/contractor-applications/staff?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function createStaff(payload: CreateStaffPayload) {
  return request<ContractorStaffRecord>('/contractor-applications/staff', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export function updateStaff(id: string, payload: UpdateStaffPayload) {
  return request<ContractorStaffRecord>(`/contractor-applications/staff/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function deleteStaff(id: string) {
  return request<{ success: boolean }>(`/contractor-applications/staff/${id}`, {
    method: 'DELETE',
  }, true);
}

export interface ContractorEquipmentRecord {
  id: string;
  regno: string;
  name: string;
  ownedOrLeased: string;
  typeMakeModel: string;
  category: string;
  registrationNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentPayload {
  regno: string;
  name: string;
  ownedOrLeased: string;
  typeMakeModel: string;
  category: string;
  registrationNo: string;
}

export type UpdateEquipmentPayload = Partial<Omit<CreateEquipmentPayload, 'regno'>>;

export function listEquipment(regno: string) {
  return request<ContractorEquipmentRecord[]>(`/contractor-applications/equipment?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function createEquipment(payload: CreateEquipmentPayload) {
  return request<ContractorEquipmentRecord>('/contractor-applications/equipment', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export function updateEquipment(id: string, payload: UpdateEquipmentPayload) {
  return request<ContractorEquipmentRecord>(`/contractor-applications/equipment/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function deleteEquipment(id: string) {
  return request<{ success: boolean }>(`/contractor-applications/equipment/${id}`, {
    method: 'DELETE',
  }, true);
}

export interface ContractorProjectExperienceRecord {
  id: string;
  regno: string;
  project: string;
  ncaProjectRegNo: string;
  contractSum: string;
  contractPeriod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectExperiencePayload {
  regno: string;
  project: string;
  ncaProjectRegNo: string;
  contractSum: string;
  contractPeriod: string;
}

export type UpdateProjectExperiencePayload = Partial<Omit<CreateProjectExperiencePayload, 'regno'>>;

export function listProjectExperience(regno: string) {
  return request<ContractorProjectExperienceRecord[]>(`/contractor-applications/project-experience?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function createProjectExperience(payload: CreateProjectExperiencePayload) {
  return request<ContractorProjectExperienceRecord>('/contractor-applications/project-experience', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export function updateProjectExperience(id: string, payload: UpdateProjectExperiencePayload) {
  return request<ContractorProjectExperienceRecord>(`/contractor-applications/project-experience/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function deleteProjectExperience(id: string) {
  return request<{ success: boolean }>(`/contractor-applications/project-experience/${id}`, {
    method: 'DELETE',
  }, true);
}

export interface ContractorLitigationRecord {
  id: string;
  regno: string;
  refNo: string;
  date: string;
  partiesInvolved: string;
  particularOfLitigation: string;
  statusOfMatter: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLitigationPayload {
  regno: string;
  refNo: string;
  date: string;
  partiesInvolved: string;
  particularOfLitigation: string;
  statusOfMatter: string;
}

export type UpdateLitigationPayload = Partial<Omit<CreateLitigationPayload, 'regno'>>;

export function listLitigation(regno: string) {
  return request<ContractorLitigationRecord[]>(`/contractor-applications/litigation?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function createLitigation(payload: CreateLitigationPayload) {
  return request<ContractorLitigationRecord>('/contractor-applications/litigation', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export function updateLitigation(id: string, payload: UpdateLitigationPayload) {
  return request<ContractorLitigationRecord>(`/contractor-applications/litigation/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}

export function deleteLitigation(id: string) {
  return request<{ success: boolean }>(`/contractor-applications/litigation/${id}`, {
    method: 'DELETE',
  }, true);
}

export interface ContractorClassificationRecord {
  regno: string;
  applicationType: string;
  buildingWorksCategory: string;
  roadWorksCategory: string;
  waterWorksCategory: string;
  electricalSubClasses: string[];
  electricalCategory: string;
  mechanicalSubClasses: string[];
  mechanicalCategory: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertClassificationPayload {
  regno: string;
  applicationType: string;
  buildingWorksCategory: string;
  roadWorksCategory: string;
  waterWorksCategory: string;
  electricalSubClasses: string[];
  electricalCategory: string;
  mechanicalSubClasses: string[];
  mechanicalCategory: string;
}

export function getClassification(regno: string) {
  return request<ContractorClassificationRecord | null>(`/contractor-applications/classification?regno=${encodeURIComponent(regno)}`, {
    method: 'GET',
  }, true);
}

export function upsertClassification(payload: UpsertClassificationPayload) {
  return request<ContractorClassificationRecord>('/contractor-applications/classification', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, true);
}

export interface ContractorApplicationRecord {
  id: string;
  regno: string;
  trackNo: string;
  companyName: string | null;
  classesApplied: string;
  applicationType: string;
  localForeign: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function submitApplication(regno: string) {
  return request<ContractorApplicationRecord>('/contractor-applications/submit', {
    method: 'PATCH',
    body: JSON.stringify({ regno }),
  }, true);
}

export function listMySubmissions() {
  return request<ContractorApplicationRecord[]>('/contractor-applications/my-submissions', {
    method: 'GET',
  }, true);
}
export interface BrsDirector {
  fullNames: string;
  idNo: string;
  nationality: string;
  percentageShare: string;
}

export type BrsVerificationResponse =
  | { found: false }
  | { found: true; blocked: true }
  | {
      found: true;
      blocked: false;
      requiresForeignRegistration: boolean;
      verified: boolean;
      businessName: string;
      kraPin: string;
      registrationDate: string;
      directors: BrsDirector[];
      foreignShareholdingPercent: number;
      existingRegno: string | null;
    };

export function verifyCompanyRegistration(registrationNumber: string) {
  return request<BrsVerificationResponse>(`/contractor-applications/verify-company?registrationNumber=${encodeURIComponent(registrationNumber)}`, {
    method: 'GET',
  }, true);
}

export type BrsDirectorLookupResponse =
  | { found: false }
  | { found: true; fullNames: string; nationality: string; percentageShare: string };

// Matches a director's ID number against the cached BRS data for this
// application's company (populated the last time it was verified) -
// used to gate the Directors tab so it only fills in / accepts directors
// BRS actually lists for that company.
export function lookupBrsDirector(regno: string, idNo: string) {
  return request<BrsDirectorLookupResponse>(
    `/contractor-applications/brs-director?regno=${encodeURIComponent(regno)}&idNo=${encodeURIComponent(idNo)}`,
    { method: 'GET' },
    true,
  );
}
export function getSubmission(id: string) {
  return request<ContractorApplicationRecord>(`/contractor-applications/submissions/${id}`, {
    method: 'GET',
  }, true);
}
