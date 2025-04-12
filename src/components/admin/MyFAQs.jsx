import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase';
import { AppContext } from '../../context/AppContext'
import AccessForbidden from '../student/AccessForbidden'
import Loading from '../../components/student/Loading';
import FilterComponent from './FilterComponent';
import PdfViewer from '../student/PdfViewer';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';


const MyFAQs = () => {
  const { isGhost } = useAuth();
  const [faqData, setFaqData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // New state to hold the filtered FAQ data
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [editingFAQ, setEditingFAQ] = useState(null);
  const [editedData, setEditedData] = useState({
    branch: [],
    faqsTitle: '',
    contributorName: '',
    subjectName: '',
  });

  const [filter, setFilter] = useState({
    branch: '',
    institution: '',
    year: ''
  });

  const { toast } = useContext(AppContext);

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

  // Fetch FAQ data from Firestore
  const getFAQData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'FAQs'));
      const faqs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaqData(faqs);
      setFilteredData(faqs); // Initially show all data
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

  // Handle Edit - Set the FAQ to be edited
  const handleEdit = (faq) => {
    setEditingFAQ(faq.id);
    setEditedData({
      ...faq.faqsCategory || {},
      faqsTitle: faq.faqsTitle,
      contributorName: faq.contributorName
    });
  };

  // Save edited data back to Firestore
  const handleSaveEdit = async () => {
    if (!editingFAQ) return;

    try {
      if (isGhost) {
        const faqRef = doc(db, 'FAQs', editingFAQ);
        await updateDoc(faqRef, {
          faqsCategory: editedData,
          faqsTitle: editedData.faqsTitle,
          contributorName: editedData.contributorName,
          updatedAt: serverTimestamp()
        });
        setEditingFAQ(null);
        setEditedData({});
        getFAQData(); // Reload data from Firestore
        toast.success('Changes Saved!')
      } else {
        toast('Unauthorized Access!', { icon: '🚫' })
      }
    } catch (error) {
      toast.error(`Error saving data: ${error.message}`);
    }
  };

  // Handle Delete - Delete the FAQ from Firestore
  const handleDelete = async (faqId) => {
    try {
      if (isGhost) {
        const faqRef = doc(db, 'FAQs', faqId);
        await deleteDoc(faqRef);
        getFAQData(); // Reload data from Firestore after deletion
        toast.success('Deleted data!')
      } else {
        toast('Unauthorized Access!', { icon: '🚫' })
      }
    } catch (error) {
      toast.error(`Error deleting data: ${error.message}`);
    }
  };

  // Filter FAQ data based on selected filters
  const filterFAQData = (filterValues) => {
    const filtered = faqData.filter((doc) => {
      const { branch, institution, year } = doc.faqsCategory || {};

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

  return isGhost ? (
    <div className='max-w-6xl mx-auto p-4'>
      {/* Filter Component */}
      <FilterComponent
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions}
        onFilterChange={filterFAQData}
      />

      {/* Displaying Filtered FAQ Data */}
      <div className="space-y-4">
        {filteredData.map((doc) => {
          const faqsCategory = doc.faqsCategory || {};
          return (
            <div key={doc.id} className="bg-sky-100 shadow-lg rounded-lg p-4 flex flex-col items-start">
              {editingFAQ === doc.id ? (
                // Edit form here (same as your original code)
                <div className="w-full max-w-5xl mx-auto p-4">
                  {/* FAQ Title */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">FAQ Title</label>
                    <input
                      type="text"
                      value={editedData.faqsTitle}
                      onChange={(e) => setEditedData({ ...editedData, faqsTitle: e.target.value })}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                      required
                    />
                  </div>

                  {/* Contributor Name */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Contributor Name</label>
                    <input
                      type="text"
                      value={editedData.contributorName}
                      onChange={(e) => setEditedData({ ...editedData, contributorName: e.target.value })}
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

                  {/* Edit Subject Names */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Subject Name</label>
                    <input
                      type="text"
                      value={editedData.subjectName || ''}
                      onChange={(e) => setEditedData({ ...editedData, subjectName: e.target.value })}
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
                    <button onClick={() => handleDelete(doc.id)} className="flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black">
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
  ) : (<AccessForbidden />)
}

export default MyFAQs