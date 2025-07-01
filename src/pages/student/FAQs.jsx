// import React, { useContext, useEffect, useState } from "react";
// import FAQsFilter from "../../components/student/FAQsFilter";
// import PdfViewer from "../../components/student/PdfViewer";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";
// import { useAuth } from '../../context/AuthContext';
// import { db, doc, getDoc, updateDoc } from "../../config/firebase";
// import Rating from "../../components/student/Rating";

// const FAQs = () => {
//   const [faqsData, setFaqsData] = useState([]);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [showFilter, setShowFilter] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const { user } = useAuth();

//   const [visibleCount, setVisibleCount] = useState(3); // To track how many items are visible
//   const [isFetchingMore, setIsFetchingMore] = useState(false); // To track if we're fetching more items


//   const { toast } = useContext(AppContext);

//   const openPdfViewer = (url) => {
//     setPdfUrl(url);
//   };

//   const closePdfViewer = () => {
//     setPdfUrl(null);
//   };

//   const handleFaqRating = async (faqId, newRating) => {
//     try {
//       const userId = user?.uid;
//       if (!userId) return toast.error("You must be logged in to rate");

//       const faqRef = doc(db, "FAQs", faqId);
//       const faqSnap = await getDoc(faqRef);
//       if (!faqSnap.exists()) return toast.error("FAQ not found");

//       const faqData = faqSnap.data();
//       const existingRatings = faqData.faqsRatings || [];

//       const alreadyRated = existingRatings.find(r => r.userId === userId);

//       let updatedRatings;
//       if (alreadyRated) {
//         updatedRatings = existingRatings.map(r =>
//           r.userId === userId ? { ...r, rating: newRating } : r
//         );
//       } else {
//         updatedRatings = [...existingRatings, { userId, rating: newRating }];
//       }

//       await updateDoc(faqRef, { faqsRatings: updatedRatings });
//       toast.success("Thank you for rating!");

//       setFaqsData(prev =>
//         prev.map(faq =>
//           faq.id === faqId ? { ...faq, faqsRatings: updatedRatings } : faq
//         )
//       );
//     } catch (error) {
//       toast(error.message);
//     }
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

//   useEffect(() => {
//     const handleScroll = () => {
//       const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
//       if (bottom && !isFetchingMore && visibleCount < faqsData.length) {
//         setIsFetchingMore(true);
//         setTimeout(() => {
//           setVisibleCount((prev) => prev + 10); // Increase the number of visible FAQs by 10
//           setIsFetchingMore(false);
//         }, 500); // Simulate delay
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [visibleCount, isFetchingMore, faqsData]);


//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-b from-purple-500 to-transparent">
//       {showFilter && (
//         <FAQsFilter
//           onResults={(data) => {
//             setFaqsData(data);
//             setShowFilter(false);
//             setLoading(false);
//           }}
//         />
//       )}

//       {!showFilter && (
//         <div className="mb-4 text-right max-w-6xl mx-auto">
//           <button
//             onClick={() => {
//               setShowFilter(true);
//               toast.dismiss();
//               setFaqsData([]);
//             }}
//             className="text-white px-4 py-2 rounded border-white border-2 bg-yellow-500 hover:bg-purple-700"
//           >
//             Change Filters
//           </button>
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto p-4">
//         <div className="space-y-4">
//           {faqsData.length > 0 &&
//             faqsData.slice(0, visibleCount).map((item) => (
//               <div
//                 key={item.id}
//                 className="p-4 bg-gray-100 mb-2 flex flex-col border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100"
//               >
//                 {/* Title + Rating stars (desktop only) */}
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
//                   <h2 className="text-base sm:text-lg md:text-xl font-medium mb-1 text-indigo-800">
//                     {item.faqsTitle}
//                   </h2>

//                   {/* Desktop only: Rating stars */}
//                   <div className="hidden md:flex items-center gap-2">
//                     <Rating
//                       initialRating={item.faqsRatings?.find(r => r.userId === user?.uid)?.rating || 0}
//                       onRate={(rating) => handleFaqRating(item.id, rating)}
//                       size={20}
//                     />
//                   </div>
//                 </div>

//                 {/* Other Info */}
//                 {item.faqsCategory?.contributorName && (
//                   <p className="text-xs sm:text-sm md:text-base text-gray-700">
//                     Contributor: {item.faqsCategory.contributorName}
//                   </p>
//                 )}
//                 {item.faqsCategory?.branch && (
//                   <p className="text-xs sm:text-sm md:text-base text-gray-700">
//                     Branch: {Array.isArray(item.faqsCategory.branch)
//                       ? item.faqsCategory.branch.join(", ")
//                       : item.faqsCategory.branch}
//                   </p>
//                 )}
//                 {item.faqsCategory?.institution && (
//                   <p className="text-xs sm:text-sm md:text-base text-gray-700">
//                     Institution: {item.faqsCategory.institution}
//                   </p>
//                 )}
//                 {item.faqsCategory?.subjectName && (
//                   <p className="text-xs sm:text-sm md:text-base text-gray-700">
//                     Subject: {item.faqsCategory.subjectName}
//                   </p>
//                 )}
//                 {item.faqsCategory?.year && (
//                   <p className="text-xs sm:text-sm md:text-base text-gray-700">
//                     Year: {item.faqsCategory.year}
//                   </p>
//                 )}

//                 {/* Mobile only: Avg Rating + Stars */}
//                 <div className="block md:hidden mt-2">
//                   {item.faqsRatings?.length > 0 && (
//                     <p className="text-xs sm:text-sm text-indigo-700 font-bold">
//                       Avg. Rating: {(
//                         item.faqsRatings.reduce((acc, r) => acc + r.rating, 0) / item.faqsRatings.length
//                       ).toFixed(1)} / 5
//                     </p>
//                   )}
//                   <div className="flex items-center gap-2 mt-1">
//                     <Rating
//                       initialRating={item.faqsRatings?.find(r => r.userId === user?.uid)?.rating || 0}
//                       onRate={(rating) => handleFaqRating(item.id, rating)}
//                       size={20}
//                     />
//                   </div>
//                 </div>

//                 {/* Bottom Row: View button + Avg Rating (desktop only) */}
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-2">
//                   <div className="flex justify-center">
//                     <button
//                       onClick={() => openPdfViewer(item.faqsLink)}
//                       className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
//                     >
//                       <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
//                       View FAQs
//                     </button>
//                   </div>

//                   {/* Desktop only: Avg Rating */}
//                   {item.faqsRatings?.length > 0 && (
//                     <p className="hidden md:block text-xs sm:text-sm md:text-base text-indigo-700 font-bold mt-1 md:mt-0">
//                       Avg. Rating: {(
//                         item.faqsRatings.reduce((acc, r) => acc + r.rating, 0) / item.faqsRatings.length
//                       ).toFixed(1)} / 5
//                     </p>
//                   )}
//                 </div>

//                 {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
//               </div>
//             ))}

//           {/* Loading Spinner */}
//           {isFetchingMore && (
//             <div className="flex justify-center py-4">
//               <div className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FAQs;













import React, { useContext, useEffect, useState } from "react";
import FAQsFilter from "../../components/student/FAQsFilter";
import PdfViewer from "../../components/student/PdfViewer";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useAuth } from '../../context/AuthContext';
import { db, doc, getDoc, updateDoc } from "../../config/firebase";
import Rating from "../../components/student/Rating";

const FAQs = () => {
  const [faqsData, setFaqsData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useContext(AppContext);

  const [visibleCount, setVisibleCount] = useState(3);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const openPdfViewer = (url) => {
    setPdfUrl(url);
  };

  const closePdfViewer = () => {
    setPdfUrl(null);
  };

  const handleFaqRating = async (faqId, newRating) => {
    try {
      const userId = user?.uid;
      if (!userId) return toast.error("You must be logged in to rate");

      const faqRef = doc(db, "FAQs", faqId);
      const faqSnap = await getDoc(faqRef);
      if (!faqSnap.exists()) return toast.error("FAQ not found");

      const faqData = faqSnap.data();
      const existingRatings = faqData.faqsRatings || [];

      const alreadyRated = existingRatings.find(r => r.userId === userId);

      let updatedRatings;
      if (alreadyRated) {
        updatedRatings = existingRatings.map(r =>
          r.userId === userId ? { ...r, rating: newRating } : r
        );
      } else {
        updatedRatings = [...existingRatings, { userId, rating: newRating }];
      }

      await updateDoc(faqRef, { faqsRatings: updatedRatings });
      toast.success("Thank you for rating!");

      setFaqsData(prev =>
        prev.map(faq =>
          faq.id === faqId ? { ...faq, faqsRatings: updatedRatings } : faq
        )
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBookmarkToggle = async (faqId) => {
    try {
      const userId = user?.uid;
      if (!userId) return toast.error("You must be logged in to bookmark");

      const userRef = doc(db, "Users", userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return toast.error("User not found");

      const userData = userSnap.data();
      const bookmarkedFAQs = userData.bookmarkedFAQs || [];

      const isBookmarked = bookmarkedFAQs.includes(faqId);

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
                    const updatedBookmarks = bookmarkedFAQs.filter(
                      (id) => id !== faqId
                    );
                    await updateDoc(userRef, { bookmarkedFAQs: updatedBookmarks });
                    toast.success("Removed from bookmarks!");
                    setFaqsData((prev) =>
                      prev.map((item) =>
                        item.id === faqId ? { ...item, isBookmarked: false } : item
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
        if (bookmarkedFAQs.length >= 10) {
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
                    const updatedBookmarks = [...bookmarkedFAQs, faqId];
                    await updateDoc(userRef, { bookmarkedFAQs: updatedBookmarks });
                    toast.success("Added to bookmarks!");
                    setFaqsData((prev) =>
                      prev.map((item) =>
                        item.id === faqId ? { ...item, isBookmarked: true } : item
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
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !isFetchingMore && visibleCount < faqsData.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10);
          setIsFetchingMore(false);
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, isFetchingMore, faqsData]);

  useEffect(() => {
    if (user?.uid && faqsData.length > 0) {
      const userRef = doc(db, "Users", user.uid);
      getDoc(userRef)
        .then((userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const bookmarkedFAQs = userData.bookmarkedFAQs || [];
            setFaqsData((prev) =>
              prev.map((item) => ({
                ...item,
                isBookmarked: bookmarkedFAQs.includes(item.id),
              }))
            );
          }
        })
        .catch((error) => {
          toast.error("Error fetching bookmarks: " + error.message);
        });
    }
  }, [user, faqsData.length, toast]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-500 to-transparent">
      {showFilter && (
        <FAQsFilter
          onResults={(data) => {
            setFaqsData(data);
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
              setFaqsData([]);
            }}
            className="text-white px-4 py-2 rounded border-white border-2 bg-yellow-500 hover:bg-purple-700"
          >
            Change Filters
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4">
        <div className="space-y-4">
          {faqsData.length > 0 &&
            faqsData.slice(0, visibleCount).map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-100 mb-2 flex flex-col border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100"
              >
                {/* First Row: Title + Rating Stars (desktop) + Bookmark Button */}
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-base sm:text-lg md:text-xl font-medium text-indigo-800">
                    {item.faqsTitle}
                  </h2>
                  <div className="hidden md:flex items-center gap-20">
                    <Rating
                      initialRating={item.faqsRatings?.find(r => r.userId === user?.uid)?.rating || 0}
                      onRate={(rating) => handleFaqRating(item.id, rating)}
                      size={20}
                    />
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
                </div>

                {/* Other Info */}
                {item.faqsCategory?.contributorName && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Contributor: {item.faqsCategory.contributorName}
                  </p>
                )}
                {item.faqsCategory?.branch && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Branch: {Array.isArray(item.faqsCategory.branch)
                      ? item.faqsCategory.branch.join(", ")
                      : item.faqsCategory.branch}
                  </p>
                )}
                {item.faqsCategory?.institution && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Institution: {item.faqsCategory.institution}
                  </p>
                )}
                {item.faqsCategory?.subjectName && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Subject: {item.faqsCategory.subjectName}
                  </p>
                )}
                {item.faqsCategory?.year && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    Year: {item.faqsCategory.year}
                  </p>
                )}

                {/* Mobile only: Avg Rating + Stars + Bookmark */}
                <div className="block md:hidden mt-2">
                  {item.faqsRatings?.length > 0 && (
                    <p className="text-xs sm:text-sm text-indigo-700 font-bold">
                      Avg. Rating: {(
                        item.faqsRatings.reduce((acc, r) => acc + r.rating, 0) / item.faqsRatings.length
                      ).toFixed(1)} / 5
                    </p>
                  )}
                  <div className="flex items-center gap-30 mt-1">
                    <Rating
                      initialRating={item.faqsRatings?.find(r => r.userId === user?.uid)?.rating || 0}
                      onRate={(rating) => handleFaqRating(item.id, rating)}
                      size={20}
                    />
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
                </div>

                {/* Bottom Row: View button + Avg Rating (desktop only) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-2">
                  <div className="flex justify-center">
                    <button
                      onClick={() => openPdfViewer(item.faqsLink)}
                      className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                    >
                      <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
                      View FAQs
                    </button>
                  </div>

                  {item.faqsRatings?.length > 0 && (
                    <p className="hidden md:block text-xs sm:text-sm md:text-base text-indigo-700 font-bold mt-1 md:mt-0">
                      Avg. Rating: {(
                        item.faqsRatings.reduce((acc, r) => acc + r.rating, 0) / item.faqsRatings.length
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

export default FAQs;