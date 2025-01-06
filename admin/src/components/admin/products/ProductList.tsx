import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../common/Button';
import { SearchInput } from '../../common/SearchInput';
import { ProductTable } from './ProductTable';
import { AddProductPage } from './AddProductPage';
import { productApi } from '../../../services/apiService'; // Import the API service

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getProducts(); // Use the API service
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showAddProduct) {
    return <AddProductPage />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowAddProduct(true)}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="mb-6">
        <SearchInput
          placeholder="Search products..."
          onSearch={setSearchTerm}
        />
      </div>

      <ProductTable
        products={filteredProducts}
        onEdit={(product) => {
          console.log('Edit product:', product);
        }}
      />
    </div>
  );
};

export default ProductList;