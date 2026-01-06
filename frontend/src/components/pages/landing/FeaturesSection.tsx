export default function FeaturesSection() {
  return (
    <div
      id="features"
      className="py-20 px-4 bg-slate-50 border-t border-slate-100"
    >
      <div className="layout-content-container flex flex-col max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-slate-900 text-3xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-slate-500">
            Everything you need to hire the top 1% without the burnout.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">
                network_intelligence_history
              </span>{" "}
            </div>
            <h3 className="text-slate-900 text-lg font-bold mb-2">
              Real-time Adaptivity
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every question adapts to user performance using Item Response
              Theory (IRT) and advanced Al algorithms.
            </p>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">alt_route</span>
            </div>
            <h3 className="text-slate-900 text-lg font-bold mb-2">
              Adaptive Questioning
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dynamic question paths that change based on candidate responses to
              probe deeper into skills and gaps.
            </p>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">speed</span>
            </div>
            <h3 className="text-slate-900 text-lg font-bold mb-2">
              Real-Time Scoring
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Instant evaluation on 50+ parameters. No more waiting days to
              debrief or grade assignments.
            </p>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">description</span>
            </div>
            <h3 className="text-slate-900 text-lg font-bold mb-2">
              Resume-Aware
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The AI reads the candidate&apos;s resume before the interview to
              ask specific questions about their past projects.
            </p>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">balance</span>
            </div>
            <h3 className="text-slate-900 text-lg font-bold mb-2">
              Bias-Reduced
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Standardized evaluation criteria ensure every candidate gets a
              fair shot, regardless of background.
            </p>
          </div>
          <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">summarize</span>
            </div>
            <h3 className="text-slate-900 text-lg font-bold mb-2">
              Recruiter-Ready Reports & Deep Analytics
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
              Powered by adaptive intelligence, our assessments understand each
              individual’s learning journey while delivering precise summaries,
              key insights, and risk signals directly to your inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
