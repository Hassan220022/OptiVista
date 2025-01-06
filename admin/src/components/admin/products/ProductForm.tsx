import React from 'react';
import { Button } from '../../common/Button';
import type { Product } from '../../../types/product';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={product?.name}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            step="0.01"
            defaultValue={product?.price}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            id="stock"
            defaultValue={product?.stock}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          id="category"
          defaultValue={product?.category}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Sunglasses">Sunglasses</option>
          <option value="Reading Glasses">Reading Glasses</option>
          <option value="Sports Eyewear">Sports Eyewear</option>
          <option value="Designer Frames">Designer Frames</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          defaultValue={product?.description}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="url"
          name="imageUrl"
          id="imageUrl"
          defaultValue={product?.imageUrl}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}