'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AffordableFlightsButtonProps {
  preferenceId: string;
}

export default function AffordableFlightsButton({ preferenceId }: AffordableFlightsButtonProps) {
  const [hasFlights, setHasFlights] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFlights = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${API_URL}/flights?preferenceId=${preferenceId}`);
        if (response.ok) {
          const flights = await response.json();
          setHasFlights(flights.length > 0);
        }
      } catch (error) {
        console.error('Error checking flights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFlights();
  }, [preferenceId]);

  if (isLoading) {
    return null;
  }

  if (!hasFlights) {
    return null;
  }

  return (
    <Link
      href={`/flights?preferenceId=${preferenceId}`}
      className="text-blue-400 hover:text-blue-300 transition-colors"
      title="View affordable flights"
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
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
        />
      </svg>
    </Link>
  );
} 