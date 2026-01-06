'use client';

/**
 * Interview Test Engine Page
 * Candidate takes test with mix of MCQ and open-ended coding questions
 */
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import VideoMonitoring from '@/components/VideoMonitoring';

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  is_mcq: boolean;
  options: string[];
  correct_answer: string;
  order_index: number;
}

interface Answer {
  question_id: number;
  selected_option?: string; // For MCQ
  answer_text?: string; // For open-ended questions
}

export default function InterviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewIdParam = searchParams.get('id');
  const numQuestionsParam = searchParams.get('questions');
  const timeLimitParam = searchParams.get('time');

  const [interviewId, setInterviewId] = useState<number | null>(
    interviewIdParam ? parseInt(interviewIdParam) : null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, string>>(new Map()); // For MCQ: questionId -> selectedOption
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Map<number, string>>(new Map()); // For open-ended: questionId -> answerText
  const [timeRemaining, setTimeRemaining] = useState<number>(
    timeLimitParam ? parseInt(timeLimitParam) : 1800 // Default 30 minutes
  );
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [violations, setViolations] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (interviewId) {
      loadInterview();
    } else {
      // For testing: Allow test mode without interview ID
      const testMode = searchParams.get('test') === 'true';
      if (testMode) {
        // Test mode: Create dummy questions for video testing
        setQuestions([
          {
            id: 1,
            question_text: 'Test Question 1: What is React?',
            question_type: 'technical',
            is_mcq: true,
            options: ['A JavaScript library', 'A database', 'A server', 'A framework'],
            correct_answer: 'A',
            order_index: 0,
          },
          {
            id: 2,
            question_text: 'Test Question 2: Write a function to reverse a string.',
            question_type: 'coding',
            is_mcq: false,
            options: [],
            correct_answer: '',
            order_index: 1,
          },
        ]);
        setTestStarted(true);
        setLoading(false);
      } else {
        setError('Interview ID not found');
        setLoading(false);
      }
    }
  }, [interviewId, searchParams]);

  useEffect(() => {
    if (testStarted && timeRemaining > 0 && !testCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted, timeRemaining]);

  const loadInterview = async () => {
    if (!interviewId) return;

    setLoading(true);
    try {
      // Get questions
      const questionsResponse = await api.interviews.getQuestions(interviewId);
      const questionsData = questionsResponse.data.questions || [];

      if (questionsData.length === 0) {
        setError('No questions found. Please generate questions first.');
        return;
      }

      setQuestions(questionsData);
      setTestStarted(true);
    } catch (err: any) {
      console.error('Error loading interview:', err);
      setError(err.response?.data?.error || 'Failed to load interview');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (testCompleted || submitting) return;
    setTestCompleted(true);
    await submitAllAnswers();
  };

  const handleOptionSelect = (option: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentQuestion.id, option);
      return newAnswers;
    });
  };

  const handleOpenEndedAnswerChange = (answerText: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setOpenEndedAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(currentQuestion.id, answerText);
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit the test? You cannot change answers after submission.')) {
      setTestCompleted(true);
      await submitAllAnswers();
    }
  };

  const submitAllAnswers = async () => {
    if (!interviewId || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      // Submit all answers (both MCQ and open-ended)
      for (const question of questions) {
        const formData = new FormData();
        formData.append('question', question.id.toString());

        if (question.is_mcq) {
          // Submit MCQ answer
          const selectedOption = answers.get(question.id) || '';
          formData.append('selected_option', selectedOption);
          await api.interviews.submitAnswer(interviewId, formData);
        } else {
          // Submit open-ended answer
          const answerText = openEndedAnswers.get(question.id) || '';
          formData.append('answer_text', answerText);
          await api.interviews.submitAnswer(interviewId, formData);
        }
      }

      // Complete interview
      await api.interviews.complete(interviewId);

      // Generate report
      try {
        await api.interviews.generateReport(interviewId);
      } catch (err) {
        console.error('Error generating report:', err);
      }

      // Redirect to results
      router.push(`/results?id=${interviewId}`);
    } catch (err: any) {
      console.error('Error submitting answers:', err);
      setError(err.response?.data?.error || 'Failed to submit answers');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleViolation = (type: 'mobile' | 'multiple_faces' | 'no_camera') => {
    setViolations((prev) => {
      const newViolations = new Set(prev);
      newViolations.add(type);
      return newViolations;
    });
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : null;
  const currentOpenEndedAnswer = currentQuestion ? openEndedAnswers.get(currentQuestion.id) || '' : '';
  const answeredCount = answers.size + openEndedAnswers.size;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error && !testStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/job-description')}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 relative">
      {/* Video Monitoring Component */}
      {testStarted && <VideoMonitoring onViolation={handleViolation} />}
      
      {/* Violation Warning Banner */}
      {violations.size > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-800">Test Monitoring Alert</h3>
                <ul className="text-sm text-red-700 mt-1">
                  {violations.has('mobile') && (
                    <li>• Mobile device detected. Please use a desktop/laptop for the test.</li>
                  )}
                  {violations.has('multiple_faces') && (
                    <li>• Multiple people detected in camera. Only the test taker should be visible.</li>
                  )}
                  {violations.has('no_camera') && (
                    <li>• Camera access is required. Please enable camera permissions.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header with Timer */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Interview Test</h1>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className={`text-3xl font-bold ${
              timeRemaining < 300 ? 'text-red-600' : 'text-gray-800'
            }`}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {answeredCount} of {questions.length} questions answered
            </p>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  Question {currentQuestionIndex + 1}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  currentQuestion.question_type === 'coding' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {currentQuestion.is_mcq ? 'Multiple Choice' : 'Coding Question'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQuestion.question_text}
              </h2>
            </div>

            {/* MCQ Options */}
            {currentQuestion.is_mcq && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                  const isSelected = currentAnswer === optionLetter;

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(optionLetter)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="font-semibold text-gray-700 mr-2">
                          {optionLetter}.
                        </span>
                        <span className="text-gray-800">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Open-Ended Question (Coding/Programming) */}
            {!currentQuestion.is_mcq && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>📝 Coding Question:</strong> Please write your solution in the text area below. You can write code, pseudocode, or explain your approach.
                  </p>
                </div>
                <textarea
                  value={currentOpenEndedAnswer}
                  onChange={(e) => handleOpenEndedAnswerChange(e.target.value)}
                  placeholder="Write your answer here... You can include code, explanations, or both."
                  className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none font-mono text-sm"
                  style={{ fontFamily: 'monospace' }}
                />
                <p className="text-xs text-gray-500">
                  Tip: Use proper indentation and formatting for code. Explain your approach if needed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              {questions.map((_, index) => {
                const question = questions[index];
                const isAnswered = question.is_mcq 
                  ? answers.has(question.id) 
                  : openEndedAnswers.has(question.id) && openEndedAnswers.get(question.id)!.trim().length > 0;
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isAnswered
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || testCompleted}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {submitting ? 'Submitting...' : testCompleted ? 'Submitted' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
