'use client';

import { createJobDescription } from '@/services/jobDescription.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function CreateJobDescription() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        company: '',
        description: '',
        required_skills: '',
        experience_level: 'mid',
        location: '',
        salary_range: '',
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e: any) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await createJobDescription(form);
            router.back();
        } catch {
            setError('Failed to save JD');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow p-8 border border-gray-100">

                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Create Job Description
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Add a new job posting to your ATS pipeline
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">

                        {/* Title */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                placeholder="e.g., Senior Frontend Engineer"
                                className="w-full border-[1.7px] border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Company
                            </label>
                            <input
                                name="company"
                                placeholder="e.g., Acme Inc."
                                className="text-sm w-full border-[1.7px] border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Job Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                placeholder="Describe the role, responsibilities, and expectations..."
                                className="text-sm w-full border-[1.7px] border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                rows={5}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Required Skills <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="required_skills"
                                name="required_skills"
                                placeholder="Describe the role, responsibilities, and expectations..."
                                className="text-sm w-full border-[1.7px] border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                rows={5}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 3-col fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Experience Level
                                </label>
                                <select
                                    name="experience_level"
                                    className="text-sm w-full border-[1.7px] border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    onChange={handleChange}
                                >
                                    <option value="entry">Entry</option>
                                    <option value="mid">Mid</option>
                                    <option value="senior">Senior</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    name="location"
                                    placeholder="Remote / City"
                                    className="text-sm w-full border-[1.7px] border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Salary Range
                                </label>
                                <input
                                    name="salary_range"
                                    placeholder="$80k – $120k"
                                    className="text-sm w-full border-[1.7px] border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="text-sm font-semibold w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition disabled:bg-gray-300"
                        >
                            {saving ? "Saving..." : "Save Job Description"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateJobDescription;