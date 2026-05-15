import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import NutrientRow from '../components/NutrientRow';
import api from '../api';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [grams, setGrams] = useState("");

    const [result, setResult] = useState({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
    const [total, setTotal] = useState({ kcal: 0, protein: 0, fat: 0, carbs: 0 });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const prodRes = await api.get('/products');
                setProducts(prodRes.data);

                const totalRes = await api.get('/food-logs/totals');
                setTotal(totalRes.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleCalculate = async () => {
        if (!selectedProduct || !grams) return;

        try {
            await api.post('/food-logs', {
                product_id: selectedProduct,
                grams: grams,
                meal_type: 'almuerzo'
            });

            const totalsRes = await api.get('/food-logs/totals');
            setTotal(totalsRes.data);

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
                            placeholder="Introduzca la cantidad en gramos"
                            value={grams}
                            onChange={(e) => setGrams(e.target.value)}
                        />
                        <Button
                            className="mt-6 py-4"
                            onClick={handleCalculate}
                        >
                            Calcular
                        </Button>
                    </div>
                </Card>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Whitre card */}
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

                    {/* Green card (Total Diario) */}
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
                </div>
            </div>
        </Layout>
    );
}