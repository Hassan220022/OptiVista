import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;