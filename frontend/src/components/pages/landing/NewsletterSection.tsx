export default function NewsletterSection() {
  return (
    <div className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-slate-100">
      <div className="max-w-2xl mx-auto text-center">
        <span className="material-symbols-outlined text-4xl text-primary mb-4">
          mail
        </span>
        <h2 className="text-slate-900 text-2xl font-bold mb-4">
          Stay Updated with AI Hiring Innovations
        </h2>
        <p className="text-slate-600 mb-8">
          Get the latest trends and product updates delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 h-12 rounded-lg bg-white border border-slate-200 text-slate-900 px-4 focus:ring-2 focus:ring-primary focus:outline-none placeholder-slate-400"
            placeholder="Enter your email"
            type="email"
          />
          <button className="h-12 px-8 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
