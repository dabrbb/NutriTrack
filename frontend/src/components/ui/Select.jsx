import { useState, useRef, useEffect } from 'react';

export default function Select({ label, options = [], value, onChange, placeholder, error }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange({ target: { value: val } });
        setIsOpen(false);
    };

    return (
        <div ref={selectRef} className="flex flex-col space-y-2 w-full text-left relative">
            {label && (
                <label className="text-sm font-bold text-[#49454F] ml-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full rounded-2xl border p-4 pr-12 text-gray-700 cursor-pointer transition-all select-none
                        ${error
                            ? "border-red-500 bg-red-50 focus:ring-red-500/20"
                            : isOpen
                                ? 'ring-2 ring-[#00C950]/20 border-[#00C950]'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                >
                    {selectedOption ? (
                        selectedOption.label
                    ) : (
                        <span className="text-gray-300">{placeholder}</span>
                    )}
                </div>

                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto py-1">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(option.value)}
                                className={`px-5 py-3 text-sm cursor-pointer transition-colors text-gray-700
                                    ${option.value === value ? 'bg-[#00C950]/10 text-[#00C950] font-semibold' : 'hover:bg-gray-50'}`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500 ml-1 font-medium">
                    {error}
                </span>
            )}
        </div>
    );
}