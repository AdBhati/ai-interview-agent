'use client';

/**
 * ProgressTracker Component
 * Shows interview progress and question status
 */
interface Question {
  id: string;
  question: string;
  status: 'pending' | 'current' | 'completed';
}

interface ProgressTrackerProps {
  questions: Question[];
  currentQuestionIndex: number;
  totalQuestions: number;
}

export default function ProgressTracker({
  questions,
  currentQuestionIndex,
  totalQuestions,
}: ProgressTrackerProps) {
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Interview Progress
          </h3>
          <span className="text-sm text-gray-600">
            {currentQuestionIndex} / {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {Math.round(progressPercentage)}% Complete
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold text-gray-700 mb-3">
          Questions
        </h4>
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
              question.status === 'current'
                ? 'border-blue-500 bg-blue-50'
                : question.status === 'completed'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {/* Status Indicator */}
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                question.status === 'current'
                  ? 'bg-blue-500 text-white'
                  : question.status === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {question.status === 'completed' ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Question Text */}
            <div className="flex-1">
              <p
                className={`text-sm ${
                  question.status === 'current'
                    ? 'font-semibold text-blue-900'
                    : question.status === 'completed'
                    ? 'text-green-900 line-through'
                    : 'text-gray-600'
                }`}
              >
                {question.question}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

