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

  const [visibleCount, setVisibleCount] = useState(3); // To track how many items are visible
  const [isFetchingMore, setIsFetchingMore] = useState(false); // To track if we're fetching more items


  const { toast } = useContext(AppContext);

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
      toast(error.message);
    }
  };
  

  useEffect(() => {
    if (showFilter) {
      toast("Apply filter to get data!", { icon: "⚠️", duration: 1000 });
    }
  }, [showFilter]);

useEffect(() => {
    if (showFilter) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col sm:flex-row ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-full p-4">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  className="h-8 w-8 sm:h-8 sm:w-8 rounded-full"
                  src={assets.tte_transparent_logo}
                  alt="Warning"
                />
                <p className="text-sm sm:text-base font-medium text-gray-900">
                  Please review the following points:
                </p>
              </div>
  
              <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-700 space-y-2 pl-5">
                <li>
                  For accessing <strong>"First Year"</strong> Syllabus/ PYQs/ FAQs/ Notes, please select <strong>"General Science & Humanities"</strong> as branch. Other branches won't return First Year data.
                </li>
                <li>
                  Each filter application increases API reads and affects billing 💸. Kindly avoid unnecessary filter requests 🙏.
                </li>
              </ol>
            </div>
            <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200">
              <button
                onClick={() => toast.remove(t.id)}
                className="w-full h-full border border-transparent rounded-b-lg sm:rounded-b-none sm:rounded-r-lg p-4 flex items-center justify-center text-xs sm:text-sm font-medium text-indigo-500 hover:text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: 'bottom-center',
        }
      )
    }
  }, [showFilter, toast])

  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !isFetchingMore && visibleCount < faqsData.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10); // Increase the number of visible FAQs by 10
          setIsFetchingMore(false);
        }, 500); // Simulate delay
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, isFetchingMore, faqsData]);
  

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
                {/* Title + Rating stars (desktop only) */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                  <h2 className="text-base sm:text-lg md:text-xl font-medium mb-1 text-indigo-800">
                    {item.faqsTitle}
                  </h2>

                  {/* Desktop only: Rating stars */}
                  <div className="hidden md:flex items-center gap-2">
                    <Rating
                      initialRating={item.faqsRatings?.find(r => r.userId === user?.uid)?.rating || 0}
                      onRate={(rating) => handleFaqRating(item.id, rating)}
                      size={20}
                    />
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

                {/* Mobile only: Avg Rating + Stars */}
                <div className="block md:hidden mt-2">
                  {item.faqsRatings?.length > 0 && (
                    <p className="text-xs sm:text-sm text-indigo-700 font-bold">
                      Avg. Rating: {(
                        item.faqsRatings.reduce((acc, r) => acc + r.rating, 0) / item.faqsRatings.length
                      ).toFixed(1)} / 5
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Rating
                      initialRating={item.faqsRatings?.find(r => r.userId === user?.uid)?.rating || 0}
                      onRate={(rating) => handleFaqRating(item.id, rating)}
                      size={20}
                    />
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

                  {/* Desktop only: Avg Rating */}
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

          {/* Loading Spinner */}
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
