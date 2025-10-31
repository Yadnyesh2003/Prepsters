// src/utils/feedbackGenerator.js
// This uses the same Gemini client-side call pattern as your CreateInterview.jsx

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_API_KEY}`;

export const generateFeedback = async (transcript, jobRole, jobDesc) => {
  const transcriptText = transcript
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n');

  const prompt = `
    You are an expert hiring manager for a ${jobRole} position.
    The job description is: ${jobDesc}
    
    You have just completed an interview with a candidate. Analyze the following transcript, which includes their technical answers, behavioral responses, and a final code submission.

    **Transcript:**
    ${transcriptText}

    **Your Task:**
    Provide comprehensive, constructive feedback for the candidate. Structure your feedback in Markdown format.
    
    Include the following sections:
    
    ### Overall Summary
    A brief summary of the candidate's performance.
    
    ### Detailed Feedback
    * **Technical Skills:** Analyze their answers to technical questions and the quality of their code submission.
    * **Communication Skills:** Assess their clarity, confidence, and professionalism.
    * **Problem-Solving:** Evaluate their approach to problems mentioned in the interview.
    
    ### Areas for Improvement
    Provide 3-5 specific, actionable bullet points on what they should work on.
    
    ### Overall Score
    Give a score out of 100, with a brief justification.
    
    Return **only** the Markdown feedback.
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) {
      throw new Error('Failed to connect to Gemini API');
    }

    const data = await response.json();
    const feedback = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (feedback.length === 0) {
      throw new Error('Received empty feedback from API.');
    }

    return feedback;
  } catch (err) {
    console.error('Gemini feedback error:', err);
    return 'Error generating feedback. Please check the console.';
  }
};