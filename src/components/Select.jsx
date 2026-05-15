export default function Select({ label, options = [], value, onChange, placeholder }) {
    return (
        <div className="flex flex-col w-full text-left">
            {label && (
                <label className="text-[#49454F] text-sm font-medium mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full py-4 px-5 bg-white border border-gray-200 rounded-2xl text-[#1A1C1E] focus:outline-none focus:border-[#00C950] focus:ring-1 focus:ring-[#00C950] transition-all appearance-none cursor-pointer"
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}