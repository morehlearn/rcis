import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Field, inputCls } from '../Field';
import { type Staff, emptyStaffDraft, NATIONALITIES, QUALIFICATIONS } from '../wizard-types';
import DocumentUploadPanel from '../DocumentUploadPanel';
import type { ContractorDocumentRecord } from '@/lib/api';

interface StaffStepProps {
  staff: Staff[];
  onAdd: (staff: Omit<Staff, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, staff: Omit<Staff, 'id'>) => Promise<boolean>;
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

export default function StaffStep({
  staff, onAdd, onUpdate, onDelete, error, saving, loading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: StaffStepProps) {
  const [draft, setDraft] = useState<Omit<Staff, 'id'>>(emptyStaffDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Staff, string>>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const change = (field: keyof Omit<Staff, 'id'>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateDraft = (): boolean => {
    const next: Partial<Record<keyof Staff, string>> = {};
    if (!draft.fullNames.trim()) next.fullNames = 'Required';
    if (!draft.idNo.trim()) next.idNo = 'Required';
    if (!draft.highestQualification) next.highestQualification = 'Required';
    if (!draft.yearsOfExperience.trim()) next.yearsOfExperience = 'Required';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetDraft = () => {
    setDraft(emptyStaffDraft);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateDraft()) return;
    const ok = editingId ? await onUpdate(editingId, draft) : await onAdd(draft);
    if (ok) resetDraft();
  };

  const handleEdit = (member: Staff) => {
    const { id, ...rest } = member;
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
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Staff</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide work permit details for foreign staff. Upload at least three staff CVs below.
        </p>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading staff...</p>}

      {!loading && staff.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">Full Names</th>
                <th className="px-3 py-2 font-medium">ID No/Passport</th>
                <th className="px-3 py-2 font-medium">Nationality</th>
                <th className="px-3 py-2 font-medium">Qualification</th>
                <th className="px-3 py-2 font-medium">Yrs Exp.</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{s.fullNames}</td>
                  <td className="px-3 py-2 text-slate-600">{s.idNo}</td>
                  <td className="px-3 py-2 text-slate-600">{s.nationality}</td>
                  <td className="px-3 py-2 text-slate-600">{s.highestQualification}</td>
                  <td className="px-3 py-2 text-slate-600">{s.yearsOfExperience}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(s)}
                        className="p-1.5 rounded text-white"
                        style={{ backgroundColor: 'var(--rcis-primary)' }}
                        aria-label="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
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
          {editingId ? 'Edit Staff Member' : 'Add Staff Details'}
        </h4>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Full Names" required error={formErrors.fullNames}>
            <input className={inputCls(formErrors.fullNames)} value={draft.fullNames} onChange={(e) => change('fullNames', e.target.value)} />
          </Field>
          <Field label="ID No/Passport No" required error={formErrors.idNo}>
            <input className={inputCls(formErrors.idNo)} value={draft.idNo} onChange={(e) => change('idNo', e.target.value)} />
          </Field>
          <Field label="Nationality" required>
            <select className={inputCls()} value={draft.nationality} onChange={(e) => change('nationality', e.target.value)}>
              {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Highest Qualification" required error={formErrors.highestQualification}>
            <select className={inputCls(formErrors.highestQualification)} value={draft.highestQualification} onChange={(e) => change('highestQualification', e.target.value)}>
              <option value="">Please Select</option>
              {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
          </Field>
          <Field label="Years of Experience" required error={formErrors.yearsOfExperience}>
            <input className={inputCls(formErrors.yearsOfExperience)} value={draft.yearsOfExperience} onChange={(e) => change('yearsOfExperience', e.target.value)} inputMode="numeric" />
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