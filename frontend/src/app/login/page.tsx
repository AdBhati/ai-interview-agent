'use client';

import { updateIsLogin, updateUserRole } from "@/store/slices/appSlice";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState('nirbhay411@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 1000));

    let role: "hr" | "candidate" | "admin" | "" = '';

    if (email === 'nirbhay411@gmail.com' && password === '123456') {
      role = 'candidate';
    } else if (email === 'nirbhay.singh@vanshiv.com' && password === '123456') {
      role = 'hr';
    } else {
      toast.error("Wrong Email or Password");
      setIsLoading(false);
      return;
    }

    // 1. Update Redux
    dispatch(updateUserRole(role));
    dispatch(updateIsLogin(true));

    // 2. Update LocalStorage
    localStorage.setItem('userRole', role);
    localStorage.setItem('isLogin', 'true');

    setIsLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="font-display bg-background-light  text-slate-900  antialiased">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Branding Panel */}
        <div className="relative hidden lg:flex w-full lg:w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white">
          {/* Abstract Background Image */}
          <div className="absolute inset-0 z-0">
            <div
              className="h-full w-full bg-cover bg-center opacity-60 mix-blend-overlay"
              data-alt="Abstract glowing blue and purple neural network lines"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXbEwOE55IXSax4R3EUUOndMlCIWHHOD5grT4SsAWS5EPuy_WxaPvg7euKtcsV0WYNcfo81o5LKAB7POd35W1ALki_bapJ12ud-HIUszFmGEnR0bXdyHKGGW6JbNNqSnPJZJ67aW1HcI1AfvIX8m_QZIc5rp1MgwHomXiE0Fvbdvh8APxNPx8io7Qc1332vZ5QZcJ1olh5upYF73FwpIpM0OTVB_ytXKK6nDzlu7CSyFXzLUPkyXalUsB3QSpz8z7Lgd2ultmInvYz")',
              }}
            ></div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 via-purple-900/80 to-teal-900/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          </div>
          {/* Branding Content */}
          <Link href="/" className="relative z-10 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-2xl">
                smart_toy
              </span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              AI Interviewer
            </span>
          </Link>
          <div className="relative z-10 max-w-lg pb-10">
            <h1 className="text-[40px] font-bold leading-tight tracking-tight text-white mb-6">
              Smarter Interviews.
              <br />
              Powered by AI.
            </h1>
            <p className="text-lg text-blue-100/90 leading-relaxed font-light">
              An AI-driven interview platform that conducts live, adaptive
              interviews and delivers instant, data-driven hiring insights to
              build your dream team.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/10">
                <span className="material-symbols-outlined text-teal-300 text-sm">
                  check_circle
                </span>
                <span className="text-sm font-medium">Bias-free screening</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/10">
                <span className="material-symbols-outlined text-purple-300 text-sm">
                  bolt
                </span>
                <span className="text-sm font-medium">Instant Feedback</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 text-xs text-white/40 font-medium">
            © 2026 AI Interview All rights reserved.
          </div>
        </div>
        {/* Right Login Panel */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center items-center bg-background-light  p-6 sm:p-12 lg:p-24 transition-colors">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="flex lg:hidden justify-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-3xl">
                  auto_awesome
                </span>
              </div>
            </div>
            {/* Page Heading */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 ">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-slate-600 ">
                Sign in to continue your AI interview experience
              </p>
            </div>
            {/* Login Form */}
            <form action="#" className="mt-8 space-y-6" method="POST">
              <div className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-slate-900"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <div className="mt-2 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-slate-400 text-[20px]">
                        mail
                      </span>
                    </div>
                    <input
                      autoComplete="email"
                      className="block w-full rounded-lg border-0 py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-shadow duration-200"
                      id="email"
                      name="email"
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>
                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-sm font-medium leading-6 text-slate-900"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <a
                        className="font-medium text-primary hover:text-primary-dark transition-colors"
                        href="#"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-slate-400 text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      autoComplete="current-password"
                      className="block w-full rounded-lg border-0 py-3 pl-10 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-shadow duration-200"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                      }}
                    />
                    <div onClick={() => {
                      setShowPassword(prev => !prev);
                    }} className="select-none absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer group">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600  text-[20px]">
                        {showPassword ? "visibility" : "visibility_off"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Action Button */}
              <div>
                <button
                  onClick={handleSignIn}
                  className="flex w-full justify-center items-center gap-2 cursor-pointer rounded-lg bg-primary px-3 py-3.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 ease-in-out transform active:scale-[0.99]"
                  type="submit"
                  disabled={isLoading}
                >
                  Sign in
                  {isLoading &&
                    <div>
                      <LoaderCircle className="animate-spin" size={20} />
                    </div>
                  }
                </button>
              </div>
            </form>
            {/* Social Login Divider */}
            <div className="relative mt-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-slate-200 " />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-background-light  px-6 text-slate-500 ">
                  Or continue with
                </span>
              </div>
            </div>
            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-white  px-3 py-2.5 text-sm font-semibold text-slate-900  shadow-sm ring-1 ring-inset ring-slate-300  hover:bg-slate-50 focus-visible:ring-transparent transition-colors"
                href="#"
              >
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
                <span className="text-sm">Google</span>
              </a>
              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:ring-transparent transition-colors"
                href="#"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
            {/* Footer Text */}
            <p className="mt-10 text-center text-sm text-slate-500">
              Don’t have an account?&nbsp;
              <Link
                className="font-semibold leading-6 text-primary hover:text-primary-dark hover:underline transition-all"
                href="/register"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
