import React, { ReactNode } from 'react';

type BadgeVariant = 'solid' | 'outline' | 'subtle';
type BadgeColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'solid',
  color = 'blue',
  size = 'md',
  rounded = false,
  className = '',
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium whitespace-nowrap';
  
  // Variant styles
  const variantStyles = {
    solid: {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      red: 'bg-red-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      purple: 'bg-purple-500 text-white',
      gray: 'bg-gray-500 text-white',
    },
    outline: {
      blue: 'bg-transparent border border-blue-500 text-blue-500',
      green: 'bg-transparent border border-green-500 text-green-500',
      red: 'bg-transparent border border-red-500 text-red-500',
      yellow: 'bg-transparent border border-yellow-500 text-yellow-500',
      purple: 'bg-transparent border border-purple-500 text-purple-500',
      gray: 'bg-transparent border border-gray-500 text-gray-500',
    },
    subtle: {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800',
    },
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  // Rounded styles
  const roundedStyles = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant][color]}
        ${sizeStyles[size]}
        ${roundedStyles}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;

// Helper function to get badge color based on status strings
export const getStatusBadgeColor = (status: string): BadgeColor => {
  const statusMap: Record<string, BadgeColor> = {
    // Order statuses
    pending: 'yellow',
    processing: 'blue',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
    
    // Payment statuses
    paid: 'green',
    failed: 'red',
    refunded: 'gray',
    
    // AR model statuses
    draft: 'gray',
    active: 'green',
    error: 'red',
    
    // Generic statuses
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
  };
  
  return statusMap[status.toLowerCase()] || 'gray';
}; 