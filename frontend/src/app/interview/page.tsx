// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { completeInterview, generateInterviewReport, getInterviewQuestions, submitInterviewAnswer } from '@/services/interviews.service';

// // --- Icons ---
// const ClockIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
// );
// const ChevronLeftIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
// );
// const ChevronRightIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
// );
// const CheckIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
// );
// const CodeIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
// );
// const ListIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
// );
// const AlertTriangle = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
// );
// const MaximizeIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
// );

// interface Question {
//     id: number;
//     question_text: string;
//     question_type: string;
//     is_mcq: boolean;
//     options: string[];
//     correct_answer: string;
//     order_index: number;
// }

// // 1. Rename logic component to Content
// function InterviewContent() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const interviewIdParam = searchParams.get('id');
//     const timeLimitParam = searchParams.get('time');

//     const [interviewId, setInterviewId] = useState<number | null>(interviewIdParam ? parseInt(interviewIdParam) : null);
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answers, setAnswers] = useState<Map<number, string>>(new Map());
//     const [openEndedAnswers, setOpenEndedAnswers] = useState<Map<number, string>>(new Map());
//     const [timeRemaining, setTimeRemaining] = useState<number>(timeLimitParam ? parseInt(timeLimitParam) : 1800);
//     const [testStarted, setTestStarted] = useState(false);
//     const [testCompleted, setTestCompleted] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // --- PROCTORING STATE ---
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [violationCount, setViolationCount] = useState(0);

//     // ---------------------------------------------------------
//     // PROCTORING LOGIC
//     // ---------------------------------------------------------

//     // 1. Enter Full Screen
//     const enterFullscreen = async () => {
//         try {
//             await document.documentElement.requestFullscreen();
//             setIsFullscreen(true);
//         } catch (err) {
//             console.error("Error attempting to enable full-screen mode:", err);
//         }
//     };

//     // 2. Monitor Full Screen Changes
//     useEffect(() => {
//         const handleFullscreenChange = () => {
//             if (!document.fullscreenElement) {
//                 setIsFullscreen(false);
//             } else {
//                 setIsFullscreen(true);
//             }
//         };

//         document.addEventListener('fullscreenchange', handleFullscreenChange);
//         document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari support

//         return () => {
//             document.removeEventListener('fullscreenchange', handleFullscreenChange);
//             document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
//         };
//     }, []);

//     // 3. Monitor Alt-Tab / Visibility / Right Click / Copy-Paste
//     useEffect(() => {
//         if (!testStarted || testCompleted) return;

//         // Prevent Right Click
//         const handleContextMenu = (e: MouseEvent) => {
//             e.preventDefault();
//             return false;
//         };

//         // Prevent Copy/Cut/Paste
//         const handleCopyCutPaste = (e: ClipboardEvent) => {
//             e.preventDefault();
//         };

//         // Detect Alt-Tab or Window Switch
//         const handleVisibilityChange = () => {
//             if (document.hidden) {
//                 setViolationCount(prev => prev + 1);
//                 alert("WARNING: You left the exam window. This instance has been recorded.");
//             }
//         };

//         document.addEventListener('contextmenu', handleContextMenu);
//         document.addEventListener('copy', handleCopyCutPaste);
//         document.addEventListener('cut', handleCopyCutPaste);
//         document.addEventListener('paste', handleCopyCutPaste);
//         document.addEventListener('visibilitychange', handleVisibilityChange);

//         return () => {
//             document.removeEventListener('contextmenu', handleContextMenu);
//             document.removeEventListener('copy', handleCopyCutPaste);
//             document.removeEventListener('cut', handleCopyCutPaste);
//             document.removeEventListener('paste', handleCopyCutPaste);
//             document.removeEventListener('visibilitychange', handleVisibilityChange);
//         };
//     }, [testStarted, testCompleted]);


//     // ---------------------------------------------------------
//     // EXISTING LOGIC (Unchanged logic, wrapped in effects)
//     // ---------------------------------------------------------

//     useEffect(() => {
//         if (interviewId) {
//             loadInterview();
//         } else {
//             setError('Interview ID not found');
//             setLoading(false);
//         }
//     }, [interviewId]);

//     useEffect(() => {
//         // Only run timer if test started AND fullscreen is active
//         if (testStarted && timeRemaining > 0 && !testCompleted && isFullscreen) {
//             const timer = setInterval(() => {
//                 setTimeRemaining((prev) => {
//                     if (prev <= 1) {
//                         handleAutoSubmit();
//                         return 0;
//                     }
//                     return prev - 1;
//                 });
//             }, 1000);
//             return () => clearInterval(timer);
//         }
//     }, [testStarted, testCompleted, timeRemaining, isFullscreen]);

//     const loadInterview = async () => {
//         if (!interviewId) return;
//         setLoading(true);
//         try {
//             const questionsResponse = await getInterviewQuestions(interviewId);
//             const questionsData = questionsResponse.questions || [];
//             if (questionsData.length === 0) {
//                 setError('No questions found.');
//                 return;
//             }
//             setQuestions(questionsData);
//             setLoading(false);
//         } catch (err: any) {
//             console.error('Error loading interview:', err);
//             setError(err.response?.data?.error || 'Failed to load interview');
//             setLoading(false);
//         }
//     };

//     const handleStartTest = () => {
//         enterFullscreen();
//         setTestStarted(true);
//     };

//     const handleAutoSubmit = async () => {
//         if (testCompleted || submitting) return;
//         setTestCompleted(true);
//         if (document.fullscreenElement) {
//             document.exitFullscreen();
//         }
//         await submitAllAnswers();
//     };

//     const handleOptionSelect = (option: string) => {
//         const currentQuestion = questions[currentQuestionIndex];
//         if (!currentQuestion) return;
//         setAnswers((prev) => {
//             const newAnswers = new Map(prev);
//             newAnswers.set(currentQuestion.id, option);
//             return newAnswers;
//         });
//     };

//     const handleOpenEndedAnswerChange = (answerText: string) => {
//         const currentQuestion = questions[currentQuestionIndex];
//         if (!currentQuestion) return;
//         setOpenEndedAnswers((prev) => {
//             const newAnswers = new Map(prev);
//             newAnswers.set(currentQuestion.id, answerText);
//             return newAnswers;
//         });
//     };

//     const handleNext = () => {
//         if (currentQuestionIndex < questions.length - 1) {
//             setCurrentQuestionIndex(currentQuestionIndex + 1);
//         }
//     };

//     const handlePrevious = () => {
//         if (currentQuestionIndex > 0) {
//             setCurrentQuestionIndex(currentQuestionIndex - 1);
//         }
//     };

//     const handleSubmit = async () => {
//         if (window.confirm('Are you sure you want to submit?')) {
//             setTestCompleted(true);
//             if (document.fullscreenElement) {
//                 await document.exitFullscreen();
//             }
//             await submitAllAnswers();
//         }
//     };

//     const submitAllAnswers = async () => {
//         if (!interviewId || submitting) return;
//         setSubmitting(true);
//         setError(null);
//         try {
//             for (const question of questions) {
//                 const formData = new FormData();
//                 formData.append('question', question.id.toString());
//                 if (question.is_mcq) {
//                     const selectedOption = answers.get(question.id) || '';
//                     formData.append('selected_option', selectedOption);
//                     await submitInterviewAnswer(interviewId, formData);
//                 } else {
//                     const answerText = openEndedAnswers.get(question.id) || '';
//                     formData.append('answer_text', answerText);
//                     await submitInterviewAnswer(interviewId, formData);
//                 }
//             }
//             await completeInterview(interviewId);
//             try { await generateInterviewReport(interviewId); } catch (err) { console.error(err); }
//             router.push(`/results?id=${interviewId}`);
//         } catch (err: any) {
//             console.error(err);
//             setError(err.response?.data?.error || 'Failed to submit answers');
//             setSubmitting(false);
//         }
//     };

//     const formatTime = (seconds: number) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     const currentQuestion = questions[currentQuestionIndex];
//     const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : null;
//     const currentOpenEndedAnswer = currentQuestion ? openEndedAnswers.get(currentQuestion.id) || '' : '';
//     const answeredCount = answers.size + openEndedAnswers.size;
//     const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;


//     // ---------------------------------------------------------
//     // CONDITIONAL RENDERS
//     // ---------------------------------------------------------

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//                 <div className="flex flex-col items-center">
//                     <div className="w-12 h-12 border-4 border-indigo-200 border-t-blue-600 rounded-full animate-spin"></div>
//                     <p className="mt-4 text-slate-500 font-medium animate-pulse">Initializing Secure Environment...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error && !testStarted) {
//         return (
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-xl shadow-lg border border-red-100 p-8 max-w-md w-full text-center">
//                     <p className="text-red-600 mb-6">{error}</p>
//                     <button onClick={() => router.push('/job-description')} className="w-full py-2.5 bg-gray-900 text-white rounded-lg">Return to Dashboard</button>
//                 </div>
//             </div>
//         );
//     }

//     // --- CASE 1: Test Loaded, But not started (Pre-flight check) ---
//     if (!testStarted) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
//                 <div className="bg-white max-w-lg w-full rounded-2xl p-8 shadow-2xl">
//                     <div className="text-center mb-6">
//                         <h1 className="text-2xl font-bold text-slate-900">Proctored Assessment</h1>
//                         <p className="text-slate-500 mt-2">Please review the rules before beginning.</p>
//                     </div>

//                     <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
//                         <div className="flex items-center gap-3 text-slate-700">
//                             <MaximizeIcon /> <span className="text-sm font-medium">Full Screen Mode is required</span>
//                         </div>
//                         <div className="flex items-center gap-3 text-slate-700">
//                             <div className="w-5 h-5 flex items-center justify-center border-2 border-slate-300 rounded text-[10px] font-bold text-slate-400">⌘</div>
//                             <span className="text-sm font-medium">No Alt-Tab or window switching</span>
//                         </div>
//                         <div className="flex items-center gap-3 text-slate-700">
//                             <div className="w-5 h-5 flex items-center justify-center border-2 border-slate-300 rounded text-[10px] font-bold text-slate-400">🖱️</div>
//                             <span className="text-sm font-medium">Right-click and Copy/Paste disabled</span>
//                         </div>
//                     </div>

//                     <button
//                         onClick={handleStartTest}
//                         className="w-full py-3.5 bg-blue-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200"
//                     >
//                         Enable Full Screen & Start Test
//                     </button>
//                     <p className="text-xs text-center text-slate-400 mt-4">By clicking start, you agree to be monitored.</p>
//                 </div>
//             </div>
//         )
//     }

//     // --- CASE 2: Test Started, But User Exited Fullscreen (BLOCKER) ---
//     if (!isFullscreen && !testCompleted) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 z-50 fixed inset-0">
//                 <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl text-center animate-in zoom-in duration-300">
//                     <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <AlertTriangle />
//                     </div>
//                     <h2 className="text-xl font-bold text-slate-900 mb-2">Assessment Paused</h2>
//                     <p className="text-slate-600 mb-6">
//                         Full-screen mode is required to continue. <br />
//                         <span className="text-xs text-red-500 font-semibold mt-2 block">
//                             Violations Recorded: {violationCount}
//                         </span>
//                     </p>
//                     <button
//                         onClick={enterFullscreen}
//                         className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
//                     >
//                         Resume Assessment
//                     </button>
//                 </div>
//             </div>
//         )
//     }

//     // --- CASE 3: Standard Test Interface (With Proctoring Warning in UI) ---
//     return (
//         <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 select-none">
//             {/* Added select-none class to prevent text highlighting/copying visually as well */}

//             {/* Top Navigation Bar */}
//             <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
//                 <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-indigo-50 p-2 rounded-lg">
//                             <span className="text-lg font-bold text-blue-600 tracking-tight">AI Interview</span>
//                         </div>
//                         <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
//                         <div className="flex items-center gap-2">
//                             {/* Violation Badge */}
//                             {violationCount > 0 && (
//                                 <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-200 text-[10px] font-bold text-red-700 animate-pulse">
//                                     {violationCount} Violations
//                                 </span>
//                             )}
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-4">
//                         <div className="flex flex-col items-end mr-2">
//                             <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                                 <div
//                                     className="h-full bg-indigo-500 transition-all duration-500 ease-out"
//                                     style={{ width: `${progress}%` }}
//                                 />
//                             </div>
//                             <span className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-wide">Progress</span>
//                         </div>

//                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-colors ${timeRemaining < 300
//                             ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
//                             : 'bg-white border-slate-200 text-slate-700'
//                             }`}>
//                             <ClockIcon />
//                             <span className="font-mono font-bold text-sm tabular-nums">
//                                 {formatTime(timeRemaining)}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

//                     {/* LEFT COLUMN: Question Content */}
//                     <div className="lg:col-span-8 space-y-6">
//                         {currentQuestion && (
//                             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//                                 {/* Question Header */}
//                                 <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                                     <div className="flex items-center gap-2">
//                                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${currentQuestion.is_mcq
//                                             ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
//                                             : 'bg-amber-50 text-amber-700 ring-amber-600/20'
//                                             }`}>
//                                             {currentQuestion.is_mcq ? <ListIcon /> : <CodeIcon />}
//                                             {currentQuestion.is_mcq ? 'Multiple Choice' : 'Coding Challenge'}
//                                         </span>
//                                     </div>
//                                     <span className="text-xs font-medium text-slate-400">ID: {currentQuestion.id}</span>
//                                 </div>

//                                 <div className="p-6 sm:p-8">
//                                     <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-8">
//                                         {currentQuestion.question_text}
//                                     </h2>

//                                     {/* MCQ INTERFACE */}
//                                     {currentQuestion.is_mcq && (
//                                         <div className="space-y-3">
//                                             {currentQuestion.options?.map((option, index) => {
//                                                 const letter = String.fromCharCode(65 + index);
//                                                 const isSelected = currentAnswer === letter;

//                                                 return (
//                                                     <button
//                                                         key={index}
//                                                         onClick={() => handleOptionSelect(letter)}
//                                                         className={`group relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ease-in-out ${isSelected
//                                                             ? 'border-blue-600 bg-indigo-50/50 shadow-sm z-10'
//                                                             : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
//                                                             }`}
//                                                     >
//                                                         <div className="flex items-start gap-4">
//                                                             <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isSelected
//                                                                 ? 'bg-blue-600 border-blue-600 text-white'
//                                                                 : 'bg-white border-slate-300 text-slate-400 group-hover:border-slate-400'
//                                                                 }`}>
//                                                                 {isSelected ? <CheckIcon /> : <span className="text-xs font-bold">{letter}</span>}
//                                                             </div>
//                                                             <span className={`text-base leading-relaxed transition-colors ${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-700'
//                                                                 }`}>
//                                                                 {option}
//                                                             </span>
//                                                         </div>
//                                                     </button>
//                                                 );
//                                             })}
//                                         </div>
//                                     )}

//                                     {/* CODING INTERFACE */}
//                                     {!currentQuestion.is_mcq && (
//                                         <div className="space-y-4">
//                                             <div className="relative group">
//                                                 <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 rounded-t-xl flex items-center px-4 gap-1.5">
//                                                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
//                                                     <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
//                                                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
//                                                     <span className="ml-2 text-[10px] text-slate-400 font-mono">solution.txt</span>
//                                                 </div>
//                                                 <textarea
//                                                     value={currentOpenEndedAnswer}
//                                                     onChange={(e) => handleOpenEndedAnswerChange(e.target.value)}
//                                                     spellCheck="false"
//                                                     onPaste={(e) => e.preventDefault()} // Explicit inline prevention
//                                                     className="w-full h-80 pt-10 px-4 pb-4 rounded-xl bg-slate-900 text-slate-50 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
//                                                     placeholder="// Write your solution or explanation here..."
//                                                 />
//                                             </div>
//                                             <div className="flex items-start gap-2 text-amber-700 bg-amber-50 px-4 py-3 rounded-lg text-xs">
//                                                 <span className="text-lg">💡</span>
//                                                 <p className="mt-0.5">Focus on explaining your logic clearly. Pseudo-code is acceptable if syntax isn't perfect.</p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Navigation Footer */}
//                         <div className="hidden lg:flex items-center justify-between pt-4">
//                             <button
//                                 onClick={handlePrevious}
//                                 disabled={currentQuestionIndex === 0}
//                                 className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 <ChevronLeftIcon /> Previous
//                             </button>

//                             {currentQuestionIndex < questions.length - 1 ? (
//                                 <button
//                                     onClick={handleNext}
//                                     className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
//                                 >
//                                     Next Question <ChevronRightIcon />
//                                 </button>
//                             ) : (
//                                 <button
//                                     onClick={handleSubmit}
//                                     disabled={submitting || testCompleted}
//                                     className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {submitting ? 'Submitting...' : testCompleted ? 'Submitted' : 'Finish & Submit'}
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN: Sidebar / Map */}
//                     <div className="lg:col-span-4 space-y-6">
//                         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-24">
//                             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
//                                 Question Map
//                             </h3>

//                             <div className="flex flex-wrap gap-2">
//                                 {questions.map((q, i) => {
//                                     const answered = q.is_mcq
//                                         ? answers.has(q.id)
//                                         : openEndedAnswers.get(q.id)?.trim();
//                                     const isCurrent = i === currentQuestionIndex;

//                                     return (
//                                         <button
//                                             key={i}
//                                             onClick={() => setCurrentQuestionIndex(i)}
//                                             className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${isCurrent
//                                                 ? 'bg-blue-600 text-white shadow-md shadow-indigo-200 scale-110'
//                                                 : answered
//                                                     ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:border-emerald-300'
//                                                     : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
//                                                 }`}
//                                         >
//                                             {i + 1}
//                                         </button>
//                                     );
//                                 })}
//                             </div>

//                             <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-[10px] text-slate-500 text-center">
//                                 <div className="flex flex-col items-center gap-1">
//                                     <div className="w-3 h-3 rounded bg-blue-600"></div>
//                                     <span>Current</span>
//                                 </div>
//                                 <div className="flex flex-col items-center gap-1">
//                                     <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200"></div>
//                                     <span>Answered</span>
//                                 </div>
//                                 <div className="flex flex-col items-center gap-1">
//                                     <div className="w-3 h-3 rounded bg-slate-50 border border-slate-200"></div>
//                                     <span>Pending</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Mobile Navigation */}
//                         <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
//                             <div className="flex items-center justify-between gap-3">
//                                 <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="p-3 rounded-lg bg-slate-100 text-slate-600 disabled:opacity-30"><ChevronLeftIcon /></button>
//                                 {currentQuestionIndex < questions.length - 1 ? (
//                                     <button onClick={handleNext} className="flex-1 py-3 rounded-lg bg-slate-900 text-white font-medium active:scale-95 transition-transform">Next</button>
//                                 ) : (
//                                     <button onClick={handleSubmit} disabled={submitting || testCompleted} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-medium active:scale-95 transition-transform disabled:bg-slate-300">Submit</button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// // 2. Export Wrapper Component
// export default function InterviewPage() {
//     return (
//         <Suspense fallback={
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//                 <div className="flex flex-col items-center">
//                     <div className="w-12 h-12 border-4 border-indigo-200 border-t-blue-600 rounded-full animate-spin"></div>
//                     <p className="mt-4 text-slate-500 font-medium animate-pulse">Initializing Secure Environment...</p>
//                 </div>
//             </div>
//         }>
//             <InterviewContent />
//         </Suspense>
//     );
// }

// 'use client';

// import { useState, useEffect, Suspense, useRef } from 'react'; // Added useRef
// import { useRouter, useSearchParams } from 'next/navigation';
// import { completeInterview, generateInterviewReport, getInterviewQuestions, submitInterviewAnswer } from '@/services/interviews.service';

// // --- Icons ---
// const CameraIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
// );
// // ... (rest of your existing icons)
// const ClockIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
// );
// const ChevronLeftIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
// );
// const ChevronRightIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
// );
// const CheckIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
// );
// const CodeIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
// );
// const ListIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
// );
// const AlertTriangle = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
// );
// const MaximizeIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
// );

// interface Question {
//     id: number;
//     question_text: string;
//     question_type: string;
//     is_mcq: boolean;
//     options: string[];
//     correct_answer: string;
//     order_index: number;
// }

// function InterviewContent() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const interviewIdParam = searchParams.get('id');
//     const timeLimitParam = searchParams.get('time');

//     const [interviewId, setInterviewId] = useState<number | null>(interviewIdParam ? parseInt(interviewIdParam) : null);
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answers, setAnswers] = useState<Map<number, string>>(new Map());
//     const [openEndedAnswers, setOpenEndedAnswers] = useState<Map<number, string>>(new Map());
//     const [timeRemaining, setTimeRemaining] = useState<number>(timeLimitParam ? parseInt(timeLimitParam) : 1800);
//     const [testStarted, setTestStarted] = useState(false);
//     const [testCompleted, setTestCompleted] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // --- PROCTORING STATE ---
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [violationCount, setViolationCount] = useState(0);
    
//     // --- VIDEO PROCTORING STATE ---
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const [stream, setStream] = useState<MediaStream | null>(null);
//     const [cameraError, setCameraError] = useState<string | null>(null);

//     // 1. Enter Full Screen
//     const enterFullscreen = async () => {
//         try {
//             await document.documentElement.requestFullscreen();
//             setIsFullscreen(true);
//         } catch (err) {
//             console.error("Error attempting to enable full-screen mode:", err);
//         }
//     };

//     // 2. Camera Logic
//     const startCamera = async () => {
//         try {
//             const mediaStream = await navigator.mediaDevices.getUserMedia({ 
//                 video: { width: 320, height: 240, facingMode: "user" }, 
//                 audio: false 
//             });
//             setStream(mediaStream);
//             if (videoRef.current) {
//                 videoRef.current.srcObject = mediaStream;
//             }
//             setCameraError(null);
//             return true;
//         } catch (err) {
//             console.error("Camera access denied:", err);
//             setCameraError("Camera access is required for proctoring.");
//             return false;
//         }
//     };

//     const stopCamera = () => {
//         if (stream) {
//             stream.getTracks().forEach(track => track.stop());
//             setStream(null);
//         }
//     };

//     // Cleanup camera on unmount
//     useEffect(() => {
//         return () => stopCamera();
//     }, [stream]);

//     // Handle Start Test with Camera Check
//     const handleStartTest = async () => {
//         const cameraActive = await startCamera();
//         if (cameraActive) {
//             await enterFullscreen();
//             setTestStarted(true);
//         } else {
//             alert("Please allow camera access to start the proctored interview.");
//         }
//     };

//     // Handle Auto-attach stream if test already started
//     useEffect(() => {
//         if (testStarted && stream && videoRef.current && !videoRef.current.srcObject) {
//             videoRef.current.srcObject = stream;
//         }
//     }, [testStarted, stream]);

//     // --- Monitor Full Screen Changes ---
//     useEffect(() => {
//         const handleFullscreenChange = () => {
//             if (!document.fullscreenElement) {
//                 setIsFullscreen(false);
//             } else {
//                 setIsFullscreen(true);
//             }
//         };

//         document.addEventListener('fullscreenchange', handleFullscreenChange);
//         return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     }, []);

//     // --- Monitor Alt-Tab / Visibility / Right Click / Copy-Paste ---
//     useEffect(() => {
//         if (!testStarted || testCompleted) return;

//         const handleContextMenu = (e: MouseEvent) => e.preventDefault();
//         const handleCopyCutPaste = (e: ClipboardEvent) => e.preventDefault();
//         const handleVisibilityChange = () => {
//             if (document.hidden) {
//                 setViolationCount(prev => prev + 1);
//                 alert("WARNING: You left the exam window. This instance has been recorded.");
//             }
//         };

//         document.addEventListener('contextmenu', handleContextMenu);
//         document.addEventListener('copy', handleCopyCutPaste);
//         document.addEventListener('cut', handleCopyCutPaste);
//         document.addEventListener('paste', handleCopyCutPaste);
//         document.addEventListener('visibilitychange', handleVisibilityChange);

//         return () => {
//             document.removeEventListener('contextmenu', handleContextMenu);
//             document.removeEventListener('copy', handleCopyCutPaste);
//             document.removeEventListener('cut', handleCopyCutPaste);
//             document.removeEventListener('paste', handleCopyCutPaste);
//             document.removeEventListener('visibilitychange', handleVisibilityChange);
//         };
//     }, [testStarted, testCompleted]);


//     // --- EXISTING LOGIC (Data Fetching & Submitting) ---

//     useEffect(() => {
//         if (interviewId) {
//             loadInterview();
//         } else {
//             setError('Interview ID not found');
//             setLoading(false);
//         }
//     }, [interviewId]);

//     useEffect(() => {
//         if (testStarted && timeRemaining > 0 && !testCompleted && isFullscreen) {
//             const timer = setInterval(() => {
//                 setTimeRemaining((prev) => {
//                     if (prev <= 1) {
//                         handleAutoSubmit();
//                         return 0;
//                     }
//                     return prev - 1;
//                 });
//             }, 1000);
//             return () => clearInterval(timer);
//         }
//     }, [testStarted, testCompleted, timeRemaining, isFullscreen]);

//     const loadInterview = async () => {
//         if (!interviewId) return;
//         setLoading(true);
//         try {
//             const questionsResponse = await getInterviewQuestions(interviewId);
//             setQuestions(questionsResponse.questions || []);
//             setLoading(false);
//         } catch (err: any) {
//             setError(err.response?.data?.error || 'Failed to load interview');
//             setLoading(false);
//         }
//     };

//     const handleAutoSubmit = async () => {
//         if (testCompleted || submitting) return;
//         setTestCompleted(true);
//         stopCamera(); // Stop camera on completion
//         if (document.fullscreenElement) document.exitFullscreen();
//         await submitAllAnswers();
//     };

//     const handleOptionSelect = (option: string) => {
//         const currentQuestion = questions[currentQuestionIndex];
//         if (!currentQuestion) return;
//         setAnswers((prev) => new Map(prev).set(currentQuestion.id, option));
//     };

//     const handleOpenEndedAnswerChange = (answerText: string) => {
//         const currentQuestion = questions[currentQuestionIndex];
//         if (!currentQuestion) return;
//         setOpenEndedAnswers((prev) => new Map(prev).set(currentQuestion.id, answerText));
//     };

//     const handleNext = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1); };
//     const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1); };

//     const handleSubmit = async () => {
//         if (window.confirm('Are you sure you want to submit?')) {
//             setTestCompleted(true);
//             stopCamera(); // Stop camera on completion
//             if (document.fullscreenElement) await document.exitFullscreen();
//             await submitAllAnswers();
//         }
//     };

//     const submitAllAnswers = async () => {
//         if (!interviewId || submitting) return;
//         setSubmitting(true);
//         try {
//             for (const question of questions) {
//                 const formData = new FormData();
//                 formData.append('question', question.id.toString());
//                 if (question.is_mcq) {
//                     formData.append('selected_option', answers.get(question.id) || '');
//                 } else {
//                     formData.append('answer_text', openEndedAnswers.get(question.id) || '');
//                 }
//                 await submitInterviewAnswer(interviewId, formData);
//             }
//             await completeInterview(interviewId);
//             try { await generateInterviewReport(interviewId); } catch (err) {}
//             router.push(`/results?id=${interviewId}`);
//         } catch (err: any) {
//             setError(err.response?.data?.error || 'Failed to submit answers');
//             setSubmitting(false);
//         }
//     };

//     const formatTime = (seconds: number) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     const currentQuestion = questions[currentQuestionIndex];
//     const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : null;
//     const currentOpenEndedAnswer = currentQuestion ? openEndedAnswers.get(currentQuestion.id) || '' : '';
//     const answeredCount = answers.size + openEndedAnswers.size;
//     const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

//     // --- RENDERS ---

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//                 <div className="flex flex-col items-center">
//                     <div className="w-12 h-12 border-4 border-indigo-200 border-t-blue-600 rounded-full animate-spin"></div>
//                     <p className="mt-4 text-slate-500 font-medium animate-pulse">Initializing Secure Environment...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!testStarted) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
//                 <div className="bg-white max-w-lg w-full rounded-2xl p-8 shadow-2xl">
//                     <div className="text-center mb-6">
//                         <h1 className="text-2xl font-bold text-slate-900">Proctored Assessment</h1>
//                         <p className="text-slate-500 mt-2">Please review the rules before beginning.</p>
//                     </div>

//                     <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
//                         <div className="flex items-center gap-3 text-slate-700">
//                             <MaximizeIcon /> <span className="text-sm font-medium">Full Screen Mode is required</span>
//                         </div>
//                         <div className="flex items-center gap-3 text-slate-700">
//                             <CameraIcon /> <span className="text-sm font-medium">Camera access required for proctoring</span>
//                         </div>
//                         <div className="flex items-center gap-3 text-slate-700 text-xs text-slate-400 pl-8">
//                             Note: Your video is only used for session integrity.
//                         </div>
//                     </div>

//                     <button
//                         onClick={handleStartTest}
//                         className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200"
//                     >
//                         Allow Camera & Start Test
//                     </button>
//                     {cameraError && <p className="text-red-500 text-center text-xs mt-3 font-medium">{cameraError}</p>}
//                 </div>
//             </div>
//         )
//     }

//     if (!isFullscreen && !testCompleted) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 z-50 fixed inset-0">
//                 <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl text-center">
//                     <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <AlertTriangle />
//                     </div>
//                     <h2 className="text-xl font-bold text-slate-900 mb-2">Assessment Paused</h2>
//                     <p className="text-slate-600 mb-6">Full-screen mode is required.</p>
//                     <button onClick={enterFullscreen} className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium">Resume Assessment</button>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
//             {/* VIDEO POPUP (Bottom Left) */}
//             <div className="fixed bottom-6 left-6 z-[60] group">
//                 <div className="relative w-40 h-52 sm:w-48 sm:h-64 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 ring-4 ring-black/5">
//                     <video
//                         ref={videoRef}
//                         autoPlay
//                         muted
//                         playsInline
//                         className="w-full h-full object-cover scale-x-[-1]" // Flip video like a mirror
//                     />
//                     {/* Status Badge */}
//                     <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
//                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//                         <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live</span>
//                     </div>
//                 </div>
//                 <p className="mt-2 text-[10px] text-slate-400 font-medium text-center">Identity Verified</p>
//             </div>

//             {/* Header */}
//             <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
//                 <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <span className="text-lg font-bold text-blue-600">AI Interview</span>
//                         {violationCount > 0 && (
//                             <span className="px-2 py-0.5 rounded-full bg-red-100 text-[10px] font-bold text-red-700 animate-pulse">
//                                 {violationCount} Violations
//                             </span>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-4">
//                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${timeRemaining < 300 ? 'bg-red-50 text-red-700 animate-pulse' : 'bg-white'}`}>
//                             <ClockIcon />
//                             <span className="font-mono font-bold text-sm">{formatTime(timeRemaining)}</span>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 pb-32">
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//                     {/* Main Content Area */}
//                     <div className="lg:col-span-8 space-y-6">
//                         {currentQuestion && (
//                             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//                                 <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//                                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
//                                         {currentQuestion.is_mcq ? <ListIcon /> : <CodeIcon />}
//                                         {currentQuestion.is_mcq ? 'Multiple Choice' : 'Coding Challenge'}
//                                     </span>
//                                 </div>

//                                 <div className="p-6 sm:p-8">
//                                     <h2 className="text-xl font-bold text-slate-900 mb-8">{currentQuestion.question_text}</h2>

//                                     {currentQuestion.is_mcq ? (
//                                         <div className="space-y-3">
//                                             {currentQuestion.options?.map((option, index) => {
//                                                 const letter = String.fromCharCode(65 + index);
//                                                 const isSelected = currentAnswer === letter;
//                                                 return (
//                                                     <button
//                                                         key={index}
//                                                         onClick={() => handleOptionSelect(letter)}
//                                                         className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:bg-slate-50'}`}
//                                                     >
//                                                         <span className="font-bold mr-3">{letter}.</span> {option}
//                                                     </button>
//                                                 );
//                                             })}
//                                         </div>
//                                     ) : (
//                                         <textarea
//                                             value={currentOpenEndedAnswer}
//                                             onChange={(e) => handleOpenEndedAnswerChange(e.target.value)}
//                                             className="w-full h-80 p-4 rounded-xl bg-slate-900 text-slate-50 font-mono text-sm"
//                                             placeholder="// Write your solution here..."
//                                         />
//                                     )}
//                                 </div>
//                             </div>
//                         )}

//                         <div className="flex items-center justify-between">
//                             <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-5 py-2 text-slate-600 disabled:opacity-50">Previous</button>
//                             {currentQuestionIndex < questions.length - 1 ? (
//                                 <button onClick={handleNext} className="px-8 py-2.5 bg-slate-900 text-white rounded-lg">Next</button>
//                             ) : (
//                                 <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg">Submit</button>
//                             )}
//                         </div>
//                     </div>

//                     {/* Question Map Sidebar */}
//                     <div className="lg:col-span-4">
//                         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-24">
//                             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Question Map</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {questions.map((_, i) => (
//                                     <button
//                                         key={i}
//                                         onClick={() => setCurrentQuestionIndex(i)}
//                                         className={`w-9 h-9 rounded-lg text-sm font-medium ${i === currentQuestionIndex ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
//                                     >
//                                         {i + 1}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default function InterviewPage() {
//     return (
//         <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
//             <InterviewContent />
//         </Suspense>
//     );
// }

'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeInterview, generateInterviewReport, getInterviewQuestions, submitInterviewAnswer } from '@/services/interviews.service';

// --- Icons ---
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
);
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);
const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
);
const AlertTriangle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const MaximizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
);

interface Question {
    id: number;
    question_text: string;
    question_type: string;
    is_mcq: boolean;
    options: string[];
    correct_answer: string;
    order_index: number;
}

function InterviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const interviewIdParam = searchParams.get('id');
    const timeLimitParam = searchParams.get('time');

    const [interviewId, setInterviewId] = useState<number | null>(interviewIdParam ? parseInt(interviewIdParam) : null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<number, string>>(new Map());
    const [openEndedAnswers, setOpenEndedAnswers] = useState<Map<number, string>>(new Map());
    const [timeRemaining, setTimeRemaining] = useState<number>(timeLimitParam ? parseInt(timeLimitParam) : 1800);
    const [testStarted, setTestStarted] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- PROCTORING STATE ---
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    
    // --- VIDEO & AUDIO PROCTORING STATE ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mediaError, setMediaError] = useState<string | null>(null);

    // 1. Enter Full Screen
    const enterFullscreen = async () => {
        try {
            const docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                await docElm.requestFullscreen();
            }
            setIsFullscreen(true);
            // After entering fullscreen, wait a beat and force video play
            setTimeout(attachStreamToVideo, 300);
        } catch (err) {
            console.error("Fullscreen error:", err);
        }
    };

    // 2. Camera & Mic Logic
    const startMedia = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 320, height: 240, facingMode: "user" }, 
                audio: true // Enabled Microphone
            });
            setStream(mediaStream);
            setMediaError(null);
            return true;
        } catch (err) {
            console.error("Media access denied:", err);
            setMediaError("Camera and Microphone access are required.");
            return false;
        }
    };

    // Helper to attach stream to the video element
    const attachStreamToVideo = () => {
        if (videoRef.current && stream) {
            if (videoRef.current.srcObject !== stream) {
                videoRef.current.srcObject = stream;
            }
            videoRef.current.play().catch(e => console.error("Auto-play failed:", e));
        }
    };

    const stopMedia = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // Effect: Re-attach camera when tab becomes visible or fullscreen is resumed
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && testStarted && !testCompleted) {
                attachStreamToVideo();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [stream, testStarted, testCompleted]);

    // Effect: Re-attach camera when component re-renders into main view
    useEffect(() => {
        if (isFullscreen && testStarted) {
            attachStreamToVideo();
        }
    }, [isFullscreen, testStarted, stream]);

    // Cleanup media on unmount
    useEffect(() => {
        return () => stopMedia();
    }, []);

    const handleStartTest = async () => {
        const mediaActive = await startMedia();
        if (mediaActive) {
            await enterFullscreen();
            setTestStarted(true);
        } else {
            alert("Please allow camera and microphone access to start.");
        }
    };

    // --- Monitor Full Screen Changes ---
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
            if (isFull) attachStreamToVideo(); // Ensure video starts when returning
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [stream]);

    // --- Monitor Alt-Tab / Security ---
    useEffect(() => {
        if (!testStarted || testCompleted) return;

        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleCopyCutPaste = (e: ClipboardEvent) => e.preventDefault();
        const handleSecurityViolation = () => {
            if (document.hidden) {
                setViolationCount(prev => prev + 1);
                alert("SECURITY WARNING: Tab switching is recorded. Please return to the exam.");
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopyCutPaste);
        document.addEventListener('cut', handleCopyCutPaste);
        document.addEventListener('paste', handleCopyCutPaste);
        document.addEventListener('visibilitychange', handleSecurityViolation);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopyCutPaste);
            document.removeEventListener('cut', handleCopyCutPaste);
            document.removeEventListener('paste', handleCopyCutPaste);
            document.removeEventListener('visibilitychange', handleSecurityViolation);
        };
    }, [testStarted, testCompleted]);


    // --- STANDARD TEST LOGIC ---
    useEffect(() => {
        if (interviewId) {
            loadInterview();
        } else {
            setError('Interview ID not found');
            setLoading(false);
        }
    }, [interviewId]);

    useEffect(() => {
        if (testStarted && timeRemaining > 0 && !testCompleted && isFullscreen) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [testStarted, testCompleted, timeRemaining, isFullscreen]);

    const loadInterview = async () => {
        if (!interviewId) return;
        setLoading(true);
        try {
            const questionsResponse = await getInterviewQuestions(interviewId);
            setQuestions(questionsResponse.questions || []);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load interview');
            setLoading(false);
        }
    };

    const handleAutoSubmit = async () => {
        if (testCompleted || submitting) return;
        setTestCompleted(true);
        stopMedia();
        if (document.fullscreenElement) document.exitFullscreen();
        await submitAllAnswers();
    };

    const handleOptionSelect = (option: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;
        setAnswers((prev) => new Map(prev).set(currentQuestion.id, option));
    };

    const handleOpenEndedAnswerChange = (answerText: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;
        setOpenEndedAnswers((prev) => new Map(prev).set(currentQuestion.id, answerText));
    };

    const handleNext = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1); };
    const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1); };

    const handleSubmit = async () => {
        if (window.confirm('Confirm submission?')) {
            setTestCompleted(true);
            stopMedia();
            if (document.fullscreenElement) await document.exitFullscreen();
            await submitAllAnswers();
        }
    };

    const submitAllAnswers = async () => {
        if (!interviewId || submitting) return;
        setSubmitting(true);
        try {
            for (const question of questions) {
                const formData = new FormData();
                formData.append('question', question.id.toString());
                if (question.is_mcq) {
                    formData.append('selected_option', answers.get(question.id) || '');
                } else {
                    formData.append('answer_text', openEndedAnswers.get(question.id) || '');
                }
                await submitInterviewAnswer(interviewId, formData);
            }
            await completeInterview(interviewId);
            try { await generateInterviewReport(interviewId); } catch (err) {}
            router.push(`/results?id=${interviewId}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to submit answers');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : null;
    const currentOpenEndedAnswer = currentQuestion ? openEndedAnswers.get(currentQuestion.id) || '' : '';
    const answeredCount = answers.size + openEndedAnswers.size;
    const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    // --- RENDER LOGIC ---

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-medium">Initializing Secure Environment...</p>
                </div>
            </div>
        );
    }

    // CASE 1: Pre-start
    if (!testStarted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Proctored Assessment</h1>
                    <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                        <div className="flex items-center gap-3 text-slate-700 font-medium">
                            <MaximizeIcon /> Full Screen Mode Required
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 font-medium">
                            <CameraIcon /> Camera Enabled
                        </div>
                        <div className="flex items-center gap-3 text-slate-700 font-medium">
                            <MicIcon /> Microphone Enabled
                        </div>
                    </div>
                    <button onClick={handleStartTest} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
                        Grant Permissions & Start Test
                    </button>
                    {mediaError && <p className="text-red-500 text-center text-xs mt-3 font-medium">{mediaError}</p>}
                </div>
            </div>
        )
    }

    // CASE 2: PAUSED (Fullscreen exited)
    if (!isFullscreen && !testCompleted) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 z-50 fixed inset-0">
                <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Assessment Paused</h2>
                    <p className="text-slate-600 mb-6">You must remain in full-screen mode to complete the assessment.</p>
                    <button 
                        onClick={enterFullscreen} 
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
                    >
                        Resume Assessment
                    </button>
                </div>
            </div>
        )
    }

    // CASE 3: Standard Interface
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
            
            {/* VIDEO POPUP (Bottom Left) - Optimized for recovery */}
            <div className="fixed bottom-6 left-6 z-[60] group">
                <div className="relative w-40 h-52 sm:w-48 sm:h-64 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 ring-4 ring-black/5">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-x-[-1] bg-slate-900"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Proctoring Active</span>
                    </div>
                    {/* Visual Mic Indicator */}
                    <div className="absolute bottom-3 right-3 p-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                        <MicIcon />
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-blue-600 tracking-tight">AI Interview</span>
                        {violationCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-[10px] font-bold text-red-700 animate-pulse">
                                {violationCount} Violations
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${timeRemaining < 300 ? 'bg-red-50 text-red-700 animate-pulse' : 'bg-white'}`}>
                            <ClockIcon />
                            <span className="font-mono font-bold text-sm">{formatTime(timeRemaining)}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        {currentQuestion && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                                        {currentQuestion.is_mcq ? <ListIcon /> : <CodeIcon />}
                                        {currentQuestion.is_mcq ? 'Multiple Choice' : 'Coding Challenge'}
                                    </span>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <h2 className="text-lg font-medium text-slate-900 mb-8">{currentQuestion.question_text}</h2>
                                    {currentQuestion.is_mcq ? (
                                        <div className="space-y-3">
                                            {currentQuestion.options?.map((option, index) => {
                                                const letter = String.fromCharCode(65 + index);
                                                const isSelected = currentAnswer === letter;
                                                return (
                                                    <button key={index} onClick={() => handleOptionSelect(letter)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                                                        <span className="font-bold mr-3">{letter}.</span> {option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <textarea
                                            value={currentOpenEndedAnswer}
                                            onChange={(e) => handleOpenEndedAnswerChange(e.target.value)}
                                            className="w-full h-80 p-4 rounded-xl bg-slate-900 text-slate-50 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="// Write your solution here..."
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-5 py-2 text-slate-600 disabled:opacity-50 cursor-pointer">Previous</button>
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button onClick={handleNext} className="px-8 py-2.5 bg-slate-900 text-white rounded-lg cursor-pointer font-semibold">Next</button>
                            ) : (
                                <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer font-semibold">Submit</button>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-24">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Question Map</h3>
                            <div className="flex flex-wrap gap-2">
                                {questions.map((_, i) => (
                                    <button key={i} onClick={() => setCurrentQuestionIndex(i)} className={`w-9 h-9 rounded-lg text-sm font-medium cursor-pointer ${i === currentQuestionIndex ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{i + 1}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function InterviewPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <InterviewContent />
        </Suspense>
    );
}