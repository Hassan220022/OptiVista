import ApiService from '../services/ApiService';

/**
 * Utility function to reload data from the database
 * @param endpoint The API endpoint to fetch data from
 * @param params Optional parameters to include in the request
 * @returns Promise with the fetched data
 */
export async function reloadData<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  try {
    // Clear any cached data for this endpoint if needed
    // This is where you would implement cache invalidation if you have a cache layer
    
    // Make a fresh request to the backend
    return await ApiService.get<T>(endpoint, params);
  } catch (error) {
    console.error(`Error reloading data from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Forces a reload of the entire application by clearing the cache and reloading the page
 */
export function forceReload(): void {
  // Clear local storage caches if needed
  // localStorage.removeItem('cached_dashboard');
  
  // Reload the page
  window.location.reload();
}

/**
 * Utility functions for scheduling and managing data reload intervals
 */

type ReloadCallback = () => void;

/**
 * Schedule a data reload at specified intervals
 * @param callback Function to call when it's time to reload
 * @param intervalMs Time in milliseconds between reloads
 * @returns An identifier for the scheduled reload
 */
export const scheduleDataReload = (callback: ReloadCallback, intervalMs: number = 60000): number => {
  if (!callback) {
    console.error('No callback provided for data reload');
    return -1;
  }
  
  if (intervalMs < 5000) {
    console.warn('Reload interval is very short (<5s), this may cause performance issues');
  }
  
  // Create the interval and return its ID
  return window.setInterval(() => {
    callback();
  }, intervalMs);
};

/**
 * Clear a previously scheduled data reload
 * @param intervalId The identifier returned by scheduleDataReload
 */
export const clearScheduledReload = (intervalId: number): void => {
  if (intervalId && intervalId !== -1) {
    window.clearInterval(intervalId);
  }
};

/**
 * One-time delayed data reload
 * @param callback Function to call when it's time to reload
 * @param delayMs Time in milliseconds to wait before reload
 * @returns An identifier for the scheduled reload
 */
export const scheduleDelayedReload = (callback: ReloadCallback, delayMs: number = 5000): number => {
  if (!callback) {
    console.error('No callback provided for delayed reload');
    return -1;
  }
  
  // Create the timeout and return its ID
  return window.setTimeout(() => {
    callback();
  }, delayMs);
};

/**
 * Clear a previously scheduled delayed reload
 * @param timeoutId The identifier returned by scheduleDelayedReload
 */
export const clearDelayedReload = (timeoutId: number): void => {
  if (timeoutId && timeoutId !== -1) {
    window.clearTimeout(timeoutId);
  }
};

export default {
  reloadData,
  forceReload,
  scheduleDataReload,
  clearScheduledReload,
  scheduleDelayedReload,
  clearDelayedReload
}; 