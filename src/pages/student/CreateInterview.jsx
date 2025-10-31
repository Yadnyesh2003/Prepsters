import React, { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { parseResumeFromUrl } from "../../utils/resumeParser";

const LEVELS = [
  { value: "fresher", label: "Fresher" },
  { value: "newbie", label: "Newbie" },
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
];
const TYPES = [
  { value: "technical", label: "Technical" },
  { value: "behavioural", label: "Behavioural" },
  { value: "managerial", label: "Managerial" },
  { value: "mixed", label: "Mixed" },
];
const DURATIONS = [
  { value: "short", label: "Short (4 Qs)" },
  { value: "medium", label: "Medium (7 Qs)" },
  { value: "long", label: "Long (10 Qs)" },
];

const animatedComponents = makeAnimated();

const CreateInterview = () => {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const [techStack, setTechStack] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [level, setLevel] = useState(null);
  const [type, setType] = useState(null);
  const [duration, setDuration] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user resumes
  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setResumes(
            (data.resumes || []).map((r) => ({
              value: r.display_name,
              label: r.display_name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
        toast.error("Failed to fetch resumes.");
      }
    };
    fetchUserResumes();
  }, [user]);

  const checkInterviewLimit = async () => {
    if (!user) return false;

    try {
      // ✅ Query only by userId — no composite index needed
      const interviewsRef = collection(db, "Interviews");
      const q = query(interviewsRef, where("userId", "==", user.uid), limit(10));
      const snapshot = await getDocs(q);
      // ✅ Filter expired interviews locally
      const now = Timestamp.now();
      const activeInterviews = snapshot.docs.filter(
        (doc) => doc.data().expiresOn?.toMillis() > now.toMillis()
      ).length;

      if (activeInterviews >= 3) {
        toast.error(
          "You already have 3 active interviews. Please wait for them to expire before creating a new one!"
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking interview limit:", error);
      toast.error("Failed to check interview limit. Try again later.");
      return false;
    }
  };



  // Generate Gemini questions
  const generateQuestions = async (resumeParsedData) => {
    const numQuestions =
      duration.value === "short"
        ? 4
        : duration.value === "medium"
        ? 7
        : 10;
    const prompt = `
      You are an AI interviewer preparing a ${type.value} interview for a ${level.value} ${role}.
      Tech Stack: ${techStack}
      Job Description: ${jobDesc}
      Resume Data:
      ${resumeParsedData}

      Generate ${numQuestions} smart, conversational, voice-friendly questions that challenge the student based on their resume, tech stack, and job description.
      Return only the questions, one per line, no special characters or numbering.
      `;

    const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      return text.split("\n").filter((q) => q.trim() !== "");
    } catch (err) {
      console.error("Gemini error:", err);
      toast.error("Failed to generate questions.");
      return [];
    }
  };


  // Summarize parsed resume data if too large (to stay under Firestore 1MB)
  const summarizeResumeData = async (resumeText) => {
    if (!resumeText || resumeText.trim().length === 0) return "";

    // // If small enough, skip summarization
    // if (resumeText.length < 500) {
    //   return resumeText;
    // }

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_API_KEY}`;

      const prompt = `
        You are an AI resume compressor. Summarize the following resume into a structured JSON-like text with sections: 
        "About", "Skills", "Experience", "Projects", "Achievements" and "Education". 
        
        Keep descriptions conversational yet concise
        Output a JSON-like text that an interviewer AI can easily understand and reference.

        Keep it under 15000 characters total, focusing only on keywords, achievements, and technologies.

        Resume:
        ${resumeText}
        `;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      const data = await response.json();
      const summary =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      if (summary.length > 0) {
        console.log("✅ Gemini summarized resume length:", summary.length);
        return summary;
      } else {
        console.warn("Gemini returned empty summary. Using fallback.");
        return resumeText.slice(0, 50000); // fallback truncate
      }
    } catch (error) {
      console.error("Error summarizing resume:", error);
      return resumeText.slice(0, 50000); // fallback truncate
    }
  };


  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in first!");
    if (!level || !type || !duration)
      return toast.error("Please select all dropdown fields!");
    if (!role || !techStack || !selectedResume || !jobDesc)
      return toast.error("Please fill all fields!");
    const canCreate = await checkInterviewLimit();
      if (!canCreate) return;

    setLoading(true);

    try {
      const userRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const resumeObj = (userData.resumes || []).find(
        (r) => r.display_name === selectedResume.value
      );
      if (!resumeObj) return toast.error("Invalid resume selected.");

      // let parsed = resumeObj.parsedData || (await parseResumeFromUrl(resumeObj.url));
      // ✅ Ensure parsed resume text exists
      let resumeParsed = resumeObj.parsedData || resumeObj.parsed_data || '';
      if (!resumeParsed || resumeParsed.trim().length === 0) {
        const possibleUrl =
          resumeObj.url ||
          resumeObj.fileUrl ||
          resumeObj.link ||
          resumeObj.storageUrl ||
          '';
        if (possibleUrl) {
          resumeParsed = await parseResumeFromUrl(possibleUrl);
        }
      }
      // ✅ Condense resume data for safe Firestore storage
      const safeResumeData = await summarizeResumeData(resumeParsed);

      const questions = await generateQuestions(safeResumeData);

      const createdAt = Timestamp.now();
      const expiresOn = Timestamp.fromMillis(createdAt.toMillis() + 7 * 24 * 60 * 60 * 1000);

      const interviewRef = await addDoc(collection(db, "Interviews"), {
        createdAt,
        level: level.value,
        role,
        techStack: techStack.split(",").map((t) => t.trim()),
        type: type.value,
        duration: duration.value,
        studentResume: selectedResume.value,
        jobDesc,
        summarizedResume: safeResumeData,
        userId: user.uid,
        questions,
        expiresOn,
        isCompleted: false,
      });

      await updateDoc(userRef, {
        interviews: arrayUnion(interviewRef.id),
      });

      toast.success("Interview created successfully!");
      setRole("");
      setTechStack("");
      setSelectedResume(null);
      setJobDesc("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create interview!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 bg-white shadow-2xl rounded-2xl p-8 text-gray-700">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-3">
        🚀 Create Your AI Mock Interview
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Get ready to face your next placement interview! Fill the form carefully — our AI will tailor
        your mock interview questions based on your resume and job description.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-medium block mb-1">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="e.g. Frontend Developer"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Tech Stack</label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="e.g. React, Node.js, MongoDB"
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Job Description</label>
          <textarea
            maxLength={10000}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste or describe the job description..."
            required
            className="w-full border rounded-lg p-2 h-24"
          />
          <p className="text-sm text-gray-500 mt-1">
            {jobDesc.length}/10000 characters
          </p>
        </div>

        <div>
          <label className="font-medium block mb-1">Experience Level</label>
          <Select
            options={LEVELS}
            value={level}
            onChange={setLevel}
            components={animatedComponents}
            className="text-black"
            placeholder="Select experience level..."
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Interview Type</label>
          <Select
            options={TYPES}
            value={type}
            onChange={setType}
            components={animatedComponents}
            className="text-black"
            placeholder="Select interview type..."
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Duration</label>
          <Select
            options={DURATIONS}
            value={duration}
            onChange={setDuration}
            components={animatedComponents}
            className="text-black"
            placeholder="Select duration..."
          />
        </div>

        <div>
          <label className="font-medium block mb-1">Select Resume</label>
          <Select
            options={resumes}
            value={selectedResume}
            onChange={setSelectedResume}
            components={animatedComponents}
            className="text-black"
            placeholder="Select a resume"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 font-semibold"
        >
          {loading ? "Creating Interview..." : "Create Interview"}
        </button>
      </form>
    </div>
  );
};

export default CreateInterview;