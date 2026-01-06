'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { RangeField } from '@/components/pages/interview-config/RangeField';
import { InfoPanel } from '@/components/pages/interview-config/InfoPanel';
import { ErrorAlert } from '@/components/pages/interview-config/ErrorAlert';
import { PageHeader } from '@/components/pages/interview-config/PageHeader';
import { createInterview, generateInterviewQuestions, startInterview } from '@/services/interviews.service';
import { LoaderCircle } from 'lucide-react';

// 1. Rename the logic component to 'InterviewConfigContent'
function InterviewConfigContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const jobDescriptionId = searchParams.get('jd') ? parseInt(searchParams.get('jd')!) : null;
    const resumeId = searchParams.get('resume') ? parseInt(searchParams.get('resume')!) : null;
    const matchId = searchParams.get('match') ? parseInt(searchParams.get('match')!) : null;

    const [numQuestions, setNumQuestions] = useState(5);
    const [timeLimit, setTimeLimit] = useState(30);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobDescriptionId || !resumeId) {
            router.push('/job-description');
        }
    }, [jobDescriptionId, resumeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!jobDescriptionId || !resumeId) {
            setError('Missing job description or resume information');
            return;
        }

        if (numQuestions < 5 || numQuestions > 10) {
            setError('Number of questions must be between 5 and 10');
            return;
        }

        if (timeLimit < 10 || timeLimit > 120) {
            setError('Time limit must be between 10 and 120 minutes');
            return;
        }

        setCreating(true);
        setError(null);

        try {
            const interviewResponse = await createInterview({
                resume: resumeId,
                job_description: jobDescriptionId,
                time_limit_minutes: timeLimit,
            });

            const interviewId = interviewResponse.id;
            await generateInterviewQuestions(interviewId, numQuestions);
            await startInterview(interviewId);

            localStorage.setItem(
                'interviewConfig',
                JSON.stringify({
                    interviewId,
                    numQuestions,
                    timeLimitMinutes: timeLimit,
                    timeLimitSeconds: timeLimit * 60,
                })
            );

            router.push(`/interview?id=${interviewId}&questions=${numQuestions}&time=${timeLimit * 60}`);
        } catch (err: any) {
            console.error('Error creating interview:', err);
            setError(err.response?.data?.error || 'Failed to create interview. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <PageHeader
                title="Configure Interview Test"
                subtitle="Define the number of questions and time limit for the candidate's online assessment."
            />

            <div className="max-w-3xl mx-auto mt-12">
                <div className="mt-10 rounded-2xl overflow-hidden border-0 border-black/5 shadow-sm bg-white">
                    {/* Header Bar */}
                    <div className="px-6 py-5 bg-blue-600 border-b">
                        <h3 className="text-base font-bold text-white">
                            Interview Settings
                        </h3>
                        <p className="text-sm font-medium text-white mt-1">
                            Customize the assessment parameters below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-10">

                        {/* Section 1 */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Number of Questions
                            </h4>

                            <div className="bg-gray-50 rounded-xl border-[.5px] border-gray-400 p-4">
                                <RangeField
                                    id="numQuestions"
                                    label="Total Questions"
                                    min={5}
                                    max={10}
                                    value={numQuestions}
                                    onChange={(v:any) => setNumQuestions(v)}
                                    highlight={numQuestions}
                                    unit="questions"
                                    hint="Select between 5 to 10 questions"
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-200" />

                        {/* Section 2 */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Time Allocation
                            </h4>

                            <div className="bg-gray-50 rounded-xl border-[.5px] border-gray-400 p-4">
                                <RangeField
                                    id="timeLimit"
                                    label="Time Limit"
                                    min={10}
                                    max={120}
                                    step={5}
                                    value={timeLimit}
                                    onChange={(v:any) => setTimeLimit(v)}
                                    highlight={timeLimit}
                                    unit="minutes"
                                    hint="Select between 10 to 120 minutes"
                                />
                            </div>

                            <div className="mt-3">
                                <InfoPanel
                                    totalMinutes={timeLimit}
                                    totalSeconds={timeLimit * 60}
                                    avgSeconds={Math.round((timeLimit * 60) / numQuestions)}
                                />
                            </div>
                        </div>

                        {error && <ErrorAlert message={error} />}

                        <hr className="border-gray-200" />

                        {/* Footer */}
                        <div className="pt-0 flex justify-between items-center">

                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={creating}
                                className="px-5 py-2.5 text-sm cursor-pointer rounded-lg border-[.5px] border-gray-400 text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={creating}
                                className="px-6 py-3 text-sm cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                            >
                                {creating ?
                                    <div className="flex items-center gap-2">
                                        <span>Creating Test</span>
                                        <LoaderCircle size={20} className='animate-spin' />
                                    </div>
                                    : 'Start Test Engine'}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}

// 2. Export the Wrapper Component with Suspense
export default function InterviewConfigPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoaderCircle size={40} className="animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600 font-medium">Loading Configuration...</p>
                </div>
            </div>
        }>
            <InterviewConfigContent />
        </Suspense>
    );
}