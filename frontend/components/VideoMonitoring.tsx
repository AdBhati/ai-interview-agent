'use client';

import { useState, useEffect, useRef } from 'react';

interface VideoMonitoringProps {
  onViolation?: (type: 'mobile' | 'multiple_faces' | 'no_camera') => void;
}

export default function VideoMonitoring({ onViolation }: VideoMonitoringProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<{
    mobile: boolean;
    multipleFaces: boolean;
    noCamera: boolean;
  }>({
    mobile: false,
    multipleFaces: false,
    noCamera: false,
  });
  const [faceCount, setFaceCount] = useState(0);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  };

  // Simple face detection using canvas analysis
  // This is a basic implementation - for production, use a proper ML model
  const detectFacesBasic = () => {
    if (!videoRef.current || !isActive) {
      return;
    }

    try {
      const video = videoRef.current;
      
      // Basic check: if video is playing and has dimensions, assume 1 face
      // This is a simplified version - in production, use proper face detection
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        // For now, we'll use a simple heuristic: if video is active, assume 1 person
        // Multiple person detection would require proper ML model
        setFaceCount(1);
        setWarnings((prev) => ({ ...prev, multipleFaces: false }));
      }
    } catch (err) {
      console.error('Error in basic face detection:', err);
    }
  };

  // Start video monitoring
  const startMonitoring = async () => {
    try {
      setError(null);
      
      // Check for mobile device
      if (isMobileDevice()) {
        setWarnings((prev) => ({ ...prev, mobile: true }));
        onViolation?.('mobile');
      }

      // Request camera and microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: true,
      });

      setStream(mediaStream);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Start face detection
      startFaceDetection();
    } catch (err: any) {
      console.error('Error accessing camera/microphone:', err);
      setError('Camera and microphone access is required for the test.');
      setWarnings((prev) => ({ ...prev, noCamera: true }));
      onViolation?.('no_camera');
    }
  };

  // Stop video monitoring
  const stopMonitoring = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  // Face detection function (simplified)
  const detectFaces = () => {
    detectFacesBasic();
  };

  // Start periodic face detection
  const startFaceDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    // Detect faces every 1 second
    detectionIntervalRef.current = setInterval(() => {
      detectFaces();
    }, 1000);

    // Initial detection
    detectFaces();
  };

  // Auto-start when component mounts
  useEffect(() => {
    startMonitoring();

    return () => {
      stopMonitoring();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 p-3">
        {/* Video Feed */}
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-48 h-36 rounded-lg object-cover bg-black"
          />
          
          {/* Status Indicator */}
          <div className="absolute top-2 right-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
              title={isActive ? 'Camera Active' : 'Camera Inactive'}
            />
          </div>

          {/* Face Count Indicator */}
          {isActive && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              👤 {faceCount} {faceCount === 1 ? 'Person' : 'People'}
            </div>
          )}
        </div>

        {/* Warnings */}
        <div className="mt-2 space-y-1">
          {warnings.mobile && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded flex items-center gap-1">
              <span>⚠️</span>
              <span>Mobile device detected</span>
            </div>
          )}
          {warnings.multipleFaces && (
            <div className="bg-red-100 border border-red-400 text-red-800 text-xs px-2 py-1 rounded flex items-center gap-1">
              <span>🚫</span>
              <span>Multiple people detected</span>
            </div>
          )}
          {warnings.noCamera && (
            <div className="bg-red-100 border border-red-400 text-red-800 text-xs px-2 py-1 rounded flex items-center gap-1">
              <span>❌</span>
              <span>Camera access required</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 bg-red-50 border border-red-200 text-red-700 text-xs px-2 py-1 rounded">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="mt-2 flex gap-2">
          {!isActive ? (
            <button
              onClick={startMonitoring}
              className="flex-1 bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              Enable Camera
            </button>
          ) : (
            <button
              onClick={stopMonitoring}
              className="flex-1 bg-gray-500 text-white text-xs px-3 py-1 rounded hover:bg-gray-600 transition-colors"
            >
              Disable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

