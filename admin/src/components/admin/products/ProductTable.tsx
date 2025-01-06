import React from 'react';
import { Button } from '../../common/Button';
import type { Product } from '../../../types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(`http://196.221.151.195:3000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        alert('Product deleted successfully!');
        window.location.reload(); // Refresh the page
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}