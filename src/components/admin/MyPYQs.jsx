import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Loading from '../../components/admin/Loading';
import PdfViewer from '../student/PdfViewer';
import { assets, branches, institutions, subjects, years, contributors, academicYears } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import FilterComponent from './FilterComponent';
import AccessForbidden from '../student/AccessForbidden';

const MyPYQs = () => {
  const { isGhost, user } = useAuth();
  const [pyqData, setPyqData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [editingPYQ, setEditingPYQ] = useState(null);
  const [editedData, setEditedData] = useState({
    branch: [],
    pyqsTitle: '',
    subjectName: [], 
    contributorName: ''
  });

  const [filter, setFilter] = useState({
    branch: '',
    institution: '',
    year: '',
    searchQuery: ''
  });

  const {toast} = useContext(AppContext)

//================================================================================================================================================================================================

  //For FilterComponent.jsx 
  const filterOptions = {
    branches: branches.map(b => b.value),
    years: years.map(y => y.value),
    institutions: institutions.map(i => i.value)
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
      toast.error(`Error fetching PYQs: ${error.message}`);
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
    setEditedData({ 
      ...pyq.pyqsCategory || {}, 
      pyqsTitle: pyq.pyqsTitle,
      contributorName: pyq.contributorName || ''
    });
  };

  // Save edited data back to Firestore
  const handleSaveEdit = async () => {
    if (!editingPYQ) return;

    try {
      if(isGhost) {
        const pyqRef = doc(db, 'PYQs', editingPYQ);
        await updateDoc(pyqRef, {
          pyqsCategory: editedData,
          pyqsTitle: editedData.pyqsTitle,
          contributorName: editedData.contributorName,
          updatedBy: user.displayName,
          updatedAt: serverTimestamp(),
        });
        setEditingPYQ(null);
        setEditedData({});
        getPYQData(); // Reload data from Firestore
        toast.success('Changes Saved!')
      }
    } catch (error) {
      toast('Unauthorized Access!', {icon: '🚫'})
    }
  };

  // Handle Delete - Delete the PYQ from Firestore
  const handleDelete = async (pyqId) => {
    try {
      if(isGhost) {
        const pyqRef = doc(db, 'PYQs', pyqId);
        await deleteDoc(pyqRef);
        getPYQData(); // Reload data from Firestore after deletion
        toast.success('Deleted data!')
      } else {
    toast('Unauthorized Access!', {icon: '🚫'})
    }
  } catch (error) {
    toast.error(`Error deleting data: ${error.message}`);
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
    const title = doc.pyqsTitle || '';

    const institutionMatch = filterValues.institution
      ? institution && institution.toLowerCase().includes(filterValues.institution.toLowerCase())
      : true;

    // Check if the branch filter matches any of the branches in the array
    const branchMatch = filterValues.branch
      ? branch && branch.includes(filterValues.branch) // Check if the selected branch is in the array
      : true;

    const searchMatch = filterValues.searchQuery
      ? title.toLowerCase().includes(filterValues.searchQuery.toLowerCase())
      : true;

    return (
      branchMatch &&
      institutionMatch &&
      (filterValues.year ? year === filterValues.year : true) &&
      searchMatch
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

  return isGhost ? (
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

                  {/* Contributor Name */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Contributor Name</label>
                    <Select
                      components={makeAnimated()}
                      options={contributors}
                      value={{ label: editedData.contributorName, value: editedData.contributorName }}
                      onChange={(selectedOption) => setEditedData({ ...editedData, contributorName: selectedOption.value })}
                      placeholder="Select Contributor"
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      isClearable
                    />
                  </div>

                  {/* Selected Branches */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Branch</label>
                    <Select
                      components={makeAnimated()}
                      isMulti
                      options={branches}
                      value={editedData.branch.map(branch => ({ label: branch, value: branch }))}
                      onChange={(selectedOptions) => {
                        const branches = selectedOptions.map(option => option.value);
                        setEditedData({ ...editedData, branch: branches });
                      }}
                      placeholder="Select Branches"
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      isClearable
                    />
                  </div>

                  {/* Academic Year */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Academic Year</label>
                    <Select
                      components={makeAnimated()}
                      options={academicYears}
                      value={{ label: editedData.academicYear, value: editedData.academicYear }}
                      onChange={(selectedOption) => setEditedData({ ...editedData, academicYear: selectedOption.value })}
                      placeholder="Select Academic Year"
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      isClearable
                    />
                  </div>


                  {/* Institution */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Institution</label>
                    <Select
                      components={makeAnimated()}
                      options={institutions}
                      value={{ label: editedData.institution, value: editedData.institution }}
                      onChange={(selectedOption) => setEditedData({ ...editedData, institution: selectedOption.value })}
                      placeholder="Select Institution"
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      isClearable
                    />
                  </div>

                  {/* Edit Subject Names */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Subject Name</label>
                    <Select
                      components={makeAnimated()}
                      isMulti
                      options={subjects}
                      value={editedData.subjectName.map(subject => ({ label: subject, value: subject }))}
                      onChange={(selectedOptions) => {
                        const subjects = selectedOptions.map(option => option.value);
                        setEditedData({ ...editedData, subjectName: subjects });
                      }}
                      placeholder="Select Subjects"
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      isClearable
                    />
                  </div>


                  {/* Year Radio Buttons */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Year</label>
                    <Select
                      components={makeAnimated()}
                      options={years}
                      value={{ label: editedData.year, value: editedData.year }}
                      onChange={(selectedOption) => setEditedData({ ...editedData, year: selectedOption.value })}
                      placeholder="Select Year"
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      isClearable
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
                  <p className="text-gray-700">Contributor Name: {doc.contributorName}</p>
                  {pyqsCategory.branch && (
                    <p className="text-gray-700">Branch: {pyqsCategory.branch.join(', ')}</p>
                  )}
                  {pyqsCategory.subjectName && (
                    <p className="text-gray-700">Subject Name: {Array.isArray(pyqsCategory.subjectName) ? pyqsCategory.subjectName.join(', ') : ''}</p>
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
  ) : <AccessForbidden/>
};

export default MyPYQs;
