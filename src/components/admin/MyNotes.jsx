import React, { useContext, useEffect, useState } from 'react';
import { getDocs, collection, db, doc, updateDoc, deleteDoc, serverTimestamp } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Loading from '../../components/admin/Loading';
import PdfViewer from '../student/PdfViewer';
import { assets, branches, institutions, years, contributors, subjects } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import FilterComponent from './FilterComponent';
import AccessForbidden from '../student/AccessForbidden';

const MyNotes = () => {
  const { isGhost, user } = useAuth();
  const [noteData, setNoteData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [editingNote, setEditingNote] = useState(null);
  const [editedData, setEditedData] = useState({
    notesCategory: {
      branch: [],
      subjectName: [],
      year: ''
    },
    notesTitle: '',
    contributorName: '',
    notesLink: ''
  });

  const [filter, setFilter] = useState({
    branch: '',
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

  const getNoteData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Notes'));
      const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNoteData(notes);
      setFilteredData(notes);
      setLoading(false);
    } catch (error) {
      toast.error(`Error fetching Notes: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGhost) {
      getNoteData();
    }
  }, [isGhost]);

  const handleEdit = (note) => {
    setEditingNote(note.id);
    setEditedData({
      notesCategory: {
        branch: note.notesCategory?.branch || [],
        subjectName: note.notesCategory?.subjectName || [],
        year: note.notesCategory?.year || ''
      },
      notesTitle: note.notesTitle || '',
      contributorName: note.contributorName || '',
      notesLink: note.notesLink || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingNote) return;

    try {
      if (isGhost) {
        const noteRef = doc(db, 'Notes', editingNote);
        await updateDoc(noteRef, {
          notesCategory: editedData.notesCategory,
          notesTitle: editedData.notesTitle,
          contributorName: editedData.contributorName,
          notesLink: editedData.notesLink,
          updatedBy: user.displayName,
          updatedAt: serverTimestamp(),
        });
        setEditingNote(null);
        setEditedData({
          notesCategory: {
            branch: [],
            subjectName: [],
            year: ''
          },
          notesTitle: '',
          contributorName: '',
          notesLink: ''
        });
        getNoteData();
        toast.success('Changes Saved!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Error saving data: ${error.message}`);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      if (isGhost) {
        const noteRef = doc(db, 'Notes', noteId);
        await deleteDoc(noteRef);
        getNoteData();
        toast.success('Deleted data!');
      } else {
        toast('Unauthorized Access!', { icon: '🚫' });
      }
    } catch (error) {
      toast.error(`Error deleting data: ${error.message}`);
    }
  };

  const filterNoteData = (filterValues) => {
    const filtered = noteData.filter((doc) => {
      const { branch, year } = doc.notesCategory || {};
      const title = doc.notesTitle || '';

      const branchMatch = filterValues.branch
        ? branch && branch.includes(filterValues.branch)
        : true;

      const searchMatch = filterValues.searchQuery
        ? title.toLowerCase().includes(filterValues.searchQuery.toLowerCase())
        : true;

      return (
        branchMatch &&
        (filterValues.year ? year === filterValues.year : true) &&
        searchMatch
      );
    });
    setFilteredData(filtered);
  };

  const handleLinkChange = (e) => {
    let modifiedLink = e.target.value;
    if (modifiedLink.includes("/view?usp=drive_link")) {
      modifiedLink = modifiedLink.replace(/\/view\?usp=drive_link$/, '/preview');
    }
    setEditedData(prev => ({
      ...prev,
      notesLink: modifiedLink
    }));
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
      <h6 className='text-xs text-black text-center bg-amber-200 border rounded-4xl mb-2'>Institution Filter Is Inactive on This Page!</h6>

      <FilterComponent
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions}
        onFilterChange={filterNoteData}
      />

      <div className="space-y-4">
        {filteredData.map((doc) => {
          const notesCategory = doc.notesCategory || {};
          return (
            <div key={doc.id} className="bg-sky-100 shadow-lg rounded-lg p-4 flex flex-col items-start">
              {editingNote === doc.id ? (
                <div className="w-full max-w-5xl mx-auto p-4">
                  {/* Notes Title */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Notes Title</label>
                    <input
                      type="text"
                      value={editedData.notesTitle}
                      onChange={(e) => setEditedData(prev => ({ ...prev, notesTitle: e.target.value }))}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
                      required
                    />
                  </div>

                  {/* Contributor Name */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Contributor Name</label>
                    <Select
                      name="contributorName"
                      isClearable
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

                  {/* Branches Drop Down */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Branch</label>
                    <Select
                      name="branch"
                      isMulti
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={branches}
                      value={branches.filter((b) => editedData.notesCategory.branch.includes(b.value))}
                      onChange={(selected) =>
                        setEditedData(prev => ({
                          ...prev,
                          notesCategory: {
                            ...prev.notesCategory,
                            branch: selected.map((s) => s.value),
                          }
                        }))
                      }
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Branch(es)"
                    />
                  </div>

                  {/* Subject Names */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Subject Name</label>
                    <Select
                      name="subjectName"
                      isMulti
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={subjects}
                      value={subjects.filter((s) => editedData.notesCategory.subjectName.includes(s.value))}
                      onChange={(selected) =>
                        setEditedData(prev => ({
                          ...prev,
                          notesCategory: {
                            ...prev.notesCategory,
                            subjectName: selected.map((s) => s.value),
                          }
                        }))
                      }
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Subject(s)"
                    />
                  </div>

                  {/* Year DropDown */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Year</label>
                    <Select
                      name="year"
                      isClearable
                      components={animatedComponents}
                      options={years}
                      value={years.find((y) => y.value === editedData.notesCategory.year)}
                      onChange={(selected) =>
                        setEditedData(prev => ({
                          ...prev,
                          notesCategory: {
                            ...prev.notesCategory,
                            year: selected ? selected.value : '',
                          }
                        }))
                      }
                      className="w-full md:w-3/4 mt-2 md:mt-0 text-black"
                      placeholder="Select Year"
                    />
                  </div>

                  {/* Notes Link */}
                  <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-black w-full md:w-1/4">Notes Link</label>
                    <input
                      type="url"
                      value={editedData.notesLink}
                      onChange={handleLinkChange}
                      className="border p-2 w-full md:w-3/4 mt-2 md:mt-0"
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
                  <p className='text-gray-700'>Contributor Name: {doc.contributorName}</p>
                  {notesCategory.subjectName && (
                    <p className="text-gray-700">Subject Name: {Array.isArray(notesCategory.subjectName) ? notesCategory.subjectName.join(', ') : ''}</p>
                  )}
                  {notesCategory.branch && (
                    <p className="text-gray-700">Branch: {Array.isArray(notesCategory.branch) ? notesCategory.branch.join(', ') : ''}</p>
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
  ) : <AccessForbidden />;
}

export default MyNotes;