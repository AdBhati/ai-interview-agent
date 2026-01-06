import { JobDescription } from "@/app/(protected)/job-description/page";

export default function JDCard({
    jd,
    onClick,
}: {
    jd: JobDescription;
    onClick: () => void;
}) {
    return (
        <div
            className="bg-white rounded-xl shadow hover:drop-shadow-xl p-5 hover:shadow-lg transition min-h-[248px] h-full flex flex-col"
        >
            {/* CONTENT */}
            <div className="flex-1">
                <h3 className="font-semibold text-lg">{jd.title}</h3>

                {jd.company && (
                    <p className="text-gray-500 text-sm">{jd.company}</p>
                )}

                <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                    {jd.description}
                </p>

                <div className="mt-4 flex gap-2 text-xs text-gray-600">
                    {jd.location && <span>📍 {jd.location}</span>}
                    {jd.experience_level && <span>• {jd.experience_level}</span>}
                </div>
            </div>

            {/* BUTTON */}
            <button onClick={onClick} className="cursor-pointer text-sm mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
                View ATS →
            </button>
        </div>
    );
}
