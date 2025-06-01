import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import PdfViewer from '../../components/student/PdfViewer';
import NotesFilter from '../../components/student/NotesFilter';
import { AppContext } from '../../context/AppContext';
import Rating from '../../components/student/Rating';
import { db, doc, getDoc, updateDoc } from "../../config/firebase";
import { useAuth } from '../../context/AuthContext';

const Notes = () => {
  const [notesData, setNotesData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(true);

  //LazyLoad
  const [visibleCount, setVisibleCount] = useState(3);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { toast } = useContext(AppContext)
  const { isGhost, user } = useAuth();
  
  const openPdfViewer = (url) => {
    setPdfUrl(url); // Set the PDF URL to be displayed in the viewer
  };

  const closePdfViewer = () => {
    setPdfUrl(null); // Close the viewer by setting PDF URL to null
  };

  const handleNoteRating = async (noteId, newRating) => {
    try {
      const userId = user?.uid
      if (!userId) return toast.error("You must be logged in to rate");
  
      const noteRef = doc(db, "Notes", noteId)
      const noteSnap = await getDoc(noteRef)
      if (!noteSnap.exists()) return toast.error("Note not found")
  
      const noteData = noteSnap.data()
      // const existingRatings = noteData.ratings || []
      const existingRatings = noteData.notesRatings || []
  
      const alreadyRated = existingRatings.find(r => r.userId === userId)
  
      let updatedRatings
      if (alreadyRated) {
        // Remove old rating and add new one
        updatedRatings = existingRatings.map(r =>
          r.userId === userId ? { ...r, rating: newRating } : r
        )
      } else {
        updatedRatings = [...existingRatings, { userId, rating: newRating }]
      }
  
      await updateDoc(noteRef, { notesRatings: updatedRatings })
      toast.success("Thank You for Rating!")
  
      // To update UI with latest rating.
      setNotesData(prev =>
        prev.map(note =>
          note.id === noteId ? { ...note, notesRatings: updatedRatings } : note
        )
      )
  
    } catch (error) {
      toast(error.message)
    }
  }

  useEffect(() => {
    if (showFilter) {
      toast.dismiss();
      toast.custom(
        (t) => (
          <div
            onClick={() => toast.remove(t.id)}
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } cursor-pointer max-w-xs w-auto bg-yellow-100 text-yellow-800 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center px-6 py-2`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium">Apply filter to get data!</p>
            </div>
          </div>
        ),
        {
          duration: 1000,
          position: "top-right"
        }
      );
    }
  }, [showFilter]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !isFetchingMore && visibleCount < notesData.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10);
          setIsFetchingMore(false);
        }, 500);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, isFetchingMore, notesData]);
  

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
                toast.dismiss();
                setNotesData([]);
              }}
              className="text-white px-4 py-2 rounded border-white border-2 bg-yellow-500 hover:bg-purple-700"
            >
              Change Filters
            </button>
          </div>
        )}

      <div className="max-w-6xl mx-auto p-4">
        <div className="space-y-4">
          {notesData.length > 0 && notesData.slice(0, visibleCount).map((note) => (
            <div
              key={note.id}
              className="p-4 bg-gray-100 mb-2 flex flex-col border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100"
            >
              {/* Title + Rating stars (desktop only) */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                <h2 className="text-base sm:text-lg md:text-xl font-medium mb-1 text-indigo-800">
                  {note.notesTitle}
                </h2>

                {/* Desktop only: Rating stars */}
                <div className="hidden md:flex items-center gap-2">
                  <Rating
                    initialRating={note.notesRatings?.find(r => r.userId === user?.uid)?.rating || 0}
                    onRate={(rating) => handleNoteRating(note.id, rating)}
                    size={20}
                  />
                </div>
              </div>

              {/* Other Info */}
              <p className="text-xs sm:text-sm md:text-base text-gray-700">
                Contributor Name: {note.contributorName}
              </p>
              {note.notesCategory.subjectName && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                  Subject Name: {Array.isArray(note.notesCategory.subjectName) ? note.notesCategory.subjectName.join(', ') : ''}
                </p>
              )}
              {note.notesCategory.branch && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                  Branch: {Array.isArray(note.notesCategory.branch) ? note.notesCategory.branch.join(', ') : ''}
                </p>
              )}
              {note.notesCategory.year && (
                <p className="text-xs sm:text-sm md:text-base text-gray-700">
                  Year: {note.notesCategory.year}
                </p>
              )}

              {/* Mobile only: Avg Rating + Stars */}
              <div className="block md:hidden mt-2">
                {note.notesRatings?.length > 0 && (
                  <p className="text-xs sm:text-sm text-indigo-700 font-bold">
                    Avg. Rating: {(
                      note.notesRatings.reduce((acc, r) => acc + r.rating, 0) / note.notesRatings.length
                    ).toFixed(1)} / 5
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Rating
                    initialRating={note.notesRatings?.find(r => r.userId === user?.uid)?.rating || 0}
                    onRate={(rating) => handleNoteRating(note.id, rating)}
                    size={20}
                  />
                </div>
              </div>

              {/* Bottom Row: View button + Avg Rating (desktop only) */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-2">
                <div className="flex justify-center">
                  <button
                    onClick={() => openPdfViewer(note.notesLink)}
                    className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                  >
                    <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
                    View Notes
                  </button>
                </div>

                {/* Desktop only: Avg Rating */}
                {note.notesRatings?.length > 0 && (
                  <p className="hidden md:block text-xs sm:text-sm md:text-base text-indigo-700 font-bold mt-1 md:mt-0">
                    Avg. Rating: {(
                      note.notesRatings.reduce((acc, r) => acc + r.rating, 0) / note.notesRatings.length
                    ).toFixed(1)} / 5
                  </p>
                )}
              </div>

              {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
            </div>
          ))}

          {isFetchingMore && (
            <div className="flex justify-center py-4">
              <div className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>    
    </div>
  );
};

export default Notes