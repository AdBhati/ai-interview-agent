export default function ContactSection() {
  return (
    <div
      id="letsConnect"
      className="py-24 bg-gradient-to-b from-white to-slate-50 px-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="max-w-[1140px] bg-white mx-auto glass-panel rounded-3xl shadow-2xl drop-shadow-2xl shadow-slate-200 border border-white/50 relative z-10 overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white/40">
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 text-xs font-semibold tracking-wide text-primary uppercase bg-blue-50 rounded-full border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Get in Touch
              </span>
              <h2 className="text-slate-900 text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                Ready to transform your hiring?
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                Our team is here to help you get started with AI-powered
                interviews.
              </p>
            </div>
            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 ml-1">
                    First Name
                  </label>
                  <input
                    className="w-full rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-900 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300"
                    placeholder="Jane"
                    type="text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700 ml-1">
                    Last Name
                  </label>
                  <input
                    className="w-full rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-900 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300"
                    placeholder="Doe"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 ml-1">
                  Work Email
                </label>
                <input
                  className="w-full rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-900 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300"
                  placeholder="jane@company.com"
                  type="email"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 ml-1">
                  How can we help?
                </label>
                <textarea
                  className="w-full rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-900 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 resize-none"
                  placeholder="Tell us about your hiring goals..."
                  rows={3}
                  defaultValue=""
                />
              </div>
              <button
                className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 mt-2"
                type="button"
              >
                Get Started Now
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">
                No credit card required for demo request.
              </p>
            </form>
          </div>
          <div className="relative hidden lg:block overflow-hidden bg-slate-900">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-100"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAEVyyjZ2o9WBFlcul9vZBrkAW1w5u8cJ1IGxFxzxt21TbyywzfUxHavE9ux82kuGZVUmw8EqU0ednoblk-q8vxCCWZgmAN-XvDQpxEFl2WU5It5ps7LjxMGjnpVMHOa5DkBtM_oFl2QkVwi6HHvByzHSnY7wnmFY83Fs4tWCrR4wPKrY1pwhSScyi_SGdQeZcyBzNThQ0qgXFQ8_aBoEQNqMrPMk0-uXfeUJc_FTpZiAG5sZjhdq5hx3YRiJcCDK5j-yqof7jDnV6")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/40 to-slate-900/50 mix-blend-multiply" />
            {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" /> */}
            <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
              <div className="flex justify-end">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    auto_awesome
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl max-w-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-green-300">
                      AI Analysis Complete
                    </span>
                  </div>
                  <p className="text-lg font-medium leading-snug mb-2">
                    &quot;This candidate demonstrates exceptional
                    problem-solving skills in distributed systems.&quot;
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-200">
                    <span className="material-symbols-outlined text-lg">
                      verified
                    </span>
                    <span>98% Technical Match</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Experience the future
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    Join 500+ forward-thinking companies that have modernized
                    their recruitment with our AI platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
