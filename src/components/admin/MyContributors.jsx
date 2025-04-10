import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { db, collection, updateDoc, doc, getDocs, deleteDoc, serverTimestamp } from "../../config/firebase";
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets';

const MyContributors = () => {
  const { isGhost } = useContext(AppContext); // Fetch user data/context
  const [contributorData, setContributorData] = useState([]); // Store contributors data
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage errors

  // Track which contributor is being edited
  const [editingContributor, setEditingContributor] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Function to fetch contributor data from Firestore
  const getContributorData = async () => {
    try {
      // Reference to the 'contributors' collection in Firestore
      const querySnapshot = await getDocs(collection(db, 'Contributors'));

      // Create an array to store fetched data
      const contributors = [];
      querySnapshot.forEach((doc) => {
        // Add each document data to the contributors array
        contributors.push({ ...doc.data(), id: doc.id });
      });

      setContributorData(contributors); // Set the fetched data to state
      setLoading(false); // Set loading state to false after data is fetched
    } catch (err) {
      setError(err.message); // Set error state in case of failure
      setLoading(false); // Stop loading state if there's an error
    }
  };

  // Fetch data when component mounts and `isGhost` is true
  useEffect(() => {
    if (isGhost) {
      getContributorData(); // Fetch data if user is 'Ghost'
    }
  }, [isGhost]); // Re-run effect if `isGhost` changes

  // Handle Edit button click: set the contributor as editable
  const handleEdit = (contributor) => {
    setEditingContributor(contributor.id);
    setEditedData({
      contributorName: contributor.contributorName,
      contributorRole: contributor.contributorRole,
      contributorContributions: contributor.contributorContributions,
      contributorSocial: contributor.contributorSocial
    });
  };

  const handleDelete = async(id) => {
    try {
      await deleteDoc(doc(db, 'Contributors', id));
      setContributorData(prevData =>
        prevData.filter(contributor => contributor.id !== id)
      );
    } catch (error) {
      setError('Error deleting contributor: ' + error.message);
    }
  };

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Save edited data to Firestore
  const handleSave = async (id) => {
    try {
      const contributorRef = doc(db, 'Contributors', id);

      // Update contributor data in Firestore
      await updateDoc(contributorRef, {
        contributorName: editedData.contributorName,
        contributorRole: editedData.contributorRole,
        contributorContributions: editedData.contributorContributions,
        contributorSocial: editedData.contributorSocial,
        updatedAt: serverTimestamp()
      });

      // Update the local state after saving
      setContributorData(prevData =>
        prevData.map((contributor) =>
          contributor.id === id ? { ...contributor, ...editedData } : contributor
        )
      );
      setEditingContributor(null); // Reset editing state
    } catch (err) {
      setError('Error saving data: ' + err.message);
    }
  };

  if (loading) {
    return <Loading />; // Show loading indicator while fetching
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if any error occurs
  }

  return (
    <div className="container mx-auto py-2 px-2">
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
                <button onClick={() => handleDelete(contributor.id)} className="mt-4 flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black">
                <img src={assets.delete_data} alt='delete' className='md:justify-center w-6 h-6 mr-2' />
                <span className="hidden md:inline">Delete Contributor</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
};

export default MyContributors;