import { format, formatDistance, isToday, isYesterday } from 'date-fns';
import { DATE_FORMAT, DATE_TIME_FORMAT } from './constants';

/**
 * Formats a date string to a displayable date format
 */
export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return format(date, DATE_FORMAT);
};

/**
 * Formats a date string to a displayable date and time format
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return format(date, DATE_TIME_FORMAT);
};

/**
 * Formats a date string to a relative time (e.g., "2 hours ago", "yesterday")
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isToday(date)) {
    return formatDistance(date, new Date(), { addSuffix: true });
  }
  
  if (isYesterday(date)) {
    return 'yesterday';
  }
  
  return formatDistance(date, new Date(), { addSuffix: true });
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number, currencyCode = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Formats a number with commas for thousands
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Formats a percentage
 */
export const formatPercentage = (value: number, decimalPlaces = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Formats file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncates text to a specified length and adds ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalizes the first letter of each word in a string
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats a phone number as (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (phoneNumberString: string): string => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phoneNumberString;
}; 