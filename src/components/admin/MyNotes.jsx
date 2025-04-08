import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase'; 
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import PdfViewer from '../student/PdfViewer';
import { assets } from '../../assets/assets';

import FilterComponent from './FilterComponent';


const MyNotes = () => {
  const [noteData, setNoteData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // New state to hold the filtered syllabus data
  const [loading, setLoading] = useState(true);
  const { isGhost, setIsGhost } = useContext(AppContext);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [editingNote, setEditingNote] = useState(null);
  const [editedData, setEditedData] = useState({
    branch: [],
    subjectName: [],   //subjectName can be selected multiple as array element
    pyqsTitle: '',
  });

  const [filter, setFilter] = useState({
    branch: '',
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
  
  const getNoteData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Notes'));
      const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNoteData(notes);
      setFilteredData(notes); // Initially show all data
      setLoading(false);
    } catch (error) {
      alert('Error fetching Notes:' + error.message);
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(isGhost){
      getNoteData();
    }
  }, [isGhost]);

  // Handle Edit - Set the PYQ to be edited
  const handleEdit = (note) => {
    setEditingNote(note.id);
    setEditedData({ ...note.notesCategory || {}, notesTitle: note.notesTitle });
  };

  // Save edited data back to Firestore
  const handleSaveEdit = async () => {
    if (!editingNote) return;

    try {
      const noteRef = doc(db, 'Notes', editingNote);
      await updateDoc(noteRef, {
        notesCategory: editedData,
        notesTitle: editedData.notesTitle,
        updatedAt: serverTimestamp()
      });
      setEditingNote(null);
      setEditedData({});
      getNoteData(); // Reload data from Firestore
    } catch (error) {
      alert('Error saving Note:', error);
    }
  };

  // Handle Delete - Delete the PYQ from Firestore
  const handleDelete = async (noteId) => {
    try {
      const noteRef = doc(db, 'Notes', noteId);
      await deleteDoc(noteRef);
      getNoteData(); // Reload data from Firestore after deletion
    } catch (error) {
      alert('Error deleting Note:', error);
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
  const filterNoteData = (filterValues) => {
    const filtered = noteData.filter((doc) => {
      const { branch, year } = doc.notesCategory || {};
  
      // Check if the branch filter matches any of the branches in the array
      const branchMatch = filterValues.branch
        ? branch && branch.includes(filterValues.branch) // Check if the selected branch is in the array
        : true;
  
      return (
        branchMatch &&
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
    <h6 className='text-xs text-black bg-amber-200 border rounded-4xl mb-2'>Institution Filter Is Inactive on This Page!</h6>
    {/* Filter Component */}
    <FilterComponent 
      filter={filter}
      setFilter={setFilter}
      filterOptions={filterOptions}
      onFilterChange={filterNoteData}
    />

    {/* Displaying Filtered PYQ Data */}
    <div className="space-y-4">
        {filteredData.map((doc) => {
          const notesCategory = doc.notesCategory || {};
          return (
            <div key={doc.id} className="bg-sky-100 shadow-lg rounded-lg p-4 flex flex-col items-start">
              {editingNote === doc.id ? (
                // Edit form here (same as your original code)
                <div className="w-full max-w-5xl mx-auto p-4">
                  {/* Notes Title */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Notes Title</label>
                    <input
                      type="text"
                      value={editedData.notesTitle}
                      onChange={(e) => setEditedData({ ...editedData, notesTitle: e.target.value })}
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

                  {/* Edit Subject Names */}
                  <div className="mt-2">
                    <label className="block text-sm font-semibold text-black">Subject Name</label>
                    <input
                      type="text"
                      value={Array.isArray(editedData.subjectName) ? editedData.subjectName.join(', ') : ''} // Display comma-separated subjects
                      onChange={(e) => {
                        const subjects = e.target.value.split(',').map(subject => subject.trim());
                        setEditedData({
                          ...editedData,
                          subjectName: subjects ||[]
                        });
                      }}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                    />
                    <p className="text-sm text-gray-500">Enter subject names separated by commas.</p>
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
                      onClick={() => setEditingNote(null)}
                      className="hover:bg-red-500 hover:text-black bg-gray-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <h2 className="text-xl font-semibold">{doc.notesTitle}</h2>
                  {notesCategory.subjectName && (
                    <p className="text-gray-700">Subject Name: {Array.isArray(notesCategory.subjectName) ? notesCategory.subjectName.join(', ') : ''}</p>
                  )}
                  {notesCategory.branch && (
                    <p className="text-gray-700">Branch: {Array.isArray(notesCategory.branch) ? notesCategory.branch.join(', '): ''}</p>
                  )}
                  {notesCategory.year && (
                    <p className="text-gray-700">Year: {notesCategory.year}</p>
                  )}
                  <div className="flex space-x-4 mt-2">
                    <button onClick={() => openPdfViewer(doc.notesLink)} className="flex bg-indigo-500 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.view_data} alt="view" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">View Notes</span>
                    </button>
                    <button onClick={() => handleEdit(doc)} className="flex bg-amber-400 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.edit_data} alt="edit" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">Edit Notes</span>
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="flex bg-red-500 text-white px-4 py-2 rounded-md hover:text-black">
                      <img src={assets.delete_data} alt="delete" className="w-6 h-6 mr-2" />
                      <span className="hidden md:inline">Delete Notes</span>
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
  )
}

export default MyNotes