export function RangeField({
    id,
    label,
    min,
    max,
    step = 1,
    value,
    onChange,
    highlight,
    unit,
    hint,
}: any) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-4">
                <input
                    type="range"
                    id={id}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="flex-1 accent-blue-600"
                />

                <div className="w-24 text-center">
                    <span className="text-xl font-bold text-blue-600">{highlight}</span>
                    <span className="text-gray-600 text-sm"> {unit}</span>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">{hint}</p>
        </div>
    );
}
