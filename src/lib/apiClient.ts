/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A utility file for making API calls in a centralized way.
 * Provides functions for calling specific endpoints.
 */

export const apiClient = {
    /**
     * Sends a POST request to the given endpoint.
     * @param endpoint - The API endpoint to call.
     * @param body - The request body to send.
     * @returns The response data.
     */
    post: async (endpoint: string, body: Record<string, any>) => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Something went wrong');
        }
  
        return await response.json();
      } catch (error) {
        console.log(`Error in POST ${endpoint}:`, error);
        throw error;
      }
    },
  
    /**
     * Sends a GET request to the given endpoint.
     * @param endpoint - The API endpoint to call.
     * @returns The response data.
     */
    get: async (endpoint: string) => {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Something went wrong');
        }
  
        return await response.json();
      } catch (error) {
        console.log(`Error in GET ${endpoint}:`, error);
        throw error;
      }
    },
  };
  