import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Field, inputCls } from '../Field';
import { type ProjectExperience, emptyProjectExperienceDraft } from '../wizard-types';
import DocumentUploadPanel from '../DocumentUploadPanel';
import type { ContractorDocumentRecord } from '@/lib/api';

interface ProjectExperienceStepProps {
  projects: ProjectExperience[];
  onAdd: (project: Omit<ProjectExperience, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, project: Omit<ProjectExperience, 'id'>) => Promise<boolean>;
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

export default function ProjectExperienceStep({
  projects, onAdd, onUpdate, onDelete, error, saving, loading,
  documents, documentsLoading, documentsUploading, documentsError,
  onUploadDocument, onViewDocument, onDeleteDocument,
}: ProjectExperienceStepProps) {
  const [draft, setDraft] = useState<Omit<ProjectExperience, 'id'>>(emptyProjectExperienceDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProjectExperience, string>>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const change = (field: keyof Omit<ProjectExperience, 'id'>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateDraft = (): boolean => {
    const next: Partial<Record<keyof ProjectExperience, string>> = {};
    if (!draft.project.trim()) next.project = 'Required';
    if (!draft.ncaProjectRegNo.trim()) next.ncaProjectRegNo = 'Required';
    if (!draft.contractSum.trim()) next.contractSum = 'Required';
    if (!draft.contractPeriod.trim()) next.contractPeriod = 'Required';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetDraft = () => {
    setDraft(emptyProjectExperienceDraft);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateDraft()) return;
    const ok = editingId ? await onUpdate(editingId, draft) : await onAdd(draft);
    if (ok) resetDraft();
  };

  const handleEdit = (project: ProjectExperience) => {
    const { id, ...rest } = project;
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
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Project Experience</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Attach particulars of contracts in hand or executed before by the firm, and documentary support
          for ongoing and completed projects (award letters, practical completion certificate, certificate
          of taking over, final acceptance certificate).
        </p>
      </div>

      {loading && <p className="text-xs text-slate-400">Loading project experience...</p>}

      {!loading && projects.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">Project</th>
                <th className="px-3 py-2 font-medium">NCA Project Reg No</th>
                <th className="px-3 py-2 font-medium">Contract Sum (Kshs)</th>
                <th className="px-3 py-2 font-medium">Contract Period</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{p.project}</td>
                  <td className="px-3 py-2 text-slate-600">{p.ncaProjectRegNo}</td>
                  <td className="px-3 py-2 text-slate-600">{p.contractSum}</td>
                  <td className="px-3 py-2 text-slate-600">{p.contractPeriod}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="p-1.5 rounded text-white"
                        style={{ backgroundColor: 'var(--rcis-primary)' }}
                        aria-label="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
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
          {editingId ? 'Edit Project Experience' : 'Add Firms Experience'}
        </h4>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Project" required error={formErrors.project}>
            <input className={inputCls(formErrors.project)} value={draft.project} onChange={(e) => change('project', e.target.value)} />
          </Field>
          <Field label="NCA Project Reg No" required error={formErrors.ncaProjectRegNo}>
            <input
              className={inputCls(formErrors.ncaProjectRegNo)}
              value={draft.ncaProjectRegNo}
              onChange={(e) => change('ncaProjectRegNo', e.target.value)}
              placeholder="e.g. 531136360104"
            />
          </Field>
          <Field label="Contract Sum (Kshs)" required error={formErrors.contractSum}>
            <input
              className={inputCls(formErrors.contractSum)}
              value={draft.contractSum}
              onChange={(e) => change('contractSum', e.target.value)}
              inputMode="numeric"
            />
          </Field>
          <Field label="Contract Period (Completion)" required error={formErrors.contractPeriod}>
            <input
              type="date"
              className={inputCls(formErrors.contractPeriod)}
              value={draft.contractPeriod}
              onChange={(e) => change('contractPeriod', e.target.value)}
            />
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