'use client';

/**
 * ATS Matches Page - For specific Job Description
 * Shows resume upload, all resumes for this JD, ATS scores, and Conduct Interview button
 */
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';

interface ATSMatch {
  id: number;
  job_description: number;
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
  created_at: string;
}

interface Resume {
  id: number;
  original_filename: string;
  file_size_mb: number;
  status: string;
  created_at: string;
}

export default function ATSMatchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobDescriptionId = searchParams.get('jd') ? parseInt(searchParams.get('jd')!) : null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobDescription, setJobDescription] = useState<any>(null);
  const [matches, setMatches] = useState<ATSMatch[]>([]);
  const [allResumes, setAllResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobDescriptionId) {
      loadData();
    } else {
      router.push('/job-description');
    }
  }, [jobDescriptionId]);

  const loadData = async () => {
    if (!jobDescriptionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load job description
      const jdResponse = await api.jobDescriptions.get(jobDescriptionId);
      setJobDescription(jdResponse.data);

      // Load matches
      const matchesResponse = await api.interviews.getMatches(jobDescriptionId);
      setMatches(matchesResponse.data.matches || []);

      // Load all resumes
      const resumesResponse = await api.resumes.list();
      setAllResumes(resumesResponse.data || []);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.resumes.upload(formData);
      
      // Reload data
      await loadData();
      
      // Auto-match the new resume
      if (jobDescriptionId && response.data.id) {
        await handleMatchResume(response.data.id);
      }
    } catch (err: any) {
      console.error('Error uploading resume:', err);
      setError(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleMatchResume = async (resumeId: number) => {
    if (!jobDescriptionId) return;
    
    setMatching(true);
    setError(null);
    
    try {
      await api.interviews.matchResume(jobDescriptionId, resumeId);
      await loadData(); // Reload matches
    } catch (err: any) {
      console.error('Error matching resume:', err);
      setError(err.response?.data?.error || 'Failed to match resume');
    } finally {
      setMatching(false);
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

  const handleConductInterview = (resumeId: number, matchId: number) => {
    // Navigate to interview configuration page
    router.push(`/interview-config?jd=${jobDescriptionId}&resume=${resumeId}&match=${matchId}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Strong Match';
    if (score >= 50) return 'Moderate Match';
    return 'Weak Match';
  };

  // Get resumes that are matched
  const matchedResumeIds = new Set(matches.map(m => m.resume));
  const unmatchedResumes = allResumes.filter(r => !matchedResumeIds.has(r.id) && r.status === 'extracted');

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ATS Resume Matches
              </h1>
              {jobDescription && (
                <div>
                  <p className="text-lg text-gray-700 font-semibold">{jobDescription.title}</p>
                  {jobDescription.company && (
                    <p className="text-gray-600">{jobDescription.company}</p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/job-description')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to JDs
            </button>
          </div>

          {/* Upload Resume Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
            <div className="text-center">
              <p className="text-gray-700 font-semibold mb-2">Upload Candidate Resume</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className={`inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Uploading...' : '📄 Upload Resume PDF'}
              </label>
              <p className="text-xs text-gray-500 mt-2">PDF files only, max 10MB</p>
            </div>
          </div>

          {/* Match All Button */}
          {unmatchedResumes.length > 0 && (
            <div className="text-center">
              <button
                onClick={handleMatchAllResumes}
                disabled={matching}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {matching ? 'Matching...' : `Match ${unmatchedResumes.length} Unmatched Resume(s)`}
              </button>
            </div>
          )}
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
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Matches List */}
        {!loading && matches.length === 0 && unmatchedResumes.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 mb-4">No resumes uploaded yet.</p>
            <p className="text-sm text-gray-500">Upload a resume to get started with ATS matching.</p>
          </div>
        )}

        {!loading && (matches.length > 0 || unmatchedResumes.length > 0) && (
          <div className="space-y-4">
            {/* Matched Resumes with ATS Scores */}
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {match.resume_details.original_filename}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Size: {match.resume_details.file_size_mb} MB</span>
                      <span>•</span>
                      <span>Matched: {new Date(match.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`px-6 py-3 rounded-lg font-semibold border-2 ${getScoreColor(match.overall_score)}`}>
                    <div className="text-3xl text-center">{match.overall_score.toFixed(1)}%</div>
                    <div className="text-xs text-center mt-1">{getScoreLabel(match.overall_score)}</div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="text-xs text-gray-600 mb-1">Skills</div>
                    <div className="text-xl font-semibold">{match.skills_score.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="text-xs text-gray-600 mb-1">Experience</div>
                    <div className="text-xl font-semibold">{match.experience_score.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="text-xs text-gray-600 mb-1">Education</div>
                    <div className="text-xl font-semibold">{match.education_score.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Conduct Interview Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleConductInterview(match.resume, match.id)}
                    className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
                  >
                    🎯 Conduct Interview
                  </button>
                </div>
              </div>
            ))}

            {/* Unmatched Resumes */}
            {unmatchedResumes.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Unmatched Resumes</h2>
                <div className="space-y-3">
                  {unmatchedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{resume.original_filename}</p>
                        <p className="text-sm text-gray-600">Size: {resume.file_size_mb} MB</p>
                      </div>
                      <button
                        onClick={() => handleMatchResume(resume.id)}
                        disabled={matching}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
                      >
                        Match Resume
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
