import Link from "next/link";

const InterviewInitiate = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10  flex flex-1 justify-center ">
          <div className="layout-content-container flex flex-col flex-1 w-full">
            <div className="flex flex-wrap justify-between gap-3 px-4 pb-3 pt-2">
              <div className="flex min-w-72 flex-col gap-2">
                <h1 className="text-[#0d141b] text-4xl font-black leading-tight tracking-[-0.033em]">
                  Start AI Interview
                </h1>
                <p className="text-slate-500 text-base font-normal leading-normal">
                  A streamlined process to assess your skills effectively.
                </p>
              </div>
            </div>
            {/* Main Content Card */}
            <main className="px-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="p-6 md:p-8 border-b border-slate-100">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        smart_toy
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-[#0d141b] mb-2">
                        How the AI Interview Works
                      </h2>
                      <p className="text-slate-500 max-w-2xl">
                        Our AI-powered interviewer will guide you through a
                        series of questions designed to highlight your
                        strengths. The process is unbiased, adaptive, and
                        designed to be low-stress.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Steps Grid */}
                <div className="p-6 md:p-8 bg-slate-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Step 1 */}
                    <div className="flex flex-col gap-4 p-4 rounded-lg border border-slate-200 bg-white transition-all hover:shadow-md group">
                      <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                        <span className="material-symbols-outlined">
                          person_add
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Step 1
                        </span>
                        <h3 className="text-[#0d141b] text-base font-bold leading-tight">
                          Enter Details
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Provide your basic info and upload your resume
                          context.
                        </p>
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div className="flex flex-col gap-4 p-4 rounded-lg border border-slate-200 bg-white transition-all hover:shadow-md group">
                      <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                        <span className="material-symbols-outlined">mic</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Step 2
                        </span>
                        <h3 className="text-[#0d141b] text-base font-bold leading-tight">
                          Live Interview
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Answer spoken or text-based questions naturally.
                        </p>
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="flex flex-col gap-4 p-4 rounded-lg border border-slate-200 bg-white transition-all hover:shadow-md group">
                      <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                        <span className="material-symbols-outlined">
                          auto_awesome
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Step 3
                        </span>
                        <h3 className="text-[#0d141b] text-base font-bold leading-tight">
                          Adaptive Flow
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Questions adjust in real-time based on your responses.
                        </p>
                      </div>
                    </div>
                    {/* Step 4 */}
                    <div className="flex flex-col gap-4 p-4 rounded-lg border border-slate-200 bg-white transition-all hover:shadow-md group">
                      <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-200">
                        <span className="material-symbols-outlined">
                          insights
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Step 4
                        </span>
                        <h3 className="text-[#0d141b] text-base font-bold leading-tight">
                          Instant Report
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Receive detailed feedback on your performance
                          immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action Footer */}
                <div className="p-6 md:p-8 border-t border-slate-100 flex flex-col items-center justify-center gap-4">
                  <Link
                    href={"/practice-interview/entryform"}
                    className="bg-primary hover:bg-blue-600 text-white text-base font-semibold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 w-full md:w-auto min-w-[280px]"
                  >
                    Proceed to Interview Setup
                  </Link>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="material-symbols-outlined text-[16px]">
                      lock
                    </span>
                    <span>
                      Your session is private and end-to-end encrypted.
                    </span>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewInitiate;
