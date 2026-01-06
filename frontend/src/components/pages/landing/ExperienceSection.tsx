export default function ExperienceSection() {
  return (
    <div className="py-20 px-4 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full pointer-events-none blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50 rounded-full pointer-events-none blur-3xl opacity-60" />
      <div className="max-w-[1000px] mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 text-3xl font-bold">
            Experience the Interview
          </h2>
          <p className="text-slate-500 mt-2">
            See how our AI interacts, probes, and evaluates in real-time.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl grid md:grid-cols-[1.5fr_1fr] min-h-[500px]">
          <div className="p-6 flex flex-col border-r border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold">AI Interviewer</h4>
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{" "}
                    Online
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 rounded bg-white border border-slate-200 text-xs text-slate-500 shadow-sm">
                Question 3 of 5
              </div>
            </div>
            <div className="mb-6">
              <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-100 text-slate-700 text-sm leading-relaxed max-w-[90%] shadow-sm">
                Can you explain a challenging technical problem you solved
                recently? specifically, how did you handle the trade-offs between
                performance and code readability?
              </div>
              <span className="text-xs text-slate-400 mt-1 block pl-1">
                AI • 10:42 AM
              </span>
            </div>
            <div className="mt-auto flex flex-col items-end">
              <div className="relative w-[240px] h-[140px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-2 shadow-md group">
                <img
                  className="w-full h-full object-cover"
                  data-alt="Candidate speaking during interview"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKBQSG_cMbnTSt650OYRO90IimW4mUQLPznIdZ2iDUFP4F-p6gD5fpV-mihMp4jwplPgniQQfZ-Tac3iSZg49S3MR5DQO_lrelyj4B7dDe8T8yghhCG_SMuuosUyw-GWNW5ZikOfyJMFHOXfu1p7g7GhCQr1aIJLyNlPja0I8kgLwsUJCco0tUPzcOZHt3zqjRM0syqzR3_fGdYNxBnYvg-97P7N87-p64-5PtPTDVHa46Njg0_wtDk3b8hVrncLy6jKVKYhAw3aJz"
                />
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-slate-700 flex items-center gap-1 shadow-sm border border-white/20">
                  <span className="material-symbols-outlined text-[10px] text-primary">
                    mic
                  </span>{" "}
                  Speaking...
                </div>
              </div>
              <div className="p-3 rounded-2xl rounded-tr-none bg-primary text-white text-sm leading-relaxed max-w-[90%] shadow-md">
                In my last project, we had a data ingestion bottleneck. I decided
                to rewrite the parser in Rust...
              </div>
              <span className="text-xs text-slate-400 mt-1 block pr-1">
                You • 10:43 AM
              </span>
            </div>
          </div>
          <div className="bg-white p-6 flex flex-col gap-6">
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Real-Time Evaluation
              </h5>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">
                      Technical Accuracy
                    </span>
                    <span className="text-primary font-bold">8.5/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">
                      Communication
                    </span>
                    <span className="text-purple-500 font-bold">9.2/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">
                      Problem Solving
                    </span>
                    <span className="text-teal-500 font-bold">7.8/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-teal-400 h-1.5 rounded-full"
                      style={{ width: "78%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h6 className="text-slate-800 text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500 text-sm">
                  lightbulb
                </span>{" "}
                AI Insight
              </h6>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidate shows strong understanding of system architecture but
                could elaborate more on specific Rust memory safety guarantees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


