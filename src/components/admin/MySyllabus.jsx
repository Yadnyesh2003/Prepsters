import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase'; 
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import PdfViewer from '../student/PdfViewer';
import { assets } from '../../assets/assets';

const MySyllabus = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // New state to hold the filtered syllabus data
  const [loading, setLoading] = useState(true);
  const { isGhost, setIsGhost } = useContext(AppContext);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [editingSyllabus, setEditingSyllabus] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [filter, setFilter] = useState({
    branch: '',
    institution: '',
    year: ''
  });

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
      console.log('Fetched Syllabus Data: ', syllabus);
    } catch (error) {
      console.error('Error fetching syllabus:', error);
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
    setEditedData({ ...syllabus.syllabusCategory || {}, syllabusTitle: syllabus.syllabusTitle });
  };

  // Save edited data back to Firestore
  const handleSaveEdit = async () => {
    if (!editingSyllabus) return;

    try {
      const syllabusRef = doc(db, 'Syllabus', editingSyllabus);
      await updateDoc(syllabusRef, {
        syllabusCategory: editedData,
        syllabusTitle: editedData.syllabusTitle,
        updatedAt: serverTimestamp()
      });
      setEditingSyllabus(null);
      setEditedData({});
      getSyllabusData(); // Reload data from Firestore
    } catch (error) {
      console.error('Error saving syllabus:', error);
    }
  };

  // Handle Delete - Delete the syllabus from Firestore
  const handleDelete = async (syllabusId) => {
    try {
      const syllabusRef = doc(db, 'Syllabus', syllabusId);
      await deleteDoc(syllabusRef);
      getSyllabusData(); // Reload data from Firestore after deletion
    } catch (error) {
      console.error('Error deleting syllabus:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilter = { ...filter, [name]: value };
    setFilter(updatedFilter); // Update filter state
    filterSyllabusData(updatedFilter); // Immediately apply the filter with the updated state
  };

  // Filter syllabus data based on selected filters
  const filterSyllabusData = (filterValues) => {
    const filtered = syllabusData.filter((doc) => {
      const { branch, institution, year } = doc.syllabusCategory || {};
      
      // Check if the institution matches (case insensitive and partial match)
      const institutionMatch = filterValues.institution
        ? institution && institution.toLowerCase().includes(filterValues.institution.toLowerCase())
        : true;

      return (
        (filterValues.branch ? branch === filterValues.branch : true) &&
        institutionMatch &&
        (filterValues.year ? year === filterValues.year : true)
      );
    });
    setFilteredData(filtered); // Update the filtered data
  };

  // Handle Year Radio Selection
  const handleYearChange = (e) => {
    setEditedData({
      ...editedData,
      year: e.target.value, // Set selected year
    });
  };

  // Handle Branch Checkbox Selection
  const handleBranchChange = (e) => {
    setEditedData({
      ...editedData,
      branch: e.target.value,
    });
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

  return isGhost && (
    <div className="max-w-6xl mx-auto p-4">
      {/* Filter Component */}
      <div className="mb-4 p-4 bg-cyan-300 shadow-lg rounded-md">
        <h2 className="text-lg font-semibold">Filter Syllabus Documents</h2>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* Branch Filter */}
          <div>
            <label className="block text-sm font-semibold text-black">Branch</label>
            <select
              name="branch"
              value={filter.branch}
              onChange={handleFilterChange}
              className="border p-2"
            >
              <option value="">All Branches</option>
              {["General Science & Humanities", "Computer Engineering", "Information Technology", "Electronics & Telecommunication", "Artificial Intelligence & Data Science", "Electronics & Computer Science"].map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          {/* Institution Filter */}
          <div>
            <label className="block text-sm font-semibold text-black">Institution</label>
            <input
              type="text"
              name="institution"
              value={filter.institution}
              onChange={handleFilterChange}
              className="border p-2"
              placeholder="Example: Mumbai University"
            />
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-semibold text-black">Year</label>
            <select
              name="year"
              value={filter.year}
              onChange={handleFilterChange}
              className="border p-2"
            >
              <option value="">All Years</option>
              {["First Year", "Second Year", "Third Year", "Final Year"].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Displaying Filtered Syllabus Data */}
      <div className="space-y-4">
        {filteredData.map((doc) => {
          const syllabusCategory = doc.syllabusCategory || {}; 
          return (
            <div key={doc.id} className="bg-sky-100 shadow-lg rounded-lg p-4 flex flex-col items-start">
              {editingSyllabus === doc.id ? (
                // Edit form here (same as your original code)
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
              
                {/* Branches Checkboxes */}
                <div className="mt-2">
                  <label className="block text-sm font-semibold text-black">Branch</label>
                  <div className="flex flex-col md:flex-row gap-4 mt-2">
                    {["General Science & Humanities", "Computer Engineering", "Information Technology", "Electronics & Telecommunication", "Artificial Intelligence & Data Science", "Electronics & Computer Science"].map((branch) => (
                      <label key={branch} className="flex items-center hover:text-indigo-700">
                        <input
                          type="radio"
                          value={branch}
                          checked={editedData.branch===branch}
                          onChange={handleBranchChange}
                          className="mr-2"
                        />
                        {branch}
                      </label>
                    ))}
                  </div>
                </div>
              
                {/* Institution */}
                <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <label className="block text-sm font-semibold text-black w-full md:w-1/4">Institution</label>
                  <input
                    type="text"
                    value={editedData.institution || ''}
                    onChange={(e) => setEditedData({ ...editedData, institution: e.target.value })}
                    className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                    required
                  />
                </div>
              
                {/* Year Radio Buttons */}
                <div className="mt-2">
                  <label className="block text-left text-sm font-semibold text-black">Year</label>
                  <div className="flex flex-col md:flex-row gap-4 mt-2">
                    {["First Year", "Second Year", "Third Year", "Final Year"].map((year) => (
                      <label key={year} className="flex items-center gap-2 hover:text-indigo-700">
                        <input
                          type="radio"
                          value={year}
                          checked={editedData.year === year}
                          onChange={handleYearChange}
                          className="mr-2"
                          required
                        />
                        {year}
                      </label>
                    ))}
                  </div>
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
                    <button onClick={() => handleDelete(doc.id)} className="flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black">
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
  );
};

export default MySyllabus;