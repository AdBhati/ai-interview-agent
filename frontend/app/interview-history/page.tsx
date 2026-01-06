'use client';

/**
 * Interview History Page
 * Shows all interviews with their results, scores, and reports
 */
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';

interface InterviewHistory {
  id: number;
  resume: number;
  resume_details: {
    id: number;
    original_filename: string;
    file_size_mb: number;
  } | null;
  job_description: {
    id: number;
    title: string;
    company: string;
  } | null;
  title: string;
  status: string;
  time_limit_minutes: number;
  total_questions: number;
  total_score: number;
  average_score: number;
  completion_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  questions: any[];
  answers: any[];
  report: any | null;
}

export default function InterviewHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resume_id') ? parseInt(searchParams.get('resume_id')!) : undefined;
  const jdId = searchParams.get('jd_id') ? parseInt(searchParams.get('jd_id')!) : undefined;

  const [interviews, setInterviews] = useState<InterviewHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'completed', // Default to completed
    limit: 50,
    offset: 0,
  });

  useEffect(() => {
    loadHistory();
  }, [resumeId, jdId, filters.status, filters.offset]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        limit: filters.limit,
        offset: filters.offset,
      };
      if (resumeId) params.resume_id = resumeId;
      if (jdId) params.job_description_id = jdId;
      if (filters.status) params.status = filters.status;

      const response = await api.interviews.getHistory(params);
      setInterviews(response.data.results || []);
      setTotalCount(response.data.count || 0);
    } catch (err: any) {
      console.error('Error loading interview history:', err);
      setError(err.response?.data?.error || 'Failed to load interview history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const handleViewDetails = (interviewId: number) => {
    router.push(`/results?interview=${interviewId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Interview History</h1>
              <p className="text-gray-600">View all interviews with results and scores</p>
            </div>
            <button
              onClick={() => router.push('/job-description')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to JDs
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, offset: 0 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="created">Created</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="text-sm text-gray-600">
              Total: {totalCount} interview(s)
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading interview history...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && interviews.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 mb-4">No interviews found.</p>
            <p className="text-sm text-gray-500">Start conducting interviews to see history here.</p>
          </div>
        )}

        {/* Interview List */}
        {!loading && interviews.length > 0 && (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{interview.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(interview.status)}`}>
                        {interview.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {interview.resume_details && (
                        <p>Resume: <span className="font-semibold">{interview.resume_details.original_filename}</span></p>
                      )}
                      {interview.job_description && (
                        <p>Job: <span className="font-semibold">{interview.job_description.title}</span>
                          {interview.job_description.company && ` at ${interview.job_description.company}`}
                        </p>
                      )}
                      <p>Created: {formatDate(interview.created_at)}</p>
                      {interview.started_at && <p>Started: {formatDate(interview.started_at)}</p>}
                      {interview.completed_at && <p>Completed: {formatDate(interview.completed_at)}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(interview.average_score)}`}>
                      {interview.average_score.toFixed(1)}/10
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Average Score</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="text-xs text-gray-600 mb-1">Total Score</div>
                    <div className="text-xl font-semibold">{interview.total_score.toFixed(1)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="text-xs text-gray-600 mb-1">Questions</div>
                    <div className="text-xl font-semibold">{interview.total_questions}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="text-xs text-gray-600 mb-1">Completion</div>
                    <div className="text-xl font-semibold">{interview.completion_percentage.toFixed(0)}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="text-xs text-gray-600 mb-1">Time Limit</div>
                    <div className="text-xl font-semibold">{interview.time_limit_minutes}m</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(interview.id)}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    View Details & Report
                  </button>
                  {interview.report && (
                    <button
                      onClick={() => router.push(`/results?interview=${interview.id}`)}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                    >
                      View Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalCount > filters.limit && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) })}
              disabled={filters.offset === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="px-4 py-2 text-gray-600">
              Showing {filters.offset + 1} - {Math.min(filters.offset + filters.limit, totalCount)} of {totalCount}
            </div>
            <button
              onClick={() => setFilters({ ...filters, offset: filters.offset + filters.limit })}
              disabled={filters.offset + filters.limit >= totalCount}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

