import React, { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  title: string;
  render?: (item: T, index: number) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
  isLoading?: boolean;
  emptyStateMessage?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  className?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyStateMessage = 'No data available',
  sortColumn,
  sortDirection,
  onSort,
  className = '',
  rowClassName = '',
  striped = true,
  bordered = true,
  hoverable = true,
  compact = false,
}: TableProps<T>) {
  // Styles
  const tableClasses = `w-full ${bordered ? 'border-collapse border border-gray-200' : ''} ${className}`;
  const thClasses = `text-left font-semibold text-gray-700 ${compact ? 'px-2 py-1' : 'px-4 py-2'} bg-gray-50 border-b-2 border-gray-200`;
  const tdClasses = `${compact ? 'px-2 py-1' : 'px-4 py-2'} ${bordered ? 'border-b border-gray-200' : ''}`;
  const trHoverClasses = hoverable ? 'hover:bg-blue-50 cursor-pointer' : '';
  
  // Handle row click
  const handleRowClick = (item: T, index: number) => {
    if (onRowClick) {
      onRowClick(item, index);
    }
  };
  
  // Handle sort
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;
    
    if (column.key === sortColumn) {
      // Toggle direction
      onSort(column.key, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to asc
      onSort(column.key, 'asc');
    }
  };
  
  // Get row class name
  const getRowClassName = (item: T, index: number): string => {
    let classes = '';
    
    // Add striped effect
    if (striped && index % 2 === 1) {
      classes += 'bg-gray-50 ';
    }
    
    // Add hover effect if row is clickable
    if (onRowClick) {
      classes += trHoverClasses + ' ';
    }
    
    // Add custom row class
    if (typeof rowClassName === 'function') {
      classes += rowClassName(item, index);
    } else {
      classes += rowClassName;
    }
    
    return classes.trim();
  };
  
  // Sort indicator
  const SortIndicator = ({ column }: { column: Column<T> }) => {
    if (!column.sortable || column.key !== sortColumn) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? (
          <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }
  
  // Empty state
  if (data.length === 0) {
    return (
      <div className="w-full text-center py-8 border border-gray-200 rounded-md">
        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-2 text-gray-600">{emptyStateMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${thClasses} ${column.className || ''} ${
                  column.align ? `text-${column.align}` : ''
                } ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                style={{ width: column.width || 'auto' }}
                onClick={() => column.sortable && handleSort(column)}
              >
                {column.title}
                {column.sortable && <SortIndicator column={column} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              className={getRowClassName(item, index)}
              onClick={() => handleRowClick(item, index)}
            >
              {columns.map((column) => (
                <td
                  key={`${keyExtractor(item, index)}-${column.key}`}
                  className={`${tdClasses} ${column.align ? `text-${column.align}` : ''}`}
                >
                  {column.render
                    ? column.render(item, index)
                    : item[column.key] !== undefined
                    ? String(item[column.key])
                    : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table; 