export function ResumeUpload({ uploading, onUpload, fileInputRef }: any) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="border-2 border-dashed rounded-xl p-10 text-center border-blue-400 transition-colors">

                <div className="mx-auto mb-3 text-blue-600 text-3xl">
                    📄
                </div>

                <p className="font-semibold text-gray-800 text-lg">
                    Upload Resume
                </p>

                <p className="text-gray-500 text-sm mt-1 mb-6">
                    PDF files only — max 10MB
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={onUpload}
                    disabled={uploading}
                    className="hidden"
                    id="resume-upload"
                />

                <label
                    htmlFor="resume-upload"
                    className={`inline-flex cursor-pointer text-sm font-semibold items-center justify-center px-6 py-3 rounded-lg shadow-sm transition-all
                        ${uploading
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow'
                        }`}
                >
                    {uploading ? 'Uploading…' : 'Select PDF File'}
                </label>
            </div>
        </div>
    );
}
