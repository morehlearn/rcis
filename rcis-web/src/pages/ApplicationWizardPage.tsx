import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import WizardStepper from '@/features/wizard/WizardStepper';
import CompanyDetailsStep from '@/features/wizard/steps/CompanyDetailsStep';
import PeopleStep from '@/features/wizard/steps/PeopleStep';
import ResourcesStep from '@/features/wizard/steps/ResourcesStep';
import TrackRecordStep from '@/features/wizard/steps/TrackRecordStep';
import ClassificationAttachmentsStep from '@/features/wizard/steps/ClassificationAttachmentsStep';
import ApplicationRequirementsModal from '@/features/wizard/ApplicationRequirementsModal';
import { WIZARD_STEPS, MODE_LABELS, resolveMode, MODE_TO_APPLICATION_TYPE } from '@/features/wizard/wizard-config';
import {
  emptyFirmProfile, emptyFirmRegistration, emptyDeclarations,emptyClassification,
  type FirmProfileData, type FirmRegistrationData, type DeclarationsData, type Director, type Office, type Referee, type ClassificationData,
  type Asset, type Staff, type Equipment, type ProjectExperience, type Litigation,
} from '@/features/wizard/wizard-types';
import SummaryStep from '@/features/wizard/steps/SummaryStep';

import {
  createFirmProfile, updateFirmProfile, updateFirmRegistration, updateDeclarations, listMyApplications, listMySubmissions,
  listDirectors, createDirector, updateDirector, deleteDirector,
  uploadDirectorFile, getDirectorFileUrl, type ContractorDirectorRecord, type DirectorFileField,
  listOffices, createOffice, updateOffice, deleteOffice, type ContractorOfficeRecord,
  listDocuments, uploadDocument, getDocumentUrl, deleteDocument, type ContractorDocumentRecord,
  listReferees, createReferee, updateReferee, deleteReferee, type ContractorRefereeRecord,
 listAssets, createAsset, updateAsset, deleteAsset, type ContractorAssetRecord, 
 listStaff, createStaff, updateStaff, deleteStaff, type ContractorStaffRecord,
 listEquipment, createEquipment, updateEquipment, deleteEquipment, type ContractorEquipmentRecord,
 listProjectExperience, createProjectExperience, updateProjectExperience, deleteProjectExperience, type ContractorProjectExperienceRecord,
 listLitigation, createLitigation, updateLitigation, deleteLitigation, type ContractorLitigationRecord,
 getClassification, upsertClassification, verifyCompanyRegistration, lookupBrsDirector,
submitApplication,} from '@/lib/api';

type FirmProfileErrors = Partial<Record<keyof FirmProfileData, string>>;
type FirmRegistrationErrors = Partial<Record<keyof FirmRegistrationData, string>>;
type DeclarationsErrors = Partial<Record<keyof DeclarationsData, string>>;

// Required fields reflect what's marked required in the reference screenshots
// (red labels / asterisks), not necessarily what would be ideal validation.
const REQUIRED_FIRM_PROFILE: (keyof FirmProfileData)[] = [
  'incorporationNo', 'headOffice', 'town', 'localForeign', 'telephone', 'cellPhone',
];

const REQUIRED_FIRM_REGISTRATION: (keyof FirmRegistrationData)[] = [
  'firmType', 'kraPin', 'bankName', 'bankBranch', 'associationMembershipNo',
];

export default function ApplicationWizardPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsError, setAssetsError] = useState('');
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [assetsSaving, setAssetsSaving] = useState(false);
  const [assetsLoadedFor, setAssetsLoadedFor] = useState<string | null>(null);

  const [staff, setStaff] = useState<Staff[]>([]);
  const [staffError, setStaffError] = useState('');
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffSaving, setStaffSaving] = useState(false);
  const [staffLoadedFor, setStaffLoadedFor] = useState<string | null>(null);

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentError, setEquipmentError] = useState('');
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentSaving, setEquipmentSaving] = useState(false);
  const [equipmentLoadedFor, setEquipmentLoadedFor] = useState<string | null>(null);

  const [projects, setProjects] = useState<ProjectExperience[]>([]);
  const [projectsError, setProjectsError] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsSaving, setProjectsSaving] = useState(false);
  const [projectsLoadedFor, setProjectsLoadedFor] = useState<string | null>(null);

  const [litigation, setLitigation] = useState<Litigation[]>([]);
  const [litigationError, setLitigationError] = useState('');
  const [litigationLoading, setLitigationLoading] = useState(false);
  const [litigationSaving, setLitigationSaving] = useState(false);
  const [litigationLoadedFor, setLitigationLoadedFor] = useState<string | null>(null);

  const [classification, setClassification] = useState<ClassificationData>({
  ...emptyClassification,
  applicationType: MODE_TO_APPLICATION_TYPE[mode],
});
  const [classificationErrors, setClassificationErrors] = useState<Partial<Record<keyof ClassificationData, string>>>({});
  const [classificationLoadedFor, setClassificationLoadedFor] = useState<string | null>(null);

  // Set from the loaded/created ContractorCompany record's own status field -
  // controls whether Summary shows the editable review or the "submitted,
  // read-only" state.
  const [justSubmittedTrackNo, setJustSubmittedTrackNo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // regno is assigned by the backend the moment Step 1 saves successfully.
  // Every subsequent step's PATCH call needs it, so it lives at wizard level.
  const [regno, setRegno] = useState<string | null>(null);

  // Which sub-tab is active within each grouped step. "Save and continue"
  // steps through these one at a time so nobody's Referees or Staff tab
  // gets skipped just because Directors was filled in first.
  const [peopleTab, setPeopleTab] = useState(0);
  const [resourcesTab, setResourcesTab] = useState(0);
  const [trackRecordTab, setTrackRecordTab] = useState(0);

  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'error' | 'warning' | 'info'; text: string } | undefined>();
  // Set when verify-company finds this company already registered under a
  // "new registration" flow - blocks Save and continue until the
  // incorporation number is changed to something that isn't a duplicate.
  const [duplicateRegno, setDuplicateRegno] = useState<string | null>(null);


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
    Promise.all([listMyApplications(), listMySubmissions()])
      .then(async ([applications, submissions]) => {
        const app = applications.find((a) => a.regno === resumeRegno);
        if (!app) {
          setApiError('That application could not be found.');
          return;
        }

        // Once an application has at least one submitted tracking record
        // it's locked - send the person back to the dashboard instead of
        // loading it for editing. Mirrors the same "in progress" check the
        // dashboard uses to decide whether to show a "Continue" prompt.
        // "Apply for a new certificate/licence" is the one deliberate
        // exception: it reopens an already-submitted regno on purpose, to
        // add a new class against the same company.
        const alreadySubmitted = submissions.some((s) => s.regno === resumeRegno);
        if (alreadySubmitted && mode !== 'certificate') {
          navigate('/', {
            replace: true,
            state: { notice: 'That application has already been submitted and can no longer be edited.' },
          });
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

        // Land on the first grouped step that still needs work: Firm Profile
        // always exists once regno exists, so the earliest possible resume
        // point is Step 1 (People) once Company Details is filled in.
        const registrationDone = !!app.firmType;
        let resumeStep = registrationDone ? 1 : 0;

        const [directorRecords, officeRecords, refereeRecords, assetRecords, staffRecords, equipmentRecords, projectRecords, litigationRecords, classificationRecord] = await Promise.all([
          listDirectors(app.regno).catch(() => []),
          listOffices(app.regno).catch(() => []),
          listReferees(app.regno).catch(() => []),
          listAssets(app.regno).catch(() => []),
          listStaff(app.regno).catch(() => []),
          listEquipment(app.regno).catch(() => []),
          listProjectExperience(app.regno).catch(() => []),
          listLitigation(app.regno).catch(() => []),
          getClassification(app.regno).catch(() => null),
        ]);
        // "Apply for a new certificate/licence" only wants to show the
        // class being added, not what's already registered - so this mode
        // deliberately skips prefilling the classification form, even
        // though a record already exists for this regno. It's still marked
        // "loaded" so the per-step effect below doesn't try to load it in
        // and overwrite the blank starting state.
        if (classificationRecord && mode !== 'certificate') {
          setClassification({
            applicationType: classificationRecord.applicationType,
            buildingWorksCategory: classificationRecord.buildingWorksCategory,
            roadWorksCategory: classificationRecord.roadWorksCategory,
            waterWorksCategory: classificationRecord.waterWorksCategory,
            electricalSubClasses: classificationRecord.electricalSubClasses,
            electricalCategory: classificationRecord.electricalCategory,
            mechanicalSubClasses: classificationRecord.mechanicalSubClasses,
            mechanicalCategory: classificationRecord.mechanicalCategory,
          });
        }
        if (classificationRecord) setClassificationLoadedFor(app.regno);

        if (mode === 'certificate') {
          // This company is already fully registered - land on Company
          // Details for a quick confirm, and let every step be clicked
          // straight away rather than gating on "furthest step reached".
          resumeStep = 0;
        } else if (classificationRecord) resumeStep = 4;
        else if (projectRecords.length > 0 || litigationRecords.length > 0) resumeStep = 3;
        else if (officeRecords.length > 0 || assetRecords.length > 0 || equipmentRecords.length > 0) resumeStep = 2;
        else if (directorRecords.length > 0 || refereeRecords.length > 0 || staffRecords.length > 0) resumeStep = 1;

        // Land on the right sub-tab within whichever group is resumed into,
        // following the same Directors -> Referees -> Staff (etc.) order
        // that "Save and continue" steps through.
        setPeopleTab(directorRecords.length > 0 ? (refereeRecords.length > 0 ? 2 : 1) : 0);
        setResourcesTab(officeRecords.length > 0 ? (assetRecords.length > 0 ? 2 : 1) : 0);
        setTrackRecordTab(projectRecords.length > 0 ? 1 : 0);

        setVisited(
          mode === 'certificate'
            ? new Set(Array.from({ length: WIZARD_STEPS.length }, (_, i) => i))
            : new Set(Array.from({ length: resumeStep + 1 }, (_, i) => i)),
        );
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
    if (activeStep !== 1 || !regno || directorsLoadedFor === regno) return;

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

  // Directors are no longer auto-created from the BRS verify response -
  // every director, including ones BRS already lists, gets added through
  // the ID lookup + "Load from BRS" flow in the Directors tab so the list
  // stays strictly tied to verified BRS data.

  const toOffice = (record: ContractorOfficeRecord): Office => ({
    id: record.id,
    town: record.town,
    address: record.address,
    location: record.location,
  });

  // Same idea as Directors: load offices and the shared document pool the
  // first time the Resources step is reached for a given regno. The shared
  // document pool is used from Resources onward (Resources, Track record,
  // Classification & documents), so it loads on any of those steps too.
  useEffect(() => {
    if ((activeStep !== 1 && activeStep !== 2 && activeStep !== 3 && activeStep !== 4) || !regno) return;

    if (activeStep === 2 && officesLoadedFor !== regno) {
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

  // Load existing referees the first time the People step is reached for a given regno.
  useEffect(() => {
    if (activeStep !== 1 || !regno || refereesLoadedFor === regno) return;

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


  const toAsset = (record: ContractorAssetRecord): Asset => ({
    id: record.id,
    description: record.description,
    registrationNo: record.registrationNo,
  });

  useEffect(() => {
    if (activeStep !== 2 || !regno || assetsLoadedFor === regno) return;

    setAssetsLoading(true);
    listAssets(regno)
      .then((records) => {
        setAssets(records.map(toAsset));
        setAssetsLoadedFor(regno);
      })
      .catch((err) => {
        setAssetsError(err instanceof Error ? err.message : 'Could not load assets.');
      })
      .finally(() => setAssetsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);

  const toStaff = (record: ContractorStaffRecord): Staff => ({
    id: record.id,
    fullNames: record.fullNames,
    idNo: record.idNo,
    nationality: record.nationality,
    highestQualification: record.highestQualification,
    yearsOfExperience: record.yearsOfExperience,
  });

  useEffect(() => {
    if (activeStep !== 1 || !regno || staffLoadedFor === regno) return;

    setStaffLoading(true);
    listStaff(regno)
      .then((records) => {
        setStaff(records.map(toStaff));
        setStaffLoadedFor(regno);
      })
      .catch((err) => {
        setStaffError(err instanceof Error ? err.message : 'Could not load staff.');
      })
      .finally(() => setStaffLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);

  const toEquipment = (record: ContractorEquipmentRecord): Equipment => ({
    id: record.id,
    name: record.name,
    ownedOrLeased: record.ownedOrLeased,
    typeMakeModel: record.typeMakeModel,
    category: record.category,
    registrationNo: record.registrationNo,
  });

  useEffect(() => {
    if (activeStep !== 2 || !regno || equipmentLoadedFor === regno) return;

    setEquipmentLoading(true);
    listEquipment(regno)
      .then((records) => {
        setEquipment(records.map(toEquipment));
        setEquipmentLoadedFor(regno);
      })
      .catch((err) => {
        setEquipmentError(err instanceof Error ? err.message : 'Could not load equipment.');
      })
      .finally(() => setEquipmentLoading(false));
  }, [activeStep, regno]);


  const toProjectExperience = (record: ContractorProjectExperienceRecord): ProjectExperience => ({
    id: record.id,
    project: record.project,
    ncaProjectRegNo: record.ncaProjectRegNo,
    contractSum: record.contractSum,
    contractPeriod: record.contractPeriod,
  });

  useEffect(() => {
    if (activeStep !== 3 || !regno || projectsLoadedFor === regno) return;

    setProjectsLoading(true);
    listProjectExperience(regno)
      .then((records) => {
        setProjects(records.map(toProjectExperience));
        setProjectsLoadedFor(regno);
      })
      .catch((err) => {
        setProjectsError(err instanceof Error ? err.message : 'Could not load project experience.');
      })
      .finally(() => setProjectsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);

  const toLitigation = (record: ContractorLitigationRecord): Litigation => ({
    id: record.id,
    refNo: record.refNo,
    date: record.date,
    partiesInvolved: record.partiesInvolved,
    particularOfLitigation: record.particularOfLitigation,
    statusOfMatter: record.statusOfMatter,
  });

  useEffect(() => {
    if (activeStep !== 3 || !regno || litigationLoadedFor === regno) return;

    setLitigationLoading(true);
    listLitigation(regno)
      .then((records) => {
        setLitigation(records.map(toLitigation));
        setLitigationLoadedFor(regno);
      })
      .catch((err) => {
        setLitigationError(err instanceof Error ? err.message : 'Could not load litigation history.');
      })
      .finally(() => setLitigationLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);


useEffect(() => {
    if (activeStep !== 4 || !regno || classificationLoadedFor === regno) return;

    getClassification(regno)
      .then((record) => {
        // Certificate/licence applications only show the class being
        // newly added, never what's already registered - so the form
        // stays blank here even if a classification record already exists.
        if (record && mode !== 'certificate') {
          setClassification({
            applicationType: record.applicationType,
            buildingWorksCategory: record.buildingWorksCategory,
            roadWorksCategory: record.roadWorksCategory,
            waterWorksCategory: record.waterWorksCategory,
            electricalSubClasses: record.electricalSubClasses,
            electricalCategory: record.electricalCategory,
            mechanicalSubClasses: record.mechanicalSubClasses,
            mechanicalCategory: record.mechanicalCategory,
          });
        }
        setClassificationLoadedFor(regno);
      })
      .catch((err) => {
        setApiError(err instanceof Error ? err.message : 'Could not load classification.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);

  // Summary needs every collection populated, but resuming an application
  // jumps straight to the furthest step with data - skipping the individual
  // per-step loading effects for everything before it. This backfills
  // whatever wasn't already loaded this session, so Summary is never
  // showing stale "None added" for data that actually exists.
  useEffect(() => {
    if (activeStep !== 5 || !regno) return;

    if (directorsLoadedFor !== regno) {
      listDirectors(regno).then((records) => {
        setDirectors(records.map(toDirector));
        setDirectorsLoadedFor(regno);
      }).catch(() => {});
    }
    if (officesLoadedFor !== regno) {
      listOffices(regno).then((records) => {
        setOffices(records.map(toOffice));
        setOfficesLoadedFor(regno);
      }).catch(() => {});
    }
    if (documentsLoadedFor !== regno) {
      listDocuments(regno).then((records) => {
        setDocuments(records);
        setDocumentsLoadedFor(regno);
      }).catch(() => {});
    }
    if (refereesLoadedFor !== regno) {
      listReferees(regno).then((records) => {
        setReferees(records.map(toReferee));
        setRefereesLoadedFor(regno);
      }).catch(() => {});
    }
    if (assetsLoadedFor !== regno) {
      listAssets(regno).then((records) => {
        setAssets(records.map(toAsset));
        setAssetsLoadedFor(regno);
      }).catch(() => {});
    }
    if (staffLoadedFor !== regno) {
      listStaff(regno).then((records) => {
        setStaff(records.map(toStaff));
        setStaffLoadedFor(regno);
      }).catch(() => {});
    }
    if (equipmentLoadedFor !== regno) {
      listEquipment(regno).then((records) => {
        setEquipment(records.map(toEquipment));
        setEquipmentLoadedFor(regno);
      }).catch(() => {});
    }
    if (projectsLoadedFor !== regno) {
      listProjectExperience(regno).then((records) => {
        setProjects(records.map(toProjectExperience));
        setProjectsLoadedFor(regno);
      }).catch(() => {});
    }
    if (litigationLoadedFor !== regno) {
      listLitigation(regno).then((records) => {
        setLitigation(records.map(toLitigation));
        setLitigationLoadedFor(regno);
      }).catch(() => {});
    }
    if (classificationLoadedFor !== regno) {
      getClassification(regno).then((record) => {
        if (record && mode !== 'certificate') {
          setClassification({
            applicationType: record.applicationType,
            buildingWorksCategory: record.buildingWorksCategory,
            roadWorksCategory: record.roadWorksCategory,
            waterWorksCategory: record.waterWorksCategory,
            electricalSubClasses: record.electricalSubClasses,
            electricalCategory: record.electricalCategory,
            mechanicalSubClasses: record.mechanicalSubClasses,
            mechanicalCategory: record.mechanicalCategory,
          });
        }
        setClassificationLoadedFor(regno);
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, regno]);


  const handleProfileChange = (field: keyof FirmProfileData, value: string) => {
    setFirmProfile((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) setProfileErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === 'incorporationNo' && duplicateRegno) {
      setDuplicateRegno(null);
      setVerifyMessage(undefined);
    }
  };

  const handleVerifyCompany = async () => {
    if (!firmProfile.incorporationNo.trim()) return;
    setVerifying(true);
    setVerifyMessage(undefined);
    setDuplicateRegno(null);
    try {
      const result = await verifyCompanyRegistration(firmProfile.incorporationNo);

      if (!result.found) {
        setVerifyMessage({ type: 'error', text: 'This registration number could not be verified with BRS. Please check it and try again.' });
        return;
      }
      if (result.blocked) {
        setVerifyMessage({ type: 'error', text: 'This company is already registered under another RCIS account. If you believe this is an error, please contact NCA to request access.' });
        return;
      }
      if (result.requiresForeignRegistration) {
        setVerifyMessage({
          type: 'warning',
          text: `This company has ${result.foreignShareholdingPercent}% foreign shareholding and must be registered as a Foreign Contractor, not Local.`,
        });
        return;
      }

      // New Contractor Registration is only meant for companies that
      // aren't in the system yet - if BRS/our own records show this
      // incorporation number already has a regno, block it here instead
      // of letting a second, duplicate registration be created for the
      // same company. Renewal/Upgrade/Downgrade modes are exempt since
      // finding the existing company is the whole point there.
      if (result.existingRegno && mode === 'new') {
        setDuplicateRegno(result.existingRegno);
        setVerifyMessage({
          type: 'error',
          text: `Company exists in the system with regno ${result.existingRegno}. Please continue with the existing details.`,
        });
        return;
      }

      if (result.existingRegno) {
        setVerifyMessage({ type: 'info', text: `This company is already registered (${result.existingRegno}).` });
      } else {
        setVerifyMessage({ type: 'info', text: `Verified: ${result.businessName}` });
      }

      setFirmProfile((prev) => ({ ...prev, firmName: result.businessName }));
      setFirmRegistration((prev) => ({ ...prev, kraPin: result.kraPin }));
    } catch (err) {
      setVerifyMessage({ type: 'error', text: err instanceof Error ? err.message : 'Could not verify this company. Please try again.' });
    } finally {
      setVerifying(false);
    }
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

  const handleLookupDirector = async (idNo: string) => {
    if (!regno) {
      return { found: false as const };
    }
    return lookupBrsDirector(regno, idNo);
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

  const handleAddAsset = async (asset: Omit<Asset, 'id'>): Promise<boolean> => {
    if (!regno) {
      setAssetsError('Missing application reference — please go back to Step 1 and save again.');
      return false;
    }
    setAssetsSaving(true);
    setAssetsError('');
    try {
      const created = await createAsset({ regno, ...asset });
      setAssets((prev) => [...prev, toAsset(created)]);
      return true;
    } catch (err) {
      setAssetsError(err instanceof Error ? err.message : 'Could not save this asset. Please try again.');
      return false;
    } finally {
      setAssetsSaving(false);
    }
  };

  const handleUpdateAsset = async (id: string, asset: Omit<Asset, 'id'>): Promise<boolean> => {
    setAssetsSaving(true);
    setAssetsError('');
    try {
      const updated = await updateAsset(id, asset);
      setAssets((prev) => prev.map((a) => (a.id === id ? toAsset(updated) : a)));
      return true;
    } catch (err) {
      setAssetsError(err instanceof Error ? err.message : 'Could not update this asset. Please try again.');
      return false;
    } finally {
      setAssetsSaving(false);
    }
  };

  const handleDeleteAsset = async (id: string): Promise<boolean> => {
    setAssetsError('');
    try {
      await deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      setAssetsError(err instanceof Error ? err.message : 'Could not delete this asset. Please try again.');
      return false;
    }
  };

  const handleAddStaff = async (member: Omit<Staff, 'id'>): Promise<boolean> => {
    if (!regno) {
      setStaffError('Missing application reference — please go back to Step 1 and save again.');
      return false;
    }
    setStaffSaving(true);
    setStaffError('');
    try {
      const created = await createStaff({ regno, ...member });
      setStaff((prev) => [...prev, toStaff(created)]);
      return true;
    } catch (err) {
      setStaffError(err instanceof Error ? err.message : 'Could not save this staff member. Please try again.');
      return false;
    } finally {
      setStaffSaving(false);
    }
  };

  const handleUpdateStaff = async (id: string, member: Omit<Staff, 'id'>): Promise<boolean> => {
    setStaffSaving(true);
    setStaffError('');
    try {
      const updated = await updateStaff(id, member);
      setStaff((prev) => prev.map((s) => (s.id === id ? toStaff(updated) : s)));
      return true;
    } catch (err) {
      setStaffError(err instanceof Error ? err.message : 'Could not update this staff member. Please try again.');
      return false;
    } finally {
      setStaffSaving(false);
    }
  };

  const handleDeleteStaff = async (id: string): Promise<boolean> => {
    setStaffError('');
    try {
      await deleteStaff(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err) {
      setStaffError(err instanceof Error ? err.message : 'Could not delete this staff member. Please try again.');
      return false;
    }
  };

  const handleAddEquipment = async (item: Omit<Equipment, 'id'>): Promise<boolean> => {
    if (!regno) {
      setEquipmentError('Missing application reference — please go back to Step 1 and save again.');
      return false;
    }
    setEquipmentSaving(true);
    setEquipmentError('');
    try {
      const created = await createEquipment({ regno, ...item });
      setEquipment((prev) => [...prev, toEquipment(created)]);
      return true;
    } catch (err) {
      setEquipmentError(err instanceof Error ? err.message : 'Could not save this equipment. Please try again.');
      return false;
    } finally {
      setEquipmentSaving(false);
    }
  };

  const handleUpdateEquipment = async (id: string, item: Omit<Equipment, 'id'>): Promise<boolean> => {
    setEquipmentSaving(true);
    setEquipmentError('');
    try {
      const updated = await updateEquipment(id, item);
      setEquipment((prev) => prev.map((e) => (e.id === id ? toEquipment(updated) : e)));
      return true;
    } catch (err) {
      setEquipmentError(err instanceof Error ? err.message : 'Could not update this equipment. Please try again.');
      return false;
    } finally {
      setEquipmentSaving(false);
    }
  };

  const handleDeleteEquipment = async (id: string): Promise<boolean> => {
    setEquipmentError('');
    try {
      await deleteEquipment(id);
      setEquipment((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err) {
      setEquipmentError(err instanceof Error ? err.message : 'Could not delete this equipment. Please try again.');
      return false;
    }
  };

  const handleAddProject = async (project: Omit<ProjectExperience, 'id'>): Promise<boolean> => {
    if (!regno) {
      setProjectsError('Missing application reference — please go back to Step 1 and save again.');
      return false;
    }
    setProjectsSaving(true);
    setProjectsError('');
    try {
      const created = await createProjectExperience({ regno, ...project });
      setProjects((prev) => [...prev, toProjectExperience(created)]);
      return true;
    } catch (err) {
      setProjectsError(err instanceof Error ? err.message : 'Could not save this project. Please try again.');
      return false;
    } finally {
      setProjectsSaving(false);
    }
  };

  const handleUpdateProject = async (id: string, project: Omit<ProjectExperience, 'id'>): Promise<boolean> => {
    setProjectsSaving(true);
    setProjectsError('');
    try {
      const updated = await updateProjectExperience(id, project);
      setProjects((prev) => prev.map((p) => (p.id === id ? toProjectExperience(updated) : p)));
      return true;
    } catch (err) {
      setProjectsError(err instanceof Error ? err.message : 'Could not update this project. Please try again.');
      return false;
    } finally {
      setProjectsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string): Promise<boolean> => {
    setProjectsError('');
    try {
      await deleteProjectExperience(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setProjectsError(err instanceof Error ? err.message : 'Could not delete this project. Please try again.');
      return false;
    }
  };

  const handleAddLitigation = async (entry: Omit<Litigation, 'id'>): Promise<boolean> => {
    if (!regno) {
      setLitigationError('Missing application reference — please go back to Step 1 and save again.');
      return false;
    }
    setLitigationSaving(true);
    setLitigationError('');
    try {
      const created = await createLitigation({ regno, ...entry });
      setLitigation((prev) => [...prev, toLitigation(created)]);
      return true;
    } catch (err) {
      setLitigationError(err instanceof Error ? err.message : 'Could not save this entry. Please try again.');
      return false;
    } finally {
      setLitigationSaving(false);
    }
  };

  const handleUpdateLitigation = async (id: string, entry: Omit<Litigation, 'id'>): Promise<boolean> => {
    setLitigationSaving(true);
    setLitigationError('');
    try {
      const updated = await updateLitigation(id, entry);
      setLitigation((prev) => prev.map((l) => (l.id === id ? toLitigation(updated) : l)));
      return true;
    } catch (err) {
      setLitigationError(err instanceof Error ? err.message : 'Could not update this entry. Please try again.');
      return false;
    } finally {
      setLitigationSaving(false);
    }
  };

  const handleDeleteLitigation = async (id: string): Promise<boolean> => {
    setLitigationError('');
    try {
      await deleteLitigation(id);
      setLitigation((prev) => prev.filter((l) => l.id !== id));
      return true;
    } catch (err) {
      setLitigationError(err instanceof Error ? err.message : 'Could not delete this entry. Please try again.');
      return false;
    }
  };


  const handleClassificationChange = (field: keyof ClassificationData, value: string) => {
    setClassification((prev) => ({ ...prev, [field]: value }));
    if (classificationErrors[field]) setClassificationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleElectricalSubClassesChange = (codes: string[]) => {
    setClassification((prev) => ({ ...prev, electricalSubClasses: codes }));
  };

  const handleMechanicalSubClassesChange = (codes: string[]) => {
    setClassification((prev) => ({ ...prev, mechanicalSubClasses: codes }));
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

  const validateReferees = (): boolean => {
    if (referees.length === 0) {
      setRefereesError('Add at least one referee before continuing');
      return false;
    }
    setRefereesError('');
    return true;
  };

  const validateClassification = (): boolean => {
    const next: Partial<Record<keyof ClassificationData, string>> = {};
    if (!classification.applicationType) next.applicationType = 'Required';
    setClassificationErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateDeclarations()) return;
    if (!regno) {
      setSubmitError('Missing application reference — please go back to Step 1 and save again.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await updateDeclarations({ regno, ...declarations });
      const updated = await submitApplication(regno);
      setJustSubmittedTrackNo(updated.trackNo);
      // Submitted applications are locked - there's nothing left to do on
      // this page, so send the person back to the dashboard rather than
      // leaving them sitting on a wizard they can no longer edit.
      navigate('/', {
        replace: true,
        state: { notice: `Application submitted. Your tracking number is ${updated.trackNo}.` },
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit the application. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

    // Step 0 (Company Details) persists both Firm Profile and Firm
    // Registration on "Save and continue". People/Resources/Track record
    // persist incrementally as each row/document is added within their
    // tabs, so "Save and continue" there just validates and moves on.
    if (activeStep === 0) {
      if (duplicateRegno) {
        setApiError(`Company exists in the system with regno ${duplicateRegno}. Please continue with the existing details.`);
        return;
      }
      if (!validateProfile() || !validateRegistration()) return;
      setSaving(true);
      try {
        if (regno) {
          // Already has a regno (fresh create earlier, or resumed) - update, don't create again.
          await Promise.all([
            updateFirmProfile({ regno, ...firmProfile }),
            updateFirmRegistration({ regno, ...firmRegistration }),
          ]);
        } else {
          const created = await createFirmProfile({ ...firmProfile });
          setRegno(created.regno);
          await updateFirmRegistration({ regno: created.regno, ...firmRegistration });
        }
        advance();
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Could not save Company Details. Please try again.');
      } finally {
        setSaving(false);
      }
      return;
    }

    // People, Resources and Track record each bundle 2-3 tabs. "Save and
    // continue" steps through them one at a time - Directors then Referees
    // then Staff, and so on - instead of jumping straight to the next
    // wizard step the moment the first tab is filled in. Directors and
    // Referees are mandatory; the rest just need to be seen, not filled.
    if (activeStep === 1) {
      if (peopleTab === 0) {
        if (!validateDirectors()) return;
        setSavedAt(new Date());
        setPeopleTab(1);
        return;
      }
      if (peopleTab === 1) {
        if (!validateReferees()) return;
        setSavedAt(new Date());
        setPeopleTab(2);
        return;
      }
      advance();
      return;
    }

    if (activeStep === 2) {
      if (resourcesTab < 2) {
        setSavedAt(new Date());
        setResourcesTab(resourcesTab + 1);
        return;
      }
      advance();
      return;
    }

    if (activeStep === 3) {
      if (trackRecordTab < 1) {
        setSavedAt(new Date());
        setTrackRecordTab(trackRecordTab + 1);
        return;
      }
      advance();
      return;
    }

    if (activeStep === 4) {
      if (!validateClassification()) return;
      if (!regno) {
        setApiError('Missing application reference — please go back to Step 1 and save again.');
        return;
      }
      setSaving(true);
      try {
        await upsertClassification({ regno, ...classification });
        advance();
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Could not save Classification. Please try again.');
      } finally {
        setSaving(false);
      }
      return;
    }

    advance();
  };

  const handlePrev = () => {
    // Mirror the forward tab-stepping: back up one tab within the current
    // group before leaving it, and land on the last tab of the previous
    // group when stepping back into one.
    if (activeStep === 1 && peopleTab > 0) {
      setPeopleTab(peopleTab - 1);
      return;
    }
    if (activeStep === 2 && resourcesTab > 0) {
      setResourcesTab(resourcesTab - 1);
      return;
    }
    if (activeStep === 3 && trackRecordTab > 0) {
      setTrackRecordTab(trackRecordTab - 1);
      return;
    }

    if (activeStep === 0) return;
    const prevStep = activeStep - 1;
    if (prevStep === 1) setPeopleTab(2);
    if (prevStep === 2) setResourcesTab(2);
    if (prevStep === 3) setTrackRecordTab(1);
    goStep(prevStep);
  };

  const savedLabel = useMemo(() => {
    if (!savedAt) return null;
    return `Saved at ${savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [savedAt]);

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <CompanyDetailsStep
          profileData={firmProfile}
          profileErrors={profileErrors}
          onProfileChange={handleProfileChange}
          onVerify={handleVerifyCompany}
          verifying={verifying}
          verifyMessage={verifyMessage}
          registrationData={firmRegistration}
          registrationErrors={registrationErrors}
          onRegistrationChange={handleRegistrationChange}
          onCategoriesChange={handleCategoriesChange}
        />
      );
    }

    if (activeStep === 1) {
      return (
        <PeopleStep
          activeTab={peopleTab}
          onActiveTabChange={setPeopleTab}
          directors={directors}
          onAddDirector={handleAddDirector}
          onUpdateDirector={handleUpdateDirector}
          onDeleteDirector={handleDeleteDirector}
          onUploadDirectorFile={handleUploadDirectorFile}
          onViewDirectorFile={handleViewDirectorFile}
          onLookupDirector={handleLookupDirector}
          directorsError={directorsError}
          directorsSaving={directorsSaving}
          directorsLoading={directorsLoading}
          referees={referees}
          onAddReferee={handleAddReferee}
          onUpdateReferee={handleUpdateReferee}
          onDeleteReferee={handleDeleteReferee}
          refereesError={refereesError}
          refereesSaving={refereesSaving}
          refereesLoading={refereesLoading}
          staff={staff}
          onAddStaff={handleAddStaff}
          onUpdateStaff={handleUpdateStaff}
          onDeleteStaff={handleDeleteStaff}
          staffError={staffError}
          staffSaving={staffSaving}
          staffLoading={staffLoading}
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

    if (activeStep === 2) {
      return (
        <ResourcesStep
          activeTab={resourcesTab}
          onActiveTabChange={setResourcesTab}
          offices={offices}
          onAddOffice={handleAddOffice}
          onUpdateOffice={handleUpdateOffice}
          onDeleteOffice={handleDeleteOffice}
          officesError={officesError}
          officesSaving={officesSaving}
          officesLoading={officesLoading}
          assets={assets}
          onAddAsset={handleAddAsset}
          onUpdateAsset={handleUpdateAsset}
          onDeleteAsset={handleDeleteAsset}
          assetsError={assetsError}
          assetsSaving={assetsSaving}
          assetsLoading={assetsLoading}
          equipment={equipment}
          onAddEquipment={handleAddEquipment}
          onUpdateEquipment={handleUpdateEquipment}
          onDeleteEquipment={handleDeleteEquipment}
          equipmentError={equipmentError}
          equipmentSaving={equipmentSaving}
          equipmentLoading={equipmentLoading}
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

    if (activeStep === 3) {
      return (
        <TrackRecordStep
          activeTab={trackRecordTab}
          onActiveTabChange={setTrackRecordTab}
          projects={projects}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          projectsError={projectsError}
          projectsSaving={projectsSaving}
          projectsLoading={projectsLoading}
          litigation={litigation}
          onAddLitigation={handleAddLitigation}
          onUpdateLitigation={handleUpdateLitigation}
          onDeleteLitigation={handleDeleteLitigation}
          litigationError={litigationError}
          litigationSaving={litigationSaving}
          litigationLoading={litigationLoading}
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

    if (activeStep === 4) {
      return (
        <ClassificationAttachmentsStep
          classification={classification}
          classificationErrors={classificationErrors}
          onClassificationChange={handleClassificationChange}
          onElectricalSubClassesChange={handleElectricalSubClassesChange}
          onMechanicalSubClassesChange={handleMechanicalSubClassesChange}
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
        <SummaryStep
          regno={regno}
          justSubmittedTrackNo={justSubmittedTrackNo}
          firmProfile={firmProfile}
          firmRegistration={firmRegistration}
          declarations={declarations}
          declarationsErrors={declarationsErrors}
          onDeclarationsChange={handleDeclarationsChange}
          validateDeclarations={validateDeclarations}
          directors={directors}
          offices={offices}
          referees={referees}
          assets={assets}
          staff={staff}
          equipment={equipment}
          projects={projects}
          litigation={litigation}
          classification={classification}
          documents={documents}
          onEditStep={goStep}
          onViewDocument={handleViewDocument}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
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

          <div className="rounded-xl border border-slate-200 bg-white">
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

              {!isLastStep && (
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
                    disabled={saving}
                    className="flex items-center gap-1 rounded-md text-white text-sm px-5 py-2 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--rcis-accent)' }}
                  >
                    {saving ? 'Saving...' : 'Save and continue'}
                    {!saving && <ChevronRight size={15} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}