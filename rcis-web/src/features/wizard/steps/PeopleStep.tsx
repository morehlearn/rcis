import TabGroup from '../TabGroup';
import DirectorsStep from './DirectorsStep';
import RefereesStep from './RefereesStep';
import StaffStep from './StaffStep';
import type { Director, Referee, Staff } from '../wizard-types';
import type { ContractorDocumentRecord } from '@/lib/api';

type DirectorFileField = 'cv' | 'academicCert';

type BrsLookupResult =
  | { found: false }
  | { found: true; fullNames: string; nationality: string; percentageShare: string };

interface DocumentProps {
  documents: ContractorDocumentRecord[];
  documentsLoading: boolean;
  documentsUploading: boolean;
  documentsError?: string;
  onUploadDocument: (docType: string, file: File) => Promise<void>;
  onViewDocument: (documentId: string) => Promise<void>;
  onDeleteDocument: (documentId: string) => Promise<void>;
}

interface PeopleStepProps extends DocumentProps {
  activeTab: number;
  onActiveTabChange: (index: number) => void;

  directors: Director[];
  onAddDirector: (director: Omit<Director, 'id'>) => Promise<string | null>;
  onUpdateDirector: (id: string, director: Omit<Director, 'id'>) => Promise<boolean>;
  onDeleteDirector: (id: string) => Promise<boolean>;
  onUploadDirectorFile: (directorId: string, field: DirectorFileField, file: File) => Promise<void>;
  onViewDirectorFile: (directorId: string, field: DirectorFileField) => Promise<void>;
  onLookupDirector: (idNo: string) => Promise<BrsLookupResult>;
  directorsError?: string;
  directorsSaving?: boolean;
  directorsLoading?: boolean;

  referees: Referee[];
  onAddReferee: (referee: Omit<Referee, 'id'>) => Promise<boolean>;
  onUpdateReferee: (id: string, referee: Omit<Referee, 'id'>) => Promise<boolean>;
  onDeleteReferee: (id: string) => Promise<boolean>;
  refereesError?: string;
  refereesSaving?: boolean;
  refereesLoading?: boolean;

  staff: Staff[];
  onAddStaff: (member: Omit<Staff, 'id'>) => Promise<boolean>;
  onUpdateStaff: (id: string, member: Omit<Staff, 'id'>) => Promise<boolean>;
  onDeleteStaff: (id: string) => Promise<boolean>;
  staffError?: string;
  staffSaving?: boolean;
  staffLoading?: boolean;
}

// Directors, Referees and Staff were three separate wizard steps, but they
// share the exact same shape (a repeatable list + add/edit form + shared
// document pool) - grouping them under tabs cuts three page transitions
// down to one.
export default function PeopleStep({
  activeTab, onActiveTabChange,
  directors, onAddDirector, onUpdateDirector, onDeleteDirector,
  onUploadDirectorFile, onViewDirectorFile, onLookupDirector, directorsError, directorsSaving, directorsLoading,
  referees, onAddReferee, onUpdateReferee, onDeleteReferee, refereesError, refereesSaving, refereesLoading,
  staff, onAddStaff, onUpdateStaff, onDeleteStaff, staffError, staffSaving, staffLoading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: PeopleStepProps) {
  const documentProps: DocumentProps = {
    documents, documentsLoading, documentsUploading, documentsError,
    onUploadDocument, onViewDocument, onDeleteDocument,
  };

  return (
    <TabGroup
      activeIndex={activeTab}
      onActiveIndexChange={onActiveTabChange}
      tabs={[
        {
          key: 'directors',
          label: 'Directors',
          complete: directors.length > 0,
          content: (
            <DirectorsStep
              directors={directors}
              onAdd={onAddDirector}
              onUpdate={onUpdateDirector}
              onDelete={onDeleteDirector}
              onUploadFile={onUploadDirectorFile}
              onViewFile={onViewDirectorFile}
              onLookupDirector={onLookupDirector}
              error={directorsError}
              saving={directorsSaving}
              loading={directorsLoading}
            />
          ),
        },
        {
          key: 'referees',
          label: 'Referees',
          complete: referees.length > 0,
          content: (
            <RefereesStep
              referees={referees}
              onAdd={onAddReferee}
              onUpdate={onUpdateReferee}
              onDelete={onDeleteReferee}
              error={refereesError}
              saving={refereesSaving}
              loading={refereesLoading}
              {...documentProps}
            />
          ),
        },
        {
          key: 'staff',
          label: 'Staff',
          complete: staff.length > 0,
          content: (
            <StaffStep
              staff={staff}
              onAdd={onAddStaff}
              onUpdate={onUpdateStaff}
              onDelete={onDeleteStaff}
              error={staffError}
              saving={staffSaving}
              loading={staffLoading}
              {...documentProps}
            />
          ),
        },
      ]}
    />
  );
}
