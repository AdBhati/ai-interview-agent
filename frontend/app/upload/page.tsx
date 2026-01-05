'use client';

/**
 * Upload Page
 * Upload resume/CV for interview preparation
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [extracting, setExtracting] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.resumes.upload(formData);
      
      console.log('Resume uploaded successfully:', response.data);
      
      // Store resume data
      setResumeData(response.data);
      
      // Store resume ID in localStorage for later use
      if (response.data.id) {
        localStorage.setItem('resumeId', response.data.id.toString());
      }

      // Check if text extraction is in progress
      if (response.data.status === 'processing') {
        setExtracting(true);
        // Poll for extraction completion
        pollForExtraction(response.data.id);
      } else if (response.data.status === 'extracted') {
        setSuccess(true);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      
      // Extract error message from response
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.file) {
          setError(Array.isArray(errorData.file) ? errorData.file[0] : errorData.file);
        } else if (errorData.error) {
          setError(errorData.error);
        } else {
          setError('Failed to upload resume. Please try again.');
        }
      } else {
        setError('Failed to upload resume. Please check your connection and try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const pollForExtraction = async (resumeId: number) => {
    // Poll every 2 seconds for extraction status
    const maxAttempts = 30; // 60 seconds max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await api.resumes.get(resumeId);
        const resume = response.data;

        if (resume.status === 'extracted') {
          setExtracting(false);
          setResumeData(resume);
          setSuccess(true);
        } else if (resume.status === 'failed') {
          setExtracting(false);
          setError('Failed to extract text from PDF. The resume was uploaded but text extraction failed.');
          setResumeData(resume);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 2000);
        } else {
          setExtracting(false);
          setError('Text extraction is taking longer than expected. You can continue to the interview.');
          setResumeData(resume);
        }
      } catch (err) {
        console.error('Error polling extraction status:', err);
        setExtracting(false);
      }
    };

    poll();
  };

  const handleExtractText = async () => {
    if (!resumeData?.id) return;

    setExtracting(true);
    setError(null);

    try {
      const response = await api.resumes.extractText(resumeData.id);
      setResumeData(response.data);
      setExtracting(false);
      setSuccess(true);
    } catch (err: any) {
      setExtracting(false);
      setError(err.response?.data?.error || 'Failed to extract text from PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Upload Your Resume
        </h1>
        <p className="text-gray-600 mb-8">
          Upload your resume or CV to get started with the AI interview.
        </p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">PDF files only (MAX. 10MB)</p>
          </label>
        </div>

        {/* Selected File */}
        {file && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700"
              disabled={uploading}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Extraction Status */}
        {extracting && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <p className="text-blue-700">Extracting text from PDF...</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && !extracting && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <p className="font-semibold mb-2">✓ Resume uploaded successfully!</p>
            {resumeData?.status === 'extracted' && (
              <p className="text-sm">Text extracted from PDF successfully.</p>
            )}
          </div>
        )}

        {/* Extracted Text Preview */}
        {resumeData && resumeData.extracted_text && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Extracted Text Preview</h3>
            <div className="max-h-60 overflow-y-auto text-sm text-gray-600 bg-white p-3 rounded border">
              <p className="whitespace-pre-wrap">
                {resumeData.extracted_text.substring(0, 500)}
                {resumeData.extracted_text.length > 500 && '...'}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {resumeData.extracted_text.length} characters extracted
            </p>
          </div>
        )}

        {/* Manual Extract Button (if extraction failed or not done) */}
        {resumeData && resumeData.status !== 'extracted' && !extracting && (
          <div className="mb-6">
            <button
              onClick={handleExtractText}
              disabled={extracting}
              className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {resumeData.status === 'failed' ? 'Retry Text Extraction' : 'Extract Text from PDF'}
            </button>
          </div>
        )}

        {/* Upload Button */}
        {!success && (
          <button
            onClick={handleUpload}
            disabled={!file || uploading || extracting}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        )}

        {/* Continue Button (after successful upload) */}
        {success && !extracting && (
          <div className="space-y-3">
            <button
              onClick={() => router.push('/job-description')}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Add Job Description
            </button>
            <button
              onClick={() => router.push('/interview')}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Continue to Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

