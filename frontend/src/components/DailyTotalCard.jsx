import Card from './Card';
import NutrientRow from './NutrientRow';

export default function DailyTotalCard({ total }) {
    return (
        <Card className="p-7 bg-[#DCFCE7] border-none">
            <h3 className="text-lg font-bold text-[#1A1C1E] mb-6">
                Total Diario
            </h3>
            <div className="space-y-4">
                <NutrientRow label="Kcal" value={total?.kcal || 0} icon="🔥" bg="bg-orange-50" />
                <NutrientRow label="Proteínas" value={total?.protein || 0} unit="g" icon="🥩" bg="bg-red-50" />
                <NutrientRow label="Grasas" value={total?.fat || 0} unit="g" icon="💧" bg="bg-yellow-50" />
                <NutrientRow label="Carbohidratos" value={total?.carbs || 0} unit="g" icon="🍞" bg="bg-blue-50" />
            </div>
        </Card>
    );
}