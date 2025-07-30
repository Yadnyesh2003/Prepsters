import React, { useContext, useEffect, useState } from "react";
import PYQsFilter from "../../components/student/PYQsFilter";
import PdfViewer from "../../components/student/PdfViewer";
import { assets } from "../../assets/assets";
import Loader from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import { db, doc, getDoc, updateDoc } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";

const PYQs = () => {
  const [pyqsData, setPyqsData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false);

  

  // Lazy loading state
  const [visibleCount, setVisibleCount] = useState(3);
  const [isFetchingMore, setIsFetchingMore] = useState(false);


  const { toast, trackPdfViewEvent } = useContext(AppContext);
  const { user } = useAuth();
  const openPdfViewer = (url, item) => {
    setPdfUrl(url); // Set the PDF URL to be displayed in the viewer
    console.log("PYQ pdf clicked is: ", item)
    // Track Analytics Event
    trackPdfViewEvent({
      contentType: "PYQs",
      details: {
        pdf_branch: Array.isArray(item.pyqsCategory?.branch)
          ? item.pyqsCategory.branch.join(', ')
          : item.pyqsCategory?.branch || "unknown",
        pdf_subject: Array.isArray(item.pyqsCategory?.subjectName)
          ? item.pyqsCategory.subjectName.join(', ')
          : item.pyqsCategory?.subjectName || "unknown",
        pdf_institution: item.pyqsCategory?.institution || "unknown",
        pdf_academicYear: item.pyqsCategory?.academicYear || "unknown",
        pdf_year: item.pyqsCategory?.year || "unknown",
        pdf_contributor: item.contributorName || "unknown",
        pdf_title: item.pyqsTitle || "untitled",
      }
    });
    // console.log("Note pdf after tracking is: ", note)

  };

  const closePdfViewer = () => {
    setPdfUrl(null);
  };

  const handleBookmarkToggle = async (pyqId) => {
    try {
      const userId = user?.uid;
      if (!userId) return toast.error("You must be logged in to bookmark");

      const userRef = doc(db, "Users", userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return toast.error("User not found");

      const userData = userSnap.data();
      const bookmarkedPYQs = userData.bookmarkedPYQs || [];

      const isBookmarked = bookmarkedPYQs.includes(pyqId);

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
                    const updatedBookmarks = bookmarkedPYQs.filter(
                      (id) => id !== pyqId
                    );
                    await updateDoc(userRef, { bookmarkedPYQs: updatedBookmarks });
                    toast.success("Removed from bookmarks!");
                    setPyqsData((prev) =>
                      prev.map((item) =>
                        item.id === pyqId ? { ...item, isBookmarked: false } : item
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
        if (bookmarkedPYQs.length >= 10) {
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
                    const updatedBookmarks = [...bookmarkedPYQs, pyqId];
                    await updateDoc(userRef, { bookmarkedPYQs: updatedBookmarks });
                    toast.success("Added to bookmarks!");
                    setPyqsData((prev) =>
                      prev.map((item) =>
                        item.id === pyqId ? { ...item, isBookmarked: true } : item
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
    document.title = "PYQs"
  }, [])


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
      if (bottom && !isFetchingMore && visibleCount < pyqsData.length) {
        setIsFetchingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10);
          setIsFetchingMore(false);
        }, 500);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, isFetchingMore, pyqsData]);

  useEffect(() => {
    if (user?.uid && pyqsData.length > 0) {
      const userRef = doc(db, "Users", user.uid);
      getDoc(userRef)
        .then((userSnap) => {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const bookmarkedPYQs = userData.bookmarkedPYQs || [];
            setPyqsData((prev) =>
              prev.map((item) => ({
                ...item,
                isBookmarked: bookmarkedPYQs.includes(item.id),
              }))
            );
          }
        })
        .catch((error) => {
          toast.error("Error fetching bookmarks: " + error.message);
        });
    }
  }, [user, pyqsData.length, toast]);

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
                  {/* First Row: Bookmark Button + Title */}
                  <div className="flex items-center justify-between w-full">
                    <h2 className="text-base sm:text-lg md:text-xl font-medium text-indigo-800">
                      {item.pyqsTitle || "PYQ Document"}
                    </h2>

                  </div>
                  {/* Contributor Information Section */}
                  <div className="mt-1 w-full">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">
                      <span className="font-medium">Contributed by:</span>{" "}
                      {item.createdBy || item.contributorName || "Unknown"}
                    </p>
                  </div>

                  {item.pyqsCategory?.branch && (
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Branch:{" "}
                      {Array.isArray(item.pyqsCategory.branch)
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
                      Subject:{" "}
                      {Array.isArray(item.pyqsCategory.subjectName)
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

                  {/* Button Section: View Button Only */}
                  <div className="mt-2 mb-1 flex items-center justify-between w-full">
                    <button
                      onClick={() => openPdfViewer(item.pyqsLink, item)}
                      className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                    >
                      <img
                        src={assets.view_data}
                        alt="view"
                        className="w-5 h-5 mr-2"
                      />
                      View PYQ
                    </button>
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
