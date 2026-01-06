import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel: Branding & Visuals */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between relative overflow-hidden bg-slate-50  border-slate-200 ">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-300/20 blur-[100px]" />
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12 xl:p-20">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">
                smart_toy
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              AI Interviewer
            </span>
          </div>
          {/* Hero Text */}
          <div className="flex flex-col gap-6 max-w-lg mb-12">
            <h1 className="text-[#0d141b] tracking-tight text-4xl xl:text-5xl font-bold leading-tight text-left">
              Hire Faster. <br />
              <span className="text-primary">Interview Smarter.</span>
            </h1>
            <p className="text-[#4c739a] text-lg font-normal leading-relaxed">
              Create your account to start conducting AI-driven interviews,
              evaluate candidates instantly, and make confident hiring
              decisions.
            </p>
            <div className="flex gap-4 mt-2">
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  alt="User portrait"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  data-alt="Female user portrait small"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9_2fdNbvQrxKHXdHM8CKAOFL1WM5Vnvr1ejVHQEZzu52BCSKPEAiUDP1nRBUsE4zQMw4KGnWuGnhdQ-U916WZ59x8HD7U91bXXPRPJihRxgxddAp-f8KFncTUc-K_o2CEI8NIAkDEOcBjMxGPOHju45ZMFgGUp7jTJ4yVBLosOOxIXGYkukVzKyfgwWx0jDUBc43e8epWa112o5RjwkOKWpjumkbVdErx4pn3VngLy1qAjGKn1rEn58cNyagIBL0GpoVLXx-BxrET"
                />
                <img
                  alt="User portrait"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  data-alt="Male user portrait small"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGeBH4K2bX4RPJZx3L3XoHqCiMNyygUmQYEopIY3fNVtTTOTtRgdmlOWwQdZwv7kVgpTkJEFHzxyxijcDAiZ_-bNHjaRkcmvRDu8p42qfBwCtFhuL_fRBEk5OFczN6UmrGR9n_PPychdxujAvNI1zN24-7WdtgdSo2Flnueo5j5H_Q9E3G0EK1wYn1JZLXo0fdOOl4KEC2vADtZ-DJ291w7gh8byMgmLenE-S3Hy_98WzzA6umaEQZ7J2e_5ykVMPW4Bf0XsFh1FMX"
                />
                <img
                  alt="User portrait"
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  data-alt="Male user portrait small"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpQXw0jUWjxHHpF2FLfHNC2YGOzuxOlW_YHFntR6h6ik21GvjWNkuw1zF-jTPGIMqYvfUj_TR9YglOTtKDqXS5oSFrc3XZCNEeZoqDSgAM-pZNBsz5Q4sJqARa7udGDtBwdYHychZlUZH8teIZTw95wH7fhSmGvXwtiX84L5wSkxXiqcEYMfx2Z8ucleXjrePH-H0gQTLDsuCml8qYUO9oJ7lAGEPGeOnoNs2jQyaJEn540gkgBV-v0zI2jELz4P2itokOlWnW_ukp"
                />
              </div>
              <div className="flex items-center text-sm font-medium text-slate-600">
                <span className="text-primary font-bold mr-1">2,000+</span>{" "}
                companies trust us
              </div>
            </div>
          </div>
          {/* Illustration Area */}
          <div className="flex-1 w-full relative flex items-center justify-center min-h-[300px]">
            <div
              className="w-full h-full bg-cover bg-center rounded-2xl shadow-2xl shadow-blue-900/10 overflow-hidden relative group"
              data-alt="Abstract 3D glass shapes with blue lighting representing AI technology"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAy2Z9aI0SQrY49GXNtJQhziKxVLA57o8UYelWgTCQbaIvwar8RZJqPuW-JbEGk5aInlr0D8Omb1zTKRWyQ-HVYtH6hu37PpQo9Vje57aPBYRvk9MkLS4xJl_tj2fvHRkuYayDHyJ_Rgr2VgZMZLnK6poSJy3V7KETAKpZRh5WdYTq8eIRePkTf7nhOzXhm6cti1fDM7ekgfGIwDS2hgdh77ioPt5Xya2wjOxuWkRB6SKtaQ12cn0FPBrgWBSbe0Y_J1gcTOnihIWeY")',
              }}
            >
              {/* Overlay card mimicking UI */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 transform transition-transform duration-700 group-hover:translate-y-[-5px]">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined text-xl">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Candidate Analysis Complete
                    </p>
                    <p className="text-xs text-slate-500">
                      Match score: 94% • High Potential
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Panel: Registration Form */}
      <div className="flex w-full lg:w-1/2 flex-col bg-white overflow-y-auto">
        <div className="flex flex-col justify-center min-h-full py-12 px-6 sm:px-12 xl:px-24">
          <div className="max-w-[480px] w-full mx-auto">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">
                  smart_toy
                </span>
              </div>
              <span className="text-lg font-bold text-slate-900 ">
                InterView.ai
              </span>
            </div>
            {/* Page Heading */}
            <div className="mb-8">
              <h2 className="text-[#0d141b] text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
                Create Your Account
              </h2>
              <p className="text-[#4c739a]  text-base font-normal leading-normal">
                Get started with AI-powered interviews today.
              </p>
            </div>
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 h-12 px-4 rounded-lg border border-slate-200  hover:bg-slate-50  transition-colors bg-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M3.15295 7.3455L6.4385 9.755C7.3275 7.554 9.4805 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.159 2 4.828 4.1685 3.15295 7.3455Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M12 22C14.666 22 17.0545 20.9455 18.841 19.294L15.4815 16.697C14.476 17.3415 13.2875 17.721 12 17.721C9.3785 17.721 7.1565 16.039 6.3015 13.6935L3.0335 16.2155C4.7085 19.5305 8.115 22 12 22Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M21.8055 10.0415H21V10H12V14H17.6515C17.257 15.108 16.4725 16.073 15.4815 16.697L18.841 19.294C20.777 17.509 21.9995 14.963 21.9995 12C21.9995 11.3295 21.931 10.675 21.8055 10.0415Z"
                    fill="#1976D2"
                  />
                </svg>
                <span className="text-sm font-medium text-slate-700">
                  Google
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 h-12 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors bg-white">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-[#0077b5]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">
                  LinkedIn
                </span>
              </button>
            </div>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Or register with email
                </span>
              </div>
            </div>
            {/* Registration Form */}
            <form className="flex flex-col gap-4">
              {/* Full Name */}
              <label className="flex flex-col">
                <p className="text-[#0d141b] text-sm font-medium leading-normal pb-2">
                  Full Name
                </p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">
                      person
                    </span>
                  </span>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] bg-slate-50 focus:border-primary h-12 placeholder:text-[#4c739a] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                    placeholder="Enter your full name"
                    required
                    type="text"
                  />
                </div>
              </label>
              {/* Work Email */}
              <label className="flex flex-col">
                <p className="text-[#0d141b] text-sm font-medium leading-normal pb-2">
                  Work Email
                </p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </span>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] bg-slate-50 focus:border-primary h-12 placeholder:text-[#4c739a] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                    placeholder="name@company.com"
                    required
                    type="email"
                  />
                </div>
              </label>
              {/* Split Row for Company and Role */}
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex flex-col flex-1">
                  <p className="text-[#0d141b] text-sm font-medium leading-normal pb-2">
                    Company Name{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </p>
                  <input
                    className="form-input w-full rounded-lg text-[#0d141b] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] bg-slate-50 focus:border-primary h-12 px-4 text-base font-normal transition-all"
                    placeholder="Acme Inc."
                    type="text"
                  />
                </label>
                <label className="flex flex-col flex-1">
                  <p className="text-[#0d141b] text-sm font-medium leading-normal pb-2">
                    Role{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </p>
                  <div className="relative">
                    <select className="form-select w-full rounded-lg text-[#0d141b] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] bg-slate-50 focus:border-primary h-12 px-4 text-base font-normal transition-all appearance-none">
                      <option disabled selected >
                        Select Role
                      </option>
                      <option value="hr">HR Manager</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="hiring_manager">Hiring Manager</option>
                      <option value="founder">Founder/CEO</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        expand_more
                      </span>
                    </span>
                  </div>
                </label>
              </div>
              {/* Password */}
              <label className="flex flex-col">
                <p className="text-[#0d141b] text-sm font-medium leading-normal pb-2">
                  Password
                </p>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">
                      lock
                    </span>
                  </span>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] bg-slate-50 focus:border-primary h-12 placeholder:text-[#4c739a] pl-10 pr-10 text-base font-normal leading-normal transition-all"
                    placeholder="Create a password"
                    required
                    type="password"
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors focus:outline-none"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility_off
                    </span>
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {/* <div className="flex gap-2 mt-2 h-1">
                  <div className="flex-1 bg-red-400 rounded-full h-full" />
                  <div className="flex-1 bg-slate-200 rounded-full h-full" />
                  <div className="flex-1 bg-slate-200 rounded-full h-full" />
                  <div className="flex-1 bg-slate-200 rounded-full h-full" />
                </div> */}
                <p className="text-xs text-slate-500 mt-1">
                  Must contain at least 8 characters, one uppercase, and one
                  number.
                </p>
              </label>
              {/* Confirm Password */}
              <label className="flex flex-col">
                <p className="text-[#0d141b] text-sm font-medium leading-normal pb-2">
                  Confirm Password
                </p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">
                      lock_reset
                    </span>
                  </span>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdbe7] bg-slate-50 focus:border-primary h-12 placeholder:text-[#4c739a] pl-10 pr-4 text-base font-normal leading-normal transition-all"
                    placeholder="Confirm your password"
                    required
                    type="password"
                  />
                </div>
              </label>
              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 mt-2">
                <div className="flex items-center h-5">
                  <input
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/50 bg-slate-50"
                    id="terms"
                    required
                    type="checkbox"
                  />
                </div>
                <div className="text-sm">
                  <label className="font-medium text-slate-700" htmlFor="terms">
                    I agree to the{" "}
                    <a
                      className="text-primary hover:text-blue-600 underline decoration-2 decoration-transparent hover:decoration-current transition-all"
                      href="#"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      className="text-primary hover:text-blue-600 underline decoration-2 decoration-transparent hover:decoration-current transition-all"
                      href="#"
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              </div>
              {/* Submit Button */}
              <button className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary hover:bg-blue-600 active:scale-[0.98] py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30">
                Create Account
              </button>
            </form>
            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-600 text-sm">
                Already have an account?&nbsp;
                <Link
                  className="font-semibold text-primary hover:text-blue-600 transition-colors"
                  href="/login"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
