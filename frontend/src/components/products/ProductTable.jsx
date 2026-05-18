import Card from "../forms/Card";

export default function ProductTable({ products, loading, onDelete, onRowClick }) {
    return (
        <Card className="bg-white p-6 overflow-hidden border border-gray-100 shadow-sm rounded-2xl w-full">
            {loading ? (
                <p className="text-gray-400 text-sm text-center py-4">Cargando productos...</p>
            ) : products.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No hay productos guardados.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-4 text-xs font-bold text-gray-400 tracking-wider">Nombre del Producto</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 tracking-wider">Kcal / 100g</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 tracking-wider">Proteína / 100g</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 tracking-wider">Grasa / 100g</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 tracking-wider">Carbohidratos / 100g</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 tracking-wider text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr 
                                    key={product.id} 
                                    onClick={() => onRowClick(product)}
                                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="py-5 text-sm font-bold text-[#1A1C1E]">{product.name}</td>
                                    <td className="py-5 text-sm text-gray-500">{product.kcal}</td>
                                    <td className="py-5 text-sm text-gray-500">{product.protein}g</td>
                                    <td className="py-5 text-sm text-gray-500">{product.fat}g</td>
                                    <td className="py-5 text-sm text-gray-500">{product.carbs}g</td>
                                    <td className="py-5 text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(product.id);
                                            }}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
}