import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Field, inputCls } from '../Field';
import { type Referee, emptyRefereeDraft, PROFESSIONS } from '../wizard-types';
import DocumentUploadPanel from '../DocumentUploadPanel';
import type { ContractorDocumentRecord } from '@/lib/api';

interface RefereesStepProps {
  referees: Referee[];
  onAdd: (referee: Omit<Referee, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, referee: Omit<Referee, 'id'>) => Promise<boolean>;
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

export default function RefereesStep({
  referees, onAdd, onUpdate, onDelete, error, saving, loading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: RefereesStepProps) {
  const [draft, setDraft] = useState<Omit<Referee, 'id'>>(emptyRefereeDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Referee, string>>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const change = (field: keyof Omit<Referee, 'id'>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateDraft = (): boolean => {
    const next: Partial<Record<keyof Referee, string>> = {};
    if (!draft.name.trim()) next.name = 'Required';
    if (!draft.postalAddress.trim()) next.postalAddress = 'Required';
    if (!draft.telephone.trim()) next.telephone = 'Required';
    if (!draft.profession) next.profession = 'Required';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetDraft = () => {
    setDraft(emptyRefereeDraft);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateDraft()) return;
    const ok = editingId ? await onUpdate(editingId, draft) : await onAdd(draft);
    if (ok) resetDraft();
  };

  const handleEdit = (referee: Referee) => {
    const { id, ...rest } = referee;
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
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Referees</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          At least one referee should be a professional in the construction industry.
        </p>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading referees...</p>}

      {!loading && referees.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[550px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Postal Address</th>
                <th className="px-3 py-2 font-medium">Telephone</th>
                <th className="px-3 py-2 font-medium">Profession</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {referees.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{r.name}</td>
                  <td className="px-3 py-2 text-slate-600">{r.postalAddress}</td>
                  <td className="px-3 py-2 text-slate-600">{r.telephone}</td>
                  <td className="px-3 py-2 text-slate-600">{r.profession}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(r)}
                        className="p-1.5 rounded text-white"
                        style={{ backgroundColor: 'var(--rcis-primary)' }}
                        aria-label="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
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
          {editingId ? 'Edit Referee' : 'Add Referee'}
        </h4>

        <div className="grid sm:grid-cols-4 gap-4">
          <Field label="Name" required error={formErrors.name}>
            <input className={inputCls(formErrors.name)} value={draft.name} onChange={(e) => change('name', e.target.value)} />
          </Field>
          <Field label="Postal Address" required error={formErrors.postalAddress}>
            <input className={inputCls(formErrors.postalAddress)} value={draft.postalAddress} onChange={(e) => change('postalAddress', e.target.value)} />
          </Field>
          <Field label="Telephone" required error={formErrors.telephone}>
            <input className={inputCls(formErrors.telephone)} value={draft.telephone} onChange={(e) => change('telephone', e.target.value)} />
          </Field>
          <Field label="Profession" required error={formErrors.profession}>
            <select className={inputCls(formErrors.profession)} value={draft.profession} onChange={(e) => change('profession', e.target.value)}>
              <option value="">Please Select</option>
              {PROFESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
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