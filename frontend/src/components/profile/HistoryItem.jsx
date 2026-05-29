import { useState } from 'react';

const MEAL_TYPES = {
    breakfast: { name: 'Desayuno'},
    lunch: { name: 'Almuerzo'},
    dinner: { name: 'Cena'},
    snack: { name: 'Snack' }
};

export default function HistoryItem({ day }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const activeMeals = Object.entries(day.meals).filter(([_, items]) => items.length > 0);
    
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
                        <span className="font-bold text-[#1A1C1E]">{day.total_kcal} <span className="font-normal text-gray-400 text-xs">kcal</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-base">🥩</span>
                        <span className="font-bold text-[#1A1C1E]">{day.total_protein}g</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-base">🥑</span>
                        <span className="font-bold text-[#1A1C1E]">{day.total_fat}g</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-base">🌾</span>
                        <span className="font-bold text-[#1A1C1E]">{day.total_carbs}g</span>
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
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
                    {activeMeals.length === 0 ? (
                        <div className="text-xs text-gray-400 text-center py-4">
                            No hay detalles disponibles
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activeMeals.map(([mealType, items]) => (
                                <div key={mealType} className="space-y-2">
                                    <h4 className="text-sm font-bold text-[#1A1C1E] flex items-center gap-2">
                                        <span>{MEAL_TYPES[mealType]?.name || mealType}</span>
                                    </h4>
                                    
                                    <div className="space-y-2 pl-4">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">
                                                    {item.product_name} ({item.grams}g)
                                                </span>
                                                <div className="flex gap-4 text-xs">
                                                    <span className="font-medium">🔥 {item.kcal}</span>
                                                    <span className="text-gray-500">🥩 {item.protein}g</span>
                                                    <span className="text-gray-500">🥑 {item.fat}g</span>
                                                    <span className="text-gray-500">🌾 {item.carbs}g</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}