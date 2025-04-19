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

  const { toast } = useContext(AppContext);

  const openPdfViewer = (url) => {
    setPdfUrl(url); // Set the PDF URL to be displayed in the viewer
  };

  const closePdfViewer = () => {
    setPdfUrl(null); // Close the viewer by setting PDF URL to null
  };

  useEffect(() => {
    if (showFilter) {
      toast("Apply filter to get data!");
    }
  }, [showFilter]);

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
                setSyllabusData([]);
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
          {syllabusData.length > 0 && (
          syllabusData.map((item) => (
            <div key={item.id} className="p-4 bg-gray-100 rounded mb-2 flex flex-col items-start">
            <h2 className="text-xs font-semibold">Syllabus Title: {item.syllabusTitle}</h2>
            {item.syllabusCategory.academicYear && (
              <p className="text-gray-700">Academic Year: {item.syllabusCategory.academicYear}</p>
            )}
            {item.syllabusCategory.branch && (
              <p className="text-gray-700">Branch: {item.syllabusCategory.branch}</p>
            )}
            {item.syllabusCategory.institution && (
              <p className="text-gray-700">Institution: {item.syllabusCategory.institution}</p>
            )}
            {item.syllabusCategory.year && (
              <p className="text-gray-700">Year: {item.syllabusCategory.year}</p>
            )}
            <div className="flex space-x-4 mt-2">
              <button onClick={() => openPdfViewer(item.syllabusLink)} className="flex bg-indigo-500 text-white px-4 py-2 rounded-md hover:text-black">
                <img src={assets.view_data} alt="view" className="w-6 h-6 mr-2" />
                  <span className="hidden md:inline">View Syllabus</span>
              </button>
            </div>
              {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePdfViewer} />}
            </div>
          )))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Syllabus;
