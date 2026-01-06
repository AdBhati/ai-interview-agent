'use client';

/**
 * Home Page
 * Landing page for the AI Interview System
 */
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Interview System
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Practice and improve your interview skills with AI-powered feedback
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Upload Resume
              </h3>
              <p className="text-gray-600 text-sm">
                Upload your resume to get personalized interview questions
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                AI Interview
              </h3>
              <p className="text-gray-600 text-sm">
                Practice with AI interviewer using voice or text responses
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Get Feedback
              </h3>
              <p className="text-gray-600 text-sm">
                Receive detailed feedback and improvement suggestions
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/job-description"
              className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg shadow-lg"
            >
              Create Job Description
            </Link>
            <Link
              href="/upload"
              className="px-8 py-4 bg-white text-blue-500 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg shadow-lg"
            >
              Upload Resume
            </Link>
            <Link
              href="/interview-history"
              className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg shadow-lg"
            >
              View Interview History
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-gray-600">
            <p className="mb-2">
              Powered by advanced AI technology to help you ace your interviews
            </p>
            <p className="text-sm">
              Practice anytime, anywhere, and get instant feedback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
