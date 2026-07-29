import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Field, inputCls } from '../Field';
import { type Asset, emptyAssetDraft } from '../wizard-types';
import DocumentUploadPanel from '../DocumentUploadPanel';
import type { ContractorDocumentRecord } from '@/lib/api';

interface AssetsStepProps {
  assets: Asset[];
  onAdd: (asset: Omit<Asset, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, asset: Omit<Asset, 'id'>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  error?: string;
  saving?: boolean;
  loading?: boolean;

  documents: ContractorDocumentRecord[];
  documentsLoading: boolean;
  documentsUploading: boolean;
  documentsError?: string;
  onUploadDocument: (docType: string, file: File) => Promise<void>;
  onViewDocument: (documentId: string) => Promise<void>;
  onDeleteDocument: (documentId: string) => Promise<void>;
}

export default function AssetsStep({
  assets, onAdd, onUpdate, onDelete, error, saving, loading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: AssetsStepProps) {
  const [draft, setDraft] = useState<Omit<Asset, 'id'>>(emptyAssetDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Asset, string>>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const change = (field: keyof Omit<Asset, 'id'>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateDraft = (): boolean => {
    const next: Partial<Record<keyof Asset, string>> = {};
    if (!draft.description.trim()) next.description = 'Required';
    if (!draft.registrationNo.trim()) next.registrationNo = 'Required';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetDraft = () => {
    setDraft(emptyAssetDraft);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateDraft()) return;
    const ok = editingId ? await onUpdate(editingId, draft) : await onAdd(draft);
    if (ok) resetDraft();
  };

  const handleEdit = (asset: Asset) => {
    const { id, ...rest } = asset;
    setDraft(rest);
    setEditingId(id);
    setFormErrors({});
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Assets</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          List the firm's fixed (immovable) assets and their registration details.
        </p>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading assets...</p>}

      {!loading && assets.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[400px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">Description</th>
                <th className="px-3 py-2 font-medium">Registration No</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{a.description}</td>
                  <td className="px-3 py-2 text-slate-600">{a.registrationNo}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(a)}
                        className="p-1.5 rounded text-white"
                        style={{ backgroundColor: 'var(--rcis-primary)' }}
                        aria-label="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id)}
                        disabled={deletingId === a.id}
                        className="p-1.5 rounded text-white bg-red-600 disabled:opacity-50"
                        aria-label="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="rounded-lg border border-slate-200 p-4 space-y-4">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          {editingId ? 'Edit Asset' : 'Add Fixed Asset (Immovable Assets)'}
        </h4>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Description" required error={formErrors.description}>
            <input className={inputCls(formErrors.description)} value={draft.description} onChange={(e) => change('description', e.target.value)} />
          </Field>
          <Field label="Registration No" required error={formErrors.registrationNo}>
            <input className={inputCls(formErrors.registrationNo)} value={draft.registrationNo} onChange={(e) => change('registrationNo', e.target.value)} />
          </Field>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-md text-white text-xs font-medium disabled:opacity-60"
            style={{ backgroundColor: 'var(--rcis-accent)' }}
          >
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Save & Add More'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetDraft}
              disabled={saving}
              className="px-4 py-2 rounded-md border border-slate-300 text-xs font-medium text-slate-600"
            >
              Cancel
            </button>
          )}
        </div>
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