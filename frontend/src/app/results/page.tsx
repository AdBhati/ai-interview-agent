'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateInterviewReport, getInterviewReport } from '@/services/interviews.service';

// --- Icons ---
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);
const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);
const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
);
const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const ListChecksIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h11" /><path d="M10 12h11" /><path d="M10 18h11" /><path d="M4 6h1" /><path d="M4 12h1" /><path d="M4 18h1" /></svg>
);
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);

interface ReportData {
    id: number;
    overall_score: number;
    technical_score: number;
    behavioral_score: number;
    communication_score: number;
    summary: string;
    strengths: string;
    areas_for_improvement: string;
    recommendations: string;
    total_questions: number;
    questions_answered: number;
    average_answer_length: number;
}

// 1. Rename logic component to Content
function ResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const interviewId = searchParams.get('id') || localStorage.getItem('interviewId');

    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (interviewId) {
            loadReport();
        } else {
            setError('No interview ID provided');
            setLoading(false);
        }
    }, [interviewId]);

    const loadReport = async () => {
        if (!interviewId) return;

        try {
            setLoading(true);
            const response = await getInterviewReport(parseInt(interviewId));
            setReport(response);
        } catch (err: any) {
            if (err.response?.status === 404) {
                // Report doesn't exist, offer to generate
                setError(null);
            } else {
                setError('Failed to load report');
                console.error('Error loading report:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!interviewId) return;

        try {
            setGenerating(true);
            const response = await generateInterviewReport(parseInt(interviewId));
            setReport(response);
            setError(null);
        } catch (err: any) {
            setError('Failed to generate report. Please try again.');
            console.error('Error generating report:', err);
        } finally {
            setGenerating(false);
        }
    };

    // Enhanced Color Logic
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (score >= 6) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-rose-600 bg-rose-50 border-rose-200';
    };

    const getProgressBarColor = (score: number) => {
        if (score >= 8) return 'bg-emerald-500';
        if (score >= 6) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-medium animate-pulse">Analyzing performance data...</p>
                </div>
            </div>
        );
    }

    if (error && !report) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Error Loading Report</h3>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/interview')}
                        className="w-full px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                    >
                        Return to Interview
                    </button>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <AwardIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Interview Completed!</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Your session has been recorded. Generate your comprehensive AI analysis report now to see how you performed.
                    </p>
                    <button
                        onClick={handleGenerateReport}
                        disabled={generating}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Generating Analysis...</span>
                            </>
                        ) : (
                            <>
                                <AwardIcon /> Generate Report
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Performance Report</h1>
                        <p className="text-slate-500 mt-1">AI-Powered Analysis & Feedback</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-500 shadow-sm">
                            ID: #{report.id}
                        </span>
                        <span className="px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700 shadow-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified
                        </span>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-100">
                        {/* Overall Score - Hero */}
                        <div className="md:col-span-4 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Overall Score</h3>
                            <div className="relative">
                                <div className={`w-32 h-32 rounded-full flex items-center justify-center border-[6px] ${getScoreColor(report.overall_score)}`}>
                                    <span className="text-4xl font-bold text-slate-900">{report.overall_score.toFixed(1)}</span>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-slate-500 font-medium">Out of 10.0</p>
                        </div>

                        {/* Score Breakdown */}
                        <div className="md:col-span-8 p-8 space-y-6">
                            <h3 className="text-sm font-semibold text-slate-900">Category Breakdown</h3>

                            {[
                                { label: 'Technical Proficiency', score: report.technical_score, color: 'blue' },
                                { label: 'Behavioral Fit', score: report.behavioral_score, color: 'purple' },
                                { label: 'Communication Style', score: report.communication_score, color: 'indigo' }
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                        <span className="text-sm font-bold text-slate-900">{item.score.toFixed(1)}/10</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${getProgressBarColor(item.score)}`}
                                            style={{ width: `${(item.score / 10) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="lg:col-span-2">
                            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <AwardIcon /> Executive Summary
                            </h2>
                            <div className="bg-slate-50 rounded-xl px-5 py-3 border border-slate-100 text-slate-700 leading-relaxed text-sm">
                                {report.summary}
                            </div>
                        </div>

                        {/* Strengths */}
                        <div>
                            <h2 className="text-basefont-bold text-slate-900 mb-3 flex items-center gap-2">
                                <CheckCircleIcon /> Key Strengths
                            </h2>
                            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100/50 h-full">
                                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                                    {report.strengths}
                                </p>
                            </div>
                        </div>

                        {/* Improvements */}
                        <div>
                            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <TrendingUpIcon /> Areas for Improvement
                            </h2>
                            <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100/50 h-full">
                                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                                    {report.areas_for_improvement}
                                </p>
                            </div>
                        </div>

                        {/* Recommendations (Full Width) */}
                        <div className="lg:col-span-2 mt-9">
                            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <LightbulbIcon /> Actionable Recommendations
                            </h2>
                            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50">
                                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                                    {report.recommendations}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="bg-slate-50 border-t border-slate-200 px-8 py-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 mb-2">
                                    <ListChecksIcon />
                                </div>
                                <span className="text-2xl font-bold text-slate-900">{report.total_questions}</span>
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Questions</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 mb-2">
                                    <CheckCircleIcon />
                                </div>
                                <span className="text-2xl font-bold text-slate-900">{report.questions_answered}</span>
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Answered</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 mb-2">
                                    <ClockIcon />
                                </div>
                                <span className="text-2xl font-bold text-slate-900">{Math.round(report.average_answer_length)}</span>
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Char/Answer</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-all font-medium shadow-lg shadow-slate-200"
                    >
                        <HomeIcon /> Return Home
                    </button>
                </div>

            </div>
        </div>
    );
}

// 2. Export Wrapper Component
export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Results...</p>
                </div>
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}