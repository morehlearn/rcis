import { useState } from 'react';
import { Pencil, Trash2, Upload, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Field, inputCls } from '../Field';
import {
  type Director, emptyDirectorDraft, QUALIFICATIONS, PROFESSIONS,
} from '../wizard-types';

type DirectorFileField = 'cv' | 'academicCert';

type BrsLookupResult =
  | { found: false }
  | { found: true; fullNames: string; nationality: string; percentageShare: string };

interface DirectorsStepProps {
  directors: Director[];
  onAdd: (director: Omit<Director, 'id'>) => Promise<string | null>;
  onUpdate: (id: string, director: Omit<Director, 'id'>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onUploadFile: (directorId: string, field: DirectorFileField, file: File) => Promise<void>;
  onViewFile: (directorId: string, field: DirectorFileField) => Promise<void>;
  onLookupDirector: (idNo: string) => Promise<BrsLookupResult>;
  error?: string;
  saving?: boolean;
  loading?: boolean;
}

export default function DirectorsStep({
  directors, onAdd, onUpdate, onDelete, onUploadFile, onViewFile, onLookupDirector, error, saving, loading,
}: DirectorsStepProps) {
  const [draft, setDraft] = useState<Omit<Director, 'id'>>(emptyDirectorDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Director, string>>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openingKey, setOpeningKey] = useState<string | null>(null);

  // Every director must be matched against BRS by ID number before the
  // rest of the form unlocks. verifiedIdNo tracks which ID that match was
  // for - if the person edits the ID afterwards, it no longer equals
  // draft.idNo and the director is treated as unverified again without any
  // extra bookkeeping.
  const [verifiedIdNo, setVerifiedIdNo] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const isVerified = verifiedIdNo !== null && verifiedIdNo === draft.idNo.trim();

  // The actual File objects live separately from the draft's filename
  // strings - the filename is what gets shown/saved as text, the File
  // itself only matters for the upload call right after save succeeds.
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [academicCertFile, setAcademicCertFile] = useState<File | null>(null);

  const change = (field: keyof Omit<Director, 'id'>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === 'idNo') setLookupError('');
  };

  const handleLookup = async () => {
    const idNo = draft.idNo.trim();
    if (!idNo) {
      setFormErrors((prev) => ({ ...prev, idNo: 'Enter an ID number first' }));
      return;
    }
    setVerifying(true);
    setLookupError('');
    try {
      const result = await onLookupDirector(idNo);
      if (result.found) {
        setDraft((prev) => ({
          ...prev,
          fullNames: result.fullNames,
          nationality: result.nationality,
          percentageShare: result.percentageShare,
        }));
        setVerifiedIdNo(idNo);
      } else {
        setVerifiedIdNo(null);
        setLookupError('No director with this ID was found in BRS records for this company. Check the ID number, or verify the company in Company Details first.');
      }
    } catch (err) {
      setVerifiedIdNo(null);
      setLookupError(err instanceof Error ? err.message : 'Could not check this ID against BRS. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const validateDraft = (): boolean => {
    const next: Partial<Record<keyof Director, string>> = {};
    if (!draft.idNo.trim()) next.idNo = 'Required';
    else if (!isVerified) next.idNo = 'Look up this ID against BRS before adding this director.';
    if (!draft.highestQualification) next.highestQualification = 'Required';
    if (!draft.profession) next.profession = 'Required';
    if (!draft.yearsOfExperience.trim()) next.yearsOfExperience = 'Required';
    if (!editingId && !draft.cvFileName) next.cvFileName = 'CV is required';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetDraft = () => {
    setDraft(emptyDirectorDraft);
    setEditingId(null);
    setFormErrors({});
    setCvFile(null);
    setAcademicCertFile(null);
    setVerifiedIdNo(null);
    setLookupError('');
  };

  const handleSave = async () => {
    if (!validateDraft()) return;

    const targetId = editingId
      ? (await onUpdate(editingId, draft)) ? editingId : null
      : await onAdd(draft);

    if (!targetId) return;

    if (cvFile) await onUploadFile(targetId, 'cv', cvFile);
    if (academicCertFile) await onUploadFile(targetId, 'academicCert', academicCertFile);

    resetDraft();
  };

  const handleEdit = (director: Director) => {
    const { id, ...rest } = director;
    setDraft(rest);
    setEditingId(id);
    setFormErrors({});
    setCvFile(null);
    setAcademicCertFile(null);
    // Already-saved directors were matched against BRS when they were
    // added (or predate this check) - treat them as verified unless the
    // person changes the ID number, which will fall out of sync with
    // isVerified automatically and require a fresh lookup.
    setVerifiedIdNo(director.idNo);
    setLookupError('');
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const handleFileSelect = (field: DirectorFileField, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (field === 'cv') {
      setCvFile(file);
      change('cvFileName', file.name);
    } else {
      setAcademicCertFile(file);
      change('academicCertFileName', file.name);
    }
  };

  const handleView = async (directorId: string, field: DirectorFileField) => {
    const key = `${directorId}-${field}`;
    setOpeningKey(key);
    await onViewFile(directorId, field);
    setOpeningKey(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--rcis-primary)' }}>Directors</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Add the firm's directors, one at a time. At least one director with a CV is required.
        </p>
      </div>

      {loading && (
        <p className="text-xs text-slate-400">Loading directors...</p>
      )}

      {!loading && directors.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">Full Names</th>
                <th className="px-3 py-2 font-medium">ID No/Passport</th>
                <th className="px-3 py-2 font-medium">Nationality</th>
                <th className="px-3 py-2 font-medium">Qualification</th>
                <th className="px-3 py-2 font-medium">Profession</th>
                <th className="px-3 py-2 font-medium">Yrs Exp.</th>
                <th className="px-3 py-2 font-medium">% Share</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {directors.map((d) => {
                    const isComplete = !!d.highestQualification && !!d.profession && !!d.yearsOfExperience && !!d.cvFileName;
                    return (
                      <tr key={d.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-700">
                          {d.fullNames}
                          {!isComplete && (
                            <span className="ml-2 inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                              Incomplete
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-600">{d.idNo}</td>
                        <td className="px-3 py-2 text-slate-600">{d.nationality}</td>
                        <td className="px-3 py-2 text-slate-600">{d.highestQualification || '—'}</td>
                        <td className="px-3 py-2 text-slate-600">{d.yearsOfExperience || '—'}</td>
                        <td className="px-3 py-2 text-slate-600">{d.percentageShare}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(d)}
                              className="p-1.5 rounded text-white"
                              style={{ backgroundColor: 'var(--rcis-primary)' }}
                              aria-label="Edit"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(d.id)}
                              disabled={deletingId === d.id}
                              className="p-1.5 rounded text-white bg-red-600 disabled:opacity-50"
                              aria-label="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="rounded-lg border border-slate-200 p-4 space-y-4">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          {editingId ? 'Edit Director' : 'Add Firm Director Details'}
        </h4>

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="ID No/Passport No" required error={formErrors.idNo}>
            <div className="flex gap-2">
              <input
                className={inputCls(formErrors.idNo)}
                value={draft.idNo}
                onChange={(e) => change('idNo', e.target.value)}
              />
              <button
                type="button"
                onClick={handleLookup}
                disabled={verifying || !draft.idNo.trim()}
                className="px-3 rounded-md text-white text-xs font-medium shrink-0 disabled:opacity-60"
                style={{ backgroundColor: 'var(--rcis-primary)' }}
              >
                {verifying ? 'Checking...' : 'Load from BRS'}
              </button>
            </div>
          </Field>
          <Field label="Full Names">
            <input className={inputCls()} value={draft.fullNames} disabled placeholder="Filled in from BRS" />
          </Field>
          <Field label="Nationality">
            <input className={inputCls()} value={draft.nationality} disabled placeholder="Filled in from BRS" />
          </Field>

          {isVerified && (
            <div className="sm:col-span-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 -mt-2">
              <CheckCircle2 size={13} />
              Verified with BRS
            </div>
          )}
          {lookupError && (
            <p className="sm:col-span-3 text-[11px] text-red-600 -mt-2">{lookupError}</p>
          )}

          <Field label="Percentage Share">
            <input className={inputCls()} value={draft.percentageShare} disabled placeholder="Filled in from BRS" />
          </Field>
          <Field label="Highest Qualification" required error={formErrors.highestQualification}>
            <select
              className={inputCls(formErrors.highestQualification)}
              value={draft.highestQualification}
              onChange={(e) => change('highestQualification', e.target.value)}
              disabled={!isVerified}
            >
              <option value="">Please Select</option>
              {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
          </Field>
          <Field label="Profession" required error={formErrors.profession}>
            <select
              className={inputCls(formErrors.profession)}
              value={draft.profession}
              onChange={(e) => change('profession', e.target.value)}
              disabled={!isVerified}
            >
              <option value="">Please Select</option>
              {PROFESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Years of Experience" required error={formErrors.yearsOfExperience}>
            <input
              className={inputCls(formErrors.yearsOfExperience)}
              value={draft.yearsOfExperience}
              onChange={(e) => change('yearsOfExperience', e.target.value)}
              inputMode="numeric"
              disabled={!isVerified}
            />
          </Field>

          <Field label="Curriculum Vitae" required error={formErrors.cvFileName}>
            <label className={`${inputCls(formErrors.cvFileName)} flex items-center gap-2 ${isVerified ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} text-slate-500`}>
              <Upload size={14} />
              <span className="truncate">{draft.cvFileName || 'Choose file...'}</span>
              <input type="file" className="hidden" onChange={(e) => handleFileSelect('cv', e)} disabled={!isVerified} />
            </label>
          </Field>
          <Field label="Academic Certificates">
            <label className={`${inputCls()} flex items-center gap-2 ${isVerified ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} text-slate-500`}>
              <Upload size={14} />
              <span className="truncate">{draft.academicCertFileName || 'Choose file...'}</span>
              <input type="file" className="hidden" onChange={(e) => handleFileSelect('academicCert', e)} disabled={!isVerified} />
            </label>
          </Field>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isVerified}
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

      <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-slate-600 space-y-1">
        <p className="font-medium text-slate-700">NOTE:</p>
        <p>Upload Directors CVs (at least one).</p>
        <p>Name your documents appropriately — files with similar names will be overwritten by the latest upload.</p>
        <p>Avoid the following characters in file names: # % &amp; * : &lt; &gt; ? / {'{ }'}</p>
      </div>

      <UploadedFilesList directors={directors} onView={handleView} openingKey={openingKey} />
    </div>
  );
}

function UploadedFilesList({
  directors, onView, openingKey,
}: {
  directors: Director[];
  onView: (directorId: string, field: DirectorFileField) => void;
  openingKey: string | null;
}) {
  const rows = directors.flatMap((d) => {
    const entries: { fileName: string; docType: string; director: string; directorId: string; field: DirectorFileField }[] = [];
    if (d.cvFileName) entries.push({ fileName: d.cvFileName, docType: 'Curriculum Vitae', director: d.fullNames, directorId: d.id, field: 'cv' });
    if (d.academicCertFileName) entries.push({ fileName: d.academicCertFileName, docType: 'Academic Certificate', director: d.fullNames, directorId: d.id, field: 'academicCert' });
    return entries;
  });

  if (rows.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">List of uploaded files</h4>
      </div>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-slate-500 uppercase tracking-wide">
            <th className="px-3 py-2 font-medium">File Name</th>
            <th className="px-3 py-2 font-medium">Document Type</th>
            <th className="px-3 py-2 font-medium">Director</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = `${row.directorId}-${row.field}`;
            const opening = openingKey === key;
            return (
              <tr key={key} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onView(row.directorId, row.field)}
                    disabled={opening}
                    className="inline-flex items-center gap-1 font-medium hover:underline disabled:opacity-50"
                    style={{ color: 'var(--rcis-primary)' }}
                  >
                    {opening ? 'Opening...' : row.fileName}
                    <ExternalLink size={11} />
                  </button>
                </td>
                <td className="px-3 py-2 text-slate-600">{row.docType}</td>
                <td className="px-3 py-2 text-slate-600">{row.director}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}