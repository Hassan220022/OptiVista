import React, { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  headerAction?: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  noPadding?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  headerAction,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  noPadding = false,
  bordered = true,
  elevated = false,
  hoverable = false,
}) => {
  // Base styles
  const baseStyles = 'bg-white rounded-lg overflow-hidden';
  
  // Optional styles
  const borderedStyles = bordered ? 'border border-gray-200' : '';
  const elevatedStyles = elevated ? 'shadow-md' : '';
  const hoverableStyles = hoverable ? 'transition-shadow duration-300 hover:shadow-lg' : '';
  
  // Body padding
  const bodyPadding = noPadding ? '' : 'p-4';
  
  // Determine if header exists
  const hasHeader = title || subtitle || headerAction;
  
  return (
    <div className={`${baseStyles} ${borderedStyles} ${elevatedStyles} ${hoverableStyles} ${className}`}>
      {hasHeader && (
        <div className={`border-b border-gray-200 px-4 py-3 flex items-center justify-between ${headerClassName}`}>
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="ml-4">{headerAction}</div>}
        </div>
      )}
      
      <div className={`${bodyPadding} ${bodyClassName}`}>{children}</div>
      
      {footer && (
        <div className={`border-t border-gray-200 px-4 py-3 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export const CardGrid: React.FC<{
  children: ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}> = ({ children, columns = 3, gap = 4, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };
  
  const gapSize = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
  };
  
  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} ${gapSize[gap as keyof typeof gapSize]} ${className}`}>
      {children}
    </div>
  );
};

export default Card; 