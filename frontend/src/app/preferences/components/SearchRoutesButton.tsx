'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchRoutesButtonProps {
  id: string;
}

export function SearchRoutesButton({ id }: SearchRoutesButtonProps) {
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      
      // Navigate to the routes page with the preference ID
      router.push(`/routes?preferenceId=${id}`);
      
    } catch (error) {
      console.error('Error navigating to routes:', error);
      alert('Failed to search routes. Please try again.');
      setIsSearching(false);
    }
  };

  return (
    <button
      onClick={handleSearch}
      disabled={isSearching}
      className="text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
      title="Search routes"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
        />
      </svg>
    </button>
  );
} 