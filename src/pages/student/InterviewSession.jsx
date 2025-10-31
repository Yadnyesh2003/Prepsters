// src/pages/student/InterviewSession.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { vapi } from '../../lib/vapi.sdk';
import { interviewer as interviewerBasePrompt } from '../../utils/interviewer'; // We'll update this prompt
import { generateFeedback } from '../../utils/feedbackGenerator'; // We'll create this
import MonacoEditor from '@monaco-editor/react';
import Loader from '../../components/student/Loading'; // Assuming you have a loader
import { assets } from '../../assets/assets';

// Enum for Call Status
const CallStatus = {
  INACTIVE: 'INACTIVE',
  CONNECTING: 'CONNECTING',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
};

const InterviewSession = () => {
  const { id: interviewId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [code, setCode] = useState('// Write your code here...');

  // Fetch interview data on load
  useEffect(() => {
    if (!user || !interviewId) {
      navigate('/');
      return;
    }

    const fetchInterview = async () => {
      try {
        const interviewRef = doc(db, 'Interviews', interviewId);
        const docSnap = await getDoc(interviewRef);

        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          const data = docSnap.data();
          setInterviewData(data);
          // Check if interview already has feedback
          if (data.feedback) {
            // If feedback exists, redirect to feedback page
            navigate(`/interview/${interviewId}/feedback`);
          }
        } else {
          console.error('Interview not found or unauthorized');
          navigate('/unauthorized');
        }
      } catch (error) {
        console.error('Error fetching interview:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [user, interviewId, navigate]);

  // VAPI event listeners
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message) => {
      // We only care about transcripts
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error) => console.error('VAPI Error:', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);

  // Handle call end: Generate feedback and redirect
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      handleGenerateFeedback();
    }
  }, [callStatus]);

  // Update last message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        setLastMessage(lastMsg.content);
      }
    }
  }, [messages]);

  const handleGenerateFeedback = async () => {
    if (!interviewData || messages.length === 0) return;

    setLoading(true); // Show loader while generating feedback
    try {
      // 1. Add final code to transcript
      const finalTranscript = [
        ...messages,
        {
          role: 'system',
          content: `[FINAL CODE SUBMITTED BY USER]:\n${code}`,
        },
      ];

      // 2. Call Gemini to generate feedback
      const feedbackText = await generateFeedback(
        finalTranscript,
        interviewData.role,
        interviewData.jobDesc
      );

      // 3. Save feedback to Firestore
      const interviewRef = doc(db, 'Interviews', interviewId);
      await updateDoc(interviewRef, {
        feedback: feedbackText,
        transcript: finalTranscript,
        isCompleted: true
      });

      // 4. Redirect to feedback page
      navigate(`/interview/${interviewId}/feedback`);
    } catch (error) {
      console.error('Error generating feedback:', error);
      alert('Failed to generate feedback. Please try again.');
      navigate('/interview/list'); // Go back to list
    } finally {
      setLoading(false);
    }
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    // Format questions from Firestore
    const formattedQuestions = (interviewData?.questions || [])
      .map((q) => `- ${q}`)
      .join('\n');

    // Dynamically create the agent prompt
    const dynamicInterviewerPrompt = {
      ...interviewerBasePrompt,
      model: {
        ...interviewerBasePrompt.model,
        messages: [
          {
            role: 'system',
            content: interviewerBasePrompt.model.messages[0].content
              .replace('{{questions}}', formattedQuestions)
              .replace('{{studentName}}', user.displayName || 'Candidate')
              .replace('{{jobRole}}', interviewData.role || 'the position'),
          },
        ],
      },
      // Pass resume and job desc to VAPI variables (optional but good)
      metadata: {
        jobDesc: interviewData.jobDesc,
        resumeSummary: interviewData.summarizedResume,
      },
    };

    vapi.start(dynamicInterviewerPrompt);
  };

  const handleSubmitCode = () => {
    // Send the code to the VAPI agent
    vapi.send({
      type: 'add-message',
      role: 'user',
      message: `[USER SUBMITTED CODE]:\n${code}`,
    });
    alert('Code submitted to interviewer!');
  };

  const handleDisconnect = () => {
    vapi.stop();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-[calc(100vh-80px)] text-gray-800">
      {/* Left Side: Interviewer and Transcript */}
      <div className="w-1/2 flex flex-col p-6 bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            {/* AI Interviewer Avatar */}
            <div className="relative inline-block">
              <img
                src={assets.ai_agent} // You'll need to add this to your `public` folder
                alt="AI Interviewer"
                width={120}
                height={120}
                className="rounded-full object-cover shadow-lg"
              />
              {isSpeaking && (
                <span
                  className="absolute top-0 left-0 w-full h-full rounded-full bg-purple-500 opacity-75 animate-ping"
                  style={{ animationDuration: '1.5s' }}
                />
              )}
            </div>
            <h3 className="text-2xl font-semibold mt-4">AI Interviewer</h3>
            <p className="text-gray-500">
              {interviewData?.role || 'Interview'}
            </p>
          </div>

          {/* Transcript */}
          {lastMessage && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow w-full max-w-md">
              <p className="text-lg text-center font-medium">{lastMessage}</p>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="w-full flex justify-center py-4">
          {callStatus !== CallStatus.ACTIVE ? (
            <button
              className="relative px-8 py-4 bg-green-500 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-green-600 transition"
              onClick={handleCall}
            >
              {callStatus === CallStatus.CONNECTING ? 'Connecting...' : 'Start Interview'}
            </button>
          ) : (
            <button
              className="px-8 py-4 bg-red-500 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-red-600 transition"
              onClick={handleDisconnect}
            >
              End Call
            </button>
          )}
        </div>
      </div>

      {/* Right Side: Code Editor */}
      <div className="w-1/2 flex flex-col bg-gray-800">
        <div className="flex-1 h-full">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>
        <button
          className="w-full py-4 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          onClick={handleSubmitCode}
          disabled={callStatus !== CallStatus.ACTIVE}
        >
          Submit Code to Interviewer
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;