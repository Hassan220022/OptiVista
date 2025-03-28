import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  borderRadius?: string;
}

/**
 * Basic skeleton loader component for content placeholders
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = '1rem',
  width = '100%',
  borderRadius = '0.25rem'
}) => {
  const style = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
    borderRadius
  };

  return (
    <div 
      className={`animate-pulse bg-gray-200 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * Skeleton loader for a card with title and content
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <Skeleton height="1.5rem" width="60%" className="mb-4" />
      <div className="space-y-3">
        <Skeleton height="0.9rem" />
        <Skeleton height="0.9rem" width="90%" />
        <Skeleton height="0.9rem" width="80%" />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for a statistic card
 */
export const StatCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <Skeleton height="1rem" width="40%" className="mb-2" />
      <Skeleton height="1.75rem" width="60%" className="mb-3" />
      <Skeleton height="0.75rem" width="50%" />
    </div>
  );
};

/**
 * Skeleton loader for a chart
 */
export const ChartSkeleton: React.FC<{ className?: string, height?: string | number }> = ({ 
  className = '', 
  height = 300
}) => {
  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <Skeleton height="1.5rem" width="40%" className="mb-4" />
      <Skeleton height={height} width="100%" className="mb-2" />
      <div className="flex justify-between mt-2">
        <Skeleton height="0.75rem" width="10%" />
        <Skeleton height="0.75rem" width="10%" />
        <Skeleton height="0.75rem" width="10%" />
        <Skeleton height="0.75rem" width="10%" />
        <Skeleton height="0.75rem" width="10%" />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for a table row with customizable number of columns
 */
export const TableRowSkeleton: React.FC<{ columns?: number, className?: string }> = ({ 
  columns = 3, 
  className = '' 
}) => {
  return (
    <tr className={className}>
      {Array(columns).fill(0).map((_, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {index === 0 && (
              <div className="flex-shrink-0 h-10 w-10 mr-4">
                <Skeleton height={40} width={40} borderRadius="50%" />
              </div>
            )}
            <div className={`flex-1 ${index === 0 ? 'space-y-1' : ''}`}>
              <Skeleton height="0.9rem" width={index === 0 ? '80%' : '70%'} />
              {index === 0 && <Skeleton height="0.75rem" width="50%" />}
            </div>
          </div>
        </td>
      ))}
    </tr>
  );
};

/**
 * Skeleton loader for a form input
 */
export const InputSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Skeleton height="0.9rem" width="30%" />
      <Skeleton height="2.5rem" width="100%" borderRadius="0.375rem" />
    </div>
  );
};

/**
 * Skeleton loader for a button
 */
export const ButtonSkeleton: React.FC<{ className?: string, width?: string | number }> = ({ 
  className = '', 
  width = '100%' 
}) => {
  return (
    <Skeleton height="2.5rem" width={width} borderRadius="0.375rem" className={className} />
  );
};

export default {
  Skeleton,
  CardSkeleton,
  StatCardSkeleton,
  ChartSkeleton,
  TableRowSkeleton,
  InputSkeleton,
  ButtonSkeleton
}; 