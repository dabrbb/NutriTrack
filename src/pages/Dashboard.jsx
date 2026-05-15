import { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import NutrientRow from '../components/NutrientRow';

export default function Dashboard() {
    const [product, setProduct] = useState("");
    const [grams, setGrams] = useState("");

    const productOptions = [
        { label: "Pollo (Pechuga)", value: "chicken" },
        { label: "Arroz Blanco", value: "rice" }
    ];

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
                            placeholder="Introduce un producto"
                            options={productOptions}
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
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
                            onClick={() => console.log("Click")}
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
                            <NutrientRow label="Kcal" value="0" icon="🔥" bg="bg-orange-50" />
                            <NutrientRow label="Proteínas" value="0" unit="g" icon="🥩" bg="bg-red-50" />
                            <NutrientRow label="Grasas" value="0" unit="g" icon="💧" bg="bg-yellow-50" />
                            <NutrientRow label="Carbohidratos" value="0" unit="g" icon="🍞" bg="bg-blue-50" />
                        </div>
                    </Card>

                    {/* Green card (Total Diario) */}
                    <Card className="p-7 bg-[#DCFCE7] border-none">
                        <h3 className="text-lg font-bold text-[#1A1C1E] mb-6">
                            Total Diario
                        </h3>
                        <div className="space-y-4">
                            <NutrientRow label="Kcal" value="0" icon="🔥" bg="bg-orange-50" />
                            <NutrientRow label="Proteínas" value="0" unit="g" icon="🥩" bg="bg-red-50" />
                            <NutrientRow label="Grasas" value="0" unit="g" icon="💧" bg="bg-yellow-50" />
                            <NutrientRow label="Carbohidratos" value="0" unit="g" icon="🍞" bg="bg-blue-50" />
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}