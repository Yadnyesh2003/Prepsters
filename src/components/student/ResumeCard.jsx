// src/components/student/ResumeCard.jsx
import React, { useState, useContext } from 'react';
import PdfViewer from './PdfViewer';
import { AppContext } from '../../context/AppContext';
import { Eye, Edit3, Trash2, FileText, Loader2 } from 'lucide-react';

const ResumeCard = ({ resume, onRename, onDelete, isDeleting }) => {
  const { id, original_filename, display_name, bytes, url, format, extension } = resume;
  const [showPdf, setShowPdf] = useState(false);
  const { toast } = useContext(AppContext);

  const getReadableSize = (bytes) => {
    if (!bytes) return '—';
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  };

  const isPdf = format === 'pdf' || extension === 'pdf';
  const isViewable = isPdf;

  const handleRenameClick = () => {
    const currentName = display_name || original_filename.replace(/\.[^/.]+$/, "");

    toast.custom(
      (t) => (
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Rename Resume</h3>
          <p className="text-xs text-gray-500 mb-2">File will remain as .{extension}</p>
          <input
            type="text"
            defaultValue={currentName}
            placeholder="Enter new name"
            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            id={`rename-input-${id}`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = document.getElementById(`rename-input-${id}`);
                const newName = input.value.trim();
                if (newName) {
                  onRename(id, newName);
                  toast.dismiss(t.id);
                }
              }
            }}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const input = document.getElementById(`rename-input-${id}`);
                const newName = input.value.trim();
                if (!newName) {
                  toast.error('Name cannot be empty');
                  return;
                }
                onRename(id, newName);
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-sm"
            >
              Save
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: 'top-center' }
    );
  };

  const handleViewClick = () => {
    if (isViewable) {
      setShowPdf(true);
    } else {
      window.open(url, '_blank');
    }
  };

  const getFileIcon = () => {
    if (isPdf) return <FileText className="w-5 h-5 text-red-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <>
      <div className={`bg-white border border-purple-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all ${
        isDeleting ? 'opacity-50' : ''
      }`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate" title={original_filename}>
              {display_name || original_filename.replace(/\.[^/.]+$/, "")}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{getReadableSize(bytes)}</span>
              <span>•</span>
              <span className="font-medium text-purple-600 uppercase">{extension}</span>
              {isDeleting && <span className="text-orange-500">Deleting...</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View/Download */}
          <button
            onClick={handleViewClick}
            disabled={isDeleting}
            className={`p-2 rounded-full transition-all ${
              isViewable
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isViewable ? 'View PDF' : `Download ${extension.toUpperCase()} file`}
          >
            {isViewable ? <Eye className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </button>

          {/* Rename */}
          <button
            onClick={handleRenameClick}
            disabled={isDeleting}
            className={`p-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Rename"
          >
            <Edit3 className="w-5 h-5" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(id)}
            disabled={isDeleting}
            className={`p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Delete"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen PDF Viewer - same implementation as LatestContent */}
      {showPdf && <PdfViewer pdfUrl={url} onClose={() => setShowPdf(false)} />}
    </>
  );
};

export default ResumeCard;