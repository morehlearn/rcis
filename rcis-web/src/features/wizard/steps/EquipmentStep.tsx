import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Field, inputCls } from '../Field';
import { type Equipment, emptyEquipmentDraft, OWNED_OR_LEASED, EQUIPMENT_CATEGORIES } from '../wizard-types';
import DocumentUploadPanel from '../DocumentUploadPanel';
import type { ContractorDocumentRecord } from '@/lib/api';

interface EquipmentStepProps {
  equipment: Equipment[];
  onAdd: (equipment: Omit<Equipment, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, equipment: Omit<Equipment, 'id'>) => Promise<boolean>;
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

export default function EquipmentStep({
  equipment, onAdd, onUpdate, onDelete, error, saving, loading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: EquipmentStepProps) {
  const [draft, setDraft] = useState<Omit<Equipment, 'id'>>(emptyEquipmentDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Equipment, string>>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const change = (field: keyof Omit<Equipment, 'id'>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateDraft = (): boolean => {
    const next: Partial<Record<keyof Equipment, string>> = {};
    if (!draft.name.trim()) next.name = 'Required';
    if (!draft.ownedOrLeased) next.ownedOrLeased = 'Required';
    if (!draft.typeMakeModel.trim()) next.typeMakeModel = 'Required';
    if (!draft.category) next.category = 'Required';
    if (!draft.registrationNo.trim()) next.registrationNo = 'Required';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetDraft = () => {
    setDraft(emptyEquipmentDraft);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateDraft()) return;
    const ok = editingId ? await onUpdate(editingId, draft) : await onAdd(draft);
    if (ok) resetDraft();
  };

  const handleEdit = (item: Equipment) => {
    const { id, ...rest } = item;
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
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Equipment &amp; Plant</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Indicate the particulars of construction equipment owned by the company.
        </p>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading equipment...</p>}

      {!loading && equipment.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">Name of Plant/Equipment</th>
                <th className="px-3 py-2 font-medium">Owned/Leased</th>
                <th className="px-3 py-2 font-medium">Type/Make/Model</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Reg/Serial No</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((e) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{e.name}</td>
                  <td className="px-3 py-2 text-slate-600">{e.ownedOrLeased}</td>
                  <td className="px-3 py-2 text-slate-600">{e.typeMakeModel}</td>
                  <td className="px-3 py-2 text-slate-600">{e.category}</td>
                  <td className="px-3 py-2 text-slate-600">{e.registrationNo}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(e)}
                        className="p-1.5 rounded text-white"
                        style={{ backgroundColor: 'var(--rcis-primary)' }}
                        aria-label="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(e.id)}
                        disabled={deletingId === e.id}
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
          {editingId ? 'Edit Equipment' : 'Add Equipment/Plant Owned'}
        </h4>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Name of Plant/Equipment" required error={formErrors.name}>
            <input className={inputCls(formErrors.name)} value={draft.name} onChange={(e) => change('name', e.target.value)} />
          </Field>
          <Field label="Owned/Leased" required error={formErrors.ownedOrLeased}>
            <select className={inputCls(formErrors.ownedOrLeased)} value={draft.ownedOrLeased} onChange={(e) => change('ownedOrLeased', e.target.value)}>
              <option value="">Please Select</option>
              {OWNED_OR_LEASED.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Type/Make/Model" required error={formErrors.typeMakeModel}>
            <input className={inputCls(formErrors.typeMakeModel)} value={draft.typeMakeModel} onChange={(e) => change('typeMakeModel', e.target.value)} />
          </Field>
          <Field label="Category" required error={formErrors.category}>
            <select className={inputCls(formErrors.category)} value={draft.category} onChange={(e) => change('category', e.target.value)}>
              <option value="">Please Select</option>
              {EQUIPMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Registration No/Serial No" required error={formErrors.registrationNo}>
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