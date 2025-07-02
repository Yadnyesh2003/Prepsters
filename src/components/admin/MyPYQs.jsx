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
import Confirmation from './Confirmation';

const MyPYQs = () => {
  const { isGhost, user } = useAuth();
  const [pyqData, setPyqData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pyqToDelete, setPyqToDelete] = useState(null);

  const [editingPYQ, setEditingPYQ] = useState(null);
  const [editedData, setEditedData] = useState({
    pyqsCategory: {
      academicYear: '',
      branch: [],
      institution: '',
      subjectName: [],
      year: ''
    },
    pyqsTitle: '',
    pyqsLink: '',
    contributorName: ''
  });

  const [filter, setFilter] = useState({
    branch: '',
    institution: '',
    year: '',
    searchQuery: ''
  });

  const { toast } = useContext(AppContext);

  // Fetch PYQ data from Firestore
  const getPYQData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'PYQs'));
      const pyqs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPyqData(pyqs);
      setFilteredData(pyqs);
      setLoading(false);
    } catch (error) {
      toast.error(`Error fetching PYQs: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "My PYQs"
    if (isGhost) {
      getPYQData();
    }
  }, [isGhost]);

  // Handle Edit - Set the PYQ to be edited
  const handleEdit = (pyq) => {
    setEditingPYQ(pyq.id);
    setEditedData({
      pyqsCategory: {
        academicYear: pyq.pyqsCategory?.academicYear || '',
        branch: pyq.pyqsCategory?.branch || [],
        institution: pyq.pyqsCategory?.institution || '',
        subjectName: pyq.pyqsCategory?.subjectName || [],
        year: pyq.pyqsCategory?.year || ''
      },
      pyqsTitle: pyq.pyqsTitle || '',
      pyqsLink: pyq.pyqsLink || '',
      contributorName: pyq.contributorName || ''
    });
  };

  // Handle link change with the same logic as AddPYQs
  const handleLinkChange = (e) => {
    let modifiedLink = e.target.value;

    // Check if the link matches the Google Drive view URL pattern
    if (modifiedLink.includes("/view?usp=drive_link")) {
      modifiedLink = modifiedLink.replace(/\/view\?usp=drive_link$/, '/preview');
    }

    setEditedData(prev => ({
      ...prev,
      pyqsLink: modifiedLink
    }));
  };

  // Save edited data back to Firestore
  const handleSaveEdit = async () => {
    if (!editingPYQ) return;

    try {
      if (isGhost) {
        const pyqRef = doc(db, 'PYQs', editingPYQ);
        await updateDoc(pyqRef, {
          pyqsCategory: {
            academicYear: editedData.pyqsCategory.academicYear,
            branch: editedData.pyqsCategory.branch,
            institution: editedData.pyqsCategory.institution,
            subjectName: editedData.pyqsCategory.subjectName,
            year: editedData.pyqsCategory.year
          },
          pyqsTitle: editedData.pyqsTitle,
          pyqsLink: editedData.pyqsLink,
          contributorName: editedData.contributorName,
          updatedBy: user.displayName,
          updatedAt: serverTimestamp(),
        });
        setEditingPYQ(null);
        setEditedData({
          pyqsCategory: {
            academicYear: '',
            branch: [],
            institution: '',
            subjectName: [],
            year: ''
          },
          pyqsTitle: '',
          pyqsLink: '',
          contributorName: ''
        });
        getPYQData();
        toast.success('Changes Saved!');
      }
    } catch (error) {
      toast('Unauthorized Access!', { icon: '🚫' });
    }
  };

  // Handle delete click - show confirmation modal
  const handleDeleteClick = (pyqId) => {
    setPyqToDelete(pyqId);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    try {
      if (isGhost) {
        const pyqRef = doc(db, 'PYQs', pyqToDelete);
        await deleteDoc(pyqRef);
        getPYQData();
        toast.success('PYQ deleted successfully!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Error deleting PYQ: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setPyqToDelete(null);
    }
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPyqToDelete(null);
  };

  //For FilterComponent.jsx 
  const filterOptions = {
    branches: branches.map(b => b.value),
    years: years.map(y => y.value),
    institutions: institutions.map(i => i.value)
  };

  // Filter PYQ data based on selected filters
  const filterPYQData = (filterValues) => {
    const filtered = pyqData.filter((doc) => {
      const { branch, institution, year } = doc.pyqsCategory || {};
      const title = doc.pyqsTitle || '';

      const institutionMatch = filterValues.institution
        ? institution && institution.toLowerCase().includes(filterValues.institution.toLowerCase())
        : true;

      const branchMatch = filterValues.branch
        ? branch && branch.includes(filterValues.branch)
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
    setFilteredData(filtered);
  };

  const openPdfViewer = (url) => {
    setPdfUrl(url);
  };

  const closePdfViewer = () => {
    setPdfUrl(null);
  };

  if (loading) {
    return <Loading />;
  }

  return isGhost ? (
    <div className="max-w-6xl mx-auto p-4">
      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={showDeleteModal}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm PYQ Deletion"
        message="Are you sure you want to delete this PYQ? This action cannot be undone."
      />

      <FilterComponent
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions}
        onFilterChange={filterPYQData}
      />

      <div className="space-y-4">
        {filteredData.map((doc) => {
          const pyqsCategory = doc.pyqsCategory || {};
          return (
            <div key={doc.id} className="bg-sky-100 shadow-lg rounded-lg p-4 flex flex-col items-start">
              {editingPYQ === doc.id ? (
                <div className="w-full max-w-5xl mx-auto p-4">
                  {/* PYQ Title */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">PYQ Title</label>
                    <input
                      type="text"
                      value={editedData.pyqsTitle}
                      onChange={(e) => setEditedData(prev => ({ ...prev, pyqsTitle: e.target.value }))}
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
                      onChange={(selectedOption) => setEditedData(prev => ({ ...prev, contributorName: selectedOption.value }))}
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
                      value={editedData.pyqsCategory.branch.map(branch => ({ label: branch, value: branch }))}
                      onChange={(selectedOptions) => {
                        const branches = selectedOptions.map(option => option.value);
                        setEditedData(prev => ({
                          ...prev,
                          pyqsCategory: {
                            ...prev.pyqsCategory,
                            branch: branches
                          }
                        }));
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
                      value={{ label: editedData.pyqsCategory.academicYear, value: editedData.pyqsCategory.academicYear }}
                      onChange={(selectedOption) => setEditedData(prev => ({
                        ...prev,
                        pyqsCategory: {
                          ...prev.pyqsCategory,
                          academicYear: selectedOption.value
                        }
                      }))}
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
                      value={{ label: editedData.pyqsCategory.institution, value: editedData.pyqsCategory.institution }}
                      onChange={(selectedOption) => setEditedData(prev => ({
                        ...prev,
                        pyqsCategory: {
                          ...prev.pyqsCategory,
                          institution: selectedOption.value
                        }
                      }))}
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
                      value={editedData.pyqsCategory.subjectName.map(subject => ({ label: subject, value: subject }))}
                      onChange={(selectedOptions) => {
                        const subjects = selectedOptions.map(option => option.value);
                        setEditedData(prev => ({
                          ...prev,
                          pyqsCategory: {
                            ...prev.pyqsCategory,
                            subjectName: subjects
                          }
                        }));
                      }}
                      placeholder="Select Subjects"
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      isClearable
                    />
                  </div>

                  {/* Year Selection */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Year</label>
                    <Select
                      components={makeAnimated()}
                      options={years}
                      value={{ label: editedData.pyqsCategory.year, value: editedData.pyqsCategory.year }}
                      onChange={(selectedOption) => setEditedData(prev => ({
                        ...prev,
                        pyqsCategory: {
                          ...prev.pyqsCategory,
                          year: selectedOption.value
                        }
                      }))}
                      placeholder="Select Year"
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      isClearable
                    />
                  </div>

                  {/* PYQs Link (Newly Added) */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">PYQs Link</label>
                    <input
                      type="url"
                      value={editedData.pyqsLink}
                      onChange={handleLinkChange}
                      className="w-full md:w-3/4 mt-2 md:mt-0 border p-2"
                      required
                      placeholder="Enter GDrive PDF Link..."
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
                    <button
                      onClick={() => handleDeleteClick(doc.id)}
                      className="flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black"
                    >
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
  ) : <AccessForbidden />
};

export default MyPYQs;