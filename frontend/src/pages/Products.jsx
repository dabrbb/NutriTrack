import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import api from '../api';
import ProductTable from '../components/products/ProductTable';
import AddProductModal from '../components/products/AddProductModal';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para almacenar el producto seleccionado al editar
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Cargar la lista actual de productos del servidor
    const loadProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (e) {
            console.error("Error al cargar productos:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Controlador genérico: determina el método (POST/PUT) dependiendo de la presencia del ID.
    const handleSaveProduct = async (productData) => {
        try {
            if (productData.id) {
                await api.put(`/products/${productData.id}`, productData);
            } else {
                await api.post('/products', productData);
            }
            // Actualizar la lista después de una operación exitosa
            await loadProducts();
        } catch (e) {
            console.error("Error al guardar producto:", e);
            throw e; // Genera un error para que la ventana modal pueda manejarlo.
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
        try {
            await api.delete(`/products/${id}`);
            await loadProducts();
        } catch (e) {
            console.error("Error al eliminar el producto:", e);
        }
    };

    // Preparando los datos para abrir una ventana modal en modo de edición
    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Borra el producto seleccionado antes de abrir la ventana modal para crear uno nuevo.
    const handleAddNewClick = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto pt-4 px-4">
                <h1 className="text-[32px] font-bold text-[#1A1C1E] mb-6">
                    Productos
                </h1>

                <Button
                    className="w-fit py-3 px-5 mt-0 mb-8 flex items-center gap-2 rounded-xl shadow-none text-sm font-semibold"
                    onClick={handleAddNewClick}
                >
                    <span className="text-xl font-light leading-none">+</span> Agregar Producto
                </Button>

                <ProductTable
                    products={products}
                    loading={loading}
                    onDelete={handleDelete}
                    onRowClick={handleRowClick}
                />

                {/* Renderizado condicional de la ventana modal */}
                {isModalOpen && (
                    <AddProductModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedProduct(null); // Restablecer el estado al cerrar
                        }}
                        onSave={handleSaveProduct}
                        productToEdit={selectedProduct} // Si es null, el modal funciona en modo de creación.
                    />
                )}
            </div>
        </Layout>
    );
}
