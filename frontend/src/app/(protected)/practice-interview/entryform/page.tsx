"use client";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import {
  createInterview,
  generateInterviewQuestions,
} from "@/services/interviews.service";
import { createJobDescription } from "@/services/jobDescription.service";
import { initiateMail } from "@/services/mail.service";
import { getResume, uploadResume } from "@/services/resumes.service";
import { updateResumeData } from "@/store/slices/appSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const getCurrentDomain = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_BASE_URL || "";
};

const EntryForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [skills, setSkills] = useState("");
  const [level, setLevel] = useState<"junior" | "mid" | "senior">("mid");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [jdData, setjdData] = useState<any>(null);
  const [extracting, setExtracting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (!fileInputRef || !fileInputRef.current) {
      return;
    }

    fileInputRef.current.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const sendInterviewEmail = async (id: number) => {
    const url = `${getCurrentDomain()}/interview?id=${id}&time=15`;

    const payload = {
      candidateName: name,
      candidateEmail: email,
      roleAppliedFor: role,
      experienceLevel: "",
      testLink: url,
      proctorEmail: "divyanshu.bhati@vanshiv.com",
      proctoringLink: url,
    };
    try {
      const res = await initiateMail(payload);
      console.log(res);
    } catch (error) {
      console.log("Error in sending mail ", error);
    }
  };

  const createInterviewRecord = async (resumeId: number, jdId: number) => {
    console.log("entered");
    try {
      const res = await createInterview({
        resume: resumeId,
        job_description: jdId,
        time_limit_minutes: 10,
      });
      console.log(res);
      await generateInterviewQuestions(res.id, 5);
      sendInterviewEmail(res?.id);

      return router.push(
        `/interview?id=${res.id}&questions=${5}&time=${15 * 60}`
      );
    } catch (error) {
      console.error("Error creating interview record:", error);
      throw error;
    }
  };
  const createJobDescriptionrecord = async (resumeId: number) => {
    try {
      const res = await createJobDescription({
        title: role,
        description: skills,
        required_skills: skills,
      });

      setjdData(res);

      // Pass the IDs directly instead of relying on state
      await createInterviewRecord(resumeId, res.id);
    } catch (error) {
      console.error("Error creating job description:", error);
      throw error;
    }
  };

  const handleStartInterview = async () => {
    if (!file) {
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadResume(formData);

      console.log("Resume uploaded -> ", res);
      toast.success("Resume uploaded");

      setResumeData(res);
      dispatch(updateResumeData(res));

      // Store resume ID in localStorage for later use
      if (res.id) {
        localStorage.setItem("resumeId", res.id.toString());
      }

      // Check if text extraction is in progress
      if (res.status === "processing") {
        setExtracting(true);
        pollForExtraction(res.id);
      } else if (res.status === "extracted") {
        setSuccess(true);
      } else {
        setSuccess(true);
      }

      // Pass resume ID directly instead of relying on state
      await createJobDescriptionrecord(res.id);
    } catch (error) {
      toast.error("Problem in uploading the resume");
      console.log("Error in uploading resume -> ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pollForExtraction = async (resumeId: number) => {
    // Poll every 2 seconds for extraction status
    const maxAttempts = 30; // 60 seconds max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await getResume(resumeId);
        const resume = response.data;

        if (resume.status === "extracted") {
          setExtracting(false);
          setResumeData(resume);
          dispatch(updateResumeData(resume));
          setSuccess(true);
        } else if (resume.status === "failed") {
          setExtracting(false);
          setError(
            "Failed to extract text from PDF. The resume was uploaded but text extraction failed."
          );
          setResumeData(resume);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 2000);
        } else {
          setExtracting(false);
          setError(
            "Text extraction is taking longer than expected. You can continue to the interview."
          );
          setResumeData(resume);
        }
      } catch (err) {
        console.error("Error polling extraction status:", err);
        setExtracting(false);
      }
    };

    poll();
  };

  const isDisabled = Boolean(
    !name.trim() || !role || !level || !file || !email || !skills
  );

  return (
    <div>
      <LoadingOverlay show={isLoading} />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-160 flex flex-col gap-6">
          {/* Page Heading */}
          <div className="text-center space-y-2 mb-2">
            <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Let&apos;s set up your interview
            </h1>
            <p className="text-slate-500 text-base font-normal">
              Please fill in your details to customize the AI session.
            </p>
          </div>
          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            {/* Form Fields */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Section: Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">
                    person
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Personal Details
                  </h3>
                </div>
                {/* Full Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      className="w-full rounded-lg text-sm border-slate-300 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 h-12 px-4 transition-shadow"
                      placeholder="e.g. Jane Doe"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      className="w-full rounded-lg text-sm border-slate-300 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 h-12 px-4 transition-shadow"
                      placeholder="e.g. Jane Doe"
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>
                {/* Role & Experience Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Role Applying For
                    </label>
                    <div className="relative">
                      <select
                        className="w-full text-sm rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary h-12 px-4 appearance-none cursor-pointer"
                        value={role}
                        onChange={(e) => {
                          setRole(e.target.value);
                        }}
                      >
                        <option>Select a role</option>
                        <option value="frontend">Frontend Developer</option>
                        <option value="backend">Backend Developer</option>
                        <option value="product">Product Manager</option>
                        <option value="design">UI/UX Designer</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <span className="material-symbols-outlined">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Experience Level */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Experience Level
                    </label>

                    <div className="flex bg-slate-100 p-1 rounded-lg h-12">
                      {["junior", "mid", "senior"].map((item) => {
                        const selected = level === item;

                        return (
                          <button
                            key={item}
                            onClick={() =>
                              setLevel(item as "junior" | "mid" | "senior")
                            }
                            className={`flex-1 cursor-pointer rounded-md text-sm font-medium transition-all
                ${selected
                                ? "bg-white shadow-sm text-primary ring-1 ring-black/5"
                                : "text-slate-500 hover:text-slate-700"
                              }
              `}
                          >
                            {item[0].toUpperCase() + item.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Skills <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg text-sm border-slate-300 bg-slate-50 text-slate-900 focus:border-primary focus:ring-primary placeholder:text-slate-400 h-12 px-4 transition-shadow"
                  placeholder="e.g. React, Node.JS, Next.JS"
                  type="text"
                  value={skills}
                  onChange={(e) => {
                    setSkills(e.target.value);
                  }}
                />
              </div>
              <div className="h-px bg-slate-100 w-full" />
              {/* Section: Resume Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      description
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">Resume</h3>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Optional
                  </span>
                </div>
                {/* Drop Zone */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileChange(e)}
                  accept="application/pdf"
                />
                <div
                  onClick={handleFileUpload}
                  className="group relative flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">
                        cloud_upload
                      </span>
                    </div>
                    <p className="mb-1 text-sm text-slate-700 font-medium">
                      <span className="font-semibold text-primary">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF, DOCX (MAX. 5MB)
                    </p>
                  </div>
                  <input className="hidden" id="dropzone-file" type="file" />
                </div>
                {/* Uploaded File Preview (Mock State) */}
                {file && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-1.5 rounded text-green-600 shadow-sm">
                        <span className="material-symbols-outlined text-xl">
                          picture_as_pdf
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {file.name}
                        </span>

                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">
                            check_circle
                          </span>
                          Ready for analysis
                        </span>
                      </div>
                    </div>

                    <button
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      onClick={() => setFile(null)}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row-reverse gap-3 sm:gap-4 items-center justify-between">
              <button
                className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-black/5 disabled:text-black/50"
                disabled={isDisabled}
                onClick={handleStartInterview}
              >
                {isLoading && (
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                )}
                <span className="text-sm">Start Interview</span>
                {!isLoading && (
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                )}
              </button>
              <Link href="/dashboard">
                <button className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 text-slate-600 hover:text-slate-900 text-sm font-medium rounded-lg transition-colors">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 text-xs text-slate-400 mt-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntryForm;
