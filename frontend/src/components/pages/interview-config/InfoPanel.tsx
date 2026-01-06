export function InfoPanel({ totalMinutes, totalSeconds, avgSeconds }: any) {
    return (
        <div className="mt-2 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
                ⏱ Total time: <strong>{totalMinutes} minutes</strong> ({totalSeconds} seconds)
            </p>
            <p className="text-xs text-blue-700 mt-1">
                Average time per question: ~{avgSeconds} seconds
            </p>
        </div>
    );
}
