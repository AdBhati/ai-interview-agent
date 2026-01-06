import { JobDescription } from "@/app/(protected)/job-description/page";

export function PageHeader({ jobDescription }: { jobDescription: JobDescription }) {
    return (
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">ATS Matches</h1>
                {jobDescription && (
                    <>
                        <p className="font-semibold text-gray-800">{jobDescription.title}</p>
                        {jobDescription.company && (
                            <p className="text-gray-500">{jobDescription.company}</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
