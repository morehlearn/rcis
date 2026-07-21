import { useState } from 'react';
import { Upload, ExternalLink, Trash2 } from 'lucide-react';
import { inputCls } from './Field';
import { DOCUMENT_TYPES } from './wizard-types';
import type { ContractorDocumentRecord } from '@/lib/api';

interface DocumentUploadPanelProps {
  documents: ContractorDocumentRecord[];
  loading: boolean;
  uploading: boolean;
  error?: string;
  onUpload: (docType: string, file: File) => Promise<void>;
  onView: (documentId: string) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
}

export default function DocumentUploadPanel({
  documents, loading, uploading, error, onUpload, onView, onDelete,
}: DocumentUploadPanelProps) {
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const handleUploadClick = async () => {
    if (!docType) {
      setFormError('Choose a document type');
      return;
    }
    if (!file) {
      setFormError('Choose a file');
      return;
    }
    setFormError('');
    await onUpload(docType, file);
    setDocType('');
    setFile(null);
  };

  const handleView = async (id: string) => {
    setOpeningId(id);
    await onView(id);
    setOpeningId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-slate-600 space-y-1">
        <p className="font-medium text-slate-700">NOTE:</p>
        <p>Upload Lease Agreement &amp; Title Deed copies.</p>
        <p>Name your documents appropriately — files with similar names will be overwritten by the latest upload.</p>
        <p>Avoid the following characters in file names: # % &amp; * : &lt; &gt; ? / {'{ }'}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Choose document to upload</label>
          <select className={inputCls()} value={docType} onChange={(e) => setDocType(e.target.value)}>
            <option value="">--Please Select--</option>
            {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={`${inputCls()} flex items-center gap-2 cursor-pointer text-slate-500`}>
            <Upload size={14} />
            <span className="truncate">{file ? file.name : 'Choose file...'}</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </div>

      {formError && <p className="text-xs text-red-600">{formError}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleUploadClick}
        disabled={uploading}
        className="px-4 py-2 rounded-md text-white text-xs font-medium disabled:opacity-60"
        style={{ backgroundColor: 'var(--rcis-accent)' }}
      >
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">List of uploaded files</h4>
        </div>
        {loading ? (
          <p className="text-xs text-slate-400 px-3 py-3">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-xs text-slate-400 px-3 py-3">No documents uploaded yet.</p>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">File Name</th>
                <th className="px-3 py-2 font-medium">Document Type</th>
                <th className="px-3 py-2 font-medium">Uploaded</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleView(doc.id)}
                      disabled={openingId === doc.id}
                      className="inline-flex items-center gap-1 font-medium hover:underline disabled:opacity-50"
                      style={{ color: 'var(--rcis-primary)' }}
                    >
                      {openingId === doc.id ? 'Opening...' : doc.fileName}
                      <ExternalLink size={11} />
                    </button>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{doc.docType}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {new Date(doc.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="p-1.5 rounded text-white bg-red-600 disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}