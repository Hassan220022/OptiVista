import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import type { ProductCategory } from '../../../types/product';
import { productApi } from '../../../services/apiService'; // Import the API service

const CATEGORIES: ProductCategory[] = [
  'Sunglasses',
  'Reading Glasses',
  'Sports Eyewear',
  'Designer Frames'
];

const MATERIALS = [
  'Acetate',
  'Metal',
  'Titanium',
  'TR90',
  'Stainless Steel',
  'Mixed Materials'
];

const COLORS = [
  'Black',
  'Gold',
  'Silver',
  'Tortoise',
  'Brown',
  'Blue',
  'Clear',
  'Rose Gold'
];

const AddProductPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    imageUrl: '',
    arModelUrl: '',
    materials: [] as string[],
    colors: [] as string[],
    dimensions: {
      frameWidth: '',
      templeLength: '',
      lensHeight: '',
      bridgeWidth: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await productApi.addProduct(formData); // Use the API service
      alert('Product added successfully!');
      window.location.href = '/dashboard'; // Redirect to dashboard
    } catch (error) {
      alert('Failed to add product.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value
      }
    }));
  };

  const toggleMaterial = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Images and AR */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                AR Model URL
              </label>
              <input
                type="url"
                name="arModelUrl"
                value={formData.arModelUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="URL to .glb or .usdz file"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Dimensions (mm)</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frame Width
                </label>
                <input
                  type="number"
                  name="frameWidth"
                  value={formData.dimensions.frameWidth}
                  onChange={handleDimensionChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temple Length
                </label>
                <input
                  type="number"
                  name="templeLength"
                  value={formData.dimensions.templeLength}
                  onChange={handleDimensionChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lens Height
                </label>
                <input
                  type="number"
                  name="lensHeight"
                  value={formData.dimensions.lensHeight}
                  onChange={handleDimensionChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bridge Width
                </label>
                <input
                  type="number"
                  name="bridgeWidth"
                  value={formData.dimensions.bridgeWidth}
                  onChange={handleDimensionChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Materials</h3>
            <div className="flex flex-wrap gap-2">
              {MATERIALS.map(material => (
                <Button
                  key={material}
                  type="button"
                  variant={formData.materials.includes(material) ? 'primary' : 'outline'}
                  onClick={() => toggleMaterial(material)}
                >
                  {material}
                </Button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Available Colors</h3>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <Button
                  key={color}
                  type="button"
                  variant={formData.colors.includes(color) ? 'primary' : 'outline'}
                  onClick={() => toggleColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Add Product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
export default AddProductPage;
