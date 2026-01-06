'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listJobDescriptions } from '@/services/jobDescription.service';
import JDCard from '@/components/pages/job-description/JDCard';
import { useAppSelector } from '@/store/reduxStore';
import { useDispatch } from 'react-redux';
import { updateJobDescriptions } from '@/store/slices/appSlice';
import Link from 'next/link';
import { Info } from 'lucide-react';

export interface JobDescription {
    id: number;
    title: string;
    company: string;
    description: string;
    required_skills: string;
    experience_level: string;
    location: string;
    salary_range: string;
    created_at: string;
}

export default function JobDescriptionPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    
    const jobDescriptions = useAppSelector(state => state.app.jobDescriptions);
    const [loading, setLoading] = useState(true);

    const loadJD = async () => {
        try {
            const res = await listJobDescriptions();
            dispatch(updateJobDescriptions(res || []));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJD();
    }, []);

    const handleViewATS = (id: number) => router.push(`/ats-matches?jd=${id}`);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Job Descriptions</h1>
                    <p className="text-gray-500 text-sm">Create and manage JDs</p>
                </div>

                <Link href="/job-description/create">
                    <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-semibold cursor-pointer"
                    >
                        Create JD
                    </button>
                </Link>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    <span className="material-symbols-outlined animate-spin">
                        progress_activity
                    </span>
                </div>
            ) : jobDescriptions.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center gap-2">
                    <Info size={40} strokeWidth={1.4} />
                    <p className="text-gray-600 mb-4 font-medium text-sm">No job descriptions yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {jobDescriptions.map(jd => (
                        <JDCard key={jd.id} jd={jd} onClick={() => handleViewATS(jd.id)} />
                    ))}
                </div>
            )}
        </div>
    );
}
