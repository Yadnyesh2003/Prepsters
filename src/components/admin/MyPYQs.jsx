import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import PdfViewer from '../student/PdfViewer';
import { assets } from '../../assets/assets';

import FilterComponent from './FilterComponent';

const MyPYQs = () => {
  const [pyqData, setPyqData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // New state to hold the filtered PYQ data
  const [loading, setLoading] = useState(true);
  const { isGhost, setIsGhost } = useContext(AppContext);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [editingPYQ, setEditingPYQ] = useState(null);
  const [editedData, setEditedData] = useState({
    branch: [],
    pyqsTitle: '',
  });

  const [filter, setFilter] = useState({
    branch: '',
    institution: '',
    year: ''
  });

//================================================================================================================================================================================================

  //For FilterComponent.jsx 
  const filterOptions = {
    branches: [
      "General Science & Humanities", 
      "Computer Engineering", 
      "Information Technology", 
      "Electronics & Telecommunication", 
      "Artificial Intelligence & Data Science", 
      "Electronics & Computer Science"
    ],
    years: ["First Year", "Second Year", "Third Year", "Final Year"]
  };

//===============================================================================================================================================================================================

  // Fetch PYQ data from Firestore
  const getPYQData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'PYQs'));
      const pyqs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPyqData(pyqs);
      setFilteredData(pyqs); // Initially show all data
      setLoading(false);
    } catch (error) {
      alert('Error fetching PYQs:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGhost) {
      getPYQData();
    }
  }, [isGhost]);

  // Handle Edit - Set the PYQ to be edited
  const handleEdit = (pyq) => {
    setEditingPYQ(pyq.id);
    setEditedData({ ...pyq.pyqsCategory || {}, pyqsTitle: pyq.pyqsTitle });
  };

  // Save edited data back to Firestore
  const handleSaveEdit = async () => {
    if (!editingPYQ) return;

    try {
      const pyqRef = doc(db, 'PYQs', editingPYQ);
      await updateDoc(pyqRef, {
        pyqsCategory: editedData,
        pyqsTitle: editedData.pyqsTitle,
        updatedAt: serverTimestamp()
      });
      setEditingPYQ(null);
      setEditedData({});
      getPYQData(); // Reload data from Firestore
    } catch (error) {
      alert('Error saving PYQ:', error);
    }
  };

  // Handle Delete - Delete the PYQ from Firestore
  const handleDelete = async (pyqId) => {
    try {
      const pyqRef = doc(db, 'PYQs', pyqId);
      await deleteDoc(pyqRef);
      getPYQData(); // Reload data from Firestore after deletion
    } catch (error) {
      alert('Error deleting PYQ:', error);
    }
  };

//======================================================================================================
  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   const updatedFilter = { ...filter, [name]: value };
  //   setFilter(updatedFilter); // Update filter state
  //   filterPYQData(updatedFilter); // Immediately apply the filter with the updated state
  // };
//=======================================================================================================

  // Filter PYQ data based on selected filters
const filterPYQData = (filterValues) => {
  const filtered = pyqData.filter((doc) => {
    const { branch, institution, year } = doc.pyqsCategory || {};

    const institutionMatch = filterValues.institution
      ? institution && institution.toLowerCase().includes(filterValues.institution.toLowerCase())
      : true;

    // Check if the branch filter matches any of the branches in the array
    const branchMatch = filterValues.branch
      ? branch && branch.includes(filterValues.branch) // Check if the selected branch is in the array
      : true;

    return (
      branchMatch &&
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


  const handleBranchChange = (e) => {
    const branch = e.target.value;
    const updatedBranches = e.target.checked
      ? [...editedData.branch, branch]  // Add branch if checked
      : editedData.branch.filter((b) => b !== branch);  // Remove branch if unchecked
  
    setEditedData({
      ...editedData,
      branch: updatedBranches,  // Update branch as an array
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
      <FilterComponent 
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions}
        onFilterChange={filterPYQData}
      />


      {/* INITIAL CODE PRESENT HERE HAS BEEN SHIFTER BELOW OUT OF THE RETURN STATEMENT */}
  

      {/* Displaying Filtered PYQ Data */}
      <div className="space-y-4">
        {filteredData.map((doc) => {
          const pyqsCategory = doc.pyqsCategory || {};
          return (
            <div key={doc.id} className="bg-sky-100 shadow-lg rounded-lg p-4 flex flex-col items-start">
              {editingPYQ === doc.id ? (
                // Edit form here (same as your original code)
                <div className="w-full max-w-5xl mx-auto p-4">
                  {/* PYQ Title */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">PYQ Title</label>
                    <input
                      type="text"
                      value={editedData.pyqsTitle}
                      onChange={(e) => setEditedData({ ...editedData, pyqsTitle: e.target.value })}
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
                            type="checkbox"  // Change from radio to checkbox for multiple selections
                            value={branch}
                            checked={editedData.branch.includes(branch)}  // Check if branch is selected
                            onChange={handleBranchChange}
                            className="mr-2"
                          />
                          {branch}
                        </label>
                      ))}
                    </div>
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
                      onClick={() => setEditingPYQ(null)}
                      className="hover:bg-red-500 hover:text-black bg-gray-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <h2 className="text-xl font-semibold">{doc.pyqsTitle}</h2>
                  {pyqsCategory.academicYear && (
                    <p className="mt-2 text-gray-700">Academic Year: {pyqsCategory.academicYear}</p>
                  )}
                  {pyqsCategory.branch && (
                    <p className="text-gray-700">Branch: {pyqsCategory.branch.join(', ')}</p>
                  )}
                  {pyqsCategory.institution && (
                    <p className="text-gray-700">Institution: {pyqsCategory.institution}</p>
                  )}
                  {pyqsCategory.year && (
                    <p className="text-gray-700">Year: {pyqsCategory.year}</p>
                  )}
                  <div className="flex space-x-4 mt-2">
                    <button onClick={() => openPdfViewer(doc.pyqsLink)} className="flex bg-indigo-500 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.view_data} alt="view" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">View PYQ</span>
                    </button>
                    <button onClick={() => handleEdit(doc)} className="flex bg-amber-400 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.edit_data} alt="edit" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">Edit PYQ</span>
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.delete_data} alt="delete" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">Delete PYQ</span>
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

export default MyPYQs;




{/* <div className="mb-4 p-4 bg-cyan-300 shadow-lg rounded-md">
        <h2 className="text-lg font-semibold">Filter PYQ Documents</h2>
        <div className="flex flex-col md:flex-row gap-4 mt-4">

          <div className="w-full sm:w-auto md:w-auto lg:w-auto">
            <label className="block text-sm font-semibold text-black mb-2">Branch</label>
            <select
              name="branch"
              value={filter.branch}
              onChange={handleFilterChange}
              className="border p-2 w-full max-w-full md:w-3/4 lg:w-1/2 xl:w-1/4 mt-2 md:mt-0 overflow-auto"
            >
              <option value="">All Branches</option>
              {["General Science & Humanities", "Computer Engineering", "Information Technology", "Electronics & Telecommunication", "Artificial Intelligence & Data Science", "Electronics & Computer Science"].map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
         
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
         
          <div>
            <label className="block text-sm font-semibold text-black">Year</label>
            <select
              name="year"
              value={filter.year}
              onChange={handleFilterChange}
              className="border p-2">
              <option value="">All Years</option>
              {["First Year", "Second Year", "Third Year", "Final Year"].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div> */}