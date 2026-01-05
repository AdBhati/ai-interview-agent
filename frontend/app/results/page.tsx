'use client';

/**
 * Results Page
 * Displays interview report and feedback
 */
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';

interface ReportData {
  id: number;
  overall_score: number;
  technical_score: number;
  behavioral_score: number;
  communication_score: number;
  summary: string;
  strengths: string;
  areas_for_improvement: string;
  recommendations: string;
  total_questions: number;
  questions_answered: number;
  average_answer_length: number;
}

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('id') || localStorage.getItem('interviewId');
  
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (interviewId) {
      loadReport();
    } else {
      setError('No interview ID provided');
      setLoading(false);
    }
  }, [interviewId]);

  const loadReport = async () => {
    if (!interviewId) return;
    
    try {
      setLoading(true);
      const response = await api.interviews.getReport(parseInt(interviewId));
      setReport(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Report doesn't exist, offer to generate
        setError(null);
      } else {
        setError('Failed to load report');
        console.error('Error loading report:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!interviewId) return;
    
    try {
      setGenerating(true);
      const response = await api.interviews.generateReport(parseInt(interviewId));
      setReport(response.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to generate report. Please try again.');
      console.error('Error generating report:', err);
    } finally {
      setGenerating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/interview')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Interview
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Report Not Found</h2>
          <p className="text-gray-600 mb-6">Generate a report to see your interview results.</p>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Interview Report</h1>
            <p className="text-gray-600">Your performance analysis and feedback</p>
          </div>

          {/* Overall Score */}
          <div className={`mb-8 p-6 rounded-lg ${getScoreBgColor(report.overall_score)}`}>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Overall Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(report.overall_score)}`}>
                {report.overall_score.toFixed(1)}/10
              </p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Technical</p>
              <p className="text-2xl font-bold text-blue-600">{report.technical_score.toFixed(1)}/10</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Behavioral</p>
              <p className="text-2xl font-bold text-purple-600">{report.behavioral_score.toFixed(1)}/10</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Communication</p>
              <p className="text-2xl font-bold text-indigo-600">{report.communication_score.toFixed(1)}/10</p>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
          </div>

          {/* Strengths */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Strengths</h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{report.strengths}</p>
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Areas for Improvement</h2>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{report.areas_for_improvement}</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Recommendations</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{report.recommendations}</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Statistics</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">{report.total_questions}</p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{report.questions_answered}</p>
                <p className="text-sm text-gray-600">Questions Answered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{Math.round(report.average_answer_length)}</p>
                <p className="text-sm text-gray-600">Avg Answer Length</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/interview')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Interview
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
