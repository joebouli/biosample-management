import { useState, useCallback } from 'react';

interface UseApiOptions<T> {
  // Callback invoked when the API call succeeds, receiving the data
  onSuccess?: (data: T) => void;
  // Callback invoked when the API call fails, receiving the error message
  onError?: (error: string) => void;
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  // State to hold the data returned from the API call
  const [data, setData] = useState<T | null>(null);
  // Loading state to indicate API call is in progress
  const [loading, setLoading] = useState(false);
  // Error state to hold any error message from the API call
  const [error, setError] = useState<string | null>(null);

  /**
   * execute - function to trigger the API call.
   * @param apiCall - async function returning a Promise<T>, representing the API request
   *
   * It manages loading, error and data states internally.
   * Calls optional onSuccess and onError callbacks from options.
   */
  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      // Await the API call result
      const result = await apiCall();
      // Update data state
      setData(result);
      // Call onSuccess callback if provided
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      // Extract error message, fallback to generic message
      const errorMessage = err instanceof Error ? err.message : 'API call failed';
      // Update error state
      setError(errorMessage);
      // Call onError callback if provided
      options.onError?.(errorMessage);
      throw err; // rethrow so caller can handle if needed
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  }, [options]);

  /**
   * reset - helper to clear data, error and loading states,
   * useful to reset the hook state before new calls
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,      // API response data or null
    loading,   // boolean indicating if the call is in progress
    error,     // error message or null
    execute,   // function to execute API call
    reset,     // function to reset hook state
    setData,   // setter for data, useful to update data manually if needed
  };
}
