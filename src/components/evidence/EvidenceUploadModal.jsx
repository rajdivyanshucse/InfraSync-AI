import React, { useState } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileText, Image, Film, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const EvidenceUploadModal = ({ isOpen, onClose, projectId, onUploadSuccess, microActivities = [] }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceType, setEvidenceType] = useState('PHOTO');
  const [microActivityId, setMicroActivityId] = useState('');
  const [stationing, setStationing] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMsg(null);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
      if (selectedFile.type.startsWith('image/')) setEvidenceType('PHOTO');
      else if (selectedFile.type.startsWith('video/')) setEvidenceType('VIDEO');
      else if (selectedFile.type === 'application/pdf') setEvidenceType('DOCUMENT');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('evidenceType', evidenceType);
    if (microActivityId) formData.append('microActivityId', microActivityId);
    if (stationing) formData.append('stationing', stationing);

    try {
      const response = await apiClient.upload(`/projects/${projectId}/evidence`, formData);
      setUploadResult(response);
      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Evidence upload failed. Ensure backend server is running on port 5000.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface border border-surface-border rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand/10 text-brand dark:bg-brand/20 dark:text-sky-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Upload Field Evidence</h3>
              <p className="text-xs text-foreground-muted">Filesystem Evidence Archive & Audit Checksum</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {uploadResult ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">Evidence Uploaded Successfully</h4>
              <p className="text-xs text-foreground-muted mt-1">
                ID: <span className="font-mono text-foreground font-medium">{uploadResult.id}</span>
              </p>
            </div>
            <div className="bg-surface-subtle border border-surface-border p-3 rounded-lg text-left text-xs space-y-1 text-foreground-muted font-mono">
              <div>File: <span className="text-foreground">{uploadResult.storage?.originalName}</span></div>
              <div>Stored: <span className="text-foreground">{uploadResult.storage?.storedName}</span></div>
              <div>Size: <span className="text-foreground">{formatFileSize(uploadResult.storage?.sizeBytes)}</span></div>
              <div>SHA-256: <span className="text-foreground">{uploadResult.storage?.checksum?.slice(0, 16)}...</span></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setUploadResult(null);
                  setFile(null);
                  setTitle('');
                  setDescription('');
                }}
                className="px-4 py-2 text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle rounded-lg transition-colors border border-surface-border"
              >
                Upload Another
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium bg-brand text-white hover:bg-brand-hover rounded-lg transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* File Dropzone */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Evidence Asset (JPEG, PNG, WebP, MP4, PDF)</label>
              <div className="border-2 border-dashed border-surface-border rounded-lg p-4 text-center hover:border-brand/60 bg-surface-subtle/50 transition-colors">
                <input
                  type="file"
                  id="evidence-file-input"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="evidence-file-input" className="cursor-pointer flex flex-col items-center justify-center">
                  {file ? (
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      {file.type.startsWith('image/') && <Image className="w-5 h-5 text-brand" />}
                      {file.type.startsWith('video/') && <Film className="w-5 h-5 text-purple-500" />}
                      {file.type === 'application/pdf' && <FileText className="w-5 h-5 text-amber-500" />}
                      <span className="font-medium truncate max-w-xs">{file.name}</span>
                      <span className="text-foreground-muted">({formatFileSize(file.size)})</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-7 h-7 text-foreground-muted mb-2" />
                      <span className="text-xs font-medium text-foreground">Click to browse or drag & drop</span>
                      <span className="text-[10px] text-foreground-muted mt-0.5">Up to 50MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Title & Description */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pier P4 Rebar Inspection"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border bg-surface text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Evidence Type</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="PHOTO">Photo</option>
                    <option value="VIDEO">Video</option>
                    <option value="DOCUMENT">Document / PDF</option>
                    <option value="SURVEY">Survey Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Stationing / Location</label>
                  <input
                    type="text"
                    value={stationing}
                    onChange={(e) => setStationing(e.target.value)}
                    placeholder="e.g. CH 5+340"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border bg-surface text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
              </div>

              {microActivities.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Linked Micro-Activity (Optional)</label>
                  <select
                    value={microActivityId}
                    onChange={(e) => setMicroActivityId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-surface-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="">-- No Linked Micro-Activity --</option>
                    {microActivities.map((ma) => (
                      <option key={ma.id} value={ma.id}>
                        [{ma.id}] {ma.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle rounded-lg transition-colors border border-surface-border"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="px-4 py-2 text-xs font-medium bg-brand text-white hover:bg-brand-hover disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Save Evidence</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EvidenceUploadModal;
