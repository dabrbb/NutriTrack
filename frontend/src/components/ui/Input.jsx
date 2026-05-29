export default function Input({ label, type, placeholder, onChange, value, min, error }) {
    return (
        <div className="flex flex-col space-y-2 w-full">
            <label className="text-sm font-bold text-[#49454F] ml-1">
                {label}
            </label>
            <input
                value={value}
                min={min}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                className={`rounded-2xl border p-4 text-gray-700 outline-none transition-all placeholder:text-gray-300 w-full 
                    ${error
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50"
                        : "border-gray-200 bg-white focus:ring-2 focus:ring-[#00C950]/20 focus:border-[#00C950]"
                    }`}
            />
            {error && (
                <span className="text-xs text-red-500 ml-1 font-medium">
                    {error}
                </span>
            )}
        </div>
    );
}