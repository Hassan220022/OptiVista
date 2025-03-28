import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <p className="text-gray-600">Viewing details for product ID: {id}</p>
      <p className="text-gray-600 mt-2">Product details page is under construction.</p>
    </div>
  );
};

export default ProductDetailsPage; 