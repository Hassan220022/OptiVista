import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../common/Button';
import { SearchInput } from '../../common/SearchInput';
import { ProductTable } from './ProductTable';
import { AddProductPage } from './AddProductPage';

const initialProducts = [
  { 
    id: 1, 
    name: 'Classic Aviator Sunglasses', 
    price: 149.99, 
    stock: 50, 
    category: 'Sunglasses',
    description: 'Timeless aviator design with UV protection',
    imageUrl: 'https://example.com/aviator.jpg',
    arModelUrl: 'https://example.com/aviator.glb',
    colors: ['Gold', 'Black'],
    materials: ['Metal']
  },
  { 
    id: 2, 
    name: 'Modern Reading Glasses', 
    price: 99.99, 
    stock: 30, 
    category: 'Reading Glasses',
    description: 'Comfortable reading glasses with blue light protection',
    imageUrl: 'https://example.com/reading.jpg',
    arModelUrl: 'https://example.com/reading.glb',
    colors: ['Tortoise', 'Black'],
    materials: ['Acetate']
  }
];

export function ProductList() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const filteredProducts = products.filter(product =>
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
}