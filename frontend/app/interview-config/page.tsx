'use client';

/**
 * Interview Configuration Page
 * HR sets number of questions and time limit for the interview
 */
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';

export default function InterviewConfigPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobDescriptionId = searchParams.get('jd') ? parseInt(searchParams.get('jd')!) : null;
  const resumeId = searchParams.get('resume') ? parseInt(searchParams.get('resume')!) : null;
  const matchId = searchParams.get('match') ? parseInt(searchParams.get('match')!) : null;

  const [numQuestions, setNumQuestions] = useState(5);
  const [timeLimit, setTimeLimit] = useState(30); // in minutes
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobDescriptionId || !resumeId) {
      router.push('/job-description');
    }
  }, [jobDescriptionId, resumeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescriptionId || !resumeId) {
      setError('Missing job description or resume information');
      return;
    }

    if (numQuestions < 5 || numQuestions > 10) {
      setError('Number of questions must be between 5 and 10');
      return;
    }

    if (timeLimit < 10 || timeLimit > 120) {
      setError('Time limit must be between 10 and 120 minutes');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      // Create interview session
      const interviewResponse = await api.interviews.create({
        resume: resumeId,
        job_description: jobDescriptionId,
      });

      const interviewId = interviewResponse.data.id;

      // Generate questions
      await api.interviews.generateQuestions(interviewId, numQuestions);

      // Start interview
      await api.interviews.start(interviewId);

      // Store interview config in localStorage
      localStorage.setItem('interviewConfig', JSON.stringify({
        interviewId,
        numQuestions,
        timeLimitMinutes: timeLimit,
        timeLimitSeconds: timeLimit * 60,
      }));

      // Navigate to interview/test engine
      router.push(`/interview?id=${interviewId}&questions=${numQuestions}&time=${timeLimit * 60}`);
    } catch (err: any) {
      console.error('Error creating interview:', err);
      setError(err.response?.data?.error || 'Failed to create interview. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Configure Interview Test
          </h1>
          <p className="text-gray-600 mb-8">
            Set the number of questions and time limit for the candidate's test
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Number of Questions */}
            <div>
              <label htmlFor="numQuestions" className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Questions <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="numQuestions"
                  min="5"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="w-20 text-center">
                  <span className="text-2xl font-bold text-blue-600">{numQuestions}</span>
                  <span className="text-gray-600 text-sm"> questions</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select between 5 to 10 questions (MCQ format)
              </p>
            </div>

            {/* Time Limit */}
            <div>
              <label htmlFor="timeLimit" className="block text-sm font-semibold text-gray-700 mb-2">
                Time Limit (Minutes) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="timeLimit"
                  min="10"
                  max="120"
                  step="5"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="w-24 text-center">
                  <span className="text-2xl font-bold text-green-600">{timeLimit}</span>
                  <span className="text-gray-600 text-sm"> minutes</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select between 10 to 120 minutes
              </p>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  ⏱️ Total time: <strong>{timeLimit} minutes</strong> ({timeLimit * 60} seconds)
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Average time per question: ~{Math.round((timeLimit * 60) / numQuestions)} seconds
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
              >
                {creating ? 'Creating Test...' : '🚀 Start Test Engine'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={creating}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

