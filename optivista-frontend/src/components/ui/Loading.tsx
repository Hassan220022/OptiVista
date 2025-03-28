import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  color = 'primary'
}) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const colorMap = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    success: 'border-success',
    warning: 'border-warning',
    error: 'border-error',
    info: 'border-info'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeMap[size]} border-2 border-t-transparent ${colorMap[color]}`}
      ></div>
    </div>
  );
};

export default Loading; 