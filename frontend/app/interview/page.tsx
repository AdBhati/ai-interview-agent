'use client';

/**
 * Interview Page
 * Main interview interface with chat and audio recording
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatUI from '@/components/ChatUI';
import AudioRecorder from '@/components/AudioRecorder';
import ProgressTracker from '@/components/ProgressTracker';
import { api } from '@/services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Question {
  id: string;
  question: string;
  status: 'pending' | 'current' | 'completed';
}

export default function InterviewPage() {
  const router = useRouter();
  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeInterview();
  }, []);

  const initializeInterview = async () => {
    try {
      setLoading(true);
      
      // Get resume and job description IDs from localStorage
      const resumeId = localStorage.getItem('resumeId');
      const jobDescriptionId = localStorage.getItem('jobDescriptionId');
      
      // Create or get existing interview
      let interview;
      
      if (resumeId || jobDescriptionId) {
        const payload: any = {};
        if (resumeId) payload.resume = parseInt(resumeId);
        if (jobDescriptionId) payload.job_description = parseInt(jobDescriptionId);
        
        const response = await api.interviews.create(payload);
        interview = response.data;
        setInterviewId(interview.id);
        setInterviewData(interview);
        localStorage.setItem('interviewId', interview.id.toString());
        
        // Start the interview
        await api.interviews.start(interview.id);
        
        // Generate AI questions
        try {
          const questionsResponse = await api.interviews.generateQuestions(interview.id, 5);
          const generatedQuestions = questionsResponse.data.questions || [];
          
          // Update questions state
          const formattedQuestions: Question[] = generatedQuestions.map((q: any, idx: number) => ({
            id: q.id.toString(),
            question: q.question_text,
            status: idx === 0 ? 'current' as const : 'pending' as const,
          }));
          
          setQuestions(formattedQuestions);
          
          // Update interview data with total questions
          if (generatedQuestions.length > 0) {
            setInterviewData({
              ...interview,
              total_questions: generatedQuestions.length,
            });
          }
          
          // Initialize with first question
          if (generatedQuestions.length > 0) {
            setMessages([
              {
                id: '1',
                role: 'assistant',
                content: generatedQuestions[0].question_text,
                timestamp: new Date(),
              },
            ]);
          } else {
            setMessages([
              {
                id: '1',
                role: 'assistant',
                content: 'Welcome! Let\'s begin the interview. Please introduce yourself.',
                timestamp: new Date(),
              },
            ]);
          }
        } catch (questionError: any) {
          console.error('Error generating questions:', questionError);
          // Fallback to default questions if generation fails
          setQuestions([
            { id: '1', question: 'Please introduce yourself', status: 'current' },
            { id: '2', question: 'What is your experience?', status: 'pending' },
            { id: '3', question: 'Describe a challenging project', status: 'pending' },
          ]);
          setMessages([
            {
              id: '1',
              role: 'assistant',
              content: 'Welcome! Let\'s begin the interview. Please introduce yourself.',
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        // No resume or JD - redirect to upload page
        setError('Please upload a resume or create a job description first.');
        setTimeout(() => {
          router.push('/upload');
        }, 2000);
        return;
      }
      
    } catch (err: any) {
      console.error('Error initializing interview:', err);
      setError('Failed to initialize interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!interviewId || !interviewData) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    try {
      // Get current question
      const currentQuestion = questions.find(q => q.status === 'current');
      if (!currentQuestion) return;
      
      // Find question ID from backend
      const questionsResponse = await api.interviews.getQuestions(interviewId);
      const backendQuestions = questionsResponse.data.questions || [];
      const backendQuestion = backendQuestions.find((q: any) => 
        q.question_text === currentQuestion.question || q.order_index === interviewData.current_question_index
      );
      
      if (backendQuestion) {
        // Submit answer
        const formData = new FormData();
        formData.append('question_id', backendQuestion.id.toString());
        formData.append('answer_text', message);
        
        const answerResponse = await api.interviews.submitAnswer(interviewId, formData);
        
        // Show evaluation if available
        if (answerResponse.data.evaluated && answerResponse.data.score) {
          const evaluationMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Thank you for your answer. Score: ${answerResponse.data.score}/10. ${answerResponse.data.evaluation?.substring(0, 100)}...`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, evaluationMessage]);
        }
      }
      
      // Move to next question
      updateQuestionProgress();
    } catch (err) {
      console.error('Error submitting answer:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Thank you for your answer. Let me ask you the next question...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      updateQuestionProgress();
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!interviewId || !interviewData) return;
    
    try {
      // Get current question
      const currentQuestion = questions.find(q => q.status === 'current');
      if (!currentQuestion) return;
      
      // Find question ID from backend
      const questionsResponse = await api.interviews.getQuestions(interviewId);
      const backendQuestions = questionsResponse.data.questions || [];
      const backendQuestion = backendQuestions.find((q: any) => 
        q.question_text === currentQuestion.question || q.order_index === interviewData.current_question_index
      );
      
      if (backendQuestion) {
        // Submit audio answer
        const formData = new FormData();
        formData.append('question_id', backendQuestion.id.toString());
        formData.append('audio_file', audioBlob, 'recording.webm');
        formData.append('duration_seconds', '0'); // You can calculate actual duration
        
        const answerResponse = await api.interviews.submitAnswer(interviewId, formData);
        
        // Show transcription and evaluation
        if (answerResponse.data.transcribed && answerResponse.data.answer_text) {
          const transcriptionMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Transcribed: "${answerResponse.data.answer_text.substring(0, 100)}..."`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, transcriptionMessage]);
        }
        
        if (answerResponse.data.evaluated && answerResponse.data.score) {
          const evaluationMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `Score: ${answerResponse.data.score}/10. ${answerResponse.data.evaluation?.substring(0, 100)}...`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, evaluationMessage]);
        }
      }
      
      // Update progress after audio submission
      updateQuestionProgress();
    } catch (err) {
      console.error('Error submitting audio:', err);
      updateQuestionProgress();
    }
  };

  const updateQuestionProgress = async () => {
    if (!interviewId) return;
    
    try {
      const currentIndex = questions.findIndex(q => q.status === 'current');
      if (currentIndex >= 0 && currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;
        
        // Mark current as completed, move to next
        const updatedQuestions = questions.map((q, idx) => {
          if (idx === currentIndex) return { ...q, status: 'completed' as const };
          if (idx === nextIndex) return { ...q, status: 'current' as const };
          return q;
        });
        setQuestions(updatedQuestions);
        
        // Update backend
        await api.interviews.updateProgress(interviewId, {
          current_question_index: nextIndex,
          total_questions: questions.length,
        });
        
        // Get next question from backend and display it
        try {
          const nextQuestionResponse = await api.interviews.getCurrentQuestion(interviewId);
          if (nextQuestionResponse.data.question) {
            const nextQuestion: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: nextQuestionResponse.data.question.question_text,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, nextQuestion]);
          }
        } catch (err) {
          console.error('Error fetching next question:', err);
        }
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleCompleteInterview = async () => {
    if (!interviewId) return;
    
    try {
      // Complete the interview first
      await api.interviews.complete(interviewId);
      
      // Wait a bit for the status to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate report before redirecting
      try {
        await api.interviews.generateReport(interviewId);
      } catch (reportErr: any) {
        console.error('Error generating report:', reportErr);
        // If report generation fails, still redirect - report page will handle it
        if (reportErr.response?.status === 400) {
          console.log('Report generation failed, but continuing to results page');
        }
      }
      
      router.push(`/results?id=${interviewId}`);
    } catch (err) {
      console.error('Error completing interview:', err);
      setError('Failed to complete interview');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing interview session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/upload')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              AI Interview Session
            </h1>
            {interviewData && (
              <p className="text-gray-600 mt-1">
                {interviewData.title || `Interview #${interviewData.id}`}
              </p>
            )}
          </div>
          <button
            onClick={handleCompleteInterview}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Complete Interview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Interface */}
            <div className="h-[500px]">
              <ChatUI
                messages={messages}
                onSendMessage={handleSendMessage}
                disabled={isRecording}
              />
            </div>

            {/* Audio Recorder */}
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              onRecordingStart={() => setIsRecording(true)}
              onRecordingStop={() => setIsRecording(false)}
            />
          </div>

          {/* Progress Tracker Sidebar */}
          <div className="lg:col-span-1">
            <ProgressTracker
              questions={questions}
              currentQuestionIndex={Math.max(0, questions.findIndex(q => q.status === 'current'))}
              totalQuestions={questions.length || 1}
            />
            
            {/* Interview Info */}
            {interviewData && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Interview Info</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Status:</strong> {interviewData.status}</p>
                  {interviewData.resume_details && (
                    <p><strong>Resume:</strong> {interviewData.resume_details.original_filename}</p>
                  )}
                  {interviewData.job_description_details && (
                    <p><strong>Position:</strong> {interviewData.job_description_details.title}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

