import React, { useState, useEffect } from "react";
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { parseResumeFromUrl } from "../../utils/resumeParser";

const LEVELS = ["fresher", "newbie", "intern", "junior", "senior"];
const TYPES = ["technical", "behavioural", "managerial", "mixed"];
const DURATIONS = ["short", "medium", "long"];

const CreateInterview = () => {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const [techStack, setTechStack] = useState("");
  const [level, setLevel] = useState(LEVELS[0]);
  const [type, setType] = useState(TYPES[0]);
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch resumes uploaded by this user
  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Assuming resumes are stored as an array of objects with display_name + parsedData
          setResumes(data.resumes || []);
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchUserResumes();
  }, [user]);

  // ✅ Generate questions using Gemini
  const generateQuestions = async (resumeParsedData) => {
    try {
      const numQuestions = duration === "short" ? 4 : duration === "medium" ? 7 : 10;
      const prompt = `You are an AI interviewer. Generate ${numQuestions} ${type} interview questions for a ${level} ${role} who knows ${techStack}. Use this resume data to tailor the questions:
${resumeParsedData}
Return only the list of questions, each on a separate line, optionally prefixed with numbering.
Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        
        Thank you! <3`;

      const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
      if (!GEMINI_API_KEY) {
        console.error('Missing VITE_GOOGLE_GENERATIVE_AI_API_KEY environment variable');
        return [];
      }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      const data = await response.json();
      // Helpful debug logging so we can inspect failures
      console.debug('Gemini response', data);

      // try multiple fallback paths depending on API shape
      const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.[0]?.text ||
        data?.result?.content?.[0]?.text ||
        data?.output?.[0]?.content?.text ||
        data?.text ||
        "";

      if (!rawText || rawText.trim().length === 0) {
        console.warn('Gemini returned empty text. Falling back to basic generator. Full response:', data);
        // Fallback simple question generation (minimal but useful) so DB still gets something
        const fallback = Array.from({ length: numQuestions }).map((_, i) => `${i + 1}. Tell me about your experience relevant to ${role} and ${techStack}`);
        return fallback;
      }

      const questions = rawText
        .split('\n')
        .map((q) => q.trim())
        .filter((q) => q.length > 0)
        .map((q) => q.replace(/^\d+[\).\s]*/, "").trim());

      return questions;
    } catch (error) {
        console.error("Gemini generation failed:", error);
        return [];
    }
    };


  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in first.");

    const resumeObj = resumes.find((r) => r.display_name === selectedResume);
    if (!resumeObj) return alert("Please select a resume.");

    setLoading(true);
    setMessage("");

    try {
      // Ensure we have parsed resume text. If not, try to parse from available URL fields.
      let resumeParsed = resumeObj.parsedData || resumeObj.parsed_data || '';
      if (!resumeParsed || resumeParsed.trim().length === 0) {
        // try common url fields
        const possibleUrl = resumeObj.url || resumeObj.fileUrl || resumeObj.link || resumeObj.storageUrl || resumeObj.cloudinaryUrl || '';
        if (!possibleUrl) {
          console.warn('No resume parsedData and no URL found on resume object:', resumeObj);
          setMessage('❌ Resume has no parsed data and no accessible URL to parse.');
          setLoading(false);
          return;
        }

        resumeParsed = await parseResumeFromUrl(possibleUrl);

        // If we managed to parse text, try to cache it back to the user's document (best-effort)
        if (resumeParsed && resumeParsed.length > 50) {
          try {
            // update the user's resumes array by replacing the object with parsedData — best-effort cache
            const userRef = doc(db, 'Users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              const updatedResumes = (userData.resumes || []).map((r) => {
                if (r.display_name === resumeObj.display_name) {
                  return { ...r, parsedData: resumeParsed };
                }
                return r;
              });
              try {
                await updateDoc(userRef, { resumes: updatedResumes });
              } catch (err) {
                // ignore caching failures
                console.debug('Failed to cache parsed resume back to Firestore:', err);
              }
            }
          } catch (err) {
            console.debug('Failed to read user doc for caching parsed resume:', err);
          }
        }
      }

      // Generate interview questions using Gemini
      const questions = await generateQuestions(resumeParsed);

      const createdAt = Timestamp.now();
      const expiresOn = Timestamp.fromMillis(createdAt.toMillis() + 7 * 24 * 60 * 60 * 1000);

      const interviewData = {
        createdAt,
        level,
        role,
        techStack: techStack.split(",").map((t) => t.trim()),
        type,
        studentResume: selectedResume,
        duration,
        userId: user.uid,
        questions,
        expiresOn,
      };

      // ✅ Create the interview and get its ID
        const interviewRef = await addDoc(collection(db, "Interviews"), interviewData);

        // ✅ Add the interview ID to user's interviews array
        const userRef = doc(db, "Users", user.uid);
        await updateDoc(userRef, {
        interviews: arrayUnion(interviewRef.id),
        });

      setMessage("✅ Interview created successfully!");
      setRole("");
      setTechStack("");
      setSelectedResume("");
    } catch (error) {
      console.error("Error creating interview:", error);
      setMessage("❌ Failed to create interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Create AI Mock Interview</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
            placeholder="e.g., Frontend Developer"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tech Stack (comma separated)</label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
            placeholder="e.g., React, Node.js, MongoDB"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Level</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border rounded-lg p-2">
            {LEVELS.map((lvl) => (
              <option key={lvl}>{lvl}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Interview Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded-lg p-2">
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border rounded-lg p-2">
            {DURATIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Resume Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Select Resume</label>
          <select
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
            required
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select a resume</option>
            {resumes.map((r, i) => (
              <option key={i} value={r.display_name}>
                {r.display_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 font-semibold"
        >
          {loading ? "Creating..." : "Create Interview"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default CreateInterview;