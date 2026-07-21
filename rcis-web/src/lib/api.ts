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
export interface UpdateFirmProfilePayload extends Partial<FirmProfilePayload> {
  regno: string;
}

export function updateFirmProfile(payload: UpdateFirmProfilePayload) {
  return request<ContractorCompany>('/contractor-applications/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);
}