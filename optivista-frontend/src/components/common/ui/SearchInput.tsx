import React, { useState, useEffect } from 'react';

// Define our own InputHTMLAttributes since we're having import issues
interface HTMLInputProps {
  type?: string;
  value?: string | number | readonly string[];
  placeholder?: string;
  className?: string;
  onChange?: (e: any) => void;
  [key: string]: any;
}

export interface SearchInputProps extends Omit<HTMLInputProps, 'onChange'> {
  onSearch: (term: string) => void;
  debounceTime?: number;
  placeholder?: string;
}

// Remove React.FC to avoid JSX element issues
export const SearchInput = ({
  onSearch,
  debounceTime = 300,
  placeholder = 'Search...',
  className = '',
  ...rest
}: SearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch, debounceTime]);

  // Simple event handler without specific typing
  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={handleChange}
        className={`block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${className}`}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default SearchInput;
