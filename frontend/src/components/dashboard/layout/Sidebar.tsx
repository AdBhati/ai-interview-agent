'use client'
import { useAppSelector } from "@/store/reduxStore";
import { updateIsLogin, updateUserRole } from "@/store/slices/appSlice";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const userRole = useAppSelector(state => state.app.userRole);

  const handleSignOut = () => {
    // 1. Clear LocalStorage
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userRole');

    // 2. Clear Redux Store
    dispatch(updateIsLogin(false));
    dispatch(updateUserRole(''));

    // 3. Redirect to Home/Login
    router.push("/");
  };

  return (
    <aside className="hidden max-h-screen sticky top-0 md:flex flex-col w-72 bg-card-light border-r border-slate-200 flex-shrink-0 z-40">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
        <div className="size-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
        </div>
        <h2 className="text-slate-900 text-lg font-bold tracking-tight">
          AI Interviewer
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Main Menu
        </p>
        {[
          {
            label: "Dashboard",
            icon: "dashboard",
            href: "/dashboard",
            active: pathname == "/dashboard",
            enable: true,
          },
          {
            label: "AI Interview",
            icon: "cases",
            href: "/job-description",
            active: pathname.includes("/job-description"),
            enable: userRole === "hr"
          },
          {
            label: "Mock AI Interview",
            icon: "videocam",
            href: "/practice-interview",
            active: pathname.includes("/practice-interview"),
            enable: userRole === "candidate"
          },
          {
            label: "Interview History",
            icon: "history",
            href: "/interview-history",
            active: pathname.includes("/interview-history"),
            enable: userRole === "hr"
          },
          {
            label: "Profile & Resume",
            icon: "badge",
            href: "#",
            enable: true
          },
        ].filter(item => item.enable).map((item) => (
          <a
            key={item.label}
            className={
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm" +
              (item.active
                ? " bg-primary/10 text-primary font-semibold"
                : " text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium group")
            }
            href={item.href}
          >
            <span
              className={
                "material-symbols-outlined" +
                (item.active
                  ? ""
                  : " text-slate-400 group-hover:text-primary transition-colors")
              }
            >
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}

        <div className="pt-6 mt-2">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Community &amp; Growth
          </p>
          {[
            {
              label: "Practice",
              icon: "school",
              href: "#",
            },
            {
              label: "Community",
              icon: "forum",
              href: "#",
            },
          ].map((item) => (
            <a
              key={item.label}
              className="flex items-center text-sm gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors group"
              href={item.href}
            >
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Footer / Sign Out Section */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <button
          onClick={handleSignOut}
          className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium transition-all group"
        >
          <span className="material-symbols-outlined text-slate-400 group-hover:text-red-600 transition-colors">
            logout
          </span>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;