import Link from "next/link";

export default function Header() {
  return (
    <div className="sticky top-0 z-50 glass-panel border-b-0">
      <div className="layout-container flex justify-center">
        <div className="flex flex-1 justify-center px-4 py-0">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <header className="flex items-center justify-between whitespace-nowrap px-4 py-3">
              <div className="flex items-center gap-4 text-slate-900">
                <div className="size-8 flex items-center justify-center rounded bg-primary text-white shadow-md shadow-primary/20">
                  <span className="material-symbols-outlined text-xl">
                    psychology
                  </span>
                </div>
                <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">
                  AI Interviewer
                </h2>
              </div>
              <div className="flex flex-1 justify-end gap-8 hidden md:flex">
                <div className="flex items-center gap-9">
                  <a
                    className="text-slate-600 text-sm font-medium leading-normal hover:text-primary transition-colors"
                    href="#howItworks"
                  >
                    How It Works
                  </a>
                  <a
                    className="text-slate-600 text-sm font-medium leading-normal hover:text-primary transition-colors"
                    href="#features"
                  >
                    Features
                  </a>
                  <Link
                    className="text-slate-600 text-sm font-medium leading-normal hover:text-primary transition-colors"
                    href="#letsConnect"
                  >
                   {`Let's Connect`}
                  </Link>
                </div>
                <Link href="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-md shadow-primary/20">
                  <span className="truncate">Login</span>
                </Link>
              </div>
              <div className="md:hidden text-slate-900">
                <span className="material-symbols-outlined">menu</span>
              </div>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
}
