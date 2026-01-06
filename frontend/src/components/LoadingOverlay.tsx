import { useEffect, useState } from "react";

const loadingMessages = [
  "Great answers take a moment to shape.",
  "Thinking… preparing your next opportunity.",
  "Every pause builds clarity.",
  "Your journey is being evaluated, not rushed.",
  "Good things load with intention.",
  "Precision takes a second. Excellence lasts longer.",
  "Crafting meaningful questions for you.",
  "Turning experience into insight.",
  "Analyzing with purpose.",
  "Strong interviews begin with thoughtful pauses.",
];

export const LoadingOverlay = ({ show }: { show: boolean }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (show) {
      document.body.style.overflowY = "hidden";
    }

    return () => {
      document.body.style.overflowY = "";
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/30 backdrop-blur-xs">
      <div className="flex flex-col items-center text-center max-w-md px-6">
        {/* Spinner */}
        <div className="mb-6">
          {/* <span className="material-symbols-outlined text-primary text-5xl animate-spin">
            progress_activity
          </span> */}
        </div>

        {/* Animated Text */}
        <p
          key={index}
          className="text-black/80 font-medium transition-opacity duration-500 animate-fade-in"
        >
          {loadingMessages[index]}
        </p>
      </div>
    </div>
  );
};
