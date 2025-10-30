// src/components/student/ResumeUpload.jsx
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { db, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import ResumeCard from './ResumeCard';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_BYTES = 3 * 1024 * 1024;
const MAX_COUNT = 3;

const ResumeUpload = () => {
  const { user } = useAuth();
  const { toast } = useContext(AppContext);
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchResumes = useCallback(async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'Users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) setResumes(snap.data().resumes || []);
    } catch (err) {
      toast.error('Failed to load resumes');
    }
  }, [user, toast]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'Only PDF, DOC, DOCX allowed.';
    if (file.size > MAX_SIZE_BYTES) return 'File must be under 3 MB.';
    return null;
  };

  const uploadToCloudinary = async (file) => {
    if (!cloudName || !uploadPreset) throw new Error('Cloudinary config missing');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', uploadPreset);
    fd.append('folder', `resumes/${user.uid}`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
      method: 'POST',
      body: fd,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Upload failed');
    }

    return await res.json();
  };

  const deleteFromCloudinary = async (publicId) => {
    if (!backendUrl) {
      throw new Error('Backend URL not configured');
    }

    const response = await fetch(`${backendUrl}/cloudinary/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.message || 'Failed to delete from Cloudinary');
    }

    return result;
  };

  const onFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (resumes.length >= MAX_COUNT) {
      toast.error(`Maximum ${MAX_COUNT} resumes allowed.`);
      return;
    }

    const err = validateFile(file);
    if (err) {
      toast.error(err);
      return;
    }

    setUploading(true);
    try {
      const data = await uploadToCloudinary(file);

      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      const payload = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        original_filename: file.name,
        display_name: file.name.replace(/\.[^/.]+$/, ""),
        url: data.secure_url,
        public_id: data.public_id,
        bytes: file.size,
        format: data.format || fileExtension,
        extension: fileExtension,
        createdAt: new Date().toISOString(),
      };

      const userRef = doc(db, 'Users', user.uid);
      await updateDoc(userRef, { resumes: arrayUnion(payload) });
      await fetchResumes();

      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().resumes?.length >= 1 && !snap.data().isProfileComplete) {
        await updateDoc(userRef, { isProfileComplete: true });
      }

      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRename = async (id, newName) => {
    if (!newName?.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      const resumeToUpdate = resumes.find(r => r.id === id);
      if (!resumeToUpdate) {
        toast.error('Resume not found');
        return;
      }

      const fileExtension = resumeToUpdate.extension;
      const finalFileName = `${newName}.${fileExtension}`;

      const userRef = doc(db, 'Users', user.uid);
      const updated = resumes.map(r =>
        r.id === id ? { 
          ...r, 
          original_filename: finalFileName,
          display_name: newName 
        } : r
      );
      
      await updateDoc(userRef, { resumes: updated });
      setResumes(updated);
      toast.success('Renamed successfully!');
    } catch (err) {
      console.error('Rename error:', err);
      toast.error('Rename failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const resume = resumes.find((r) => r.id === id);
    if (!resume) return;

    toast.custom(
      (t) => (
        <div className="bg-white p-5 rounded-xl shadow-xl max-w-sm mx-auto">
          <p className="text-lg font-semibold mb-3">Delete Resume?</p>
          <p className="text-sm text-gray-600 mb-4">{resume.original_filename}</p>
          <p className="text-xs text-gray-500 mb-4">This will permanently delete the file.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setDeletingId(null);
              }}
              disabled={deletingId === id}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setDeletingId(id);
                try {
                  // Delete from Cloudinary via backend
                  if (resume.public_id) {
                    await deleteFromCloudinary(resume.public_id);
                  }

                  // Delete from Firebase
                  const userRef = doc(db, 'Users', user.uid);
                  await updateDoc(userRef, { resumes: arrayRemove(resume) });
                  setResumes((prev) => prev.filter((r) => r.id !== id));

                  toast.dismiss(t.id);
                  toast.success('Resume deleted successfully!');
                  
                } catch (err) {
                  console.error('Delete error:', err);
                  
                  // If Cloudinary deletion fails, still try to remove from Firebase
                  try {
                    const userRef = doc(db, 'Users', user.uid);
                    await updateDoc(userRef, { resumes: arrayRemove(resume) });
                    setResumes((prev) => prev.filter((r) => r.id !== id));
                    
                    toast.dismiss(t.id);
                    toast.warning('Resume removed from list, but there was an issue deleting from storage.');
                  } catch (firebaseErr) {
                    toast.dismiss(t.id);
                    toast.error('Delete failed completely. Please try again.');
                  }
                } finally {
                  setDeletingId(null);
                }
              }}
              disabled={deletingId === id}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: 'top-center' }
    );
  };

  return (
    <div className=" mt-8 p-6  bg-white/90  shadow-xl rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-grey-800">Resumes</h3>
        <span className="text-sm font-medium text-purple-600">{resumes.length} / {MAX_COUNT}</span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Upload up to 3 resumes (PDF, DOC, DOCX • max 3 MB)
      </p>

      <label
        className={`block w-full sm:w-auto px-6 py-3 text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full cursor-pointer text-sm font-medium shadow-md hover:shadow-lg transition-all ${
          uploading || resumes.length >= MAX_COUNT ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Resume'}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={onFileSelected}
          disabled={uploading || resumes.length >= MAX_COUNT}
          className="hidden"
        />
      </label>

      <div className="mt-6 space-y-3">
        {resumes.length > 0 ? (
          resumes.map((r) => (
            <ResumeCard
              key={r.id}
              resume={r}
              onRename={handleRename}
              onDelete={handleDelete}
              isDeleting={deletingId === r.id}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No resumes uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;