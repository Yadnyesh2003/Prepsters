import React from "react";
import { motion } from "framer-motion";

const InterviewCard = ({ interview, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
      onClick={() => onClick(interview)}
    >
      <h2 className="text-xl font-bold mb-2 text-indigo-600">
        {interview.role || "Untitled Role"}
      </h2>
      <p className="text-sm text-gray-500">
        {interview.type} • {interview.level}
      </p>
      <p className="text-sm mt-1 text-gray-600">
        ⏱ Duration: {interview.duration}
      </p>
      <p className="text-sm mt-1 text-gray-600">
        🧠 Tech Stack: {interview.techStack?.join(", ")}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Created:{" "}
        {interview.createdAt?.toDate
          ? interview.createdAt.toDate().toLocaleString()
          : "N/A"}
      </p>
      <p className="text-xs text-gray-400">
        Expires:{" "}
        {interview.expiresOn?.toDate
          ? interview.expiresOn.toDate().toLocaleString()
          : "N/A"}
      </p>
      <hr className="my-3" />
      <p className="text-sm text-gray-700 italic line-clamp-2">
        {interview.jobDesc?.split(".")[0] || "No JD provided yet."}.
      </p>
    </motion.div>
  );
};

export default InterviewCard;