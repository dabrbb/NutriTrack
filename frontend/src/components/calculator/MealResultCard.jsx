import Card from '../forms/Card';
import NutrientRow from '../ui/NutrientRow';

export default function MealResultCard({ result }) {
    return (
        <Card className="bg-white p-7">
            <h3 className="text-lg font-bold text-[#1A1C1E] mb-6">
                Resultado de esta comida
            </h3>
            <div className="space-y-4">
                <NutrientRow label="Kcal" value={result.kcal} icon="🔥" bg="bg-orange-50" />
                <NutrientRow label="Proteínas" value={result.protein} unit="g" icon="🥩" bg="bg-red-50" />
                <NutrientRow label="Grasas" value={result.fat} unit="g" icon="💧" bg="bg-yellow-50" />
                <NutrientRow label="Carbohidratos" value={result.carbs} unit="g" icon="🍞" bg="bg-blue-50" />
            </div>
        </Card>
    );
}