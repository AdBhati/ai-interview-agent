export default function CTASection() {
  return (
    <div className="py-24 px-4 bg-gradient-to-b from-white to-blue-50 text-center border-t border-slate-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Revolutionize Interviews with AI
        </h2>
        <p className="text-xl text-slate-500 mb-10">
          Join thousands of companies hiring faster, fairer, and better.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-blue-600 shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1">
            Start Interview
          </button>
          <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 text-lg font-bold rounded-xl hover:bg-slate-50 hover:shadow-md transition-all">
            Talk to Us
          </button>
        </div>
      </div>
    </div>
  );
}
