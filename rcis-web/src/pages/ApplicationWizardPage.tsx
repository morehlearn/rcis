import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import WizardStepper from '@/features/wizard/WizardStepper';
import FirmProfileStep from '@/features/wizard/steps/FirmProfileStep';
import FirmRegistrationStep from '@/features/wizard/steps/FirmRegistrationStep';
import DeclarationsStep from '@/features/wizard/steps/DeclarationsStep';
import DirectorsStep from '@/features/wizard/steps/DirectorsStep';
import OfficesStep from '@/features/wizard/steps/OfficesStep';
import RefereesStep from '@/features/wizard/steps/RefereesStep';
import ApplicationRequirementsModal from '@/features/wizard/ApplicationRequirementsModal';
import { WIZARD_STEPS, MODE_LABELS, resolveMode } from '@/features/wizard/wizard-config';
import {
  emptyFirmProfile, emptyFirmRegistration, emptyDeclarations,
  type FirmProfileData, type FirmRegistrationData, type DeclarationsData, type Director, type Office, type Referee,
} from '@/features/wizard/wizard-types';
import {
  createFirmProfile, updateFirmProfile, updateFirmRegistration, updateDeclarations, listMyApplications,
  listDirectors, createDirector, updateDirector, deleteDirector,
  uploadDirectorFile, getDirectorFileUrl, type ContractorDirectorRecord, type DirectorFileField,
  listOffices, createOffice, updateOffice, deleteOffice, type ContractorOfficeRecord,
  listDocuments, uploadDocument, getDocumentUrl, deleteDocument, type ContractorDocumentRecord,
  listReferees, createReferee, updateReferee, deleteReferee, type ContractorRefereeRecord,
} from '@/lib/api';

type FirmProfileErrors = Partial<Record<keyof FirmProfileData, string>>;
type FirmRegistrationErrors = Partial<Record<keyof FirmRegistrationData, string>>;
type DeclarationsErrors = Partial<Record<keyof DeclarationsData, string>>;

// Required fields reflect what's marked required in the reference screenshots
// (red labels / asterisks), not necessarily what would be ideal validation.
const REQUIRED_FIRM_PROFILE: (keyof FirmProfileData)[] = [
  'incorporationNo', 'headOffice', 'town', 'localForeign', 'telephone', 'cellPhone',
];

const REQUIRED_FIRM_REGISTRATION: (keyof FirmRegistrationData)[] = [
  'firmType', 'incorporationNo', 'kraPin', 'bankName', 'bankBranch', 'associationMembershipNo',
];

export default function ApplicationWizardPage() {
  const [searchParams] = useSearchParams();
  const mode = resolveMode(searchParams.get('mode'));
  const { title, subtitle } = MODE_LABELS[mode];

  const [activeStep, setActiveStep] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const [firmProfile, setFirmProfile] = useState<FirmProfileData>(emptyFirmProfile);
  const [profileErrors, setProfileErrors] = useState<FirmProfileErrors>({});

  const [firmRegistration, setFirmRegistration] = useState<FirmRegistrationData>(emptyFirmRegistration);
  const [registrationErrors, setRegistrationErrors] = useState<FirmRegistrationErrors>({});

  const [declarations, setDeclarations] = useState<DeclarationsData>(emptyDeclarations);
  const [declarationsErrors, setDeclarationsErrors] = useState<DeclarationsErrors>({});

  const [directors, setDirectors] = useState<Director[]>([]);
  const [directorsError, setDirectorsError] = useState('');
  const [directorsLoading, setDirectorsLoading] = useState(false);
  const [directorsSaving, setDirectorsSaving] = useState(false);
  const [directorsLoadedFor, setDirectorsLoadedFor] = useState<string | null>(null);

  const [offices, setOffices] = useState<Office[]>([]);
  const [officesError, setOfficesError] = useState('');
  const [officesLoading, setOfficesLoading] = useState(false);
  const [officesSaving, setOfficesSaving] = useState(false);
  const [officesLoadedFor, setOfficesLoadedFor] = useState<string | null>(null);

  const [documents, setDocuments] = useState<ContractorDocumentRecord[]>([]);
  const [documentsError, setDocumentsError] = useState('');
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsUploading, setDocumentsUploading] = useState(false);
  const [documentsLoadedFor, setDocumentsLoadedFor] = useState<string | null>(null);

  const [referees, setReferees] = useState<Referee[]>([]);
  const [refereesError, setRefereesError] = useState('');
  const [refereesLoading, setRefereesLoading] = useState(false);
  const [refereesSaving, setRefereesSaving] = useState(false);
  const [refereesLoadedFor, setRefereesLoadedFor] = useState<string | null>(null);

  // regno is assigned by the backend the moment Step 1 saves successfully.
  // Every subsequent step's PATCH call needs it, so it lives at wizard level.
  const [regno, setRegno] = useState<string | null>(null);

  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [resuming, setResuming] = useState(false);

  const isLastStep = activeStep === WIZARD_STEPS.length - 1;

  // Resuming: /apply?regno=NCA/2026/C1 pre-fills whatever steps that
  // application already has saved, and drops the user at the first step
  // that still needs attention rather than always starting at Step 1.
  useEffect(() => {
    const resumeRegno = searchParams.get('regno');
    if (!resumeRegno) return;

    setResuming(true);
    listMyApplications()
      .then(async (applications) => {
        const app = applications.find((a) => a.regno === resumeRegno);
        if (!app) {
          setApiError('That application could not be found.');
          return;
        }

        setRegno(app.regno);
        setFirmProfile({
          incorporationNo: app.incorporationNo ?? '',
          firmName: app.firmName ?? '',
          headOffice: app.headOffice ?? '',
          postalAddress: app.postalAddress ?? '',
          county: app.county ?? '',
          town: app.town ?? '',
          localForeign: (app.localForeign as 'Local' | 'Foreign') ?? 'Local',
          website: app.website ?? '',
          telephone: app.telephone ?? '',
          cellPhone: app.cellPhone ?? '',
          email: app.email ?? '',
          latitude: app.latitude ?? '',
          longitude: app.longitude ?? '',
        });
        setFirmRegistration({
          firmType: app.firmType ?? 'Company',
          incorporationNo: app.incorporationNo ?? '',
          kraPin: app.kraPin ?? '',
          registeredCapital: app.registeredCapital ?? '',
          paidUpCapital: app.paidUpCapital ?? '',
          taxComplianceNo: app.taxComplianceNo ?? '',
          bankName: app.bankName ?? '',
          bankBranch: app.bankBranch ?? '',
          agencyName: app.agencyName ?? '',
          agencyRegistrationNo: app.agencyRegistrationNo ?? '',
          agencyYear: app.agencyYear ?? '',
          associationName: app.associationName ?? '',
          associationNameOther: app.associationNameOther ?? '',
          associationMembershipNo: app.associationMembershipNo ?? '',
          jointVentureProjects: app.jointVentureProjects ?? '',
          jointVentureFirms: app.jointVentureFirms ?? '',
          hasAgpoCertificate: app.hasAgpoCertificate ?? '',
          agpoCategories: app.agpoCategories ?? [],
          agpoExpiryDate: app.agpoExpiryDate ?? '',
        });
        setDeclarations({
          acceptCodeOfConduct: app.acceptCodeOfConduct ?? false,
          acceptTerms: app.acceptTerms ?? false,
        });

        // Land on the first step that still needs work: Firm Profile always
        // exists once regno exists, so the earliest possible resume point
        // is Step 2 (Firm Registration).
        const declarationsDone = !!app.acceptCodeOfConduct && !!app.acceptTerms;
        const registrationDone = !!app.firmType;
        let resumeStep = declarationsDone ? 3 : registrationDone ? 2 : 1;

        if (declarationsDone) {
          const [directorRecords, officeRecords, refereeRecords] = await Promise.all([
            listDirectors(app.regno).catch(() => []),
            listOffices(app.regno).catch(() => []),
            listReferees(app.regno).catch(() => []),
          ]);
          if (refereeRecords.length > 0) resumeStep = 5;
          else if (officeRecords.length > 0) resumeStep = 4;
          else if (directorRecords.length > 0) resumeStep = 3;
        }

        setVisited(new Set(Array.from({ length: resumeStep + 1 }, (_, i) => i)));
        setActiveStep(resumeStep);
      })
      .catch((err) => {
        setApiError(err instanceof Error ? err.message : 'Could not load this application.');
      })
      .finally(() => setResuming(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toDirector = (record: ContractorDirectorRecord): Director => ({
    id: record.id,
    idNo: record.idNo,
    fullNames: record.fullNames,
    nationality: record.nationality,
    highestQualification: record.highestQualification,
    profession: record.profession,
    yearsOfExperience: record.yearsOfExperience,
    percentageShare: record.percentageShare,
    cvFileName: record.cvFileName ?? '',
    academicCertFileName: record.academicCertFileName ?? '',
  });

  // Load existing directors from the backend the first time Step 4 is
  // reached for a given regno - covers both a fresh wizard run and
  // resuming an application that already has directors saved.
  useEffect(() => {
    if (activeStep !== 3 || !regno || directorsLoadedFor === regno) return;

    setDirectorsLoading(true);
    listDirectors(regno)
      .then((records) => {
        setDirectors(records.map(toDirector));
        setDirectorsLoadedFor(regno);
      })
      .catch((err) => {
        setDirectorsError(err instanceof Error ? err.message : 'Could not load directors.');
      })
      .finally(() => setDirectorsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);

  const toOffice = (record: ContractorOfficeRecord): Office => ({
    id: record.id,
    town: record.town,
    address: record.address,
    location: record.location,
  });

  // Same idea as Directors: load offices and the shared document pool the
  // first time Step 5 is reached for a given regno.
  useEffect(() => {
    if ((activeStep !== 4 && activeStep !== 5) || !regno) return;

    if (activeStep === 4 && officesLoadedFor !== regno) {
      setOfficesLoading(true);
      listOffices(regno)
        .then((records) => {
          setOffices(records.map(toOffice));
          setOfficesLoadedFor(regno);
        })
        .catch((err) => {
          setOfficesError(err instanceof Error ? err.message : 'Could not load offices.');
        })
        .finally(() => setOfficesLoading(false));
    }

    if (documentsLoadedFor !== regno) {
      setDocumentsLoading(true);
      listDocuments(regno)
        .then((records) => {
          setDocuments(records);
          setDocumentsLoadedFor(regno);
        })
        .catch((err) => {
          setDocumentsError(err instanceof Error ? err.message : 'Could not load documents.');
        })
        .finally(() => setDocumentsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);

  const toReferee = (record: ContractorRefereeRecord): Referee => ({
    id: record.id,
    name: record.name,
    postalAddress: record.postalAddress,
    telephone: record.telephone,
    profession: record.profession,
  });

  // Load existing referees the first time Step 6 is reached for a given regno.
  useEffect(() => {
    if (activeStep !== 5 || !regno || refereesLoadedFor === regno) return;

    setRefereesLoading(true);
    listReferees(regno)
      .then((records) => {
        setReferees(records.map(toReferee));
        setRefereesLoadedFor(regno);
      })
      .catch((err) => {
        setRefereesError(err instanceof Error ? err.message : 'Could not load referees.');
      })
      .finally(() => setRefereesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);

  const handleProfileChange = (field: keyof FirmProfileData, value: string) => {
    setFirmProfile((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) setProfileErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleRegistrationChange = (field: keyof FirmRegistrationData, value: string) => {
    setFirmRegistration((prev) => ({ ...prev, [field]: value }));
    if (registrationErrors[field]) setRegistrationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCategoriesChange = (categories: string[]) => {
    setFirmRegistration((prev) => ({ ...prev, agpoCategories: categories }));
  };

  const handleDeclarationsChange = (field: keyof DeclarationsData, value: boolean) => {
    setDeclarations((prev) => ({ ...prev, [field]: value }));
    if (declarationsErrors[field]) setDeclarationsErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAddDirector = async (director: Omit<Director, 'id'>): Promise<string | null> => {
    if (!regno) {
      setDirectorsError('Missing application reference — please go back to Step 1 and save again.');
      return null;
    }
    setDirectorsSaving(true);
    setDirectorsError('');
    try {
      const created = await createDirector({ regno, ...director });
      setDirectors((prev) => [...prev, toDirector(created)]);
      return created.id;
    } catch (err) {
      setDirectorsError(err instanceof Error ? err.message : 'Could not save this director. Please try again.');
      return null;
    } finally {
      setDirectorsSaving(false);
    }
  };

  const handleUploadDirectorFile = async (directorId: string, field: DirectorFileField, file: File) => {
    setDirectorsError('');
    try {
      const updated = await uploadDirectorFile(directorId, field, file);
      setDirectors((prev) => prev.map((d) => (d.id === directorId ? toDirector(updated) : d)));
    } catch (err) {
      setDirectorsError(err instanceof Error ? err.message : 'Could not upload the file. Please try again.');
    }
  };

  const handleViewDirectorFile = async (directorId: string, field: DirectorFileField) => {
    setDirectorsError('');
    try {
      const { url } = await getDirectorFileUrl(directorId, field);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setDirectorsError(err instanceof Error ? err.message : 'Could not open this file.');
    }
  };

  const handleUpdateDirector = async (id: string, director: Omit<Director, 'id'>): Promise<boolean> => {
    setDirectorsSaving(true);
    setDirectorsError('');
    try {
      const updated = await updateDirector(id, director);
      setDirectors((prev) => prev.map((d) => (d.id === id ? toDirector(updated) : d)));
      return true;
    } catch (err) {
      setDirectorsError(err instanceof Error ? err.message : 'Could not update this director. Please try again.');
      return false;
    } finally {
      setDirectorsSaving(false);
    }
  };

  const handleDeleteDirector = async (id: string): Promise<boolean> => {
    setDirectorsError('');
    try {
      await deleteDirector(id);
      setDirectors((prev) => prev.filter((d) => d.id !== id));
      return true;
    } catch (err) {
      setDirectorsError(err instanceof Error ? err.message : 'Could not delete this director. Please try again.');
      return false;
    }
  };

  const handleAddOffice = async (office: Omit<Office, 'id'>): Promise<boolean> => {
    if (!regno) {
      setOfficesError('Missing application reference — please go back to Step 1 and save again.');
      return false;
    }
    setOfficesSaving(true);
    setOfficesError('');
    try {
      const created = await createOffice({ regno, ...office });
      setOffices((prev) => [...prev, toOffice(created)]);
      return true;
    } catch (err) {
      setOfficesError(err instanceof Error ? err.message : 'Could not save this office. Please try again.');
      return false;
    } finally {
      setOfficesSaving(false);
    }
  };

  const handleUpdateOffice = async (id: string, office: Omit<Office, 'id'>): Promise<boolean> => {
    setOfficesSaving(true);
    setOfficesError('');
    try {
      const updated = await updateOffice(id, office);
      setOffices((prev) => prev.map((o) => (o.id === id ? toOffice(updated) : o)));
      return true;
    } catch (err) {
      setOfficesError(err instanceof Error ? err.message : 'Could not update this office. Please try again.');
      return false;
    } finally {
      setOfficesSaving(false);
    }
  };

  const handleDeleteOffice = async (id: string): Promise<boolean> => {
    setOfficesError('');
    try {
      await deleteOffice(id);
      setOffices((prev) => prev.filter((o) => o.id !== id));
      return true;
    } catch (err) {
      setOfficesError(err instanceof Error ? err.message : 'Could not delete this office. Please try again.');
      return false;
    }
  };

  const handleAddReferee = async (referee: Omit<Referee, 'id'>): Promise<boolean> => {
    if (!regno) {
      setRefereesError('Missing application reference — please go back to Step 1 and save again.');
      return false;
    }
    setRefereesSaving(true);
    setRefereesError('');
    try {
      const created = await createReferee({ regno, ...referee });
      setReferees((prev) => [...prev, toReferee(created)]);
      return true;
    } catch (err) {
      setRefereesError(err instanceof Error ? err.message : 'Could not save this referee. Please try again.');
      return false;
    } finally {
      setRefereesSaving(false);
    }
  };

  const handleUpdateReferee = async (id: string, referee: Omit<Referee, 'id'>): Promise<boolean> => {
    setRefereesSaving(true);
    setRefereesError('');
    try {
      const updated = await updateReferee(id, referee);
      setReferees((prev) => prev.map((r) => (r.id === id ? toReferee(updated) : r)));
      return true;
    } catch (err) {
      setRefereesError(err instanceof Error ? err.message : 'Could not update this referee. Please try again.');
      return false;
    } finally {
      setRefereesSaving(false);
    }
  };

  const handleDeleteReferee = async (id: string): Promise<boolean> => {
    setRefereesError('');
    try {
      await deleteReferee(id);
      setReferees((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      setRefereesError(err instanceof Error ? err.message : 'Could not delete this referee. Please try again.');
      return false;
    }
  };

  const handleUploadDocument = async (docType: string, file: File) => {
    if (!regno) {
      setDocumentsError('Missing application reference — please go back to Step 1 and save again.');
      return;
    }
    setDocumentsUploading(true);
    setDocumentsError('');
    try {
      const created = await uploadDocument(regno, docType, file);
      setDocuments((prev) => [created, ...prev]);
    } catch (err) {
      setDocumentsError(err instanceof Error ? err.message : 'Could not upload this document. Please try again.');
    } finally {
      setDocumentsUploading(false);
    }
  };

  const handleViewDocument = async (documentId: string) => {
    setDocumentsError('');
    try {
      const { url } = await getDocumentUrl(documentId);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setDocumentsError(err instanceof Error ? err.message : 'Could not open this document.');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    setDocumentsError('');
    try {
      await deleteDocument(documentId);
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    } catch (err) {
      setDocumentsError(err instanceof Error ? err.message : 'Could not delete this document. Please try again.');
    }
  };

  const validateProfile = (): boolean => {
    const next: FirmProfileErrors = {};
    REQUIRED_FIRM_PROFILE.forEach((field) => {
      if (!firmProfile[field].trim()) next[field] = 'This field is required';
    });
    setProfileErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateRegistration = (): boolean => {
    const next: FirmRegistrationErrors = {};
    REQUIRED_FIRM_REGISTRATION.forEach((field) => {
      const value = firmRegistration[field] as string;
      if (!value.trim()) next[field] = 'This field is required';
    });
    setRegistrationErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateDeclarations = (): boolean => {
    const next: DeclarationsErrors = {};
    if (!declarations.acceptCodeOfConduct) next.acceptCodeOfConduct = 'You must accept the Code of Conduct to continue';
    if (!declarations.acceptTerms) next.acceptTerms = 'You must accept the Terms and Conditions to continue';
    setDeclarationsErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateDirectors = (): boolean => {
    if (directors.length === 0) {
      setDirectorsError('Add at least one director before continuing');
      return false;
    }
    setDirectorsError('');
    return true;
  };

  const goStep = (index: number) => {
    setActiveStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const advance = () => {
    setSavedAt(new Date());
    if (!isLastStep) {
      const next = activeStep + 1;
      setVisited((prev) => new Set(prev).add(next));
      goStep(next);
    }
  };

  const handleNext = async () => {
    setApiError('');

    // Steps 0-2 persist directly on "Save and continue". Steps 3 (Directors)
    // and 4 (Offices) persist incrementally as each row/document is added,
    // so "Save and continue" there just validates and moves on - the actual
    // saving already happened via their own add/edit/delete handlers.
    if (activeStep === 0) {
  if (!validateProfile()) return;
  setSaving(true);
  try {
    if (regno) {
      // Already has a regno (fresh create earlier, or resumed) - update, don't create again.
      await updateFirmProfile({ regno, ...firmProfile });
    } else {
      const created = await createFirmProfile({ ...firmProfile });
      setRegno(created.regno);
    }
    advance();
  } catch (err) {
    setApiError(err instanceof Error ? err.message : 'Could not save Firm Profile. Please try again.');
  } finally {
    setSaving(false);
  }
  return;
}

    if (activeStep === 1) {
      if (!validateRegistration()) return;
      if (!regno) {
        setApiError('Missing application reference — please go back to Step 1 and save again.');
        return;
      }
      setSaving(true);
      try {
        await updateFirmRegistration({ regno, ...firmRegistration });
        advance();
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Could not save Firm Registration. Please try again.');
      } finally {
        setSaving(false);
      }
      return;
    }

    if (activeStep === 2) {
      if (!validateDeclarations()) return;
      if (!regno) {
        setApiError('Missing application reference — please go back to Step 1 and save again.');
        return;
      }
      setSaving(true);
      try {
        await updateDeclarations({ regno, ...declarations });
        advance();
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Could not save Declarations. Please try again.');
      } finally {
        setSaving(false);
      }
      return;
    }

    if (activeStep === 3 && !validateDirectors()) return;

    advance();
  };

  const handlePrev = () => {
    if (activeStep > 0) goStep(activeStep - 1);
  };

  const savedLabel = useMemo(() => {
    if (!savedAt) return null;
    return `Saved at ${savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [savedAt]);

  const renderStep = () => {
    if (activeStep === 0) {
      return <FirmProfileStep data={firmProfile} errors={profileErrors} onChange={handleProfileChange} />;
    }
    if (activeStep === 1) {
      return (
        <FirmRegistrationStep
          data={firmRegistration}
          errors={registrationErrors}
          onChange={handleRegistrationChange}
          onCategoriesChange={handleCategoriesChange}
        />
      );
    }
    if (activeStep === 2) {
      return (
        <DeclarationsStep
          data={declarations}
          errors={declarationsErrors}
          onChange={handleDeclarationsChange}
        />
      );
    }
    if (activeStep === 3) {
      return (
        <DirectorsStep
          directors={directors}
          onAdd={handleAddDirector}
          onUpdate={handleUpdateDirector}
          onDelete={handleDeleteDirector}
          onUploadFile={handleUploadDirectorFile}
          onViewFile={handleViewDirectorFile}
          error={directorsError}
          saving={directorsSaving}
          loading={directorsLoading}
        />
      );
    }
    if (activeStep === 4) {
      return (
        <OfficesStep
          offices={offices}
          onAdd={handleAddOffice}
          onUpdate={handleUpdateOffice}
          onDelete={handleDeleteOffice}
          error={officesError}
          saving={officesSaving}
          loading={officesLoading}
          documents={documents}
          documentsLoading={documentsLoading}
          documentsUploading={documentsUploading}
          documentsError={documentsError}
          onUploadDocument={handleUploadDocument}
          onViewDocument={handleViewDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      );
    }

    if (activeStep === 5) {
      return (
        <RefereesStep
          referees={referees}
          onAdd={handleAddReferee}
          onUpdate={handleUpdateReferee}
          onDelete={handleDeleteReferee}
          error={refereesError}
          saving={refereesSaving}
          loading={refereesLoading}
          documents={documents}
          documentsLoading={documentsLoading}
          documentsUploading={documentsUploading}
          documentsError={documentsError}
          onUploadDocument={handleUploadDocument}
          onViewDocument={handleViewDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400">
        <p className="text-sm font-medium text-slate-500">{WIZARD_STEPS[activeStep]}</p>
        <p className="text-xs mt-1 max-w-xs">
          This step hasn't been built yet — we're working through the wizard one step at a time.
        </p>
      </div>
    );
  };

  if (resuming) {
    return (
      <div className="min-h-screen bg-[var(--rcis-sand)]">
        <TopNav />
        <div className="flex items-center justify-center py-24 text-sm text-slate-500">
          Loading your application...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--rcis-sand)]">
      <TopNav onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="mb-4">
            <Link to="/" className="text-xs text-slate-500 hover:text-[var(--rcis-primary)]">
              ← Back to dashboard
            </Link>
            <h1 className="text-xl font-semibold text-slate-800 mt-1">{title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {subtitle}
              {regno && <span className="ml-2 text-[var(--rcis-primary)] font-medium">· {regno}</span>}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 sm:px-6 pt-4">
              <button
                type="button"
                onClick={() => setShowRequirements(true)}
                className="text-xs font-medium text-white px-3 py-1.5 rounded"
                style={{ backgroundColor: 'var(--rcis-accent)' }}
              >
                Click to view the Application Requirements
              </button>
            </div>
            {showRequirements && (
              <ApplicationRequirementsModal onClose={() => setShowRequirements(false)} />
            )}

            <div className="px-4 sm:px-6 pt-4 border-b border-slate-100">
              <WizardStepper
                steps={WIZARD_STEPS}
                activeStep={activeStep}
                visited={visited}
                onStepClick={goStep}
              />
            </div>

            <div className="p-4 sm:p-6 min-h-[320px]">
              {apiError && (
                <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                  {apiError}
                </div>
              )}
              {renderStep()}
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeStep === 0}
                className="flex items-center gap-1 rounded-md border border-slate-300 text-sm text-slate-600 px-4 py-2 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {savedLabel && !saving && (
                  <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-600">
                    <Save size={13} />
                    {savedLabel}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLastStep || saving}
                  className="flex items-center gap-1 rounded-md text-white text-sm px-5 py-2 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--rcis-accent)' }}
                >
                  {saving ? 'Saving...' : 'Save and continue'}
                  {!saving && <ChevronRight size={15} />}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}