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
              <div key={note.id} className="p-4 bg-gray-100 mb-2 flex flex-col items-start border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100">
                <h2 className="text-base sm:text-lg md:text-xl font-medium mb-1 text-indigo-800">{note.notesTitle}</h2>
                <p className='text-xs sm:text-sm md:text-base text-gray-700'>Contributor Name: {note.contributorName}</p>
                {note.notesCategory.subjectName && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">Subject Name: {Array.isArray(note.notesCategory.subjectName) ? note.notesCategory.subjectName.join(', ') : ''}</p>
                )}
                {note.notesCategory.branch && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">Branch: {Array.isArray(note.notesCategory.branch) ? note.notesCategory.branch.join(', '): ''}</p>
                )}
                {note.notesCategory.year && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">Year: {note.notesCategory.year}</p>
                )}
                  <div className="mt-2 mb-1 flex justify-center">
                    <button onClick={() => openPdfViewer(note .notesLink)} className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition">
                        <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
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