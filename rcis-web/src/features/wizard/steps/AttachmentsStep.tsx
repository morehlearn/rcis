import { GENERAL_REQUIREMENTS } from '../wizard-types';
import DocumentUploadPanel from '../DocumentUploadPanel';
import type { ContractorDocumentRecord } from '@/lib/api';

interface AttachmentsStepProps {
  documents: ContractorDocumentRecord[];
  documentsLoading: boolean;
  documentsUploading: boolean;
  documentsError?: string;
  onUploadDocument: (docType: string, file: File) => Promise<void>;
  onViewDocument: (documentId: string) => Promise<void>;
  onDeleteDocument: (documentId: string) => Promise<void>;
}

export default function AttachmentsStep({
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: AttachmentsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Attachments</h3>
        <p className="text-xs text-slate-500 mt-1">
          Please ensure all the following attachments have been loaded on the form before proceeding further.
        </p>
        <p className="text-xs font-medium text-slate-700 mt-3">The attachments includes:</p>
        <ul className="list-disc list-outside pl-5 mt-2 space-y-1 text-xs text-slate-600">
          {GENERAL_REQUIREMENTS.map((item) => (
            <li key={item.text}>
              {item.text}
              {item.mandatory && <span className="text-red-600">*</span>}
            </li>
          ))}
        </ul>
      </div>
      <DocumentUploadPanel
        documents={documents}
        loading={documentsLoading}
        uploading={documentsUploading}
        error={documentsError}
        onUpload={onUploadDocument}
        onView={onViewDocument}
        onDelete={onDeleteDocument}
      />
    </div>
  );
}