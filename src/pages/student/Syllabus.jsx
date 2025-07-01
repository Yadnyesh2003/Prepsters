// import React, { useContext, useEffect, useState } from "react";
// import SyllabusFilter from "../../components/student/SyllabusFilter";
// import PdfViewer from "../../components/student/PdfViewer";
// import { assets } from "../../assets/assets";
// import Loader from '../../components/student/Loading'
// import { AppContext } from "../../context/AppContext";

// const Syllabus = () => {
//   const [syllabusData, setSyllabusData] = useState([]);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [showFilter, setShowFilter] = useState(true);
//   const [loading, setLoading] = useState(false); 

//   //LazyLoad
//   const [visibleCount, setVisibleCount] = useState(3); // Initial number of cards
//   const [isFetchingMore, setIsFetchingMore] = useState(false);


//   const { toast } = useContext(AppContext);

//   const openPdfViewer = (url) => {
//     setPdfUrl(url); // Set the PDF URL to be displayed in the viewer
//   };

//   const closePdfViewer = () => {
//     setPdfUrl(null); // Close the viewer by setting PDF URL to null
//   };

//   useEffect(() => {
//     if (showFilter) {
//       toast.dismiss();
//       toast.custom(
//         (t) => (
//           <div
//             onClick={() => toast.remove(t.id)}
//             className={`${
//               t.visible ? "animate-enter" : "animate-leave"
//             } cursor-pointer max-w-xs w-auto bg-yellow-100 text-yellow-800 shadow-lg rounded-lg pointer-events-auto flex items-center justify-center px-6 py-2`}
//           >
//             <div className="flex items-center space-x-2">
//               <span className="text-xl">⚠️</span>
//               <p className="text-sm font-medium">Apply filter to get data!</p>
//             </div>
//           </div>
//         ),
//         {
//           duration: 1000,
//           position: "top-right"
//         }
//       );
//     }
//   }, [showFilter]);

//   //LazyLoad
//   useEffect(() => {
//     const handleScroll = () => {
//       const bottom =
//         window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
//       if (bottom && !isFetchingMore && visibleCount < syllabusData.length) {
//         setIsFetchingMore(true);
//         setTimeout(() => {
//           setVisibleCount((prev) => prev + 10); // Load 10 more cards
//           setIsFetchingMore(false);
//         }, 500); // simulate slight delay
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [visibleCount, isFetchingMore, syllabusData]);


//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-b from-purple-500 to-transparent">
//       {showFilter && <SyllabusFilter onResults={(data) => {
//         setSyllabusData(data)
//         setShowFilter(false)
//         setLoading(false);
//       }}/>}
//         {!showFilter && (
//           <div className="mb-4 text-right max-w-6xl mx-auto">
//             <button
//               onClick={() => {
//                 setShowFilter(true);
//                 toast.dismiss();
//                 setSyllabusData([]);
//               }}
//               className="text-white px-4 py-2 rounded border-white border-2 bg-yellow-500 hover:bg-purple-700"
//             >
//               Change Filters
//             </button>
//           </div>
//         )}
//       <div className="max-w-6xl mx-auto p-4">
//         {loading ? (
//           <Loader />
//         ) : (
//           <div className="space-y-4">
//           {syllabusData.length > 0 && (
//           syllabusData.slice(0, visibleCount).map((item) => (
//             <div key={item.id} className="p-4 bg-gray-100 mb-2 flex flex-col items-start border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100">
//             <h2 className="text-base sm:text-lg md:text-xl font-medium mb-1 text-indigo-800">{item.syllabusTitle}</h2>
//             {item.syllabusCategory.academicYear && (
//               <p className="text-xs sm:text-sm md:text-base text-gray-700">Academic Year: {item.syllabusCategory.academicYear}</p>
//             )}
//             {item.syllabusCategory.branch && (
//               <p className="text-xs sm:text-sm md:text-base text-gray-700">Branch: {item.syllabusCategory.branch}</p>
//             )}
//             {item.syllabusCategory.institution && (
//               <p className="text-xs sm:text-sm md:text-base text-gray-700">Institution: {item.syllabusCategory.institution}</p>
//             )}
//             {item.syllabusCategory.year && (
//               <p className="text-xs sm:text-sm md:text-base text-gray-700">Year: {item.syllabusCategory.year}</p>
//             )}
//             <div className="mt-2 mb-1 flex justify-center">
//               <button onClick={() => openPdfViewer(item.syllabusLink)} className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition">
//                 <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
//                   View Syllabus
//               </button>
//             </div>
//               {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
//             </div>
//           )))}
//             {/* {isFetchingMore && (
//               <div className="text-center py-4 text-indigo-700 text-lg font-medium">
//                 Fetching more
//                 <span className="inline-block animate-bounce [animation-delay:0s]">.</span>
//                 <span className="inline-block animate-bounce [animation-delay:0.1s]">.</span>
//                 <span className="inline-block animate-bounce [animation-delay:0.2s]">.</span>
//               </div>
//             )} */}
//             {isFetchingMore && (
//               <div className="flex justify-center py-4">
//                 <div className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
//               </div>
//             )}
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Syllabus;








import React, { useContext, useEffect, useState } from "react";
import SyllabusFilter from "../../components/student/SyllabusFilter";
import PdfViewer from "../../components/student/PdfViewer";
import { assets } from "../../assets/assets";
import Loader from '../../components/student/Loading';
import { AppContext } from "../../context/AppContext";
import { useAuth } from '../../context/AuthContext';
import { db, doc, getDoc, updateDoc } from "../../config/firebase";

const Syllabus = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false);

  // LazyLoad
  const [visibleCount, setVisibleCount] = useState(3);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { toast } = useContext(AppContext);
  const { user } = useAuth();

  const openPdfViewer = (url) => {
    setPdfUrl(url);
  };

  const closePdfViewer = () => {
    setPdfUrl(null);
  };

  const handleBookmarkToggle = async (syllabusId) => {
    try {
      const userId = user?.uid;
      if (!userId) return toast.error("You must be logged in to bookmark");

      const userRef = doc(db, "Users", userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return toast.error("User not found");

      const userData = userSnap.data();
      const bookmarkedSyllabus = userData.bookmarkedSyllabus || [];

      const isBookmarked = bookmarkedSyllabus.includes(syllabusId);

      if (isBookmarked) {
        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"
                } max-w-xs w-auto bg-red-100 text-red-800 shadow-lg rounded-lg pointer-events-auto flex flex-col items-center justify-center px-6 py-4`}
            >
              <p className="text-sm font-medium">Remove from bookmarks?</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={async () => {
                    const updatedBookmarks = bookmarkedSyllabus.filter(
                      (id) => id !== syllabusId
                    );
                    await updateDoc(userRef, { bookmarkedSyllabus: updatedBookmarks });
                    toast.success("Removed from bookmarks!");
                    setSyllabusData((prev) =>
                      prev.map((item) =>
                        item.id === syllabusId ? { ...item, isBookmarked: false } : item
                      )
                    );
                    toast.dismiss(t.id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          { duration: Infinity, position: "top-right" }
        );
      } else {
        if (bookmarkedSyllabus.length >= 10) {
          return toast.error(
            "Bookmark limit reached (10). Remove some bookmarks to add new ones."
          );
        }

        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"
                } max-w-xs w-auto bg-green-100 text-green-800 shadow-lg rounded-lg pointer-events-auto flex flex-col items-center justify-center px-6 py-4`}
            >
              <p className="text-sm font-medium">Add to bookmarks?</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={async () => {
                    const updatedBookmarks = [...bookmarkedSyllabus, syllabusId];
                    await updateDoc(userRef, { bookmarkedSyllabus: updatedBookmarks });
                    toast.success("Added to bookmarks!");
                    setSyllabusData((prev) =>
                      prev.map((item) =>
                        item.id === syllabusId ? { ...item, isBookmarked: true } : item
                      )
                    );
                    toast.dismiss(t.id);
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Yes
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          { duration: Infinity, position: "top-right" }
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (showFilter) {
      toast.dismiss();
      toast.custom(
        (t) => (
          <div
            onClick={() => toast.remove(t.id)}
            className={`${t.visible ? "animate-enter" : "animate-leave"
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
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !isFetchingMore && visibleCount < syllabusData.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10);
          setIsFetchingMore(false);
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, isFetchingMore, syllabusData]);

  useEffect(() => {
    if (user?.uid && syllabusData.length > 0) {
      const userRef = doc(db, "Users", user.uid);
      getDoc(userRef)
        .then((userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const bookmarkedSyllabus = userData.bookmarkedSyllabus || [];
            setSyllabusData((prev) =>
              prev.map((item) => ({
                ...item,
                isBookmarked: bookmarkedSyllabus.includes(item.id),
              }))
            );
          }
        })
        .catch((error) => {
          toast.error("Error fetching bookmarks: " + error.message);
        });
    }
  }, [user, syllabusData.length, toast]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-500 to-transparent">
      {showFilter && (
        <SyllabusFilter
          onResults={(data) => {
            setSyllabusData(data);
            setShowFilter(false);
            setLoading(false);
          }}
        />
      )}
      {!showFilter && (
        <div className="mb-4 text-right max-w-6xl mx-auto">
          <button
            onClick={() => {
              setShowFilter(true);
              toast.dismiss();
              setSyllabusData([]);
            }}
            className="text-white px-4 py-2 rounded border-white border-2 bg-yellow-500 hover:bg-purple-700"
          >
            Change Filters
          </button>
        </div>
      )}
      <div className="max-w-6xl mx-auto p-4">
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {syllabusData.length > 0 &&
              syllabusData.slice(0, visibleCount).map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-100 mb-2 flex flex-col items-start border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100"
                >
                  {/* First Row: Title + Bookmark Button */}
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-base sm:text-lg md:text-xl font-medium text-indigo-800">
                      {item.syllabusTitle}
                    </h2>
                    <button onClick={() => handleBookmarkToggle(item.id)}>
                      <img
                        src={
                          item.isBookmarked
                            ? assets.bookmark_done
                            : assets.bookmark
                        }
                        alt="bookmark"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                  {item.syllabusCategory.academicYear && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Academic Year: {item.syllabusCategory.academicYear}
                    </p>
                  )}
                  {item.syllabusCategory.branch && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Branch: {item.syllabusCategory.branch}
                    </p>
                  )}
                  {item.syllabusCategory.institution && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Institution: {item.syllabusCategory.institution}
                    </p>
                  )}
                  {item.syllabusCategory.year && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Year: {item.syllabusCategory.year}
                    </p>
                  )}
                  <div className="mt-2 mb-1 flex justify-center">
                    <button
                      onClick={() => openPdfViewer(item.syllabusLink)}
                      className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                    >
                      <img
                        src={assets.view_data}
                        alt="view"
                        className="w-5 h-5 mr-2"
                      />
                      View Syllabus
                    </button>
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
        )}
      </div>
    </div>
  );
};

export default Syllabus;
