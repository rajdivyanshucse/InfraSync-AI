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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Upload Field Evidence</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Local Filesystem Storage & SHA-256 Checksum</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
              <h4 className="font-semibold text-slate-900 dark:text-white">Evidence Uploaded Successfully</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ID: <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{uploadResult.id}</span>
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-left text-xs space-y-1 text-slate-600 dark:text-slate-400 font-mono">
              <div>File: {uploadResult.storage?.originalName}</div>
              <div>Stored: {uploadResult.storage?.storedName}</div>
              <div>Size: {formatFileSize(uploadResult.storage?.sizeBytes)}</div>
              <div>SHA-256: {uploadResult.storage?.checksum?.slice(0, 16)}...</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setUploadResult(null);
                  setFile(null);
                  setTitle('');
                  setDescription('');
                }}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Upload Another
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* File Dropzone */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Evidence Asset (JPEG, PNG, WebP, MP4, PDF)</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="evidence-file-input"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="evidence-file-input" className="cursor-pointer flex flex-col items-center justify-center">
                  {file ? (
                    <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
                      {file.type.startsWith('image/') && <Image className="w-5 h-5 text-blue-500" />}
                      {file.type.startsWith('video/') && <Film className="w-5 h-5 text-purple-500" />}
                      {file.type === 'application/pdf' && <FileText className="w-5 h-5 text-amber-500" />}
                      <span className="font-medium truncate max-w-xs">{file.name}</span>
                      <span className="text-slate-400">({formatFileSize(file.size)})</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Click to browse or drag & drop</span>
                      <span className="text-[10px] text-slate-400 mt-1">Up to 50MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Title & Description */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pier P4 Rebar Inspection"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Evidence Type</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PHOTO">Photo</option>
                    <option value="VIDEO">Video</option>
                    <option value="DOCUMENT">Document / PDF</option>
                    <option value="SURVEY">Survey Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Stationing / Location</label>
                  <input
                    type="text"
                    value={stationing}
                    onChange={(e) => setStationing(e.target.value)}
                    placeholder="e.g. CH 5+340"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {microActivities.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Linked Micro-Activity (Optional)</label>
                  <select
                    value={microActivityId}
                    onChange={(e) => setMicroActivityId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="px-4 py-2 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-colors"
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
