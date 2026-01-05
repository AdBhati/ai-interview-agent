'use client';

/**
 * ATS Matches Page
 * View all resume matches for a job description
 */
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';

interface ATSMatch {
  id: number;
  job_description: number;
  job_description_details: {
    id: number;
    title: string;
    company: string;
  };
  resume: number;
  resume_details: {
    id: number;
    original_filename: string;
    file_size_mb: number;
  };
  overall_score: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  match_analysis: string;
  strengths: string;
  gaps: string;
  recommendations: string;
  status: string;
  match_percentage: number;
  is_strong_match: boolean;
  is_moderate_match: boolean;
  is_weak_match: boolean;
  created_at: string;
}

export default function ATSMatchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobDescriptionId = searchParams.get('jd') ? parseInt(searchParams.get('jd')!) : null;

  const [matches, setMatches] = useState<ATSMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<any>(null);

  useEffect(() => {
    if (jobDescriptionId) {
      loadMatches();
    } else {
      loadAllMatches();
    }
  }, [jobDescriptionId]);

  const loadMatches = async () => {
    if (!jobDescriptionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.interviews.getMatches(jobDescriptionId);
      setMatches(response.data.matches || []);
      setJobDescription({
        id: response.data.job_description_id,
        title: response.data.job_description_title,
      });
    } catch (err: any) {
      console.error('Error loading matches:', err);
      setError(err.response?.data?.error || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const loadAllMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.interviews.getAllMatches();
      setMatches(response.data.matches || []);
    } catch (err: any) {
      console.error('Error loading matches:', err);
      setError(err.response?.data?.error || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchAllResumes = async () => {
    if (!jobDescriptionId) return;
    
    setMatching(true);
    setError(null);
    
    try {
      const response = await api.interviews.matchAllResumes(jobDescriptionId);
      setMatches(response.data.matches || []);
      alert(`Successfully matched ${response.data.matches_created} resume(s)!`);
    } catch (err: any) {
      console.error('Error matching resumes:', err);
      setError(err.response?.data?.error || 'Failed to match resumes');
    } finally {
      setMatching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Strong Match';
    if (score >= 50) return 'Moderate Match';
    return 'Weak Match';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ATS Resume Matches
              </h1>
              {jobDescription && (
                <p className="text-gray-600">
                  Job: <span className="font-semibold">{jobDescription.title}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              {jobDescriptionId && (
                <button
                  onClick={handleMatchAllResumes}
                  disabled={matching}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {matching ? 'Matching...' : 'Match All Resumes'}
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
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
              <p className="mt-4 text-gray-600">Loading matches...</p>
            </div>
          )}

          {/* Matches List */}
          {!loading && matches.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No matches found.</p>
              {jobDescriptionId && (
                <button
                  onClick={handleMatchAllResumes}
                  disabled={matching}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {matching ? 'Matching...' : 'Match All Resumes'}
                </button>
              )}
            </div>
          )}

          {!loading && matches.length > 0 && (
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {match.resume_details.original_filename}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>File Size: {match.resume_details.file_size_mb} MB</span>
                        <span>•</span>
                        <span>Matched: {new Date(match.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-semibold ${getScoreColor(match.overall_score)}`}>
                      <div className="text-2xl">{match.overall_score.toFixed(1)}%</div>
                      <div className="text-xs">{getScoreLabel(match.overall_score)}</div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600 mb-1">Skills</div>
                      <div className="text-lg font-semibold">{match.skills_score.toFixed(1)}%</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600 mb-1">Experience</div>
                      <div className="text-lg font-semibold">{match.experience_score.toFixed(1)}%</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600 mb-1">Education</div>
                      <div className="text-lg font-semibold">{match.education_score.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Analysis */}
                  {match.match_analysis && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Match Analysis</h4>
                      <p className="text-sm text-gray-600">{match.match_analysis}</p>
                    </div>
                  )}

                  {/* Strengths and Gaps */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {match.strengths && (
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">✓ Strengths</h4>
                        <p className="text-sm text-gray-600">{match.strengths}</p>
                      </div>
                    )}
                    {match.gaps && (
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">⚠ Gaps</h4>
                        <p className="text-sm text-gray-600">{match.gaps}</p>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  {match.recommendations && (
                    <div className="bg-blue-50 p-3 rounded mb-4">
                      <h4 className="font-semibold text-blue-700 mb-2">💡 Recommendations</h4>
                      <p className="text-sm text-gray-700">{match.recommendations}</p>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                      match.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                    <button
                      onClick={() => router.push(`/interview?jd=${match.job_description}&resume=${match.resume}`)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Start Interview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

