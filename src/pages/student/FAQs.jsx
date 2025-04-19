import React, { useContext, useEffect, useState } from "react";
import FAQsFilter from "../../components/student/FAQsFilter";
import PdfViewer from "../../components/student/PdfViewer";
import { assets } from "../../assets/assets";
import Loader from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";

const FAQs = () => {
  const [faqsData, setFaqsData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState(false);

  const { toast } = useContext(AppContext);

  const openPdfViewer = (url) => {
    setPdfUrl(url);
  };

  const closePdfViewer = () => {
    setPdfUrl(null);
  };

  useEffect(() => {
    if (showFilter) {
      toast("Apply filter to get data!");
    }
  }, [showFilter]);

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
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
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
            {faqsData.length > 0 &&
              faqsData.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-100 rounded mb-2 flex flex-col items-start"
                >
                  <h2 className="text-xs font-semibold">Title: {item.faqsTitle}</h2>

                  {item.faqsCategory?.contributorName && (
                    <p className="text-gray-700">
                      Contributor: {item.faqsCategory.contributorName}
                    </p>
                  )}
                  {item.faqsCategory?.branch && (
                    <p className="text-gray-700">
                      Branch: {Array.isArray(item.faqsCategory.branch)
                        ? item.faqsCategory.branch.join(", ")
                        : item.faqsCategory.branch}
                    </p>
                  )}
                  {item.faqsCategory?.institution && (
                    <p className="text-gray-700">
                      Institution: {item.faqsCategory.institution}
                    </p>
                  )}
                  {item.faqsCategory?.subjectName && (
                    <p className="text-gray-700">
                      Subject: {item.faqsCategory.subjectName}
                    </p>
                  )}
                  {item.faqsCategory?.year && (
                    <p className="text-gray-700">
                      Year: {item.faqsCategory.year}
                    </p>
                  )}

                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => openPdfViewer(item.faqsLink)}
                      className="flex bg-indigo-500 text-white px-4 py-2 rounded-md hover:text-black"
                    >
                      <img
                        src={assets.view_data}
                        alt="view"
                        className="w-6 h-6 mr-2"
                      />
                      <span className="hidden md:inline">View FAQs</span>
                    </button>
                  </div>

                  {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQs;
