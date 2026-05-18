import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/forms/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import NutrientRow from '../components/ui/NutrientRow';
import TodayMeals from '../components/calculator/TodayMeals';
import MealResultCard from '../components/calculator/MealResultCard';
import DailyTotalCard from '../components/calculator/DailyTotalCard';
import api from '../api';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [grams, setGrams] = useState("");

    const [result, setResult] = useState({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
    const [total, setTotal] = useState({ kcal: 0, protein: 0, fat: 0, carbs: 0 });

    const [mealType, setMealType] = useState("desayuno");
    const [logs, setLogs] = useState([]);

    const loadTodayLogs = async () => {
        try {
            const res = await api.get('/food-logs');
            setLogs(res.data);
        } catch (e) {
            console.error("Error al cargar registros:", e);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const prodRes = await api.get('/products');
                setProducts(prodRes.data);

                const totalRes = await api.get('/food-logs/totals');
                setTotal(totalRes.data);

                await loadTodayLogs();
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    if (parseFloat(grams) < 0) {
        alert("Los valores nutricionales no pueden ser negativos.");
        return;
    }

    const handleCalculate = async () => {
        if (!selectedProduct || !grams) return;

        try {
            await api.post('/food-logs', {
                product_id: selectedProduct,
                grams: grams,
                meal_type: mealType
            });

            const totalsRes = await api.get('/food-logs/totals');
            setTotal(totalsRes.data);
            await loadTodayLogs();

            const productData = products.find(p => p.id === parseInt(selectedProduct));
            const ratio = parseFloat(grams) / 100;
            setResult({
                kcal: Math.round(productData.kcal * ratio),
                protein: (productData.protein * ratio).toFixed(1),
                fat: (productData.fat * ratio).toFixed(1),
                carbs: (productData.carbs * ratio).toFixed(1)
            });

            setGrams("");
        } catch (error) {
            console.error("Error saving log:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/food-logs/${id}`);

            const totalsRes = await api.get('/food-logs/totals');
            setTotal(totalsRes.data);

            await loadTodayLogs();
        } catch (error) {
            console.error("Error al eliminar el registro:", error);
        }
    }

    return (
        <Layout>
            {/* 1. Main container */}
            <div className="max-w-3xl mx-auto pt-4">

                {/* 2. Title */}
                <h1 className="text-[32px] font-bold text-[#1A1C1E] mb-10">
                    Calculadora
                </h1>

                {/* 3. Main form */}
                <Card className="bg-white mb-10">
                    <div className="space-y-6">
                        <Select
                            label="Producto"
                            placeholder={loading ? "Cargando..." : "Introduce un producto"}
                            options={products.map(p => ({ label: p.name, value: p.id }))}
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        />
                        <Input
                            label="Gramos (g)"
                            type="number"
                            min="0"
                            placeholder="Introduzca la cantidad en gramos"
                            value={grams}
                            onChange={(e) => setGrams(e.target.value)}
                        />
                        <Select
                            label="Momento del día"
                            options={[
                                { label: "Desayuno", value: "desayuno" },
                                { label: "Almuerzo", value: "almuerzo" },
                                { label: "Merienda", value: "merienda" },
                                { label: "Cena", value: "cena" },
                                { label: "Snack", value: "snack" }
                            ]}
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                        />
                        <Button
                            className="w-full mt-6 py-4"
                            onClick={handleCalculate}
                        >
                            Calcular
                        </Button>
                    </div>
                </Card>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Whitre card */}
                    <MealResultCard result={result} />

                    {/* Green card (Total Diario) */}
                    <DailyTotalCard total={total} />
                </div>
                <TodayMeals logs={logs} onDelete={handleDelete} />
            </div>
        </Layout>
    );
}