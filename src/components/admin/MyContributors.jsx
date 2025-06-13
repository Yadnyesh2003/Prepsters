import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { db, collection, updateDoc, doc, getDocs, deleteDoc, serverTimestamp } from "../../config/firebase";
import Loading from '../../components/admin/Loading'
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import AccessForbidden from '../student/AccessForbidden';
import Confirmation from './Confirmation';

const MyContributors = () => {
  const { isGhost, user } = useAuth();
  const [contributorData, setContributorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingContributor, setEditingContributor] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [contributorToDelete, setContributorToDelete] = useState(null);

  const { toast } = useContext(AppContext);

  const getContributorData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Contributors'));
      const contributors = [];
      querySnapshot.forEach((doc) => {
        contributors.push({ ...doc.data(), id: doc.id });
      });
      setContributorData(contributors);
      setLoading(false);
    } catch (error) {
      toast.error(`Oops! Couldn't fetch Contributors. ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGhost) {
      getContributorData();
    }
  }, [isGhost]);

  const handleEdit = (contributor) => {
    setEditingContributor(contributor.id);
    setEditedData({
      contributorName: contributor.contributorName,
      contributorRole: contributor.contributorRole,
      contributorContributions: contributor.contributorContributions,
      contributorSocial: contributor.contributorSocial
    });
  };

  const handleDeleteClick = (id) => {
    setContributorToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setContributorToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (isGhost && contributorToDelete) {
        const contributorToDeleteData = contributorData.find(contributor => contributor.id === contributorToDelete);
        const contributorName = contributorToDeleteData?.contributorName || 'Contributor';

        await deleteDoc(doc(db, 'Contributors', contributorToDelete));
        setContributorData(prevData =>
          prevData.filter(contributor => contributor.id !== contributorToDelete)
        );
        toast.success(`Deleted contributions of ${contributorName}`);
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Oops! Couldn't delete. ${error.message}`);
    } finally {
      setShowDeleteConfirmation(false);
      setContributorToDelete(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async (id) => {
    try {
      if (isGhost) {
        const contributorRef = doc(db, 'Contributors', id);

        await updateDoc(contributorRef, {
          contributorName: editedData.contributorName,
          contributorRole: editedData.contributorRole,
          contributorContributions: editedData.contributorContributions,
          contributorSocial: editedData.contributorSocial,
          updatedBy: user.displayName,
          updatedAt: serverTimestamp(),
        });

        setContributorData(prevData =>
          prevData.map((contributor) =>
            contributor.id === id ? { ...contributor, ...editedData } : contributor
          )
        );
        setEditingContributor(null);
        toast.success('Changes Saved!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Error saving data: ${error.message}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return isGhost ? (
    <div className="container mx-auto py-2 px-2">
      {/* Delete Confirmation Dialog */}
      <Confirmation
        isOpen={showDeleteConfirmation}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm Contributor Deletion"
        message="Are you sure you want to delete this contributor? This action cannot be undone."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 space-x-0.5">
        {contributorData.map((contributor) => (
          <div key={contributor.id} className="bg-sky-100 p-6 rounded-lg shadow-lg hover:bg-blue-200">
            {editingContributor === contributor.id ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm text-left font-semibold text-black">Contributor Name</label>
                  <input
                    type="text"
                    name="contributorName"
                    value={editedData.contributorName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-left text-black">Role</label>
                  <input
                    type="text"
                    name="contributorRole"
                    value={editedData.contributorRole}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-left text-black">Contributions</label>
                  <textarea
                    name="contributorContributions"
                    value={editedData.contributorContributions}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-left text-black">Social Profile</label>
                  <input
                    type="url"
                    name="contributorSocial"
                    value={editedData.contributorSocial}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleSave(contributor.id)} className="bg-green-500 hover:bg-green-300 hover:text-black text-white px-4 py-2 rounded-md">Save</button>
                  <button onClick={() => setEditingContributor(null)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-red-500 hover:text-black">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold">{contributor.contributorName}</h3>
                <p className='mt-2 text-gray-700 text-left'><strong>Role:</strong> {contributor.contributorRole}</p>
                <p className='text-left text-gray-700'><strong>Contributions:</strong> {contributor.contributorContributions}</p>
                <p className='text-left text-gray-700'><strong>Social Profile:</strong> <a href={contributor.contributorSocial} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-indigo-600">LinkedIn</a></p>

                <button onClick={() => handleEdit(contributor)} className="mt-4 flex bg-yellow-500 text-white px-4 py-2 rounded-md hover:text-black">
                  <img src={assets.edit_data} alt='edit' className='w-6 h-6 mr-2' />
                  <span className="hidden md:inline">Edit Contributor</span>
                </button>
                <button onClick={() => handleDeleteClick(contributor.id)} className="mt-4 flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black">
                  <img src={assets.delete_data} alt='delete' className='md:justify-center w-6 h-6 mr-2' />
                  <span className="hidden md:inline">Delete Contributor</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : <AccessForbidden />
};

export default MyContributors;