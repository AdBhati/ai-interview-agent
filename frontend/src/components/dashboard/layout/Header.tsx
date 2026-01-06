'use client';

import { useAppSelector } from "@/store/reduxStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const userRole = useAppSelector(state => state.app.userRole);

  const segments = pathname
    .split("/")
    .filter(Boolean);

  const paths = segments.map((_, i) => "/" + segments.slice(0, i + 1).join("/"));

  return (
    <header className="h-16 shrink-0 bg-background-light/95 backdrop-blur z-30 sticky top-0 px-4 sm:px-6 lg:px-8 border-b border-transparent">
      <div className="h-full flex items-center justify-between">
        <button className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="hidden md:flex items-center gap-2 text-sm">
          <Link
            className="text-slate-500 hover:text-primary transition-colors"
            href="/dashboard"
          >
            Home
          </Link>

          {segments.map((seg, i) => {
            const isLast = i === segments.length - 1;
            const label = seg
              .replace(/-/g, " ")         // convert-slug → convert slug
              .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize Words

            return (
              <div key={seg} className="flex items-center gap-2">
                <span className="text-slate-300">/</span>

                {isLast ? (
                  <span className="text-slate-900 font-medium">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={paths[i]}
                    className="text-slate-500 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <button className="flex items-center justify-center size-9 rounded-full hover:bg-slate-200 text-slate-600 transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1" />
          <button className="flex items-center gap-2 group">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-slate-200"
              data-alt="Portrait of a user"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPLPflqwNo51y_SQVIyWPAX3vG7vV7FTSrJF-D2tCSUFq6WpLxY994WP9N_MhJrAZndAJSVBS7yjdoPeE-GKGiHynL0fMjxVxRdJ0m0Wq1hWHacd_E0QcOghzJ7XSw1J2ebYFG6mnDJKhV7fV7z2VapzbyGIOJhjuhs9hN3JxAVGP4bha6beup14R3Ja_L8THcI10WU6Fc2wp93Yferi6JX3O41phmS9Oi7yrwPv8S4uo850Jq7OkxkXGEtacTLl7lxwFnj66T7sxz")',
              }}
            />
            <div className="hidden sm:block text-left mr-1 cursor-pointer">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                Nirbhay Singh
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {userRole.toUpperCase()}
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 transition-colors">
              expand_more
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
