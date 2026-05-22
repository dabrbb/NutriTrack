import { useState } from 'react';

export default function HistoryItem({ day }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white p-5 border border-gray-100 shadow-sm rounded-2xl transition-all mb-4">
            <div
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-sm font-bold text-[#1A1C1E] min-w-[100px]">
                    {day.date}
                </div>

                <div className="flex flex-wrap items-center gap-6 md:gap-10 text-sm">
                    <div className="flex items-center space-x-2">
                        <span className="text-base">🔥</span>
                        <span className="font-bold text-[#1A1C1E]">{day.kcal} <span className="font-normal text-gray-400 text-xs">kcal</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-base">🥩</span>
                        <span className="font-bold text-[#1A1C1E]">{day.protein}g</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-base">🥑</span>
                        <span className="font-bold text-[#1A1C1E]">{day.fat}g</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-base">🌾</span>
                        <span className="font-bold text-[#1A1C1E]">{day.carbs}g</span>
                    </div>
                </div>

                <div className="ml-auto md:ml-0 text-gray-300">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400 animate-in fade-in duration-200">
                    Detalles del día disponibles en próximas actualizaciones.
                </div>
            )}
        </div>
    );
}