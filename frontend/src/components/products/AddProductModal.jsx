import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AddProductModal({ isOpen, onClose, onSave, productToEdit = null }) {
    const [name, setName] = useState("");
    const [kcal, setKcal] = useState("");
    const [protein, setProtein] = useState("");
    const [fat, setFat] = useState("");
    const [carbs, setCarbs] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [errors, setErrors] = useState({});

    const isEditMode = !!productToEdit;

    useEffect(() => {
        if (isOpen) {
            setErrors({});

            if (productToEdit) {
                setName(productToEdit.name);
                setKcal(productToEdit.kcal);
                setProtein(productToEdit.protein);
                setFat(productToEdit.fat);
                setCarbs(productToEdit.carbs);
            } else {
                setName("");
                setKcal("");
                setProtein("");
                setFat("");
                setCarbs("");
            }
        } else {
            setErrors({});
        }
    }, [isOpen, productToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);

        try {
            await onSave({
                id: productToEdit?.id,
                name,
                kcal: parseFloat(kcal),
                protein: parseFloat(protein),
                fat: parseFloat(fat),
                carbs: parseFloat(carbs)
            });
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: ["Error al guardar el producto"] });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setErrors({});
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">

                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                    type='button'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-[#1A1C1E] mb-6">
                    {isEditMode ? "Editar Producto" : "Añadir Producto"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}

                    <Input
                        label="Nombre del Producto"
                        error={Array.isArray(errors.name) ? errors.name[0] : errors.name}
                        placeholder="Introduzca el nombre del producto"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label="Kcal por 100g"
                        error={Array.isArray(errors.kcal) ? errors.kcal[0] : errors.kcal}
                        type="decimal"
                        min="0"
                        max="2000"
                        placeholder="0"
                        value={kcal}
                        onChange={(e) => setKcal(e.target.value)}
                    />
                    <Input
                        label="Proteína por 100g"
                        error={Array.isArray(errors.protein) ? errors.protein[0] : errors.protein}
                        type="decimal"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                    />
                    <Input
                        label="Grasa por 100g"
                        error={Array.isArray(errors.fat) ? errors.fat[0] : errors.fat}
                        type="decimal"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                    />
                    <Input
                        label="Carbohidratos por 100g"
                        error={Array.isArray(errors.carbs) ? errors.carbs[0] : errors.carbs}
                        type="decimal"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-1/2 py-3 mt-0 text-gray-600 bg-gray-100 border-none shadow-none text-sm font-semibold rounded-2xl hover:bg-gray-200"
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="w-1/2 py-3 mt-0 text-sm font-semibold rounded-2xl shadow-none"
                            disabled={submitting}
                        >
                            {submitting ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}