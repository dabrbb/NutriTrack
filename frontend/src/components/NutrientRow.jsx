export default function NutrientRow({ label, value, unit = "", icon, bg }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className={`${bg} w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm`}>
                    {icon}
                </div>
                <span className="text-gray-500 font-medium text-[15px]">{label}</span>
            </div>
            <div className="flex items-baseline space-x-1">
                <span className="text-[#1A1C1E] font-bold text-lg">{value}</span>
                {unit && <span className="text-xs text-gray-400 font-bold">{unit}</span>}
            </div>
        </div>
    );
}