import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase';
import Select from 'react-select';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/admin/Loading';
import PdfViewer from '../student/PdfViewer';
import { assets, branches, institutions, years } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import FilterComponent from './FilterComponent';
import AccessForbidden from '../student/AccessForbidden';
import Confirmation from './Confirmation'; // Import the Confirmation component

const MySyllabus = () => {
  const { isGhost, user } = useAuth();
  const [syllabusData, setSyllabusData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [editingSyllabus, setEditingSyllabus] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [syllabusToDelete, setSyllabusToDelete] = useState(null);

  const [filter, setFilter] = useState({
    branch: '',
    institution: '',
    year: '',
    searchQuery: ''
  });

  const { toast } = useContext(AppContext);

  // For FilterComponent.jsx 
  const filterOptions = {
    branches: branches.map(b => b.value),
    years: years.map(y => y.value),
    institutions: institutions.map(i => i.value)
  };

  // Fetch syllabus data from Firestore
  const getSyllabusData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Syllabus'));
      const syllabus = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSyllabusData(syllabus);
      setFilteredData(syllabus); // Initially show all data
      setLoading(false);
    } catch (error) {
      toast.error(`Error fetching Syllabus Data: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGhost) {
      getSyllabusData();
    }
  }, [isGhost]);

  // Handle Edit - Set the syllabus to be edited
  const handleEdit = (syllabus) => {
    setEditingSyllabus(syllabus.id);
    setEditedData({
      syllabusTitle: syllabus.syllabusTitle,
      syllabusLink: syllabus.syllabusLink || '',
      academicYear: syllabus.syllabusCategory?.academicYear || '',
      branch: branches.find(b => b.value === syllabus.syllabusCategory?.branch) || null,
      institution: institutions.find(i => i.value === syllabus.syllabusCategory?.institution) || null,
      year: years.find(y => y.value === syllabus.syllabusCategory?.year) || null,
    });
  };

  // Save edited data back to Firestore
  const handleSaveEdit = async () => {
    if (!editingSyllabus) return;

    try {
      if (isGhost) {
        const modifiedLink = editedData.syllabusLink.replace(/\/view\?usp=drive_link$/, '/preview');

        const syllabusRef = doc(db, 'Syllabus', editingSyllabus);
        await updateDoc(syllabusRef, {
          syllabusCategory: {
            academicYear: editedData.academicYear,
            branch: editedData.branch?.value || '',
            institution: editedData.institution?.value || '',
            year: editedData.year?.value || '',
          },
          syllabusTitle: editedData.syllabusTitle,
          syllabusLink: modifiedLink,
          updatedBy: user.displayName,
          updatedAt: serverTimestamp(),
        });
        setEditingSyllabus(null);
        setEditedData({});
        getSyllabusData(); // Reload data from Firestore
        toast.success('Changes Saved!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Error saving changes: ${error.message}`);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteClick = (syllabusId) => {
    setSyllabusToDelete(syllabusId);
    setShowDeleteConfirmation(true);
  };

  // Handle Delete Confirmation - Cancel
  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setSyllabusToDelete(null);
  };

  // Handle Delete Confirmation - Confirm
  const handleDeleteConfirm = async () => {
    try {
      if (isGhost && syllabusToDelete) {
        const syllabusRef = doc(db, 'Syllabus', syllabusToDelete);
        await deleteDoc(syllabusRef);
        getSyllabusData(); // Reload data from Firestore after deletion
        toast.success('Syllabus deleted successfully!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Error deleting syllabus: ${error.message}`);
    } finally {
      setShowDeleteConfirmation(false);
      setSyllabusToDelete(null);
    }
  };

  // Filter syllabus data based on selected filters
  const filterSyllabusData = (filterValues) => {
    const filtered = syllabusData.filter((doc) => {
      const { branch, institution, year } = doc.syllabusCategory || {};
      const title = doc.syllabusTitle || '';

      // Check if the institution matches (case insensitive and partial match)
      const institutionMatch = filterValues.institution
        ? institution && institution.toLowerCase().includes(filterValues.institution.toLowerCase())
        : true;

      const searchMatch = filterValues.searchQuery
        ? title.toLowerCase().includes(filterValues.searchQuery.toLowerCase())
        : true;

      return (
        (filterValues.branch ? branch === filterValues.branch : true) &&
        institutionMatch &&
        (filterValues.year ? year === filterValues.year : true) &&
        searchMatch
      );
    });
    setFilteredData(filtered); // Update the filtered data
  };

  const openPdfViewer = (url) => {
    setPdfUrl(url); // Set the PDF URL to be displayed in the viewer
  };

  const closePdfViewer = () => {
    setPdfUrl(null); // Close the viewer by setting PDF URL to null
  };

  if (loading) {
    return <Loading />;
  }

  return isGhost ? (
    <div className="max-w-6xl mx-auto p-4">
      {/* Delete Confirmation Dialog */}
      <Confirmation
        isOpen={showDeleteConfirmation}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm Syllabus Deletion"
        message="Are you sure you want to delete this syllabus? This action cannot be undone."
      />

      {/* Filter Component */}
      <FilterComponent
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions}
        onFilterChange={filterSyllabusData}
      />

      {/* Displaying Filtered Syllabus Data */}
      <div className="space-y-4">
        {filteredData.map((doc) => {
          const syllabusCategory = doc.syllabusCategory || {};
          return (
            <div key={doc.id} className="bg-sky-100 shadow-lg rounded-lg p-4 flex flex-col items-start">
              {editingSyllabus === doc.id ? (
                // Edit form
                <div className="w-full max-w-5xl mx-auto p-4">
                  {/* Syllabus Title */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Syllabus Title</label>
                    <input
                      type="text"
                      value={editedData.syllabusTitle}
                      onChange={(e) => setEditedData({ ...editedData, syllabusTitle: e.target.value })}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                      required
                    />
                  </div>

                  {/* Syllabus Link */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Syllabus Link</label>
                    <input
                      type="text"
                      value={editedData.syllabusLink}
                      onChange={(e) => setEditedData({ ...editedData, syllabusLink: e.target.value })}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                      required
                      placeholder="Enter PDF URL"
                    />
                  </div>

                  {/* Academic Year */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Academic Year</label>
                    <input
                      type="text"
                      value={editedData.academicYear}
                      onChange={(e) => setEditedData({ ...editedData, academicYear: e.target.value })}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                      required
                    />
                  </div>

                  {/* Branches Dropdown */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Branch</label>
                    <Select
                      name="branch"
                      isClearable={true}
                      options={branches}
                      value={editedData.branch}
                      onChange={(selected) => setEditedData(prev => ({ ...prev, branch: selected }))}
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Branch"
                    />
                  </div>

                  {/* Institution */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Institution</label>
                    <Select
                      name="institution"
                      isClearable={true}
                      options={institutions}
                      value={editedData.institution}
                      onChange={(selected) => setEditedData(prev => ({ ...prev, institution: selected }))}
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Institution"
                    />
                  </div>

                  {/* Year Dropdown */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Year</label>
                    <Select
                      name="year"
                      isClearable={true}
                      options={years}
                      value={editedData.year}
                      onChange={(selected) => setEditedData(prev => ({ ...prev, year: selected }))}
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Year"
                    />
                  </div>

                  {/* Save and Cancel Buttons */}
                  <div className="mt-4 flex gap-4 justify-start">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 hover:bg-green-300 hover:text-black text-white px-4 py-2 rounded-md w-full md:w-auto"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSyllabus(null)}
                      className="hover:bg-red-500 hover:text-black bg-gray-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <h2 className="text-xl font-semibold">{doc.syllabusTitle}</h2>
                  {syllabusCategory.academicYear && (
                    <p className="mt-2 text-gray-700">Academic Year: {syllabusCategory.academicYear}</p>
                  )}
                  {syllabusCategory.branch && (
                    <p className="text-gray-700">Branch: {syllabusCategory.branch}</p>
                  )}
                  {syllabusCategory.institution && (
                    <p className="text-gray-700">Institution: {syllabusCategory.institution}</p>
                  )}
                  {syllabusCategory.year && (
                    <p className="text-gray-700">Year: {syllabusCategory.year}</p>
                  )}
                  <div className="flex space-x-4 mt-2">
                    <button onClick={() => openPdfViewer(doc.syllabusLink)} className="flex bg-indigo-500 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.view_data} alt="view" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">View Syllabus</span>
                    </button>
                    <button onClick={() => handleEdit(doc)} className="flex bg-amber-400 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.edit_data} alt="edit" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">Edit Syllabus</span>
                    </button>
                    <button onClick={() => handleDeleteClick(doc.id)} className="flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.delete_data} alt="delete" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">Delete Syllabus</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
    </div>
  ) : <AccessForbidden />
};

export default MySyllabus;