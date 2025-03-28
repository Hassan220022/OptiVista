import { ACCEPTED_IMAGE_TYPES, ACCEPTED_MODEL_TYPES, MAX_FILE_SIZE, MAX_IMAGE_SIZE } from './constants';

/**
 * Validates if a string is a valid email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password meets security requirements
 * Requirements: At least 8 characters, one uppercase, one lowercase, one number
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

/**
 * Validates a US phone number
 * Valid formats: (123) 456-7890, 123-456-7890, 1234567890
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates if a file is an accepted image type and within size limit
 */
export const isValidImageFile = (file: File): { valid: boolean; message?: string } => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: `File must be one of the following types: ${ACCEPTED_IMAGE_TYPES.join(', ')}`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      message: `File size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validates if a file is an accepted 3D model type and within size limit
 */
export const isValidModelFile = (file: File): { valid: boolean; message?: string } => {
  if (!ACCEPTED_MODEL_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: `File must be one of the following types: ${ACCEPTED_MODEL_TYPES.join(', ')}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validates if a price is valid (numeric and positive)
 */
export const isValidPrice = (price: number): boolean => {
  return !isNaN(price) && price >= 0;
};

/**
 * Validates if a required field has a value
 */
export const isRequired = (value: string | number | undefined | null): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

/**
 * Validates if a value is within a range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates credit card number using Luhn algorithm
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const sanitized = cardNumber.replace(/[^0-9]/g, '');
  
  if (sanitized.length < 13 || sanitized.length > 19) return false;
  
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through from right to left
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}; 