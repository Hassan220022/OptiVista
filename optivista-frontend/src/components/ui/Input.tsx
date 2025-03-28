import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed';
  isFullWidth?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      helperText,
      size = 'md',
      variant = 'outline',
      isFullWidth = true,
      isRequired = false,
      isDisabled = false,
      isReadOnly = false,
      containerClassName = '',
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if none is provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Base input styles
    const baseStyles = 'w-full rounded-md focus:outline-none focus:ring-2 transition duration-200 disabled:cursor-not-allowed';
    
    // Variant styles
    const variantStyles = {
      outline: 'border focus:border-blue-500 focus:ring-blue-500',
      filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-blue-500',
      flushed: 'border-0 border-b border-gray-300 rounded-none px-0 focus:border-blue-500 focus:ring-blue-500',
    };
    
    // Size styles
    const sizeStyles = {
      sm: 'py-1 px-2 text-sm',
      md: 'py-2 px-3 text-base',
      lg: 'py-3 px-4 text-lg',
    };
    
    // State styles
    const stateStyles = {
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      disabled: 'opacity-60 bg-gray-100',
      readonly: 'bg-gray-50',
    };
    
    return (
      <div className={`mb-4 ${isFullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            disabled={isDisabled}
            readOnly={isReadOnly}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`
              ${baseStyles}
              ${variantStyles[variant]}
              ${sizeStyles[size]}
              ${error ? stateStyles.error : ''}
              ${isDisabled ? stateStyles.disabled : ''}
              ${isReadOnly ? stateStyles.readonly : ''}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            required={isRequired}
            {...rest}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 