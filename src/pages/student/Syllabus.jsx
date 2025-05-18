import React, { useContext, useEffect, useState } from "react";
import SyllabusFilter from "../../components/student/SyllabusFilter";
import PdfViewer from "../../components/student/PdfViewer";
import { assets } from "../../assets/assets";
import Loader from '../../components/student/Loading'
import { AppContext } from "../../context/AppContext";

const Syllabus = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false); 

  //LazyLoad
  const [visibleCount, setVisibleCount] = useState(3); // Initial number of cards
  const [isFetchingMore, setIsFetchingMore] = useState(false);


  const { toast } = useContext(AppContext);

  const openPdfViewer = (url) => {
    setPdfUrl(url); // Set the PDF URL to be displayed in the viewer
  };

  const closePdfViewer = () => {
    setPdfUrl(null); // Close the viewer by setting PDF URL to null
  };

  useEffect(() => {
    if (showFilter) {
      toast.dismiss(); // Dismiss all existing toasts once
  
      // Show simple warning toast
      toast("Apply filter to get data!", {
        icon: "⚠️",
        duration: 1000,
      });
  
      // Show custom info toast
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
      );
    }
  }, [showFilter, toast, assets.tte_transparent_logo]);

  //LazyLoad
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !isFetchingMore && visibleCount < syllabusData.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10); // Load 10 more cards
          setIsFetchingMore(false);
        }, 500); // simulate slight delay
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, isFetchingMore, syllabusData]);
  

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-500 to-transparent">
      {showFilter && <SyllabusFilter onResults={(data) => {
        setSyllabusData(data)
        setShowFilter(false)
        setLoading(false);
      }}/>}
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
          {syllabusData.length > 0 && (
          syllabusData.slice(0, visibleCount).map((item) => (
            <div key={item.id} className="p-4 bg-gray-100 mb-2 flex flex-col items-start border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100">
            <h2 className="text-base sm:text-lg md:text-xl font-medium mb-1 text-indigo-800">{item.syllabusTitle}</h2>
            {item.syllabusCategory.academicYear && (
              <p className="text-xs sm:text-sm md:text-base text-gray-700">Academic Year: {item.syllabusCategory.academicYear}</p>
            )}
            {item.syllabusCategory.branch && (
              <p className="text-xs sm:text-sm md:text-base text-gray-700">Branch: {item.syllabusCategory.branch}</p>
            )}
            {item.syllabusCategory.institution && (
              <p className="text-xs sm:text-sm md:text-base text-gray-700">Institution: {item.syllabusCategory.institution}</p>
            )}
            {item.syllabusCategory.year && (
              <p className="text-xs sm:text-sm md:text-base text-gray-700">Year: {item.syllabusCategory.year}</p>
            )}
            <div className="mt-2 mb-1 flex justify-center">
              <button onClick={() => openPdfViewer(item.syllabusLink)} className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition">
                <img src={assets.view_data} alt="view" className="w-5 h-5 mr-2" />
                  <span className="hidden md:inline">View Syllabus</span>
              </button>
            </div>
              {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
            </div>
          )))}
            {/* {isFetchingMore && (
              <div className="text-center py-4 text-indigo-700 text-lg font-medium">
                Fetching more
                <span className="inline-block animate-bounce [animation-delay:0s]">.</span>
                <span className="inline-block animate-bounce [animation-delay:0.1s]">.</span>
                <span className="inline-block animate-bounce [animation-delay:0.2s]">.</span>
              </div>
            )} */}
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
