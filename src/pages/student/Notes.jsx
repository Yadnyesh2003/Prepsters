import React, { useState } from 'react'
import { assets } from '../../assets/assets';
import PdfViewer from '../../components/student/PdfViewer';
import NotesFilter from '../../components/student/NotesFilter';

const Notes = () => {
  const [notesData, setNotesData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  
  const openPdfViewer = (url) => {
    setPdfUrl(url); // Set the PDF URL to be displayed in the viewer
  };

  const closePdfViewer = () => {
    setPdfUrl(null); // Close the viewer by setting PDF URL to null
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-500 to-transparent">
      {showFilter && <NotesFilter onResults={(data) => {
        setNotesData(data);
        setShowFilter(false); 
      }} />}
        {!showFilter && (
          <div className="mb-4 text-right max-w-6xl mx-auto">
            <button
              onClick={() => {
                setShowFilter(true);
                setNotesData([]);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Change Filters
            </button>
          </div>
        )}
      <div className="max-w-6xl mx-auto p-4">
        <div className="space-y-4">
          {notesData.length > 0 ? (
            notesData.map((note) => (
              <div key={note.id} className="p-4 bg-gray-100 rounded mb-2 flex flex-col items-start">
                <h2 className="text-xl font-semibold">{note.notesTitle}</h2>
                <p className='text-gray-700'>Contributor Name: {note.contributorName}</p>
                {note.notesCategory.subjectName && (
                  <p className="text-gray-700">Subject Name: {Array.isArray(note.notesCategory.subjectName) ? note.notesCategory.subjectName.join(', ') : ''}</p>
                )}
                {note.notesCategory.branch && (
                  <p className="text-gray-700">Branch: {Array.isArray(note.notesCategory.branch) ? note.notesCategory.branch.join(', '): ''}</p>
                )}
                {note.notesCategory.year && (
                  <p className="text-gray-700">Year: {note.notesCategory.year}</p>
                )}
                  <div className="flex space-x-4 mt-2">
                    <button onClick={() => openPdfViewer(note .notesLink)} className="flex bg-indigo-500 text-white px-4 py-2 rounded-md hover:text-black">
                        <img src={assets.view_data} alt="view" className="w-6 h-6 mr-2" />
                          <span className="hidden md:inline">View Notes</span>
                    </button>
                  </div>
                  {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
              </div>
            ))
          ) : (
            null
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes