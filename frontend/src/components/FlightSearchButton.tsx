'use client';

import { useState } from 'react';

export function FlightSearchButton() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/flight-search/trigger', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to trigger flight search');
      }

      const data = await response.json();
      if (data.success) {
        alert('Flight search completed successfully!');
      } else {
        throw new Error(data.message || 'Failed to trigger flight search');
      }
    } catch (err) {
      console.error('Error triggering flight search:', err);
      setError(err instanceof Error ? err.message : 'Failed to trigger flight search');
      alert('Failed to trigger flight search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <button
      onClick={handleSearch}
      disabled={isSearching}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSearching ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching...
        </span>
      ) : (
        'Search Flights'
      )}
    </button>
  );
} 