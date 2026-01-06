import { LoaderCircle } from "lucide-react";

export function MatchAllButton({ count, matching, onMatch }: any) {
    return (
        <div className="text-center">
            <button
                onClick={onMatch}
                disabled={matching}
                className="px-6 py-3 text-sm font-semibold cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
                {matching ?
                    <div className="flex items-center gap-2">
                        <span>Matching</span>
                        <LoaderCircle className="animate-spin" size={20} />
                    </div>
                    : `Match ${count} Resumes`}
            </button>
        </div>
    );
}
