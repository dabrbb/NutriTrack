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
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const handleSaveProduct = async (productData) => {
        try {
            if (productData.id) {
                await api.put(`/products/${productData.id}`, productData);
            } else {
                await api.post('/products', productData);
            }
            await loadProducts();
        } catch (e) {
            console.error("Error al guardar producto:", e);
            throw e;
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

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

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

                {isModalOpen && (
                    <AddProductModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedProduct(null);
                        }}
                        onSave={handleSaveProduct}
                        productToEdit={selectedProduct}
                    />
                )}
            </div>
        </Layout>
    );
}
