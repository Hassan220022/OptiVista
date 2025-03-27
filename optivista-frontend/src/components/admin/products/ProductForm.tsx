import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { FileUpload } from '../../common/FileUpload';
import { productsApi } from '../../../services/api';
import type { Product } from '../../../types/product';
import { UploadedFile } from '../../../services/uploadService';

interface ProductFormProps {
  product?: Product;
  sellerId?: string;
  onSubmit?: (product: Omit<Product, 'id'>) => void;
  onCancel?: () => void;
  onSubmitSuccess?: () => void;
}

export function ProductForm({ 
  product, 
  sellerId, 
  onSubmit, 
  onCancel, 
  onSubmitSuccess 
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedFile | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      category: formData.get('category') as string,
      description: formData.get('description') as string || '',
      imageUrl: uploadedImage?.url || formData.get('imageUrl') as string || '',
      sellerId: sellerId || '',
    };
    
    try {
      if (onSubmit) {
        onSubmit(productData);
      } else {
        // If no onSubmit handler provided, directly use the API
        if (product?.id) {
          await productsApi.update(product.id, productData);
        } else {
          await productsApi.create(productData);
        }
        
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedImage(file);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
      
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
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                step="0.01"
                defaultValue={product?.price}
                required
                className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            defaultValue={product?.description}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home & Garden</option>
            <option value="Sports">Sports & Outdoors</option>
          </select>
        </div>

        <div className="space-y-2">
          <FileUpload 
            onFileUploaded={handleFileUploaded}
            fileType="image"
            label="Product Image"
            folder={`products/${sellerId || 'general'}`}
          />
          {!uploadedImage && (
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Or enter image URL directly
              </label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                defaultValue={product?.imageUrl}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}
          {uploadedImage && (
            <div className="mt-2">
              <p className="text-sm text-green-600">Image uploaded successfully!</p>
              <img 
                src={uploadedImage.url} 
                alt="Product preview" 
                className="mt-2 h-40 object-contain rounded border border-gray-200" 
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} className="flex-1" disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}