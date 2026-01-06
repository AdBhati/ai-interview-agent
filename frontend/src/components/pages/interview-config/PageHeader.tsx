export function PageHeader({ title, subtitle }: any) {
    return (
        <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-600 mt-1 text-sm">{subtitle}</p>
        </div>
    );
}
