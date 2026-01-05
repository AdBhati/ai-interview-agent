'use client';

/**
 * Job Description Page - List View with Create Form
 * Shows all job descriptions, can create new ones
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

interface JobDescription {
  id: number;
  title: string;
  company: string;
  description: string;
  required_skills: string;
  experience_level: string;
  location: string;
  salary_range: string;
  created_at: string;
}

interface JobDescriptionForm {
  title: string;
  company: string;
  description: string;
  required_skills: string;
  experience_level: string;
  location: string;
  salary_range: string;
}

export default function JobDescriptionPage() {
  const router = useRouter();
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<JobDescriptionForm>({
    title: '',
    company: '',
    description: '',
    required_skills: '',
    experience_level: 'mid',
    location: '',
    salary_range: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobDescriptions();
  }, []);

  const loadJobDescriptions = async () => {
    setLoading(true);
    try {
      const response = await api.jobDescriptions.list();
      setJobDescriptions(response.data || []);
    } catch (err: any) {
      console.error('Error loading job descriptions:', err);
      setError('Failed to load job descriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Job title and description are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await api.jobDescriptions.create({
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description.trim(),
        required_skills: formData.required_skills.trim(),
        experience_level: formData.experience_level,
        location: formData.location.trim(),
        salary_range: formData.salary_range.trim(),
      });
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        required_skills: '',
        experience_level: 'mid',
        location: '',
        salary_range: '',
      });
      setShowCreateForm(false);
      
      // Reload list
      loadJobDescriptions();
    } catch (err: any) {
      console.error('Error creating job description:', err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.title) {
          setError(Array.isArray(errorData.title) ? errorData.title[0] : errorData.title);
        } else if (errorData.description) {
          setError(Array.isArray(errorData.description) ? errorData.description[0] : errorData.description);
        } else if (errorData.error) {
          setError(errorData.error);
        } else {
          setError('Failed to save job description. Please try again.');
        }
      } else {
        setError('Failed to save job description. Please check your connection and try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleViewATS = (jdId: number) => {
    router.push(`/ats-matches?jd=${jdId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Job Descriptions
            </h1>
            <p className="text-gray-600">
              Manage job descriptions and view ATS matches
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            {showCreateForm ? 'Cancel' : '+ Create New JD'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Job Description</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Tech Corp"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Paste the full job description here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="required_skills" className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Skills
                </label>
                <textarea
                  id="required_skills"
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., Python, React, Django, AWS"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="experience_level" className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    id="experience_level"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Remote, San Francisco"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="salary_range" className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    id="salary_range"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="e.g., $80k - $120k"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {saving ? 'Saving...' : 'Save Job Description'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Job Descriptions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading job descriptions...</p>
          </div>
        ) : jobDescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 mb-4">No job descriptions yet.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Create Your First Job Description
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobDescriptions.map((jd) => (
              <div
                key={jd.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleViewATS(jd.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{jd.title}</h3>
                    {jd.company && (
                      <p className="text-gray-600 text-sm mb-2">{jd.company}</p>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {jd.description.substring(0, 150)}...
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {jd.location && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      📍 {jd.location}
                    </span>
                  )}
                  {jd.experience_level && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {jd.experience_level}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewATS(jd.id);
                  }}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  View ATS Matches →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
