import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../common/Button';
import { FileUpload } from '../../common/FileUpload';
import { UploadedFile } from '../../../services/uploadService';
import { productsApi } from '../../../services/api';

interface AddProductPageProps {
  onBack: () => void;
  sellerId?: string;
}

type ColorOption = {
  label: string;
  value: string;
  color: string;
};

type MaterialOption = {
  label: string;
  value: string;
};

const colorOptions: ColorOption[] = [
  { label: 'Black', value: 'black', color: '#000000' },
  { label: 'Silver', value: 'silver', color: '#C0C0C0' },
  { label: 'Gold', value: 'gold', color: '#FFD700' },
  { label: 'Brown', value: 'brown', color: '#A52A2A' },
  { label: 'Blue', value: 'blue', color: '#0000FF' },
  { label: 'Red', value: 'red', color: '#FF0000' },
  { label: 'Green', value: 'green', color: '#008000' },
  { label: 'Purple', value: 'purple', color: '#800080' },
  { label: 'Pink', value: 'pink', color: '#FFC0CB' },
  { label: 'Tortoise', value: 'tortoise', color: '#704214' },
];

const materialOptions: MaterialOption[] = [
  { label: 'Metal', value: 'metal' },
  { label: 'Plastic', value: 'plastic' },
  { label: 'Acetate', value: 'acetate' },
  { label: 'Titanium', value: 'titanium' },
  { label: 'Wood', value: 'wood' },
  { label: 'Carbon Fiber', value: 'carbon-fiber' },
  { label: 'Nylon', value: 'nylon' },
];

export function AddProductPage({ onBack, sellerId }: AddProductPageProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [productImage, setProductImage] = useState<UploadedFile | null>(null);
  const [productModel, setProductModel] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleColorToggle = (colorValue: string) => {
    if (colors.includes(colorValue)) {
      setColors(colors.filter(c => c !== colorValue));
    } else {
      setColors([...colors, colorValue]);
    }
  };
  
  const handleMaterialToggle = (materialValue: string) => {
    if (materials.includes(materialValue)) {
      setMaterials(materials.filter(m => m !== materialValue));
    } else {
      setMaterials([...materials, materialValue]);
    }
  };
  
  const handleImageUpload = (fileData: UploadedFile) => {
    setProductImage(fileData);
  };
  
  const handleModelUpload = (fileData: UploadedFile) => {
    setProductModel(fileData);
  };
  
  const validateForm = () => {
    if (!name) return 'Product name is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) return 'Valid price is required';
    if (!category) return 'Category is required';
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) return 'Valid stock quantity is required';
    if (colors.length === 0) return 'At least one color must be selected';
    if (materials.length === 0) return 'At least one material must be selected';
    if (!productImage) return 'Product image is required';
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const productData = {
        name,
        price: Number(price),
        description,
        category,
        stock: Number(stock),
        colors,
        materials,
        imageUrl: productImage?.url || '',
        imageKey: productImage?.key || '',
        arModelUrl: productModel?.url || '',
        arModelKey: productModel?.key || '',
        sellerId: sellerId || '',
      };
      
      await productsApi.create(productData);
      setSuccess(true);
      
      // Reset form
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setStock('');
      setColors([]);
      setMaterials([]);
      setProductImage(null);
      setProductModel(null);
      
      // Notify user of success
      setTimeout(() => {
        setSuccess(false);
        onBack();
      }, 2000);
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
          Product created successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD)*
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="99.99"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="prescription">Prescription Glasses</option>
              <option value="reading">Reading Glasses</option>
              <option value="sports">Sports Eyewear</option>
              <option value="kids">Kids Eyewear</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity*
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="100"
              min="0"
              step="1"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product description"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Colors*
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => handleColorToggle(colorOption.value)}
                className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  colors.includes(colorOption.value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: colorOption.color }}
                />
                {colorOption.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Materials*
          </label>
          <div className="flex flex-wrap gap-2">
            {materialOptions.map((materialOption) => (
              <button
                key={materialOption.value}
                type="button"
                onClick={() => handleMaterialToggle(materialOption.value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  materials.includes(materialOption.value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {materialOption.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            fileType="image"
            label="Product Image* (JPEG, PNG, WebP)"
            onFileUploaded={handleImageUpload}
            folder="products"
          />
          
          <FileUpload
            fileType="model"
            label="3D Model (GLB, GLTF, USDZ, OBJ)"
            onFileUploaded={handleModelUpload}
            folder="models"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button onClick={onBack} variant="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={loading ? 'opacity-70 cursor-not-allowed' : ''}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}