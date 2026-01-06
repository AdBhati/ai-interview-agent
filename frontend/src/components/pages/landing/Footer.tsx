import React from "react";

const Footer = () => {
  return (
    <div className="max-w-[1200px] mx-auto py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-slate-500 text-sm">
        © 2026 AI Interviewer Inc. All rights reserved.
      </p>
      <div className="flex gap-4 text-slate-400">
        <span className="cursor-pointer hover:text-primary transition-colors">
          Twitter
        </span>
        <span className="cursor-pointer hover:text-primary transition-colors">
          LinkedIn
        </span>
        <span className="cursor-pointer hover:text-primary transition-colors">
          Facebook
        </span>
      </div>
    </div>
  );
};

export default Footer;
