import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Field, inputCls } from '../Field';
import { type Litigation, emptyLitigationDraft } from '../wizard-types';
import DocumentUploadPanel from '../DocumentUploadPanel';
import type { ContractorDocumentRecord } from '@/lib/api';

interface LitigationStepProps {
  litigation: Litigation[];
  onAdd: (entry: Omit<Litigation, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, entry: Omit<Litigation, 'id'>) => Promise<boolean>;
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

export default function LitigationStep({
  litigation, onAdd, onUpdate, onDelete, error, saving, loading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: LitigationStepProps) {
  const [draft, setDraft] = useState<Omit<Litigation, 'id'>>(emptyLitigationDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Litigation, string>>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const change = (field: keyof Omit<Litigation, 'id'>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateDraft = (): boolean => {
    const next: Partial<Record<keyof Litigation, string>> = {};
    if (!draft.refNo.trim()) next.refNo = 'Required';
    if (!draft.date.trim()) next.date = 'Required';
    if (!draft.partiesInvolved.trim()) next.partiesInvolved = 'Required';
    if (!draft.particularOfLitigation.trim()) next.particularOfLitigation = 'Required';
    if (!draft.statusOfMatter.trim()) next.statusOfMatter = 'Required';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetDraft = () => {
    setDraft(emptyLitigationDraft);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateDraft()) return;
    const ok = editingId ? await onUpdate(editingId, draft) : await onAdd(draft);
    if (ok) resetDraft();
  };

  const handleEdit = (entry: Litigation) => {
    const { id, ...rest } = entry;
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
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Litigation History</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Indicate details of litigation, arbitration, adjudication, or termination on any contracts and
          any completion projects. Leave blank if not applicable.
        </p>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading litigation history...</p>}

      {!loading && litigation.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">Ref No</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Parties Involved</th>
                <th className="px-3 py-2 font-medium">Particular of Litigation</th>
                <th className="px-3 py-2 font-medium">Status of Matter</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {litigation.map((l) => (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{l.refNo}</td>
                  <td className="px-3 py-2 text-slate-600">{l.date}</td>
                  <td className="px-3 py-2 text-slate-600">{l.partiesInvolved}</td>
                  <td className="px-3 py-2 text-slate-600">{l.particularOfLitigation}</td>
                  <td className="px-3 py-2 text-slate-600">{l.statusOfMatter}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(l)}
                        className="p-1.5 rounded text-white"
                        style={{ backgroundColor: 'var(--rcis-primary)' }}
                        aria-label="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(l.id)}
                        disabled={deletingId === l.id}
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
          {editingId ? 'Edit Litigation Entry' : 'Add Firms Litigation History'}
        </h4>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Ref No" required error={formErrors.refNo}>
            <input className={inputCls(formErrors.refNo)} value={draft.refNo} onChange={(e) => change('refNo', e.target.value)} />
          </Field>
          <Field label="Date" required error={formErrors.date}>
            <input type="date" className={inputCls(formErrors.date)} value={draft.date} onChange={(e) => change('date', e.target.value)} />
          </Field>
          <Field label="Parties Involved" required error={formErrors.partiesInvolved}>
            <input className={inputCls(formErrors.partiesInvolved)} value={draft.partiesInvolved} onChange={(e) => change('partiesInvolved', e.target.value)} />
          </Field>
          <Field label="Particular of Litigation" required error={formErrors.particularOfLitigation}>
            <input className={inputCls(formErrors.particularOfLitigation)} value={draft.particularOfLitigation} onChange={(e) => change('particularOfLitigation', e.target.value)} />
          </Field>
          <Field label="Status of Matter" required error={formErrors.statusOfMatter}>
            <input className={inputCls(formErrors.statusOfMatter)} value={draft.statusOfMatter} onChange={(e) => change('statusOfMatter', e.target.value)} />
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