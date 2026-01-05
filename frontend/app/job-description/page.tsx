'use client';

/**
 * Job Description Page
 * Input job description for personalized interview questions
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

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
  const [success, setSuccess] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);

  useEffect(() => {
    // Get resume ID from localStorage if available
    const storedResumeId = localStorage.getItem('resumeId');
    if (storedResumeId) {
      setResumeId(parseInt(storedResumeId));
    }
  }, []);

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
    setSuccess(false);

    try {
      const payload: any = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description.trim(),
        required_skills: formData.required_skills.trim(),
        experience_level: formData.experience_level,
        location: formData.location.trim(),
        salary_range: formData.salary_range.trim(),
      };

      // Add resume ID if available
      if (resumeId) {
        payload.resume = resumeId;
      }

      const response = await api.jobDescriptions.create(payload);
      
      console.log('Job description created:', response.data);
      
      // Store job description ID
      if (response.data.id) {
        localStorage.setItem('jobDescriptionId', response.data.id.toString());
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/interview');
      }, 1500);
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Job Description
          </h1>
          <p className="text-gray-600 mb-8">
            Enter the job description to get personalized interview questions
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
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
                placeholder="e.g., Software Engineer, Product Manager"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Company */}
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
                placeholder="e.g., Tech Corp, Startup Inc"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Job Description */}
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
                rows={8}
                placeholder="Paste the full job description here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length} characters
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <label htmlFor="required_skills" className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills
              </label>
              <textarea
                id="required_skills"
                name="required_skills"
                value={formData.required_skills}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Python, React, Django, AWS (comma or newline separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Experience Level and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="e.g., Remote, San Francisco, New York"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label htmlFor="salary_range" className="block text-sm font-semibold text-gray-700 mb-2">
                Salary Range (Optional)
              </label>
              <input
                type="text"
                id="salary_range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g., $80k - $120k, £50k - £70k"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Resume Info */}
            {resumeId && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  ✓ This job description will be linked to your uploaded resume
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Job description saved successfully! Redirecting to interview...
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {saving ? 'Saving...' : 'Save & Continue to Interview'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={saving}
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

