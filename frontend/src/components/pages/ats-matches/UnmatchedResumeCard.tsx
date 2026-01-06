export function UnmatchedResumeCard({ resume, matching, onMatch }: any) {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
            <div>
                <p className="font-semibold">{resume.original_filename}</p>
                <p className="text-sm text-gray-500">{resume.file_size_mb} MB</p>
            </div>

            <button
                onClick={onMatch}
                disabled={matching}
                className="px-4 py-2 text-sm font-semibold cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
                Match Resume
            </button>
        </div>
    );
}
