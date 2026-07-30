import ClassificationStep from './ClassificationStep';
import AttachmentsStep from './AttachmentsStep';
import type { ClassificationData } from '../wizard-types';
import type { ContractorDocumentRecord } from '@/lib/api';

interface ClassificationAttachmentsStepProps {
  classification: ClassificationData;
  classificationErrors: Partial<Record<keyof ClassificationData, string>>;
  onClassificationChange: (field: keyof ClassificationData, value: string) => void;
  onElectricalSubClassesChange: (codes: string[]) => void;
  onMechanicalSubClassesChange: (codes: string[]) => void;

  documents: ContractorDocumentRecord[];
  documentsLoading: boolean;
  documentsUploading: boolean;
  documentsError?: string;
  onUploadDocument: (docType: string, file: File) => Promise<void>;
  onViewDocument: (documentId: string) => Promise<void>;
  onDeleteDocument: (documentId: string) => Promise<void>;
}

// Classification already triggers attachment-prompt modals for subclasses
// that require an EPRA/CAK/trade license, so it was already functionally
// tied to document uploads - this just puts the general Attachments
// checklist in the same step instead of a step of its own.
export default function ClassificationAttachmentsStep({
  classification, classificationErrors, onClassificationChange,
  onElectricalSubClassesChange, onMechanicalSubClassesChange,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: ClassificationAttachmentsStepProps) {
  return (
    <div className="space-y-8">
      <ClassificationStep
        data={classification}
        errors={classificationErrors}
        onChange={onClassificationChange}
        onElectricalSubClassesChange={onElectricalSubClassesChange}
        onMechanicalSubClassesChange={onMechanicalSubClassesChange}
        onUploadDocument={onUploadDocument}
        documentsUploading={documentsUploading}
      />
      <div className="border-t border-slate-100 pt-6">
        <AttachmentsStep
          documents={documents}
          documentsLoading={documentsLoading}
          documentsUploading={documentsUploading}
          documentsError={documentsError}
          onUploadDocument={onUploadDocument}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
        />
      </div>
    </div>
  );
}
