// src/pages/student/Feedback.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import Loader from '../../components/student/Loading';
import { exportFeedbackAsPDF } from '../../utils/feedbackExporter';

const Feedback = () => {
  const { id: interviewId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Interview Feedback';
    if (!user || !interviewId) {
      navigate('/');
      return;
    }

    const fetchFeedback = async () => {
      try {
        const interviewRef = doc(db, 'Interviews', interviewId);
        const docSnap = await getDoc(interviewRef);

        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          const data = docSnap.data();
          if (data.feedback) {
            setInterview(data);
          } else {
            // Feedback not ready, maybe redirect back to session or list
            alert('Feedback is not yet available.');
            navigate(`/interview/${interviewId}`);
          }
        } else {
          navigate('/unauthorized');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [user, interviewId, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!interview) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold">Feedback not found.</h1>
        <Link to="/interview/list" className="text-purple-600 hover:underline">
          Back to Interviews
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-3xl font-bold text-purple-700 mb-2">Interview Feedback</h1>
      <p className="text-xl text-gray-600 mb-6">
        Role: <span className="font-semibold">{interview.role}</span>
      </p>

      {/* This renders the Markdown from Gemini */}
      <article className="prose lg:prose-xl max-w-none text-gray-800">
        <ReactMarkdown>{interview.feedback}</ReactMarkdown>
      </article>

      <hr className="my-8" />

      <h3 className="text-2xl font-semibold mb-4">Full Transcript</h3>
      <div className="h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg border">
        {(interview.transcript || []).map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.role === 'user'
                ? 'text-right'
                : msg.role === 'assistant'
                ? 'text-left'
                : 'text-center italic'
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-purple-100 text-purple-800'
                  : msg.role === 'assistant'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800 text-sm'
              }`}
            >
              <strong>{msg.role === 'assistant' ? 'Interviewer' : 'You'}:</strong>{' '}
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="text-center mt-8 flex flex-col md:flex-row justify-center gap-4">
        <button
          onClick={() => exportFeedbackAsPDF(interview)}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Download Feedback as PDF
        </button>

        <Link
          to="/interview/list"
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          Back to Interview List
        </Link>
      </div>
    </div>
  );
};

export default Feedback;