import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user ? (
        <div>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Name: {user.name || 'Not provided'}</p>
          <p className="text-gray-600">Role: {user.role}</p>
        </div>
      ) : (
        <p className="text-gray-600">Loading user profile...</p>
      )}
      <p className="text-gray-600 mt-4">Profile page is under construction.</p>
    </div>
  );
};

export default ProfilePage; 