import Card from './Card';

export default function TodayMeals({ logs, onDelete }) {
    return (
        <Card className="bg-white p-7 mt-6">
            <h3 className="text-lg font-bold text-[#1A1C1E] mb-6">
                Comidas de hoy
            </h3>

            {logs.length === 0 ? (
                <p className="text-gray-400 text-sm">
                    No has registrado ninguna comida hoy.
                </p>
            ) : (
                <div className="divide-y divide-gray-100">
                    {logs.map((log) => {
                        const ratio = log.grams / 100;
                        const kcal = Math.round(log.product?.kcal * ratio);

                        return (
                            <div key={log.id} className="py-4 flex items-center justify-between asset-row">
                                <div>
                                    <p className="font-medium text-[#1A1C1E]">
                                        {log.product?.name}
                                    </p>
                                    <p className="text-xs text-gray-400 capitalize">
                                        {log.meal_type} • {log.grams}g
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-sm text-[#1A1C1E]">
                                        {kcal} kcal
                                    </span>
                                    <button
                                        onClick={() => onDelete(log.id)}
                                        className="text-red-500 hover:text-red-700 text-xs font-medium p-1 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}