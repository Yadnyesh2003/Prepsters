import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import AccessForbidden from '../student/AccessForbidden';
import Loading from '../../components/admin/Loading';
import FilterComponent from './FilterComponent';
import PdfViewer from '../student/PdfViewer';
import { assets, branches, years, institutions, subjects, contributors } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import Confirmation from './Confirmation';

const MyFAQs = () => {
  const { isGhost, user } = useAuth();
  const [faqData, setFaqData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  const [editingFAQ, setEditingFAQ] = useState(null);
  const [editedData, setEditedData] = useState({
    faqsCategory: {
      branch: [],
      institution: '',
      subjectName: '',
      year: ''
    },
    faqsTitle: '',
    faqsLink: '',
    contributorName: ''
  });

  const [filter, setFilter] = useState({
    branch: '',
    institution: '',
    year: '',
    searchQuery: ''
  });

  const { toast } = useContext(AppContext);
  const animatedComponents = makeAnimated();

  const filterOptions = {
    branches: branches.map(b => b.value),
    years: years.map(y => y.value),
    institutions: institutions.map(i => i.value)
  };

  const getFAQData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'FAQs'));
      const faqs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaqData(faqs);
      setFilteredData(faqs);
      setLoading(false);
    } catch (error) {
      toast.error(`Error fetching FAQs: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGhost) {
      getFAQData();
    }
  }, [isGhost]);

  const handleEdit = (faq) => {
    setEditingFAQ(faq.id);
    setEditedData({
      faqsCategory: {
        branch: faq.faqsCategory?.branch || [],
        institution: faq.faqsCategory?.institution || '',
        subjectName: faq.faqsCategory?.subjectName || '',
        year: faq.faqsCategory?.year || ''
      },
      faqsTitle: faq.faqsTitle || '',
      faqsLink: faq.faqsLink || '',
      contributorName: faq.contributorName || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingFAQ) return;

    try {
      if (isGhost) {
        const faqRef = doc(db, 'FAQs', editingFAQ);
        await updateDoc(faqRef, {
          faqsCategory: editedData.faqsCategory,
          faqsTitle: editedData.faqsTitle,
          faqsLink: editedData.faqsLink,
          contributorName: editedData.contributorName,
          updatedBy: user.displayName,
          updatedAt: serverTimestamp(),
        });
        setEditingFAQ(null);
        setEditedData({
          faqsCategory: {
            branch: [],
            institution: '',
            subjectName: '',
            year: ''
          },
          faqsTitle: '',
          faqsLink: '',
          contributorName: ''
        });
        getFAQData();
        toast.success('Changes Saved!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Error saving data: ${error.message}`);
    }
  };

  const handleDeleteClick = (faqId) => {
    setFaqToDelete(faqId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (isGhost) {
        const faqRef = doc(db, 'FAQs', faqToDelete);
        await deleteDoc(faqRef);
        getFAQData();
        toast.success('FAQ deleted successfully!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Error deleting FAQ: ${error.message}`);
    } finally {
      setShowDeleteModal(false);
      setFaqToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFaqToDelete(null);
  };

  const filterFAQData = (filterValues) => {
    const filtered = faqData.filter((doc) => {
      const { branch, institution, year } = doc.faqsCategory || {};
      const title = doc.faqsTitle || '';

      const institutionMatch = filterValues.institution
        ? institution && institution.toLowerCase().includes(filterValues.institution.toLowerCase())
        : true;

      const searchMatch = filterValues.searchQuery
        ? title.toLowerCase().includes(filterValues.searchQuery.toLowerCase())
        : true;

      const branchMatch = filterValues.branch
        ? branch && branch.includes(filterValues.branch)
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
    <div className='max-w-6xl mx-auto p-4'>
      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={showDeleteModal}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm FAQ Deletion"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
      />

      <FilterComponent
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions}
        onFilterChange={filterFAQData}
      />

      <div className="space-y-4">
        {filteredData.map((doc) => {
          const faqsCategory = doc.faqsCategory || {};
          return (
            <div key={doc.id} className="bg-sky-100 shadow-lg rounded-lg p-4 flex flex-col items-start">
              {editingFAQ === doc.id ? (
                <div className="w-full max-w-5xl mx-auto p-4">
                  {/* FAQ Title */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">FAQ Title</label>
                    <input
                      type="text"
                      value={editedData.faqsTitle}
                      onChange={(e) => setEditedData(prev => ({ ...prev, faqsTitle: e.target.value }))}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                      required
                    />
                  </div>



                  {/* Contributor Name Dropdown */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Contributor Name</label>
                    <Select
                      name="contributorName"
                      isClearable={true}
                      components={animatedComponents}
                      options={contributors}
                      value={contributors.find((c) => c.value === editedData.contributorName)}
                      onChange={(selected) =>
                        setEditedData(prev => ({
                          ...prev,
                          contributorName: selected ? selected.value : '',
                        }))
                      }
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Contributor"
                    />
                  </div>

                  {/* Branches Multi-Select Dropdown */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Branch</label>
                    <Select
                      isMulti
                      components={animatedComponents}
                      name="branch"
                      options={branches}
                      value={branches.filter((b) => editedData.faqsCategory.branch.includes(b.value))}
                      onChange={(selectedOptions) =>
                        setEditedData(prev => ({
                          ...prev,
                          faqsCategory: {
                            ...prev.faqsCategory,
                            branch: selectedOptions.map((option) => option.value),
                          }
                        }))
                      }
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Branch(es)"
                    />
                  </div>

                  {/* Institution Dropdown */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Institution</label>
                    <Select
                      name="institution"
                      isClearable
                      components={animatedComponents}
                      options={institutions}
                      value={institutions.find((i) => i.value === editedData.faqsCategory.institution)}
                      onChange={(selected) =>
                        setEditedData(prev => ({
                          ...prev,
                          faqsCategory: {
                            ...prev.faqsCategory,
                            institution: selected ? selected.value : '',
                          }
                        }))
                      }
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Institution"
                    />
                  </div>

                  {/* Subject Name Dropdown */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Subject Name</label>
                    <Select
                      name="subjectName"
                      isClearable
                      components={animatedComponents}
                      options={subjects}
                      value={subjects.find((s) => s.value === editedData.faqsCategory.subjectName)}
                      onChange={(selected) =>
                        setEditedData(prev => ({
                          ...prev,
                          faqsCategory: {
                            ...prev.faqsCategory,
                            subjectName: selected ? selected.value : '',
                          }
                        }))
                      }
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Subject"
                    />
                  </div>

                  {/* Year Dropdown */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Year</label>
                    <Select
                      name="year"
                      isClearable
                      components={animatedComponents}
                      options={years}
                      value={years.find((y) => y.value === editedData.faqsCategory.year)}
                      onChange={(selected) =>
                        setEditedData(prev => ({
                          ...prev,
                          faqsCategory: {
                            ...prev.faqsCategory,
                            year: selected ? selected.value : '',
                          }
                        }))
                      }
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Year"
                    />
                  </div>

                  {/* FAQ Link */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">FAQ Link</label>
                    <input
                      type="url"
                      value={editedData.faqsLink}
                      onChange={(e) => {
                        const modifiedLink = e.target.value.replace(/\/view\?usp=drive_link$/, '/preview');
                        setEditedData(prev => ({
                          ...prev,
                          faqsLink: modifiedLink
                        }));
                      }}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                      required
                      placeholder='Enter GDrive PDF Link...'
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
                      onClick={() => setEditingFAQ(null)}
                      className="hover:bg-red-500 hover:text-black bg-gray-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <h2 className="text-xl font-semibold">{doc.faqsTitle}</h2>
                  <p className='text-gray-700'>Contributor Name: {doc.contributorName}</p>
                  {faqsCategory.branch && (
                    <p className="text-gray-700">Branch: {faqsCategory.branch.join(', ')}</p>
                  )}
                  {faqsCategory.subjectName && (
                    <p className="text-gray-700">Subject Name: {faqsCategory.subjectName}</p>
                  )}
                  {faqsCategory.institution && (
                    <p className="text-gray-700">Institution: {faqsCategory.institution}</p>
                  )}
                  {faqsCategory.year && (
                    <p className="text-gray-700">Year: {faqsCategory.year}</p>
                  )}
                  <div className="flex space-x-4 mt-2">
                    <button onClick={() => openPdfViewer(doc.faqsLink)} className="flex bg-indigo-500 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.view_data} alt="view" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">View FAQ</span>
                    </button>
                    <button onClick={() => handleEdit(doc)} className="flex bg-amber-400 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.edit_data} alt="edit" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">Edit FAQ</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(doc.id)}
                      className="flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black"
                    >
                      <img src={assets.delete_data} alt="delete" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">Delete FAQ</span>
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
  ) : <AccessForbidden />;
}

export default MyFAQs;