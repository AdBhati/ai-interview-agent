export default function HowItWorksSection() {
  return (
    <div id="howItworks" className="relative flex w-full flex-col bg-slate-50 py-20 border-t border-slate-100">
      <div className="layout-container flex flex-col items-center">
        <div className="max-w-[960px] w-full px-6">
          <div className="text-center mb-12">
            <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-[-0.015em]">
              How It Works
            </h2>
            <p className="text-slate-500 mt-3 text-lg">
              From candidate invite to final score in minutes.
            </p>
          </div>
          <div className="grid grid-cols-[40px_1fr] gap-x-6 px-4">
            <div className="flex flex-col items-center gap-1 pt-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-lg shadow-primary/30 z-10">
                <span className="material-symbols-outlined text-lg">link</span>
              </div>
              <div className="w-[2px] bg-gradient-to-b from-primary/50 to-slate-200 h-full grow min-h-[60px]" />
            </div>
            <div className="flex flex-1 flex-col pb-10 pt-1 pl-4">
              <h3 className="text-slate-900 text-xl font-bold leading-normal">
                Candidate Joins
              </h3>
              <p className="text-slate-600 text-base font-normal leading-relaxed mt-1">
                Recruiters send a magic link. Candidates click to start
                immediately—no downloads required.
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary border-2 border-primary/20 shadow-sm z-10">
                <span className="material-symbols-outlined">video_chat</span>
              </div>
              <div className="w-[2px] bg-slate-200 h-full grow min-h-[60px]" />
            </div>
            <div className="flex flex-1 flex-col pb-10 pt-1 pl-4">
              <h3 className="text-slate-900 text-xl font-bold leading-normal">
                AI Conducts Interview
              </h3>
              <p className="text-slate-600 text-base font-normal leading-relaxed mt-1">
                Our AI avatar engages in a natural conversation, asking
                job-specific questions.
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary border-2 border-primary/20 shadow-sm z-10">
                <span className="material-symbols-outlined">
                  psychology_alt
                </span>
              </div>
              <div className="w-[2px] bg-slate-200 h-full grow min-h-[60px]" />
            </div>
            <div className="flex flex-1 flex-col pb-10 pt-1 pl-4">
              <h3 className="text-slate-900 text-xl font-bold leading-normal">
                Adaptive Questioning
              </h3>
              <p className="text-slate-600 text-base font-normal leading-relaxed mt-1">
                Based on the candidate&apos;s answers, the AI digs deeper with
                follow-up questions to verify expertise.
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary border-2 border-primary/20 shadow-sm z-10">
                <span className="material-symbols-outlined">
                  assignment_turned_in
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col pt-1 pl-4">
              <h3 className="text-slate-900 text-xl font-bold leading-normal">
                Instant Report
              </h3>
              <p className="text-slate-600 text-base font-normal leading-relaxed mt-1">
                Get a scored report with transcripts, soft-skill analysis, and
                technical rankings instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
