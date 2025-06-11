import React, { useContext, useEffect, useState } from "react";
import PYQsFilter from "../../components/student/PYQsFilter";
import PdfViewer from "../../components/student/PdfViewer";
import { assets } from "../../assets/assets";
import Loader from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";

const PYQs = () => {
  const [pyqsData, setPyqsData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false);

  // Lazy loading state  
  const [visibleCount, setVisibleCount] = useState(3); // Initial cards  
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { toast } = useContext(AppContext);

  const openPdfViewer = (url) => {
    setPdfUrl(url);
  };

  const closePdfViewer = () => {
    setPdfUrl(null);
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

  // Lazy load scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !isFetchingMore && visibleCount < pyqsData.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10); // Load 10 more
          setIsFetchingMore(false);
        }, 500);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, isFetchingMore, pyqsData]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-500 to-transparent">
      {showFilter && (
        <PYQsFilter
          onResults={(data) => {
            setPyqsData(data);
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

              setPyqsData([]);
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
            {pyqsData.length > 0 &&
              pyqsData.slice(0, visibleCount).map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-100 mb-2 flex flex-col items-start border-2 rounded-2xl border-indigo-600 hover:bg-cyan-100"
                >
                  <h2 className="text-base sm:text-lg md:text-xl font-medium mb-1 text-indigo-800">
                    {item.pyqsTitle || "PYQ Document"}
                  </h2>

                  {/* Contributor Information Section */}
                  <div className="mt-1 w-full">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">
                      <span className="font-medium">Contributed by:</span> {item.createdBy || item.contributorName || "Unknown"}
                    </p>
                    {/* {item.createdAt && (
                      <p className="text-xs text-gray-500">
                        Uploaded on: {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
                      </p>
                    )} */}
                  </div>

                  {item.pyqsCategory?.branch && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Branch: {Array.isArray(item.pyqsCategory.branch)
                        ? item.pyqsCategory.branch.join(", ")
                        : item.pyqsCategory.branch}
                    </p>
                  )}

                  {item.pyqsCategory?.institution && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Institution: {item.pyqsCategory.institution}
                    </p>
                  )}

                  {item.pyqsCategory?.subjectName && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Subject: {Array.isArray(item.pyqsCategory.subjectName)
                        ? item.pyqsCategory.subjectName.join(", ")
                        : item.pyqsCategory.subjectName}
                    </p>
                  )}

                  {item.pyqsCategory?.academicYear && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Academic Year: {item.pyqsCategory.academicYear}
                    </p>
                  )}

                  {item.pyqsCategory?.year && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Exam Year: {item.pyqsCategory.year}
                    </p>
                  )}


                  <div className="mt-2 mb-1 flex justify-center w-full">
                    <button
                      onClick={() => openPdfViewer(item.pyqsLink)}
                      className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                    >
                      <img
                        src={assets.view_data}
                        alt="view"
                        className="w-5 h-5 mr-2"
                      />
                      <span className="hidden md:inline">View PYQ</span>
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

export default PYQs;