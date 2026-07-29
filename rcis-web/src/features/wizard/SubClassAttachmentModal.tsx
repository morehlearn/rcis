import { useState } from 'react';
import { Upload } from 'lucide-react';
import Modal from '@/components/Modal';
import { inputCls } from './Field';

interface SubClassAttachmentModalProps {
  subClassLabel: string;
  requiredAttachment: string;
  uploading: boolean;
  onUpload: (docType: string, file: File) => Promise<void>;
  onClose: () => void;
}

export default function SubClassAttachmentModal({
  subClassLabel, requiredAttachment, uploading, onUpload, onClose,
}: SubClassAttachmentModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    await onUpload(requiredAttachment, file);
    onClose();
  };

  return (
    <Modal title="Attachment Required" onClose={onClose}>
      <p>
        You've selected <span className="font-medium">{subClassLabel}</span>, which requires:
      </p>
      <p className="mt-1 font-semibold" style={{ color: 'var(--rcis-primary)' }}>
        {requiredAttachment}
      </p>
      <p className="mt-3 text-xs text-slate-500">
        You can upload it now, or add it later from this step or the Attachments step - it goes
        into the same document list either way.
      </p>

      <label className={`${inputCls()} flex items-center gap-2 cursor-pointer text-slate-500 mt-4`}>
        <Upload size={14} />
        <span className="truncate">{file ? file.name : 'Choose file...'}</span>
        <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 rounded-md text-white text-xs font-medium disabled:opacity-50"
          style={{ backgroundColor: 'var(--rcis-accent)' }}
        >
          {uploading ? 'Uploading...' : 'Upload Now'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-slate-300 text-xs font-medium text-slate-600"
        >
          Skip for Now
        </button>
      </div>
    </Modal>
  );
}