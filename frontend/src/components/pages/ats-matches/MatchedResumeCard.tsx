import { useState, useEffect } from 'react';
import { ScoreBadge } from './ScoreBadge';
import { getCurrentDomain } from '@/app/(protected)/practice-interview/entryform/page';
import { initiateMail } from '@/services/mail.service';
import { createInterview, generateInterviewQuestions } from '@/services/interviews.service';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/LoadingOverlay';

// --- Icons ---
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;
const InterviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

// --- Helper Component for Range Inputs ---
const SimpleRangeInput = ({ label, value, onChange, min, max, step = 1, unit }: any) => (
    <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {value} {unit}
            </span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{min}</span>
            <span>{max}</span>
        </div>
    </div>
);

// --- Step 1: Configuration Modal ---
function TestConfigModal({ isOpen, onClose, onNext }: any) {
    const [numQuestions, setNumQuestions] = useState(5);
    const [timeLimit, setTimeLimit] = useState(30);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({ numQuestions, timeLimit });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <SettingsIcon /> Configure Assessment
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <XIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <SimpleRangeInput
                        label="Number of Questions"
                        value={numQuestions}
                        onChange={setNumQuestions}
                        min={5}
                        max={10}
                        unit="Q"
                    />

                    <SimpleRangeInput
                        label="Time Limit"
                        value={timeLimit}
                        onChange={setTimeLimit}
                        min={10}
                        max={120}
                        step={5}
                        unit="min"
                    />

                    <div className="bg-blue-50/50 rounded-lg p-3 mb-6 border border-blue-100">
                        <p className="text-xs text-blue-700 flex justify-between">
                            <span>Est. time per question:</span>
                            <span className="font-bold">{Math.round((timeLimit * 60) / numQuestions)} sec</span>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                        Next: Candidate Details &rarr;
                    </button>
                </form>
            </div>
        </div>
    );
}

// --- Step 2: Email Sending Modal ---
function SendTestModal({ isOpen, onClose, onBack, candidateName, match, config }: any) {
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isOpen) document.body.style.overflowY = "hidden";
        return () => { document.body.style.overflowY = ""; }
    }, [isOpen])

    if (!isOpen) return null;

    const sendInterviewEmail = async (id: number) => {
        // --- FIX: Convert minutes to seconds for the URL ---
        const timeInSeconds = config.timeLimit * 60;
        const url = `${getCurrentDomain()}/interview?id=${id}&time=${timeInSeconds}`;

        const payload = {
            candidateName: "",
            candidateEmail: email,
            roleAppliedFor: match.job_description_details.title || "",
            experienceLevel: "",
            testLink: url,
            proctorEmail: "divyanshu.bhati@vanshiv.com",
            proctoringLink: url,
        };
        try {
            await initiateMail(payload);
        } catch (error) {
            console.log("Error in sending mail ", error);
        }
    };

    const conductInterview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            // API expects minutes, so we pass config.timeLimit (which is in minutes)
            const res = await createInterview({
                resume: match.resume,
                job_description: match.job_description,
                time_limit_minutes: config.timeLimit,
            });

            await generateInterviewQuestions(res.id, config.numQuestions);

            // Email function converts to seconds for URL
            await sendInterviewEmail(res?.id);
            toast.success("Email sent successfully");
            onClose();
        } catch (error) {
            console.log("Error in conducting Interview ", error);
            toast.error("Failed to send invite");
        } finally {
            setIsSending(false);
            setEmail('');
        }
    }

    return (
        <>
            <LoadingOverlay show={isSending} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-5 pb-2.5 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900">Send Assessment Invite</h3>
                        <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                            <XIcon />
                        </button>
                    </div>

                    <form onSubmit={conductInterview} className="p-6 pt-4">
                        {/* Config Summary Badge */}
                        <div className="flex gap-2 mb-4">
                            <span className="px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
                                {config.numQuestions} Questions
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
                                {config.timeLimit} Minutes
                            </span>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm mb-5">
                                <span className="shrink-0 mt-0.5"><MailIcon /></span>
                                <p>You are about to send a technical assessment link to <strong>{candidateName || 'the candidate'}</strong>.</p>
                            </div>

                            <label htmlFor='email' className="block text-sm font-medium text-gray-700 mb-1.5">
                                Candidate Email Address
                            </label>
                            <input
                                id='email'
                                type="email"
                                required
                                placeholder="e.g. candidate@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-4 py-2.5 rounded-xl text-sm cursor-pointer font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSending}
                                className="flex-1 px-4 py-2.5 rounded-xl cursor-pointer text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Invite'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

// --- Main Card Component ---
export function MatchedResumeCard({ match, onInterview }: any) {
    // State to manage which step of the modal flow is active
    const [workflowStep, setWorkflowStep] = useState<'idle' | 'config' | 'email'>('idle');
    const [configData, setConfigData] = useState({ numQuestions: 5, timeLimit: 30 });

    const handleConfigSubmit = (data: { numQuestions: number, timeLimit: number }) => {
        setConfigData(data);
        setWorkflowStep('email');
    };

    const handleFinalSuccess = (email: string) => {
        setWorkflowStep('idle');
        if (onInterview) onInterview(email);
    };

    return (
        <>
            <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 p-5">
                {/* --- Header Section --- */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1 overflow-hidden">
                        {/* Icon Container */}
                        <div className="p-2.5 bg-gray-50 rounded-xl shrink-0 group-hover:bg-blue-50 transition-colors duration-300">
                            <FileTextIcon />
                        </div>

                        {/* File Details */}
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
                                {match.resume_details.original_filename}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-600">
                                    PDF
                                </span>
                                <span className="text-xs text-gray-400">
                                    {match.resume_details.file_size_mb} MB • {new Date(match.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Score Badge */}
                    <div className="shrink-0">
                        <ScoreBadge score={Number(match.overall_score)} />
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                        ['Skills', match.skills_score],
                        ['Experience', match.experience_score],
                        ['Education', match.education_score],
                    ].map(([label, score]) => (
                        <div
                            key={label}
                            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-slate-100/80 transition-colors"
                        >
                            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                {label}
                            </span>
                            <span className="text-lg font-bold text-slate-800 mt-0.5">
                                {Number(score).toFixed(0)}<span className="text-xs text-slate-400 ml-0.5">%</span>
                            </span>
                        </div>
                    ))}
                </div>

                {/* --- Action Button --- */}
                <div className="mt-6 pt-4 border-t border-gray-50">
                    <button
                        onClick={() => setWorkflowStep('config')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl
                                bg-gray-900 text-white shadow-sm shadow-gray-200
                                hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5
                                active:translate-y-0 active:shadow-sm
                                transition-all duration-200 cursor-pointer"
                    >
                        <InterviewIcon />
                        Send Test Link
                    </button>
                </div>
            </div>

            {/* --- Modals --- */}

            {/* Step 1: Configuration */}
            <TestConfigModal
                isOpen={workflowStep === 'config'}
                onClose={() => setWorkflowStep('idle')}
                onNext={handleConfigSubmit}
            />

            {/* Step 2: Email & Send */}
            <SendTestModal
                isOpen={workflowStep === 'email'}
                onClose={() => setWorkflowStep('idle')}
                onBack={() => setWorkflowStep('config')}
                onSend={handleFinalSuccess}
                candidateName={match.resume_details.original_filename}
                match={match}
                config={configData}
            />
        </>
    );
}