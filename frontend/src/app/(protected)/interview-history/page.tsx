'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getInterviewHistory } from '@/services/interviews.service';

// --- Icons ---
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><path d="M12 7v5l4 2" /></svg>;

interface InterviewHistory {
    id: number;
    resume: number;
    resume_details: {
        id: number;
        original_filename: string;
        file_size_mb: number;
    } | null;
    job_description: {
        id: number;
        title: string;
        company: string;
    } | null;
    title: string;
    status: string;
    time_limit_minutes: number;
    total_questions: number;
    total_score: number;
    average_score: number;
    completion_percentage: number;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    questions: any[];
    answers: any[];
    report: any | null;
}

// 1. Rename logic component to Content
function InterviewHistoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeId = searchParams.get('resume_id') ? parseInt(searchParams.get('resume_id')!) : undefined;
    const jdId = searchParams.get('jd_id') ? parseInt(searchParams.get('jd_id')!) : undefined;

    const [interviews, setInterviews] = useState<InterviewHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        status: searchParams.get('status') || 'completed',
        limit: 50,
        offset: 0,
    });

    useEffect(() => {
        loadHistory();
    }, [resumeId, jdId, filters.status, filters.offset]);

    const loadHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const params: any = {
                limit: filters.limit,
                offset: filters.offset,
            };
            if (resumeId) params.resume_id = resumeId;
            if (jdId) params.job_description_id = jdId;
            if (filters.status) params.status = filters.status;

            const response = await getInterviewHistory(params);
            setInterviews(response.results || []);
            setTotalCount(response.count || 0);
        } catch (err: any) {
            console.error('Error loading interview history:', err);
            setError(err.response?.data?.error || 'Failed to load interview history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'in_progress':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'cancelled':
                return 'bg-slate-100 text-slate-600 border-slate-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-emerald-600';
        if (score >= 6) return 'text-amber-600';
        return 'text-rose-600';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewDetails = (interviewId: number) => {
        router.push(`/results?interview=${interviewId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                            <HistoryIcon />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Interview History</h1>
                            <p className="text-slate-500 text-sm mt-1">Manage and review your past interview sessions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/job-description')}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm text-sm"
                    >
                        ← Back to Jobs
                    </button>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm w-full sm:w-auto">
                        <FilterIcon />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-2">Filter Status:</span>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, offset: 0 })}
                            className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                        >
                            <option value="">All Interviews</option>
                            <option value="created">Created</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                        Showing {interviews.length} of {totalCount} records
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-500 text-sm font-medium">Retrieving history...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && interviews.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <HistoryIcon />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No interviews found</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">Start a new interview session to populate this list.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
                        >
                            Start New Interview
                        </button>
                    </div>
                )}

                {/* Interview List Cards */}
                {!loading && interviews.length > 0 && (
                    <div className="grid gap-4">
                        {interviews.map((interview) => (
                            <div
                                key={interview.id}
                                className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-6">

                                    {/* Left: Main Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {interview.title}
                                            </h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(interview.status)}`}>
                                                {interview.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-600">
                                            {interview.resume_details && (
                                                <div className="flex items-center gap-2">
                                                    <FileTextIcon />
                                                    <span className="truncate max-w-[200px]" title={interview.resume_details.original_filename}>
                                                        {interview.resume_details.original_filename}
                                                    </span>
                                                </div>
                                            )}
                                            {interview.job_description && (
                                                <div className="flex items-center gap-2">
                                                    <BuildingIcon />
                                                    <span className="truncate max-w-[200px]">
                                                        {interview.job_description.title}
                                                    </span>
                                                    {interview.job_description.company && (
                                                        <span className="text-slate-400 text-xs">• {interview.job_description.company}</span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <CalendarIcon />
                                                <span>{formatDate(interview.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Stats & Action */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">

                                        {/* Score Hero */}
                                        <div className="flex items-center gap-4 min-w-[140px]">
                                            <div className={`text-3xl font-bold ${getScoreColor(interview.average_score)}`}>
                                                {interview.average_score.toFixed(1)}
                                                <span className="text-sm text-slate-300 font-normal ml-0.5">/10</span>
                                            </div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                Avg<br />Score
                                            </div>
                                        </div>

                                        {/* Mini Stats */}
                                        <div className="flex gap-4 sm:gap-6 text-center">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-700">{interview.completion_percentage}%</div>
                                                <div className="text-[10px] text-slate-400 uppercase">Complete</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-700">{interview.time_limit_minutes}m</div>
                                                <div className="text-[10px] text-slate-400 uppercase">Limit</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-700">{interview.total_questions}</div>
                                                <div className="text-[10px] text-slate-400 uppercase">Q's</div>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex lg:flex-col gap-2 w-full lg:w-auto">
                                            {interview.report ? (
                                                <button
                                                    onClick={() => router.push(`/results?id=${interview.id}`)}
                                                    className="flex-1 cursor-pointer g:flex-none px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
                                                >
                                                    View Report
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleViewDetails(interview.id)}
                                                    className="flex-1 lg:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                                                >
                                                    Continue / Details
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalCount > filters.limit && (
                    <div className="flex justify-center items-center gap-4 pt-4 border-t border-slate-200">
                        <button
                            onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) })}
                            disabled={filters.offset === 0}
                            className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeftIcon /> Previous
                        </button>
                        <span className="text-sm text-slate-500 font-medium">
                            Page {Math.floor(filters.offset / filters.limit) + 1}
                        </span>
                        <button
                            onClick={() => setFilters({ ...filters, offset: filters.offset + filters.limit })}
                            disabled={filters.offset + filters.limit >= totalCount}
                            className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next <ChevronRightIcon />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// 2. Export Wrapper Component
export default function InterviewHistoryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 text-sm font-medium">Loading history...</p>
                </div>
            </div>
        }>
            <InterviewHistoryContent />
        </Suspense>
    );
}