import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InterviewCard from "../../components/student/InterviewCard";
import Loading from "../../components/student/Loading";

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Scheduled Interviews";
    const fetchInterviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Interviews"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          isCompleted: doc.data().isCompleted ?? false,
          ...doc.data(),
        }));
        setInterviews(data);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading)
    return (
      <Loading />
    );

  return (
    <div className="p-8 text-gray-800 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">📅 Scheduled Interviews</h1>

      {interviews.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No interviews scheduled yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onClick={setSelectedInterview}
            />
          ))}
        </div>
      )}

      {/* POPUP for full JD */}
      <AnimatePresence>
        {selectedInterview && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl max-w-lg w-11/12 relative shadow-xl max-h-[80vh] overflow-y-auto"
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedInterview(null)}
              >
                ✖
              </button>
              <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
                {selectedInterview.role}
              </h2>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Type:</span>{" "}
                {selectedInterview.type} <br />
                <span className="font-medium">Level:</span>{" "}
                {selectedInterview.level} <br />
                <span className="font-medium">Duration:</span>{" "}
                {selectedInterview.duration}
              </p>
              <div className="max-h-60 overflow-y-auto mb-6 border p-2 rounded-md bg-gray-50">
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedInterview.jobDesc || "No job description available."}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setSelectedInterview(null)}
                >
                  Close
                </button>

                {selectedInterview.isCompleted ? (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    onClick={() => navigate(`/interview/${selectedInterview.id}/feedback`)}
                  >
                    View Feedback
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    onClick={() => navigate(`/interview/${selectedInterview.id}`)}
                  >
                    Start Interview
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduledInterviews;