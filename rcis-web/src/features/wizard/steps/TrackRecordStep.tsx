import TabGroup from '../TabGroup';
import ProjectExperienceStep from './ProjectExperienceStep';
import LitigationStep from './LitigationStep';
import type { ProjectExperience, Litigation } from '../wizard-types';
import type { ContractorDocumentRecord } from '@/lib/api';

interface DocumentProps {
  documents: ContractorDocumentRecord[];
  documentsLoading: boolean;
  documentsUploading: boolean;
  documentsError?: string;
  onUploadDocument: (docType: string, file: File) => Promise<void>;
  onViewDocument: (documentId: string) => Promise<void>;
  onDeleteDocument: (documentId: string) => Promise<void>;
}

interface TrackRecordStepProps extends DocumentProps {
  activeTab: number;
  onActiveTabChange: (index: number) => void;

  projects: ProjectExperience[];
  onAddProject: (project: Omit<ProjectExperience, 'id'>) => Promise<boolean>;
  onUpdateProject: (id: string, project: Omit<ProjectExperience, 'id'>) => Promise<boolean>;
  onDeleteProject: (id: string) => Promise<boolean>;
  projectsError?: string;
  projectsSaving?: boolean;
  projectsLoading?: boolean;

  litigation: Litigation[];
  onAddLitigation: (entry: Omit<Litigation, 'id'>) => Promise<boolean>;
  onUpdateLitigation: (id: string, entry: Omit<Litigation, 'id'>) => Promise<boolean>;
  onDeleteLitigation: (id: string) => Promise<boolean>;
  litigationError?: string;
  litigationSaving?: boolean;
  litigationLoading?: boolean;
}

// Project Experience and Litigation History grouped under tabs.
export default function TrackRecordStep({
  activeTab, onActiveTabChange,
  projects, onAddProject, onUpdateProject, onDeleteProject, projectsError, projectsSaving, projectsLoading,
  litigation, onAddLitigation, onUpdateLitigation, onDeleteLitigation, litigationError, litigationSaving, litigationLoading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: TrackRecordStepProps) {
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
          key: 'projects',
          label: 'Project experience',
          complete: projects.length > 0,
          content: (
            <ProjectExperienceStep
              projects={projects}
              onAdd={onAddProject}
              onUpdate={onUpdateProject}
              onDelete={onDeleteProject}
              error={projectsError}
              saving={projectsSaving}
              loading={projectsLoading}
              {...documentProps}
            />
          ),
        },
        {
          key: 'litigation',
          label: 'Litigation history',
          complete: litigation.length > 0,
          content: (
            <LitigationStep
              litigation={litigation}
              onAdd={onAddLitigation}
              onUpdate={onUpdateLitigation}
              onDelete={onDeleteLitigation}
              error={litigationError}
              saving={litigationSaving}
              loading={litigationLoading}
              {...documentProps}
            />
          ),
        },
      ]}
    />
  );
}
