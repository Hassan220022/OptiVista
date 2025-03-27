import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../common/Button';
import { SearchInput } from '../../common/SearchInput';
import { ProductTable } from './ProductTable';
import { AddProductPage } from './AddProductPage';
import { productsApi } from '../../../services/api';

interface Product {
  id: number;
  name: string; 
  price: number;
  stock: number;
  category: string;
  description: string;
  imageUrl: string;
  arModelUrl: string;
  colors: string[];
  materials: string[];
  sellerId: string;
}

interface ProductListProps {
  sellerId?: string;
}

export function ProductList({ sellerId }: ProductListProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Filter products based on sellerId and searchTerm
    let filtered = products;
    
    // Filter by sellerId if provided
    if (sellerId) {
      filtered = filtered.filter(product => product.sellerId === sellerId);
    }
    
    // Then filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, sellerId, searchTerm]);

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (sellerId) {
          data = await productsApi.getBySellerId(sellerId);
        } else {
          data = await productsApi.getAll();
        }
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [sellerId]);

  if (showAddProduct) {
    return <AddProductPage onBack={() => setShowAddProduct(false)} sellerId={sellerId} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {sellerId ? 'My Products' : 'All Products'}
        </h1>
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

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <ProductTable 
          products={filteredProducts}
          onEdit={(product) => {
            console.log('Edit product:', product);
          }}
        />
      )}
    </div>
  );
}