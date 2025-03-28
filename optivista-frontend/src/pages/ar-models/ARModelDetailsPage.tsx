import React from 'react';
import { useParams } from 'react-router-dom';

const ARModelDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AR Model Details</h1>
      <p className="text-gray-600">Viewing details for AR model ID: {id}</p>
      <p className="text-gray-600 mt-2">AR model details page is under construction.</p>
    </div>
  );
};

export default ARModelDetailsPage; 