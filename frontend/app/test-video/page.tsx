'use client';

/**
 * Test Video Monitoring Page
 * Direct access to test video monitoring features
 */
import VideoMonitoring from '@/components/VideoMonitoring';
import { useState } from 'react';

export default function TestVideoPage() {
  const [violations, setViolations] = useState<Set<string>>(new Set());

  const handleViolation = (type: 'mobile' | 'multiple_faces' | 'no_camera') => {
    setViolations((prev) => {
      const newViolations = new Set(prev);
      newViolations.add(type);
      return newViolations;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎥 Video Monitoring Test
          </h1>
          <p className="text-gray-600 mb-6">
            This page allows you to test the video monitoring features including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Camera and microphone access</li>
            <li>Face detection</li>
            <li>Multiple person detection</li>
            <li>Mobile device detection</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The video monitoring component should appear in the bottom-right corner.
              Please allow camera and microphone permissions when prompted.
            </p>
          </div>
        </div>

        {/* Violation Warning Banner */}
        {violations.size > 0 && (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-800">Monitoring Alert</h3>
                <ul className="text-sm text-red-700 mt-1">
                  {violations.has('mobile') && (
                    <li>• Mobile device detected. Please use a desktop/laptop for the test.</li>
                  )}
                  {violations.has('multiple_faces') && (
                    <li>• Multiple people detected in camera. Only the test taker should be visible.</li>
                  )}
                  {violations.has('no_camera') && (
                    <li>• Camera access is required. Please enable camera permissions.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Test Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Test Instructions</h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <strong>Camera Access:</strong> Allow camera and microphone when prompted.
                The video feed should appear in the bottom-right corner.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <strong>Face Detection:</strong> The system will detect faces in real-time.
                You should see a face count indicator.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <strong>Multiple Person Test:</strong> Have another person stand behind you
                to test multiple face detection. A warning should appear.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <strong>Mobile Detection:</strong> If accessing from a mobile device,
                a warning will be shown automatically.
              </div>
            </div>
          </div>
        </div>

        {/* Video Monitoring Component */}
        <VideoMonitoring onViolation={handleViolation} />
      </div>
    </div>
  );
}

